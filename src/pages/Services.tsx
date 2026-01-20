import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SeamlessVideoLoop from '@/components/SeamlessVideoLoop';
import { TiltCard } from '@/components/TiltCard';
import { FaCheck, FaRocket, FaStore, FaBriefcase, FaHeadset, FaSearch, FaBullhorn } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { sendGAEvent } from '@/components/GoogleAnalytics';

const Services = () => {
  const { t } = useLanguage();

  const packages = [
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
  ];

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
            "name": "Лендинг",
            "description": "Продающая одностраничная страница для привлечения клиентов"
          },
          "price": "199",
          "priceCurrency": "EUR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Сайт-визитка",
            "description": "Многостраничный корпоративный сайт с полной информацией о компании"
          },
          "price": "499",
          "priceCurrency": "EUR"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Интернет-магазин",
            "description": "Полнофункциональный онлайн-магазин с каталогом, корзиной и системой оплаты"
          },
          "price": "899",
          "priceCurrency": "EUR"
        }
      ]
    }
  };

  return (
    <>
      <SEO
        title="Услуги по созданию сайтов | WebPoint - Цены от €199"
        description="Лендинг от €199, сайт-визитка от €499, интернет-магазин от €899. Полный спектр услуг по разработке сайтов. Сроки от 7 дней. Гарантия качества. Работаем по всему миру."
        keywords="создание сайтов цены, разработка лендинга, сайт визитка цена, интернет магазин, веб разработка"
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
                      {/* Spacer for icon */}
                      <div className="w-16 h-16 mb-6" />

                      <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                      <p className="text-muted-foreground mb-4">{pkg.desc}</p>

                      <ul className="space-y-3 mb-8 flex-grow">
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

                      {/* Spacer for button */}
                      <div className="h-12 mt-auto" />
                    </div>

                    <Card className={`glass-effect p-8 h-full border-white/10 flex flex-col hover-lift relative z-10 ${pkg.popular ? 'border-primary/50 shadow-elegant' : ''}`}>
                      {/* Spacer for icon */}
                      <div className="w-16 h-16 mb-6" />

                      {/* Ghost content */}
                      <h3 className="text-2xl font-bold mb-2 opacity-0 select-none">{pkg.title}</h3>
                      <p className="text-muted-foreground mb-4 opacity-0 select-none">{pkg.desc}</p>

                      <ul className="space-y-3 mb-8 flex-grow opacity-0 select-none">
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

                      {/* Spacer for button */}
                      <div className="h-12 mt-auto" />
                    </Card>

                    {/* Floating 3D Button */}
                    <div
                      className="absolute bottom-8 left-8 right-8 z-20"
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] shadow-lg transition-all duration-500 hover:bg-right hover:scale-110 hover:shadow-xl active:scale-95"
                        onClick={() => sendGAEvent('service_order_click', {
                          service_id: pkg.id,
                          service_name: pkg.title,
                          price: pkg.price
                        })}
                      >
                        <Link to={`/contact?type=${pkg.id}`}>{t('services.order')}</Link>
                      </Button>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div >
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
                      {/* Spacer for icon */}
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
                      {/* Spacer for button */}
                      <div className="h-12 mt-auto" />
                    </div>

                    <Card className="glass-effect p-8 hover-lift border-white/10 h-full flex flex-col relative z-10">
                      {/* Spacer for icon */}
                      <div className="w-16 h-16 mb-6" />

                      {/* Ghost content */}
                      <h3 className="text-2xl font-bold mb-3 opacity-0 select-none">{service.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed opacity-0 select-none">
                        {service.desc}
                      </p>
                      <ul className="space-y-3 mb-8 flex-grow opacity-0 select-none">
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
                      {/* Spacer for button */}
                      <div className="h-12 mt-auto" />
                    </Card>

                    {/* Floating 3D Button */}
                    <div
                      className="absolute bottom-8 left-8 right-8 z-20"
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] shadow-lg transition-all duration-500 hover:bg-right hover:scale-110 hover:shadow-xl active:scale-95"
                        onClick={() => sendGAEvent('service_order_click', {
                          service_id: service.id,
                          service_name: service.title,
                          price: service.price,
                          type: 'additional'
                        })}
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
              <Button asChild size="lg" className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:opacity-100 transition-all duration-500 hover:bg-right hover:scale-110 hover:shadow-xl active:scale-95">
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
