import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';
import { contactRequestService } from '@/lib/db';

const ContactForm = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  });

  // Read type from URL and pre-fill the form
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const validTypes = ['landing', 'business', 'shop', 'support', 'seo', 'ads'];
      if (validTypes.includes(typeParam)) {
        setFormData(prev => ({ ...prev, projectType: typeParam }));
      }
    }
  }, [searchParams]);

  const contactSchema = z.object({
    name: z.string().min(2, 'Минимум 2 символа').max(100),
    email: z.string().email('Неверный email'),
    phone: z.string().min(6, 'Неверный номер телефона'),
    projectType: z.enum(['landing', 'business', 'shop', 'support', 'seo', 'ads'], {
      errorMap: () => ({ message: 'Выберите тип проекта' })
    }),
    message: z.string().min(10, 'Минимум 10 символов').max(1000),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      contactSchema.parse(formData);
      setIsSubmitting(true);

      // Save to Supabase
      const success = await contactRequestService.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        project_type: formData.projectType as 'landing' | 'business' | 'shop' | 'support' | 'seo' | 'ads',
        message: formData.message,
      });

      if (success) {
        toast.success(t('contact.success'));
        setFormData({ name: '', email: '', phone: '', projectType: '', message: '' });
      } else {
        toast.error(t('contact.error'));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Error submitting contact form:', error);
        toast.error(t('contact.error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            placeholder={t('contact.name')}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="glass-effect border-white/20"
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder={t('contact.email')}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="glass-effect border-white/20"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            type="tel"
            placeholder={t('contact.phone')}
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="glass-effect border-white/20"
            required
          />
        </div>
        <div>
          <Select value={formData.projectType} onValueChange={(value) => handleChange('projectType', value)}>
            <SelectTrigger className="glass-effect border-white/20">
              <SelectValue placeholder={t('contact.projectType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landing">{t('services.landing')}</SelectItem>
              <SelectItem value="business">{t('services.business')}</SelectItem>
              <SelectItem value="shop">{t('services.shop')}</SelectItem>
              <SelectItem value="support">{t('services.additional.support.title')}</SelectItem>
              <SelectItem value="seo">{t('services.additional.seo.title')}</SelectItem>
              <SelectItem value="ads">{t('services.additional.ads.title')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Textarea
          placeholder={t('contact.message')}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className="glass-effect border-white/20 min-h-32"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:opacity-100 text-lg py-6 glow-effect transition-all duration-500 hover:bg-right hover:scale-110 hover:shadow-xl active:scale-95"
      >
        {isSubmitting ? t('contact.sending') : t('contact.send')}
      </Button>
    </motion.form>
  );
};

export default ContactForm;
