import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheck, FaHeadset, FaSearch, FaBullhorn } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SEO from '@/components/SEO';

const AdditionalServices = () => {
  const { t } = useLanguage();

  const additionalServices = [
    {
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
    "serviceType": "Дополнительные услуги",
    "provider": {
      "@type": "Organization",
      "name": "WebPoint"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Молдова"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Дополнительные услуги",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Поддержка и развитие",
            "price": "50",
            "priceCurrency": "EUR"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SEO-продвижение",
            "price": "200",
            "priceCurrency": "EUR"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Контекстная реклама",
            "price": "150",
            "priceCurrency": "EUR"
          }
        }
      ]
    }
  };

  return (
    <>
      <SEO
        title="Дополнительные услуги | WebPoint - Поддержка, SEO и реклама"
        description="Расширьте возможности вашего сайта: техническая поддержка, SEO-продвижение, контекстная реклама. Профессиональные услуги от WebPoint."
        keywords="поддержка сайта, SEO продвижение молдова, контекстная реклама, техническая поддержка сайта, настройка Google Ads"
        url="/additional-services"
        structuredData={structuredData}
      />
      <div className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-2xl animate-float-glow" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-2xl animate-float-glow-slow" />
          </div>

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('services.additional.title')}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t('services.additional.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {additionalServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-effect p-8 hover-lift border-white/10 h-full flex flex-col">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 glow-effect`}>
                      <service.icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {service.desc}
                    </p>
                    <div className={`text-3xl font-bold mb-6 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                      {service.price}
                    </div>
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
                    <Button asChild variant="outline" className="w-full glass-effect border-white/20 mt-auto">
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
              className="glass-effect p-12 rounded-3xl text-center border border-primary/20 glow-effect max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('services.cta.title')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('services.cta.subtitle')}
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Link to="/contact">{t('services.cta.button')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdditionalServices;
