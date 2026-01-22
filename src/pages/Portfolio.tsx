import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaRocket, FaTelegram, FaCogs, FaMobile, FaGlobe } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { portfolioService } from '@/lib/db';
import SEO from '@/components/SEO';
import { sendGAEvent } from '@/components/GoogleAnalytics';
import SeamlessVideoLoop from '@/components/SeamlessVideoLoop';

type ProjectType = 'all' | 'websites' | 'telegram' | 'automation' | 'mobile' | string;

interface ProjectFromAdmin {
  id: number;
  type: string;
  title: string;
  category: string;
  image: string;
  images?: string[];
  problem: string;
  solution: string;
  result: string;
  website?: string;
  technologies?: string[];
  client?: string;
  date?: string;
  translations?: {
    ro?: {
      title: string;
      category: string;
      problem: string;
      solution: string;
      result: string;
    };
    en?: {
      title: string;
      category: string;
      problem: string;
      solution: string;
      result: string;
    };
  };
}

interface DisplayProject {
  id: number;
  type: ProjectType;
  title: string;
  category: string;
  image: string;
  images?: string[];
  problem: string;
  solution: string;
  result: string;
}

const Portfolio = () => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<ProjectType>('all');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [adminProjects, setAdminProjects] = useState<ProjectFromAdmin[]>([]);

  // Загрузка проектов из БД
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await portfolioService.getAll();
        setAdminProjects(data as ProjectFromAdmin[]);
      } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem('portfolio_projects');
        if (stored) {
          try {
            setAdminProjects(JSON.parse(stored));
          } catch (e) {
            console.error('Error parsing localStorage:', e);
          }
        }
      }
    };
    loadProjects();
  }, []);

  // Преобразование проектов из админ-панели в формат для отображения
  const getProjectDisplayData = (project: ProjectFromAdmin): DisplayProject => {
    const translations = project.translations;

    let title = project.title;
    let category = project.category;
    let problem = project.problem;
    let solution = project.solution;
    let result = project.result;

    // Используем переводы в зависимости от текущего языка
    if (translations) {
      if (language === 'ro' && translations.ro) {
        title = translations.ro.title || title;
        category = translations.ro.category || category;
        problem = translations.ro.problem || problem;
        solution = translations.ro.solution || solution;
        result = translations.ro.result || result;
      } else if (language === 'en' && translations.en) {
        title = translations.en.title || title;
        category = translations.en.category || category;
        problem = translations.en.problem || problem;
        solution = translations.en.solution || solution;
        result = translations.en.result || result;
      }
    }

    return {
      id: project.id,
      type: project.type as ProjectType,
      title,
      category,
      image: project.image,
      images: project.images,
      problem,
      solution,
      result,
    };
  };

  // Используем только проекты из БД
  const allProjects: DisplayProject[] = adminProjects.map(getProjectDisplayData).sort((a, b) => (b.id || 0) - (a.id || 0)); // Сортируем по ID (новые сверху)

  const categories = [
    { id: 'all', title: t('portfolio.all'), icon: FaGlobe },
    { id: 'websites', title: t('services.category.websites'), icon: FaRocket },
    { id: 'telegram', title: t('services.category.telegram'), icon: FaTelegram },
    { id: 'automation', title: t('services.category.automation'), icon: FaCogs },
    { id: 'mobile', title: t('services.category.mobile'), icon: FaMobile },
  ];

  const subCategories: Record<string, { id: string; title: string }[]> = {
    websites: [
      { id: 'all', title: t('portfolio.all') },
      { id: 'landing', title: t('portfolio.landing') },
      { id: 'business', title: t('portfolio.business') },
      { id: 'shop', title: t('portfolio.shop') },
    ],
    telegram: [
      { id: 'all', title: t('portfolio.all') },
      { id: 'tg-basic', title: t('services.tg.basic') },
      { id: 'tg-shop', title: t('services.tg.shop') },
      { id: 'tg-complex', title: t('services.tg.complex') },
    ],
    automation: [
      { id: 'all', title: t('portfolio.all') },
      { id: 'auto-parsing', title: t('services.auto.parsing') },
      { id: 'auto-scripts', title: t('services.auto.scripts') },
    ],
    mobile: [
      { id: 'all', title: t('portfolio.all') },
      { id: 'mobile-mvp', title: t('services.mobile.mvp') },
      { id: 'mobile-business', title: t('services.mobile.business') },
      { id: 'mobile-shop', title: t('services.mobile.shop') },
    ],
  };

  const filteredProjects = allProjects.filter(project => {
    const type = project.type.toLowerCase();

    // Первый уровень фильтрации
    let matchesMain = false;
    if (filter === 'all') {
      matchesMain = true;
    } else if (filter === 'websites') {
      matchesMain = ['landing', 'business', 'shop', 'websites'].includes(type);
    } else if (filter === 'telegram') {
      matchesMain = type.startsWith('tg-') || type === 'telegram';
    } else if (filter === 'automation') {
      matchesMain = type.startsWith('auto-') || type === 'automation';
    } else if (filter === 'mobile') {
      matchesMain = type.startsWith('mobile-') || type === 'mobile';
    } else {
      matchesMain = type === filter;
    }

    if (!matchesMain) return false;

    // Второй уровень фильтрации (подкатегории)
    if (subFilter === 'all' || filter === 'all') return true;

    // Специальная обработка для сайтов, так как у них типы напрямую совпадают с подфильтрами
    if (filter === 'websites') {
      return type === subFilter;
    }

    return type === subFilter;
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Портфолио проектов WebPoint",
    "description": "Кейсы и проекты: мобильные приложения, высокотехнологичные сайты, боты и системы автоматизации",
    "itemListElement": allProjects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": project.title,
        "description": `${project.problem} ${project.solution}. Результат: ${project.result}`
      }
    }))
  };

  return (
    <>
      <SEO
        title="Портфолио ИТ-проектов | WebPoint - Наши кейсы"
        description="Посмотрите наши успешно реализованные проекты: мобильные приложения, сайты, Telegram Mini Apps и системы автоматизации. Реальные результаты для реального бизнеса."
        keywords="портфолио ит проектов, примеры мобильных приложений, кейсы автоматизации, разработка сайтов примеры"
        url="/portfolio"
        structuredData={structuredData}
      />
      <div className="min-h-screen pt-16 md:pt-20">
        {/* Hero */}
        <section className="py-12 md:py-20 relative overflow-hidden">
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
              <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6">
                {t('portfolio.title')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground px-4">
                {t('portfolio.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Categories Tabs */}
        <div className="container mx-auto px-4 -mt-10 relative z-30">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-effect p-2 rounded-2xl flex flex-wrap justify-center gap-2 border border-white/10 shadow-elegant overflow-hidden">
              {categories.filter(cat => {
                if (cat.id === 'all') return allProjects.length > 0;
                return allProjects.some(project => {
                  const type = project.type.toLowerCase();
                  if (cat.id === 'websites') return ['landing', 'business', 'shop', 'websites'].includes(type);
                  if (cat.id === 'telegram') return type.startsWith('tg-') || type === 'telegram';
                  if (cat.id === 'automation') return type.startsWith('auto-') || type === 'automation';
                  if (cat.id === 'mobile') return type.startsWith('mobile-') || type === 'mobile';
                  return type === cat.id;
                });
              }).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFilter(cat.id as ProjectType);
                    setSubFilter('all'); // Сброс подфильтра при смене главной категории
                    sendGAEvent('portfolio_filter_click', { category: cat.id });
                  }}
                  className={`relative px-4 md:px-6 py-2.5 md:py-3 rounded-xl transition-all duration-500 flex items-center gap-2 md:gap-3 group ${filter === cat.id ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {filter === cat.id && (
                    <motion.div
                      layoutId="activeTabPortfolio"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{ borderRadius: '12px' }}
                    />
                  )}
                  <cat.icon className={`text-base md:text-xl relative z-10 transition-transform duration-500 ${filter === cat.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-semibold text-sm md:text-base relative z-10 whitespace-nowrap">{cat.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-categories Tabs */}
        <div className="container mx-auto px-4 mt-6 relative z-20">
          <AnimatePresence mode="wait">
            {filter !== 'all' && subCategories[filter] && (
              <motion.div
                key={filter}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap justify-center gap-2"
              >
                <div className="glass-effect p-1.5 rounded-xl flex flex-wrap justify-center gap-1 border border-white/5 shadow-lg">
                  {subCategories[filter].filter(sub => {
                    if (sub.id === 'all') return true; // Мы уже знаем, что проекты в этой категории есть, раз видна сама категория
                    return allProjects.some(project => project.type.toLowerCase() === sub.id);
                  }).map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSubFilter(sub.id)}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${subFilter === sub.id ? 'text-white' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                    >
                      {subFilter === sub.id && (
                        <motion.div
                          layoutId="activeSubTab"
                          className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          style={{ borderRadius: '8px' }}
                        />
                      )}
                      <span className="relative z-10 whitespace-nowrap">{sub.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Projects Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card className="glass-effect overflow-hidden hover-lift border-white/10 group h-full flex flex-col">
                      <div className="relative h-48 md:h-64 overflow-hidden flex-shrink-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                          <div className="text-[10px] md:text-xs text-primary font-semibold mb-0.5 md:mb-1">{project.category}</div>
                          <h3 className="text-lg md:text-xl font-bold leading-tight">{project.title}</h3>
                        </div>
                      </div>

                      <div className="p-4 md:p-6 flex-grow flex flex-col">
                        <div className="flex-grow mb-4 md:mb-6">
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-4">
                            {project.solution}
                          </p>
                        </div>

                        <div className="mt-auto">
                          <Button
                            variant="outline"
                            asChild
                            className="w-full glass-effect group"
                            onClick={() => sendGAEvent('project_view_click', {
                              project_id: project.id,
                              project_title: project.title,
                              category: project.category
                            })}
                          >
                            <Link to={`/portfolio/${project.id}`}>
                              {t('portfolio.view')}
                              <FaExternalLinkAlt className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div >
    </>
  );
};

export default Portfolio;
