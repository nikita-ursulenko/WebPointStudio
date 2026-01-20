import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaTelegram, FaRocket, FaMobile, FaSearch, FaHeadset, FaStore, FaBriefcase } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { contactService } from '@/lib/db';
import SEO from '@/components/SEO';
import SeamlessVideoLoop from '@/components/SeamlessVideoLoop';
import AnimatedCounter from '@/components/AnimatedCounter';
import { TiltCard } from '@/components/TiltCard';

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
      icon: FaRocket,
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
      icon: FaBriefcase,
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
      icon: FaStore,
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
        <section className="relative min-h-screen flex flex-col overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 -z-10">
            <SeamlessVideoLoop
              src="/video/hero-video.mp4"
              className="w-full h-full"
              overlayClassName="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/80"
            />
          </div>

          <div className="container mx-auto px-4 flex-1 flex flex-col pt-24 md:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-6xl mx-auto flex-1 flex flex-col"
            >
              {/* Badge - Always at top on mobile */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-fit mx-auto mb-4 md:mb-6"
              >
                <div className="glass-effect px-6 py-2 rounded-full border border-primary/30">
                  <span className="text-sm font-medium gradient-text">{t('home.hero.badge')}</span>
                </div>
              </motion.div>

              {/* Main Content - Centered in remaining space on mobile */}
              <div className="flex-1 flex flex-col justify-center pb-20 md:pb-0">
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                  {t('hero.title')}
                  <br />
                  <span className="gradient-text">{t('hero.highlight')}</span>
                </h1>

                <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto px-4">
                  <span className="hidden md:inline">{t('hero.subtitle')}</span>
                  <span className="md:hidden">Профессиональная разработка сайтов под ключ с гарантией результата.</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-12 max-w-[310px] sm:max-w-none mx-auto">
                  <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:opacity-100 glow-effect text-base md:text-lg px-8 py-4 md:py-6 transition-all duration-500 hover:bg-right hover:scale-110 hover:shadow-xl active:scale-95">
                    <Link to="/contact">{t('hero.cta')}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto glass-effect border-white/20 text-base md:text-lg px-8 py-4 md:py-6">
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
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Web</span>Point <span className="gradient-text">{t('home.stats.title_suffix')}</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('home.stats.subtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto"
            >
              {[
                { value: 5, suffix: '+', label: t('about.experience') },
                { value: 150, suffix: '+', label: t('about.projects') },
                { value: 98, suffix: '%', label: t('about.clients') }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`${index === 2 ? "col-span-2 md:col-span-1 mx-auto w-full max-w-[calc(50%-0.5rem)] md:max-w-none" : "w-full"}`}
                >
                  <div className="glass-effect p-6 md:p-10 rounded-2xl md:rounded-3xl text-center border border-white/10 bg-[rgba(30,41,59,0.5)] flex flex-col items-center justify-center h-full hover-lift group">
                    <div
                      className="text-3xl md:text-6xl font-bold text-primary mb-2 md:mb-3 drop-shadow-md flex items-center justify-center font-mono group-hover:scale-110 transition-transform duration-300"
                      style={{ color: '#a855f7' }}
                    >
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-muted-foreground font-medium uppercase tracking-wide text-[10px] md:text-base opacity-80 group-hover:opacity-100 transition-opacity">
                      {stat.label}
                    </div>
                  </div>
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
                  <TiltCard className="h-full">
                    {/* Floating 3D Icon */}
                    <div
                      className="absolute top-8 left-8 z-20 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect"
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <feature.icon className="text-3xl text-white" />
                    </div>

                    {/* Floating 3D Text */}
                    <div
                      className="absolute inset-0 p-8 z-20 flex flex-col pointer-events-none"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      {/* Spacer for icon */}
                      <div className="w-16 h-16 mb-6" />
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </div>

                    <Card className="glass-effect p-8 hover-lift h-full border-white/10 relative z-10">
                      {/* Spacer for icon */}
                      <div className="w-16 h-16 mb-6" />

                      {/* Ghost content to preserve height */}
                      <h3 className="text-xl font-semibold mb-3 opacity-0 select-none">{feature.title}</h3>
                      <p className="text-muted-foreground opacity-0 select-none">{feature.desc}</p>
                    </Card>
                  </TiltCard>
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
                  <TiltCard className="h-full">
                    {service.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" style={{ transform: 'translateZ(30px)' }}>
                        <div className="bg-gradient-to-r from-primary to-accent px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                          {t('home.services.popular')}
                        </div>
                      </div>
                    )}

                    {/* Floating 3D Icon */}
                    <div
                      className={`absolute top-8 left-8 z-20 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center glow-effect`}
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <service.icon className="text-3xl text-white" />
                    </div>

                    {/* Floating 3D Price */}
                    <div
                      className="absolute top-8 right-8 z-20"
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <div className={`text-3xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                        {service.price}
                      </div>
                    </div>

                    {/* Floating 3D Text Content */}
                    <div
                      className="absolute inset-0 p-8 z-20 flex flex-col pointer-events-none"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      {/* Spacer for icon */}
                      <div className="w-16 h-16 mb-6" />

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

                      {/* Spacer for button */}
                      <div className="h-12 mt-auto" />
                    </div>

                    <Card className={`glass-effect p-8 h-full hover-lift border-white/10 flex flex-col relative z-10 ${service.popular ? 'border-primary/50 shadow-elegant' : ''}`}>
                      {/* Spacer for icon */}
                      <div className="w-16 h-16 mb-6" />

                      <h3 className="text-2xl font-bold mb-3 opacity-0 select-none">{service.title}</h3>
                      <p className="text-muted-foreground mb-6 opacity-0 select-none">{service.desc}</p>
                      <ul className="space-y-3 mb-8 flex-grow opacity-0 select-none">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Spacer for button */}
                      <div className="h-12 mt-auto" />
                    </Card>

                    {/* Floating 3D Button */}
                    <div
                      className="absolute bottom-8 left-8 right-8 z-20"
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <Button asChild className="w-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] shadow-lg transition-all duration-500 hover:bg-right hover:scale-110 hover:shadow-xl active:scale-95">
                        <Link to="/services">{t('services.additional.more')}</Link>
                      </Button>
                    </div>
                  </TiltCard>
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
              <Button asChild size="lg" className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:opacity-100 text-lg px-8 py-6 transition-all duration-500 hover:bg-right hover:scale-110 hover:shadow-xl active:scale-95">
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
