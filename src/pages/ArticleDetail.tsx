import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaClock, FaCalendar } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { blogService } from '@/lib/db';
import { getBlogImageUrl } from '@/lib/storage';
import SEO from '@/components/SEO';
import { formatArticleDate } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

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
  readTime: number;
  date: string;
  content: string;
}

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
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
    let content = article.content;
    let category = article.category;

    // Используем переводы в зависимости от текущего языка
    if (translations) {
      if (language === 'ro' && translations.ro) {
        title = translations.ro.title || title;
        excerpt = translations.ro.excerpt || excerpt;
        content = translations.ro.content || content;
        category = translations.ro.category || category;
      } else if (language === 'en' && translations.en) {
        title = translations.en.title || title;
        excerpt = translations.en.excerpt || excerpt;
        content = translations.en.content || content;
        category = translations.en.category || category;
      }
    }

    return {
      id: article.id,
      title,
      excerpt,
      image: article.image,
      category,
      readTime: article.readTime,
      date: formatArticleDate(article.date, language),
      content,
    };
  };

  // Используем только статьи из БД
  const allArticles: DisplayArticle[] = adminArticles.map(getArticleDisplayData).sort((a, b) => (b.id || 0) - (a.id || 0)); // Сортировка по ID, чтобы новые были сверху

  const articleId = id ? parseInt(id, 10) : null;
  const [currentArticle, setCurrentArticle] = useState<DisplayArticle | null>(null);

  // Загрузка конкретной статьи из БД
  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;

      // Сначала пробуем найти в уже загруженных статьях
      const foundArticle = allArticles.find(a => a.id === articleId);
      if (foundArticle) {
        setCurrentArticle(foundArticle);
        return;
      }

      // Если не найдено, загружаем из БД напрямую
      try {
        const article = await blogService.getById(articleId);
        if (article) {
          const articleFromAdmin = article as ArticleFromAdmin;
          const displayData = getArticleDisplayData(articleFromAdmin);
          setCurrentArticle(displayData);
        }
      } catch (error) {
        console.error('Error loading article:', error);
      }
    };

    loadArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, adminArticles.length, language]);

  const article = currentArticle || (articleId ? allArticles.find(a => a.id === articleId) : null);

  // Track article view
  useEffect(() => {
    if (article) {
      trackEvent('Просмотр статьи', `Блог - ${article.title}`, 'view');
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Статья не найдена</h1>
          <Button asChild>
            <Link to="/blog">Вернуться к блогу</Link>
          </Button>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": getBlogImageUrl(article.image),
    "datePublished": article.date,
    "author": {
      "@type": "Organization",
      "name": "WebPoint"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WebPoint"
    }
  };

  return (
    <>
      <SEO
        title={`${article.title} | WebPoint - Блог`}
        description={article.excerpt}
        keywords={`${article.category}, блог webpoint, статьи о создании сайтов`}
        url={`/blog/${article.id}`}
        structuredData={structuredData}
      />
      <div className="min-h-screen pt-20">
        {/* Hero Section with Image */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getBlogImageUrl(article.image)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
          </div>

          <div className="container mx-auto px-4 relative h-full flex items-end pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="inline-block mb-4">
                <span className="px-4 py-2 rounded-full glass-effect border border-primary/30 text-primary font-semibold text-sm">
                  {article.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{article.title}</h1>
            </motion.div>
          </div>
        </section>

        {/* Back Button */}
        <section className="py-6 border-b border-white/10">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/blog')}
              className="gap-2"
            >
              <FaArrowLeft />
              {t('blog.back')}
            </Button>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-6 mb-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{article.readTime} {t('blog.readTime')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  <span>{article.date}</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                  {article.content}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ArticleDetail;
