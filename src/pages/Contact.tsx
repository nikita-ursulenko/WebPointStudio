import { motion } from 'framer-motion';
import { FaWhatsapp, FaTelegram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import ContactForm from '@/components/ContactForm';
import { Card } from '@/components/ui/card';

const Contact = () => {
  const { t } = useLanguage();

  const contactMethods = [
    {
      icon: FaPhone,
      title: 'Телефон',
      value: '+373 60 123 456',
      link: 'tel:+37360123456',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'info@webpoint.md',
      link: 'mailto:info@webpoint.md',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Адрес',
      value: 'Кишинёв, ул. Пушкина 22',
      link: 'https://maps.google.com',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const messengers = [
    {
      icon: FaWhatsapp,
      name: 'WhatsApp',
      link: 'https://wa.me/37360123456',
      color: 'text-green-500',
    },
    {
      icon: FaTelegram,
      name: 'Telegram',
      link: 'https://t.me/webpoint',
      color: 'text-blue-500',
    },
  ];

  const faq = [
    {
      question: 'Как долго создаётся сайт?',
      answer: 'Лендинг - 7-10 дней, сайт-визитка - 14-21 день, интернет-магазин - 30-45 дней.',
    },
    {
      question: 'Какая форма оплаты?',
      answer: 'Предоплата 50% для начала работ, 50% после сдачи проекта. Возможна рассрочка.',
    },
    {
      question: 'Включена ли техподдержка?',
      answer: 'Да, гарантийная поддержка от 1 до 6 месяцев в зависимости от пакета.',
    },
    {
      question: 'Можно ли самому редактировать контент?',
      answer: 'Да, мы предоставляем CMS-панель и обучаем работе с ней.',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-2xl animate-float-glow-slow" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect p-8 text-center hover-lift border-white/10 group">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 glow-effect group-hover:scale-110 transition-transform`}>
                    <method.icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <p className="text-muted-foreground">{method.value}</p>
                </Card>
              </motion.a>
            ))}
          </div>

          {/* Form & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-effect p-8 border-white/10">
                <h2 className="text-2xl font-bold mb-6">Оставьте заявку</h2>
                <ContactForm />
              </Card>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* Messengers */}
              <Card className="glass-effect p-8 border-white/10">
                <h3 className="text-xl font-bold mb-6">Быстрая связь</h3>
                <div className="space-y-4">
                  {messengers.map((messenger, index) => (
                    <a
                      key={index}
                      href={messenger.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 glass-effect rounded-lg hover-lift group"
                    >
                      <div className="w-12 h-12 rounded-xl glass-effect flex items-center justify-center group-hover:scale-110 transition-transform">
                        <messenger.icon className={`text-2xl ${messenger.color}`} />
                      </div>
                      <div>
                        <div className="font-semibold">{messenger.name}</div>
                        <div className="text-sm text-muted-foreground">Написать сообщение</div>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>

              {/* Working Hours */}
              <Card className="glass-effect p-8 border-white/10">
                <h3 className="text-xl font-bold mb-6">Время работы</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Пн - Пт</span>
                    <span className="font-semibold">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Суббота</span>
                    <span className="font-semibold">10:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Воскресенье</span>
                    <span className="font-semibold">Выходной</span>
                  </div>
                </div>
              </Card>

              {/* Map placeholder */}
              <Card className="glass-effect overflow-hidden border-white/10">
                <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkerAlt className="text-5xl mb-4 mx-auto text-primary" />
                    <p className="text-lg font-semibold">Кишинёв, Молдова</p>
                    <p className="text-sm text-muted-foreground">ул. Пушкина 22, офис 15</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Часто задаваемые <span className="gradient-text">вопросы</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect p-6 border-white/10 h-full">
                  <h3 className="font-semibold mb-3 text-primary">{item.question}</h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
