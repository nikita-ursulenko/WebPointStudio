import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaTelegram, FaRocket, FaMobile, FaSearch, FaHeadset } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { contactService } from '@/lib/db';
import SEO from '@/components/SEO';

const Home = () => {
  const { t } = useLanguage();
  const [contact, setContact] = useState<{
    whatsapp_link?: string;
    telegram_link?: string;
  } | null>(null);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const data = await contactService.get();
        setContact(data);
      } catch (error) {
        console.error('Error loading contact:', error);
      }
    };
    loadContact();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WebPoint",
    "description": "Профессиональная разработка сайтов. Лендинги, интернет-магазины и корпоративные сайты под ключ. Работаем по всему миру.",
    "url": "https://webpoint.md",
    "logo": "https://webpoint.md/og-image.jpg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+373-60-123-456",
      "contactType": "Customer Service",
      "email": "info@webpoint.md",
      "availableLanguage": ["Russian", "Romanian"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Кишинёв",
      "addressCountry": "MD"
    },
    "sameAs": [
      "https://wa.me/37360123456",
      "https://t.me/webpoint",
      "https://facebook.com/webpoint",
      "https://instagram.com/webpoint"
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "Лендинг",
        "price": "199",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "name": "Сайт-визитка",
        "price": "499",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "name": "Интернет-магазин",
        "price": "899",
        "priceCurrency": "EUR"
      }
    ]
  };

  const features = [
    { icon: FaRocket, title: t('features.design'), desc: t('features.design.desc') },
    { icon: FaMobile, title: t('features.responsive'), desc: t('features.responsive.desc') },
    { icon: FaSearch, title: t('features.seo'), desc: t('features.seo.desc') },
    { icon: FaHeadset, title: t('features.support'), desc: t('features.support.desc') },
  ];

  const services = [
    {
      title: t('services.landing'),
      desc: t('services.landing.desc'),
      price: '€199',
      features: [
        t('services.features.landing.design'),
        t('services.features.landing.responsive'),
        t('services.features.landing.seo'),
        t('services.features.landing.form'),
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: t('services.business'),
      desc: t('services.business.desc'),
      price: '€499',
      features: [
        t('services.features.business.pages'),
        t('services.features.business.cms'),
        t('services.features.business.social'),
        t('services.features.business.analytics'),
      ],
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
    },
    {
      title: t('services.shop'),
      desc: t('services.shop.desc'),
      price: '€899',
      features: [
        t('services.features.shop.catalog'),
        t('services.features.shop.cart'),
        t('services.features.shop.account'),
        t('services.features.shop.delivery'),
      ],
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { value: '5+', label: t('about.experience') },
    { value: '150+', label: t('about.projects') },
    { value: '98%', label: t('about.clients') },
  ];

  return (
    <>
      <SEO
        title="WebPoint - Создание Сайтов | Лендинги, Интернет-магазины"
        description="Профессиональная разработка сайтов. Лендинги от €199, сайты-визитки от €499, интернет-магазины от €899. Современный дизайн, SEO-оптимизация, техническая поддержка. Работаем по всему миру. Более 150 реализованных проектов."
        keywords="создание сайтов, разработка сайтов, лендинг пейдж, интернет-магазин, сайт-визитка, веб-дизайн, разработка сайтов под ключ"
        url="/"
        structuredData={structuredData}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-32 md:py-40 flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 -z-10">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/video/hero-video.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/80" />
          </div>

          <div className="container mx-auto px-4 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-6"
              >
                <div className="glass-effect px-6 py-2 rounded-full border border-primary/30">
                  <span className="text-sm font-medium gradient-text">{t('home.hero.badge')}</span>
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                {t('hero.title')}
                <br />
                <span className="gradient-text">{t('hero.highlight')}</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect text-lg px-8 py-6">
                  <Link to="/contact">{t('hero.cta')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="glass-effect border-white/20 text-lg px-8 py-6">
                  <Link to="/portfolio">{t('hero.consultation')}</Link>
                </Button>
              </div>

              {/* Quick Contact Buttons */}
              {(contact?.whatsapp_link || contact?.telegram_link) && (
                <div className="flex items-center justify-center gap-4">
                  {contact?.whatsapp_link && (
                    <a
                      href={contact.whatsapp_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 glass-effect px-6 py-3 rounded-full hover-lift"
                    >
                      <FaWhatsapp className="text-xl text-green-500" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </a>
                  )}
                  {contact?.telegram_link && (
                    <a
                      href={contact.telegram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 glass-effect px-6 py-3 rounded-full hover-lift"
                    >
                      <FaTelegram className="text-xl text-blue-500" />
                      <span className="text-sm font-medium">Telegram</span>
                    </a>
                  )}
                </div>
              )}
            </motion.div>


          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 bg-card/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ willChange: 'transform' }}
                  className="glass-effect p-8 rounded-2xl text-center hover-lift border-white/10"
                >
                  <div className="text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t('home.why.title')} <span className="gradient-text">{t('home.why.highlight')}</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('home.why.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-effect p-8 hover-lift h-full border-white/10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 glow-effect">
                      <feature.icon className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('home.services.title')}</h2>
              <p className="text-xl text-muted-foreground">{t('home.services.subtitle')}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-primary to-accent px-4 py-1 rounded-full text-sm font-semibold">
                        {t('home.services.popular')}
                      </div>
                    </div>
                  )}
                  <Card className={`glass-effect p-8 h-full hover-lift border-white/10 flex flex-col ${service.popular ? 'border-primary/50 shadow-elegant' : ''}`}>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-2`}>
                      {service.price}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.desc}</p>
                    <ul className="space-y-3 mb-8 flex-grow">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 mt-auto">
                      <Link to="/contact">{t('services.order')}</Link>
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-effect p-12 md:p-16 rounded-3xl text-center border border-primary/20 glow-effect"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {t('home.cta.title')} <span className="gradient-text">{t('home.cta.highlight')}</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('home.cta.subtitle')}
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6">
                <Link to="/contact">{t('hero.cta')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
