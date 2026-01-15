import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaClock, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogService, newsletterService } from '@/lib/db';
import { getBlogImageUrl } from '@/lib/storage';
import SEO from '@/components/SEO';

type ArticleCategory = 'prices' | 'tips' | 'seo' | 'design' | 'ecommerce';

interface ArticleTranslations {
  ro?: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
  };
  en?: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
  };
}

interface ArticleFromAdmin {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  categoryKey: ArticleCategory;
  readTime: number;
  date: string;
  translations?: ArticleTranslations;
}

interface DisplayArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  categoryKey: ArticleCategory;
  readTime: number;
  date: string;
}

const Blog = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [adminArticles, setAdminArticles] = useState<ArticleFromAdmin[]>([]);

  // Загрузка статей из БД
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await blogService.getAll();
        setAdminArticles(data as ArticleFromAdmin[]);
      } catch (error) {
        console.error('Error loading articles:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem('blog_articles');
        if (stored) {
          try {
            setAdminArticles(JSON.parse(stored));
          } catch (e) {
            console.error('Error parsing localStorage:', e);
          }
        }
      }
    };
    loadArticles();
  }, []);

  // Преобразование статей из админ-панели в формат для отображения
  const getArticleDisplayData = (article: ArticleFromAdmin): DisplayArticle => {
    const translations = article.translations;

    let title = article.title;
    let excerpt = article.excerpt;
    let category = article.category;

    // Используем переводы в зависимости от текущего языка
    if (translations) {
      if (language === 'ro' && translations.ro) {
        title = translations.ro.title || title;
        excerpt = translations.ro.excerpt || excerpt;
        category = translations.ro.category || category;
      } else if (language === 'en' && translations.en) {
        title = translations.en.title || title;
        excerpt = translations.en.excerpt || excerpt;
        category = translations.en.category || category;
      }
    }

    return {
      id: article.id,
      title,
      excerpt,
      image: article.image,
      category,
      categoryKey: article.categoryKey,
      readTime: article.readTime,
      date: article.date,
    };
  };

  // Используем только статьи из БД
  const articles: DisplayArticle[] = adminArticles.map(getArticleDisplayData).sort((a, b) => (b.id || 0) - (a.id || 0)); // Сортировка по ID, чтобы новые были сверху

  const categories = [
    { value: 'all', label: t('blog.categories.all') },
    { value: 'prices', label: t('blog.categories.prices') },
    { value: 'tips', label: t('blog.categories.tips') },
    { value: 'seo', label: t('blog.categories.seo') },
    { value: 'design', label: t('blog.categories.design') },
    { value: 'ecommerce', label: t('blog.categories.ecommerce') },
  ];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.categoryKey === selectedCategory);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Блог WebPoint",
    "description": "Полезные статьи о создании и продвижении сайтов",
    "url": "https://webpoint.md/blog",
    "publisher": {
      "@type": "Organization",
      "name": "WebPoint"
    }
  };

  return (
    <>
      <SEO
        title="Блог о веб-разработке | WebPoint - Полезные статьи о создании сайтов"
        description="Полезные статьи о создании и продвижении сайтов. Советы по SEO, дизайну, ценам на разработку. Экспертные материалы от команды WebPoint."
        keywords="блог веб разработки, статьи о создании сайтов, seo советы, дизайн сайтов, интернет магазин"
        url="/blog"
        structuredData={structuredData}
      />
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
                  key={category.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category.value
                    ? 'bg-gradient-to-r from-primary to-accent text-white glow-effect'
                    : 'glass-effect text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Article - только для "all" */}
        {selectedCategory === 'all' && filteredArticles.length > 0 && (
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
                        src={getBlogImageUrl(filteredArticles[0].image)}
                        alt={filteredArticles[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="bg-primary px-4 py-1 rounded-full text-sm font-semibold">
                          {t('blog.recommended')}
                        </div>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="inline-block mb-4">
                        <span className="text-sm font-semibold text-primary">{filteredArticles[0].category}</span>
                      </div>
                      <h2 className="text-3xl font-bold mb-4">{filteredArticles[0].title}</h2>
                      <p className="text-muted-foreground mb-6">{filteredArticles[0].excerpt}</p>
                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FaClock />
                          <span>{filteredArticles[0].readTime} {t('blog.readTime')}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{filteredArticles[0].date}</span>
                      </div>
                      <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 group w-fit">
                        <Link to={`/blog/${filteredArticles[0].id}`}>
                          {t('blog.readMore')}
                          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {(selectedCategory === 'all' ? filteredArticles.slice(1) : filteredArticles).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Link to={`/blog/${article.id}`} className="block h-full">
                      <Card className="glass-effect overflow-hidden hover-lift border-white/10 h-full flex flex-col group cursor-pointer">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getBlogImageUrl(article.image)}
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
                              <span>{article.readTime} {t('blog.readTime')}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{article.date}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
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

              <NewsletterForm />
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already_subscribed'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const { success, message } = await newsletterService.subscribe(email);

      if (success) {
        if (message === 'already_subscribed') {
          setStatus('already_subscribed');
        } else {
          setStatus('success');
          setEmail('');
        }
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg inline-block">
        Спасибо за подписку! Мы свяжемся с вами, когда выйдет новая статья.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <div className="flex-1 text-left">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ваш email"
          disabled={status === 'loading'}
          className="w-full px-6 py-3 rounded-lg glass-effect border border-white/20 focus:outline-none focus:border-primary disabled:opacity-50"
          required
        />
        {status === 'error' && (
          <p className="text-red-500 text-sm mt-2 ml-2">Произошла ошибка. Попробуйте позже.</p>
        )}
        {status === 'already_subscribed' && (
          <p className="text-yellow-500 text-sm mt-2 ml-2">Вы уже подписаны!</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={status === 'loading'}
        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50"
      >
        {status === 'loading' ? 'Тихо...' : 'Подписаться'}
      </Button>
    </form>
  );
};

export default Blog;
