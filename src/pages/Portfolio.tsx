import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProjectType = 'all' | 'landing' | 'business' | 'shop';

const Portfolio = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<ProjectType>('all');

  const projects = [
    {
      id: 1,
      type: 'landing' as ProjectType,
      title: 'Beauty Salon Premium',
      category: 'Салон красоты',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
      problem: 'Салон терял клиентов из-за отсутствия онлайн-записи',
      solution: 'Создали лендинг с формой записи и интеграцией WhatsApp',
      result: '+150% онлайн-записей за первый месяц',
    },
    {
      id: 2,
      type: 'shop' as ProjectType,
      title: 'TechStore Moldova',
      category: 'Электроника',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      problem: 'Низкая конверсия продаж онлайн',
      solution: 'Разработали интуитивный интернет-магазин с быстрой оплатой',
      result: '+200% онлайн-продаж, средний чек вырос на 40%',
    },
    {
      id: 3,
      type: 'business' as ProjectType,
      title: 'Law Firm Pro',
      category: 'Юридические услуги',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
      problem: 'Устаревший сайт не привлекал новых клиентов',
      solution: 'Создали современный корпоративный сайт с блогом',
      result: '+85% входящих заявок, улучшение имиджа компании',
    },
    {
      id: 4,
      type: 'landing' as ProjectType,
      title: 'Fitness Club Launch',
      category: 'Фитнес-клуб',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      problem: 'Новый клуб нуждался в быстром привлечении членов',
      solution: 'Яркий лендинг с акциями и онлайн-регистрацией',
      result: '300+ новых членов за 2 месяца',
    },
    {
      id: 5,
      type: 'shop' as ProjectType,
      title: 'Fashion Boutique',
      category: 'Мода',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      problem: 'Бутик хотел выйти в онлайн-продажи',
      solution: 'Элегантный интернет-магазин одежды с примеркой AR',
      result: '€50K+ оборот в первые 3 месяца',
    },
    {
      id: 6,
      type: 'business' as ProjectType,
      title: 'Restaurant Chain',
      category: 'Ресторанный бизнес',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      problem: 'Сеть ресторанов нуждалась в единой платформе',
      solution: 'Многофункциональный сайт с онлайн-заказом и бронированием',
      result: '+120% онлайн-заказов, экономия на колл-центре',
    },
  ];

  const filters: { value: ProjectType; label: string }[] = [
    { value: 'all', label: t('portfolio.all') },
    { value: 'landing', label: t('portfolio.landing') },
    { value: 'business', label: t('portfolio.business') },
    { value: 'shop', label: t('portfolio.shop') },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.type === filter);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('portfolio.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('portfolio.subtitle')}
            </p>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  filter === item.value
                    ? 'bg-gradient-to-r from-primary to-accent text-white glow-effect'
                    : 'glass-effect text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-effect overflow-hidden hover-lift border-white/10 group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-xs text-primary font-semibold mb-1">{project.category}</div>
                        <h3 className="text-xl font-bold">{project.title}</h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <div className="text-sm font-semibold text-primary mb-1">{t('portfolio.problem')}</div>
                        <p className="text-sm text-muted-foreground">{project.problem}</p>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-accent mb-1">{t('portfolio.solution')}</div>
                        <p className="text-sm text-muted-foreground">{project.solution}</p>
                      </div>

                      <div>
                        <div className="text-sm font-semibold gradient-text mb-1">{t('portfolio.result')}</div>
                        <p className="text-sm font-medium">{project.result}</p>
                      </div>

                      <Button variant="outline" className="w-full glass-effect group">
                        {t('portfolio.view')}
                        <FaExternalLinkAlt className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
