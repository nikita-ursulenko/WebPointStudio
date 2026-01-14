import { useState, useEffect } from 'react';
import { FaSave, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaTelegram, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { contactService, type Contact as DBContact } from '@/lib/db';

const AdminContacts = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contact, setContact] = useState<DBContact | null>(null);

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    whatsapp_link: '',
    telegram_link: '',
    facebook_link: '',
    instagram_link: '',
  });

  useEffect(() => {
    const loadContact = async () => {
      try {
        const data = await contactService.get();
        if (data) {
          setContact(data);
          setFormData({
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            whatsapp_link: data.whatsapp_link || '',
            telegram_link: data.telegram_link || '',
            facebook_link: data.facebook_link || '',
            instagram_link: data.instagram_link || '',
          });
        }
      } catch (error) {
        console.error('Error loading contact:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || !formData.email || !formData.address || !formData.whatsapp_link || !formData.telegram_link) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    setIsSaving(true);

    try {
      const contactData: DBContact = {
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        whatsapp_link: formData.whatsapp_link,
        telegram_link: formData.telegram_link,
        facebook_link: formData.facebook_link || undefined,
        instagram_link: formData.instagram_link || undefined,
      };

      if (contact && contact.id) {
        // Update existing contact
        const updated = await contactService.update(contact.id, contactData);
        if (updated) {
          setContact(updated);
          toast.success('Контакты обновлены');
        } else {
          toast.error('Ошибка при обновлении контактов');
        }
      } else {
        // Create new contact
        const created = await contactService.create(contactData);
        if (created) {
          setContact(created);
          toast.success('Контакты созданы');
        } else {
          toast.error('Ошибка при создании контактов');
        }
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Ошибка при сохранении контактов');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Card className="glass-effect p-8 text-center border-white/10">
          <p className="text-muted-foreground">Загрузка контактов...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Управление контактами</h1>
        <p className="text-muted-foreground">
          Редактируйте контактную информацию для отображения на сайте
        </p>
      </div>

      <Card className="glass-effect p-6 border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Контакты */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaPhone className="text-primary" />
              Контакты
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">
                  Телефон *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+373 60 123 456"
                />
              </div>

              <div>
                <Label htmlFor="email">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@webpoint.md"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">
                  Адрес *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Кишинёв, ул. Пушкина 22"
                />
              </div>
            </div>
          </div>

          {/* Быстрая связь */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaWhatsapp className="text-green-500" />
              Быстрая связь
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp_link">
                  WhatsApp ссылка *
                </Label>
                <Input
                  id="whatsapp_link"
                  value={formData.whatsapp_link}
                  onChange={(e) => setFormData({ ...formData, whatsapp_link: e.target.value })}
                  placeholder="https://wa.me/37360123456"
                />
              </div>

              <div>
                <Label htmlFor="telegram_link">
                  Telegram ссылка *
                </Label>
                <Input
                  id="telegram_link"
                  value={formData.telegram_link}
                  onChange={(e) => setFormData({ ...formData, telegram_link: e.target.value })}
                  placeholder="https://t.me/webpoint"
                />
              </div>

              <div>
                <Label htmlFor="facebook_link">
                  Facebook ссылка (опционально)
                </Label>
                <Input
                  id="facebook_link"
                  value={formData.facebook_link}
                  onChange={(e) => setFormData({ ...formData, facebook_link: e.target.value })}
                  placeholder="https://facebook.com/webpoint"
                />
              </div>

              <div>
                <Label htmlFor="instagram_link">
                  Instagram ссылка (опционально)
                </Label>
                <Input
                  id="instagram_link"
                  value={formData.instagram_link}
                  onChange={(e) => setFormData({ ...formData, instagram_link: e.target.value })}
                  placeholder="https://instagram.com/webpoint"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <FaSave className="mr-2" />
              {isSaving ? 'Сохранение...' : 'Сохранить контакты'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminContacts;
