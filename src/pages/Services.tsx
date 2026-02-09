import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import SeamlessVideoLoop from '@/components/SeamlessVideoLoop';
import { TiltCard } from '@/components/TiltCard';
import {
  FaCheck, FaRocket, FaStore, FaBriefcase, FaHeadset,
  FaSearch, FaBullhorn, FaTelegram, FaRobot, FaCogs,
  FaCode, FaTerminal, FaDatabase, FaMobile, FaLaptopCode
} from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { sendGAEvent } from '@/components/GoogleAnalytics';
import { trackEvent } from '@/lib/analytics';

const Services = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active category from hash, default to 'websites'
  const activeCategory = location.hash.replace('#', '') || 'websites';

  useEffect(() => {
    // 1. Handle Legacy Query Params (redirect ?category=x -> #x)
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      navigate(`#${categoryParam}`, { replace: true });
      return;
    }

    // 2. Default Hash (if empty -> #websites)
    if (!location.hash) {
      navigate('#websites', { replace: true });
    }

    // 3. Scroll to tabs if hash changes (optional, but good for UX)
    // We only scroll if it's not the initial load or if we want deep linking behavior
    // For now, standard browser behavior handles #id scrolling mostly. 
    // But since we have a sticky header or overlay, might need offset.
  }, [searchParams, location.hash, navigate]);

  const categories = [
    { id: 'websites', title: t('services.category.websites'), icon: FaRocket },
    { id: 'telegram', title: t('services.category.telegram'), icon: FaTelegram },
    { id: 'automation', title: t('services.category.automation'), icon: FaCogs },
    { id: 'mobile', title: t('services.category.mobile'), icon: FaMobile },
  ];

  const allPackages: Record<string, any[]> = {
    websites: [
      {
        id: 'landing',
        icon: FaRocket,
        title: t('services.landing'),
        desc: t('services.landing.desc'),
        price: '€199',
        time: t('services.time.landing'),
        features: [
          t('services.features.landing.full.design'),
          t('services.features.landing.full.responsive'),
          t('services.features.landing.full.seo'),
          t('services.features.landing.full.form'),
          t('services.features.landing.full.analytics'),
          t('services.features.landing.full.hosting'),
          t('services.features.landing.full.support'),
          t('services.features.landing.full.training'),
        ],
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        id: 'business',
        icon: FaBriefcase,
        title: t('services.business'),
        desc: t('services.business.desc'),
        price: '€499',
        time: t('services.time.business'),
        features: [
          t('services.features.business.full.pages'),
          t('services.features.business.full.design'),
          t('services.features.business.full.cms'),
          t('services.features.business.full.contact'),
          t('services.features.business.full.social'),
          t('services.features.business.full.blog'),
          t('services.features.business.full.multilang'),
          t('services.features.business.full.maps'),
          t('services.features.business.full.seo'),
          t('services.features.business.full.support'),
        ],
        gradient: 'from-purple-500 to-pink-500',
        popular: true,
      },
      {
        id: 'shop',
        icon: FaStore,
        title: t('services.shop'),
        desc: t('services.shop.desc'),
        price: '€899',
        time: t('services.time.shop'),
        features: [
          t('services.features.shop.full.catalog'),
          t('services.features.shop.full.cart'),
          t('services.features.shop.full.payment'),
          t('services.features.shop.full.account'),
          t('services.features.shop.full.admin'),
          t('services.features.shop.full.discounts'),
          t('services.features.shop.full.delivery'),
          t('services.features.shop.full.notifications'),
          t('services.features.shop.full.reviews'),
          t('services.features.shop.full.multilang'),
          t('services.features.shop.full.seo'),
          t('services.features.shop.full.support'),
        ],
        gradient: 'from-orange-500 to-red-500',
      },
      {
        id: 'websites-complex',
        icon: FaLaptopCode,
        title: 'Корпоративный портал',
        desc: 'Сложные веб-системы и порталы',
        price: '€1499',
        time: 'от 30 дней',
        features: [
          'Личные кабинеты',
          'Сложная бизнес-логика',
          'Интеграции по API',
          'Высокая нагрузка'
        ],
        gradient: 'from-indigo-500 to-blue-600',
      }
    ],
    telegram: [
      {
        id: 'tg-basic',
        icon: FaTelegram,
        title: t('services.tg.basic'),
        desc: t('services.tg.basic.desc'),
        price: '€149',
        time: t('services.time.tg.basic'),
        features: [
          t('services.features.tg.basic.menu'),
          t('services.features.tg.basic.faq'),
          t('services.features.tg.basic.form'),
          t('services.features.tg.basic.admin'),
          t('services.features.tg.basic.broadcast'),
          t('services.features.tg.basic.stats'),
        ],
        gradient: 'from-blue-400 to-blue-600',
      },
      {
        id: 'tg-shop',
        icon: FaStore,
        title: t('services.tg.shop'),
        desc: t('services.tg.shop.desc'),
        price: '€299',
        time: t('services.time.tg.shop'),
        features: [
          t('services.features.tg.shop.catalog'),
          t('services.features.tg.shop.cart'),
          t('services.features.tg.shop.payments'),
          t('services.features.tg.shop.notification'),
          t('services.features.tg.shop.ref'),
          t('services.features.tg.shop.sheets'),
        ],
        gradient: 'from-cyan-400 to-blue-500',
        popular: true,
      },
      {
        id: 'tg-complex',
        icon: FaRobot,
        title: t('services.tg.complex'),
        desc: t('services.tg.complex.desc'),
        price: '€449',
        time: t('services.time.tg.complex'),
        features: [
          t('services.features.tg.complex.api'),
          t('services.features.tg.complex.db'),
          t('services.features.tg.complex.custom'),
          t('services.features.tg.complex.ai'),
          t('services.features.tg.complex.subs'),
          t('services.additional.support.tech'),
        ],
        gradient: 'from-indigo-500 to-purple-600',
      },
    ],
    automation: [
      {
        id: 'auto-parsing',
        icon: FaSearch,
        title: t('services.auto.parsing'),
        desc: t('services.auto.parsing.desc'),
        price: '€99',
        time: t('services.time.auto.parsing'),
        features: [
          t('services.features.auto.parsing.sites'),
          t('services.features.auto.parsing.format'),
          t('services.features.auto.parsing.schedule'),
          t('services.features.auto.parsing.stealth'),
        ],
        gradient: 'from-emerald-400 to-teal-600',
      },
      {
        id: 'auto-scripts',
        icon: FaTerminal,
        title: t('services.auto.scripts'),
        desc: t('services.auto.scripts.desc'),
        price: '€149',
        time: t('services.time.auto.scripts'),
        features: [
          t('services.features.auto.scripts.routine'),
          t('services.features.auto.scripts.clean'),
          t('services.features.auto.scripts.support'),
          t('services.features.auto.scripts.secure'),
          t('services.features.auto.scripts.docs'),
        ],
        gradient: 'from-slate-500 to-slate-700',
      },
      {
        id: 'auto-complex',
        icon: FaLaptopCode,
        title: t('services.auto.complex'),
        desc: t('services.auto.complex.desc'),
        price: '€499',
        time: t('services.time.auto.complex'),
        features: [
          t('services.features.auto.complex.web'),
          t('services.features.auto.complex.parsing'),
          t('services.features.auto.complex.scripts'),
          t('services.features.auto.complex.ai'),
          t('services.features.auto.complex.notif'),
        ],
        gradient: 'from-blue-600 to-cyan-600',
        popular: true,
      },
    ],
    mobile: [
      {
        id: 'mobile-mvp',
        icon: FaMobile,
        title: t('services.mobile.mvp'),
        desc: t('services.mobile.mvp.desc'),
        price: '€999',
        time: t('services.time.mobile.mvp'),
        features: [
          t('services.features.mobile.mvp.hybrid'),
          t('services.features.mobile.mvp.auth'),
          t('services.features.mobile.mvp.adaptive'),
          t('services.features.mobile.mvp.social'),
          t('services.features.mobile.mvp.analytics'),
        ],
        gradient: 'from-blue-500 to-indigo-600',
      },
      {
        id: 'mobile-business',
        icon: FaBriefcase,
        title: t('services.mobile.business'),
        desc: t('services.mobile.business.desc'),
        price: '€1999',
        time: t('services.time.mobile.business'),
        features: [
          t('services.features.mobile.mvp.hybrid'),
          t('services.features.mobile.business.stores'),
          t('services.features.mobile.business.push'),
          t('services.features.mobile.business.native'),
          t('services.features.mobile.business.geo'),
        ],
        gradient: 'from-purple-600 to-pink-600',
        popular: true,
      },
      {
        id: 'mobile-shop',
        icon: FaStore,
        title: t('services.mobile.shop'),
        desc: t('services.mobile.shop.desc'),
        price: '€2499',
        time: t('services.time.mobile.shop'),
        features: [
          t('services.features.mobile.mvp.hybrid'),
          t('services.features.mobile.shop.pay'),
          t('services.features.mobile.shop.ota'),
          t('services.features.mobile.shop.search'),
          t('services.features.mobile.shop.history'),
        ],
        gradient: 'from-orange-500 to-red-600',
      },
    ],
  };

  const additionalServices = [
    {
      id: 'support',
      icon: FaHeadset,
      title: t('services.additional.support.title'),
      desc: t('services.additional.support.desc'),
      price: t('services.additional.support.price'),
      features: [
        t('services.additional.support.content'),
        t('services.additional.support.tech'),
        t('services.additional.support.monitoring'),
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'seo',
      icon: FaSearch,
      title: t('services.additional.seo.title'),
      desc: t('services.additional.seo.desc'),
      price: t('services.additional.seo.price'),
      features: [
        t('services.additional.seo.analysis'),
        t('services.additional.seo.optimization'),
        t('services.additional.seo.links'),
      ],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'ads',
      icon: FaBullhorn,
      title: t('services.additional.ads.title'),
      desc: t('services.additional.ads.desc'),
      price: t('services.additional.ads.price'),
      features: [
        t('services.additional.ads.google'),
        t('services.additional.ads.facebook'),
        t('services.additional.ads.analytics'),
      ],
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Веб-разработка",
    "provider": {
      "@type": "Organization",
      "name": "WebPoint"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Услуги по созданию сайтов",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Разработка ИТ-решений",
            "description": "Веб-платформы, мобильные приложения, боты и автоматизация"
          },
          "price": "99",
          "priceCurrency": "EUR"
        }
      ]
    }
  };

  return (
    <>
      <SEO
        title="ИТ-услуги и разработка цифровых продуктов | WebPoint"
        description="Полный спектр ИТ-услуг: создание веб-платформ, мобильных приложений на Flutter, Telegram Mini Apps и систем автоматизации. Цены от €99. Узнайте больше об инновациях для вашего бизнеса."
        keywords="ит услуги, разработка мобильных приложений, автоматизация бизнеса, создание сайтов кишинев, telegram боты разработка, парсинг данных"
        url="/services"
        structuredData={structuredData}
      />
      <div className="min-h-screen pt-20">


        {/* Hero */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <SeamlessVideoLoop
              src="/video/hero-video.mp4"
              className="w-full h-full"
              overlayClassName="absolute inset-0 bg-background/80"
            />
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

        {/* Categories Tabs */}
        <div id="services-tabs" className="container mx-auto px-4 -mt-10 mb-10 relative z-30">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-effect p-2 rounded-2xl flex flex-wrap justify-center gap-2 border border-white/10 shadow-elegant overflow-hidden">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`#${cat.id}`, { replace: true });
                    trackEvent('Клик по категории', `Услуги - Таб - ${cat.title}`, 'click');
                  }}
                  className={`relative px-6 py-3 rounded-xl transition-all duration-500 flex items-center gap-3 group ${activeCategory === cat.id ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{ borderRadius: '12px' }}
                    />
                  )}
                  <cat.icon className={`text-xl relative z-10 transition-transform duration-500 ${activeCategory === cat.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-semibold relative z-10 whitespace-nowrap">{cat.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Packages with :target visibility */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            {Object.keys(allPackages).map((categoryKey) => (
              <div
                key={categoryKey}
                className={`${activeCategory === categoryKey ? 'grid animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'} grid-cols-1 lg:grid-cols-3 gap-8`}
              >
                {allPackages[categoryKey].map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    id={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <TiltCard className="h-full">
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" style={{ transform: 'translateZ(30px)' }}>
                          <div className="bg-gradient-to-r from-primary to-accent px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                            {t('services.popular.badge')}
                          </div>
                        </div>
                      )}

                      {/* Floating 3D Icon */}
                      <div
                        className={`absolute top-8 left-8 z-20 w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center glow-effect`}
                        style={{ transform: 'translateZ(50px)' }}
                      >
                        <pkg.icon className="text-3xl text-white" />
                      </div>

                      {/* Floating 3D Price */}
                      <div
                        className="absolute top-8 right-8 z-20 text-right"
                        style={{ transform: 'translateZ(50px)' }}
                      >
                        <div className={`text-4xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent mb-1`}>
                          {pkg.price}
                        </div>
                        <div className="text-sm text-muted-foreground bg-white/10 backdrop-blur-md px-2 py-1 rounded-md inline-block">
                          {pkg.time}
                        </div>
                      </div>

                      {/* Floating 3D Text Content */}
                      <div
                        className="absolute inset-0 p-8 z-20 flex flex-col pointer-events-none"
                        style={{ transform: 'translateZ(40px)' }}
                      >
                        <div className="w-16 h-16 mb-6" />
                        <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                        <p className="text-muted-foreground mb-4 text-sm line-clamp-3">{pkg.desc}</p>

                        <ul className="space-y-3 mb-8 flex-grow">
                          {pkg.features.map((feature: string, i: number) => (
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
                        <div className="h-12 mt-auto" />
                      </div>

                      <Card className={`glass-effect p-8 h-full border-white/10 flex flex-col hover-lift relative z-10 ${pkg.popular ? 'border-primary/50 shadow-elegant' : ''}`}>
                        <div className="w-16 h-16 mb-6" />
                        <h3 className="text-2xl font-bold mb-2 opacity-0 select-none">{pkg.title}</h3>
                        <p className="text-muted-foreground mb-4 opacity-0 select-none">{pkg.desc}</p>
                        <ul className="space-y-3 mb-8 flex-grow opacity-0 select-none">
                          {pkg.features.map((_: any, i: number) => (
                            <li key={i} className="flex items-start gap-3"><div className="w-5 h-5" /></li>
                          ))}
                        </ul>
                        <div className="h-12 mt-auto" />
                      </Card>

                      {/* Floating 3D Button */}
                      <div
                        className="absolute bottom-8 left-8 right-8 z-20"
                        style={{ transform: 'translateZ(50px)' }}
                      >
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] shadow-lg transition-all duration-500 hover:bg-right hover:scale-105 hover:shadow-xl active:scale-95"
                          onClick={() => {
                            sendGAEvent('service_order_click', {
                              service_id: pkg.id,
                              service_name: pkg.title,
                              price: pkg.price
                            });
                            trackEvent('Начало заказа', `Услуги - ${categoryKey} - ${pkg.title}`, 'click');
                          }}
                        >
                          <Link to={`/contact?type=${pkg.id}`}>{t('services.order')}</Link>
                        </Button>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-20 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('services.additional.title')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('services.additional.subtitle')}
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
                  <TiltCard className="h-full">
                    {/* Floating 3D Icon */}
                    <div
                      className={`absolute top-8 left-8 z-20 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center glow-effect`}
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <service.icon className="text-white text-2xl" />
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
                      <div className="w-16 h-16 mb-6" />
                      <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {service.desc}
                      </p>
                      <ul className="space-y-3 mb-8 flex-grow">
                        {service.features.map((feature, i) => (
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
                      <div className="h-12 mt-auto" />
                    </div>

                    <Card className="glass-effect p-8 hover-lift border-white/10 h-full flex flex-col relative z-10">
                      <div className="w-16 h-16 mb-6" />
                      <h3 className="text-2xl font-bold mb-3 opacity-0 select-none">{service.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed opacity-0 select-none">
                        {service.desc}
                      </p>
                      <ul className="space-y-3 mb-8 flex-grow opacity-0 select-none">
                        {service.features.map((_, i) => (
                          <li key={i} className="flex items-start gap-3"><div className="w-5 h-5" /></li>
                        ))}
                      </ul>
                      <div className="h-12 mt-auto" />
                    </Card>

                    {/* Floating 3D Button */}
                    <div
                      className="absolute bottom-8 left-8 right-8 z-20"
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] shadow-lg transition-all duration-500 hover:bg-right hover:scale-105 hover:shadow-xl active:scale-95"
                        onClick={() => {
                          sendGAEvent('service_order_click', {
                            service_id: service.id,
                            service_name: service.title,
                            price: service.price,
                            type: 'additional'
                          });
                          trackEvent('Начало заказа', `Услуги - Доп. услуга - ${service.title}`, 'click');
                        }}
                      >
                        <Link to={`/contact?type=${service.id}`}>{t('services.order')}</Link>
                      </Button>
                    </div>
                  </TiltCard>
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
                {t('services.cta.title')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('services.cta.subtitle')}
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:opacity-100 transition-all duration-500 hover:bg-right hover:scale-110 hover:shadow-xl active:scale-95" onClick={() => trackEvent('Клик по кнопке', 'Услуги - Подвал - Связаться с нами', 'click')}>
                <Link to="/contact">{t('services.cta.button')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;
