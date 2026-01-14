import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheck, FaRocket, FaStore, FaBriefcase } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Services = () => {
  const { t } = useLanguage();

  const packages = [
    {
      id: 'landing',
      icon: FaRocket,
      title: t('services.landing'),
      desc: t('services.landing.desc'),
      price: '€299',
      time: '7-10 дней',
      features: [
        'Уникальный современный дизайн',
        'Адаптивная верстка для всех устройств',
        'SEO-оптимизация и настройка метатегов',
        'Форма заявки с email-уведомлениями',
        'Интеграция с Google Analytics',
        'Настройка хостинга и домена',
        'Месяц технической поддержки',
        'Обучение по управлению контентом',
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'business',
      icon: FaBriefcase,
      title: t('services.business'),
      desc: t('services.business.desc'),
      price: '€599',
      time: '14-21 день',
      features: [
        'До 10 информационных страниц',
        'Уникальный дизайн под ваш бренд',
        'Административная панель (CMS)',
        'Форма обратной связи',
        'Интеграция с социальными сетями',
        'Блог или новостной раздел',
        'Мультиязычность (RU/RO)',
        'Google Maps интеграция',
        'SEO-оптимизация всех страниц',
        '3 месяца технической поддержки',
      ],
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
    },
    {
      id: 'shop',
      icon: FaStore,
      title: t('services.shop'),
      desc: t('services.shop.desc'),
      price: '€999',
      time: '30-45 дней',
      features: [
        'Каталог товаров с фильтрацией',
        'Корзина и оформление заказа',
        'Интеграция платежных систем',
        'Личный кабинет клиента',
        'Административная панель управления',
        'Система скидок и промокодов',
        'Интеграция служб доставки',
        'Email-уведомления о заказах',
        'Отзывы и рейтинг товаров',
        'Мультиязычность и мультивалютность',
        'SEO-оптимизация товаров',
        '6 месяцев технической поддержки',
      ],
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const additionalServices = [
    {
      title: 'Поддержка и развитие',
      price: '€50/мес',
      features: ['Обновление контента', 'Техническая поддержка', 'Мониторинг безопасности'],
    },
    {
      title: 'SEO-продвижение',
      price: '€200/мес',
      features: ['Анализ конкурентов', 'Оптимизация контента', 'Работа со ссылками'],
    },
    {
      title: 'Контекстная реклама',
      price: '€150/мес',
      features: ['Настройка Google Ads', 'Facebook Ads', 'Аналитика и отчеты'],
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-2xl animate-float-glow" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('services.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Packages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                id={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary to-accent px-4 py-1 rounded-full text-sm font-semibold">
                      Популярный выбор
                    </div>
                  </div>
                )}
                <Card className={`glass-effect p-8 h-full border-white/10 ${pkg.popular ? 'border-primary/50 shadow-elegant' : ''}`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-6 glow-effect`}>
                    <pkg.icon className="text-3xl text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                  <p className="text-muted-foreground mb-4">{pkg.desc}</p>
                  
                  <div className="mb-6">
                    <div className={`text-4xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent mb-1`}>
                      {pkg.price}
                    </div>
                    <div className="text-sm text-muted-foreground">Срок: {pkg.time}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <FaCheck className="text-xs text-primary" />
                          </div>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    <Link to="/contact">{t('services.order')}</Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Дополнительные <span className="gradient-text">услуги</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Расширьте возможности вашего сайта
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect p-6 hover-lift border-white/10">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <div className="text-2xl font-bold gradient-text mb-4">{service.price}</div>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full glass-effect">
                    <Link to="/contact">Узнать подробнее</Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-effect p-12 rounded-3xl text-center border border-primary/20 glow-effect"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Не нашли подходящий пакет?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Мы создадим индивидуальное предложение под ваши задачи и бюджет
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Link to="/contact">Получить консультацию</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
