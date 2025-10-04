import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaClock, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Blog = () => {
  const { t } = useLanguage();

  const articles = [
    {
      id: 1,
      title: 'Сколько стоит создание сайта в Молдове в 2025 году',
      excerpt: 'Подробный разбор цен на разработку сайтов: от лендингов до интернет-магазинов. Что влияет на стоимость и как не переплатить.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      category: 'Цены',
      readTime: 8,
      date: '15 января 2025',
    },
    {
      id: 2,
      title: '10 ошибок при создании сайта для бизнеса',
      excerpt: 'Типичные ошибки, которые совершают предприниматели при заказе сайта. Как их избежать и сэкономить деньги.',
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
      category: 'Советы',
      readTime: 6,
      date: '12 января 2025',
    },
    {
      id: 3,
      title: 'Лендинг или интернет-магазин: что выбрать для старта',
      excerpt: 'Сравнение типов сайтов для малого бизнеса. Когда нужен лендинг, а когда стоит сразу делать магазин.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
      category: 'Выбор решения',
      readTime: 7,
      date: '10 января 2025',
    },
    {
      id: 4,
      title: 'SEO-оптимизация сайта: руководство для новичков',
      excerpt: 'Базовые принципы SEO, которые должен знать каждый владелец сайта. Как подняться в топ Google без больших бюджетов.',
      image: 'https://images.unsplash.com/photo-1562577309-2592ab84b1bc?w=800&q=80',
      category: 'SEO',
      readTime: 10,
      date: '8 января 2025',
    },
    {
      id: 5,
      title: 'Адаптивный дизайн: почему это критично в 2025',
      excerpt: 'Статистика мобильного трафика в Молдове и почему ваш сайт должен идеально работать на смартфонах.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
      category: 'Дизайн',
      readTime: 5,
      date: '5 января 2025',
    },
    {
      id: 6,
      title: 'Интеграция платежных систем для интернет-магазина',
      excerpt: 'Обзор популярных платежных систем в Молдове: комиссии, особенности подключения и безопасность.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
      category: 'E-commerce',
      readTime: 9,
      date: '3 января 2025',
    },
  ];

  const categories = ['Все статьи', 'Цены', 'Советы', 'SEO', 'Дизайн', 'E-commerce'];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('blog.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('blog.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-card/50 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                    : 'glass-effect text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass-effect overflow-hidden border-white/10 hover-lift">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-80 lg:h-auto">
                  <img
                    src={articles[0].image}
                    alt={articles[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-primary px-4 py-1 rounded-full text-sm font-semibold">
                      Рекомендуем
                    </div>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="inline-block mb-4">
                    <span className="text-sm font-semibold text-primary">{articles[0].category}</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{articles[0].title}</h2>
                  <p className="text-muted-foreground mb-6">{articles[0].excerpt}</p>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FaClock />
                      <span>{articles[0].readTime} {t('blog.readTime')}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{articles[0].date}</span>
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 group w-fit">
                    {t('blog.readMore')}
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(1).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect overflow-hidden hover-lift border-white/10 h-full flex flex-col group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="glass-effect px-3 py-1 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FaClock />
                        <span>{article.readTime} мин</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full mt-4 group/btn"
                    >
                      {t('blog.readMore')}
                      <FaArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-effect p-12 rounded-3xl text-center border border-primary/20 glow-effect"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Получайте <span className="gradient-text">новые статьи</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Подпишитесь на рассылку и первыми узнавайте о новых материалах
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-6 py-3 rounded-lg glass-effect border border-white/20 focus:outline-none focus:border-primary"
              />
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Подписаться
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
