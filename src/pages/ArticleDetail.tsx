import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaClock, FaCalendar } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Данные статей (в будущем можно вынести в отдельный файл)
  const articles = [
    {
      id: 1,
      title: t('blog.article1.title'),
      excerpt: t('blog.article1.excerpt'),
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      category: t('blog.article1.category'),
      readTime: 8,
      date: '15 января 2025',
      content: t('blog.article1.content') || 'Полное содержание статьи будет здесь...',
    },
    {
      id: 2,
      title: t('blog.article2.title'),
      excerpt: t('blog.article2.excerpt'),
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80',
      category: t('blog.article2.category'),
      readTime: 6,
      date: '12 января 2025',
      content: t('blog.article2.content') || 'Полное содержание статьи будет здесь...',
    },
    {
      id: 3,
      title: t('blog.article3.title'),
      excerpt: t('blog.article3.excerpt'),
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80',
      category: t('blog.article3.category'),
      readTime: 7,
      date: '10 января 2025',
      content: t('blog.article3.content') || 'Полное содержание статьи будет здесь...',
    },
    {
      id: 4,
      title: t('blog.article4.title'),
      excerpt: t('blog.article4.excerpt'),
      image: 'https://images.unsplash.com/photo-1562577309-2592ab84b1bc?w=1200&q=80',
      category: t('blog.article4.category'),
      readTime: 10,
      date: '8 января 2025',
      content: t('blog.article4.content') || 'Полное содержание статьи будет здесь...',
    },
    {
      id: 5,
      title: t('blog.article5.title'),
      excerpt: t('blog.article5.excerpt'),
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
      category: t('blog.article5.category'),
      readTime: 5,
      date: '5 января 2025',
      content: t('blog.article5.content') || 'Полное содержание статьи будет здесь...',
    },
    {
      id: 6,
      title: t('blog.article6.title'),
      excerpt: t('blog.article6.excerpt'),
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80',
      category: t('blog.article6.category'),
      readTime: 9,
      date: '3 января 2025',
      content: t('blog.article6.content') || 'Полное содержание статьи будет здесь...',
    },
  ];

  const articleId = id ? parseInt(id, 10) : null;
  const article = articleId ? articles.find(a => a.id === articleId) : null;

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
    "image": article.image,
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
              src={article.image}
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
