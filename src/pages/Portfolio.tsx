import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { portfolioService } from '@/lib/db';
import SEO from '@/components/SEO';

type ProjectType = 'all' | 'landing' | 'business' | 'shop';

interface ProjectFromAdmin {
  id: number;
  type: 'landing' | 'business' | 'shop';
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

  // Статические проекты из LanguageContext
  const staticProjects: DisplayProject[] = [
    {
      id: 7,
      type: 'landing' as ProjectType,
      title: t('portfolio.project.mded.title'),
      category: t('portfolio.project.mded.category'),
      image: '/images/portfolio/mded/site.webp',
      images: [
        '/images/portfolio/mded/slide1.webp',
        '/images/portfolio/mded/slide2.webp',
        '/images/portfolio/mded/slide3.webp',
        '/images/portfolio/mded/slide4.webp',
        '/images/portfolio/mded/slide5.webp',
      ],
      problem: t('portfolio.project.mded.problem'),
      solution: t('portfolio.project.mded.solution'),
      result: t('portfolio.project.mded.result'),
    },
    {
      id: 1,
      type: 'landing' as ProjectType,
      title: t('portfolio.project.beauty.title'),
      category: t('portfolio.project.beauty.category'),
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
      problem: t('portfolio.project.beauty.problem'),
      solution: t('portfolio.project.beauty.solution'),
      result: t('portfolio.project.beauty.result'),
    },
    {
      id: 2,
      type: 'shop' as ProjectType,
      title: t('portfolio.project.tech.title'),
      category: t('portfolio.project.tech.category'),
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      problem: t('portfolio.project.tech.problem'),
      solution: t('portfolio.project.tech.solution'),
      result: t('portfolio.project.tech.result'),
    },
    {
      id: 3,
      type: 'business' as ProjectType,
      title: t('portfolio.project.law.title'),
      category: t('portfolio.project.law.category'),
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
      problem: t('portfolio.project.law.problem'),
      solution: t('portfolio.project.law.solution'),
      result: t('portfolio.project.law.result'),
    },
    {
      id: 4,
      type: 'landing' as ProjectType,
      title: t('portfolio.project.fitness.title'),
      category: t('portfolio.project.fitness.category'),
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      problem: t('portfolio.project.fitness.problem'),
      solution: t('portfolio.project.fitness.solution'),
      result: t('portfolio.project.fitness.result'),
    },
    {
      id: 5,
      type: 'shop' as ProjectType,
      title: t('portfolio.project.fashion.title'),
      category: t('portfolio.project.fashion.category'),
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      problem: t('portfolio.project.fashion.problem'),
      solution: t('portfolio.project.fashion.solution'),
      result: t('portfolio.project.fashion.result'),
    },
    {
      id: 6,
      type: 'business' as ProjectType,
      title: t('portfolio.project.restaurant.title'),
      category: t('portfolio.project.restaurant.category'),
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      problem: t('portfolio.project.restaurant.problem'),
      solution: t('portfolio.project.restaurant.solution'),
      result: t('portfolio.project.restaurant.result'),
    },
  ];

  // Объединяем статические проекты с проектами из админ-панели
  // Проекты из админ-панели имеют приоритет (перезаписывают статические с таким же ID)
  const allProjects: DisplayProject[] = [
    ...staticProjects.filter(sp => !adminProjects.some(ap => ap.id === sp.id)),
    ...adminProjects.map(getProjectDisplayData),
  ].sort((a, b) => b.id - a.id); // Сортируем по ID (новые сверху)

  const filters: { value: ProjectType; label: string }[] = [
    { value: 'all', label: t('portfolio.all') },
    { value: 'landing', label: t('portfolio.landing') },
    { value: 'business', label: t('portfolio.business') },
    { value: 'shop', label: t('portfolio.shop') },
  ];

  const filteredProjects = filter === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.type === filter);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Портфолио проектов WebPoint",
    "description": "Примеры успешно реализованных проектов: лендинги, корпоративные сайты, интернет-магазины",
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
        title="Портфолио работ | WebPoint - Примеры созданных сайтов"
        description="Портфолио успешных проектов: лендинги, корпоративные сайты, интернет-магазины. Более 150 реализованных проектов в Молдове. Реальные результаты и кейсы."
        keywords="портфолио сайтов молдова, примеры лендингов, кейсы веб разработки, создание интернет магазинов кишинев"
        url="/portfolio"
        structuredData={structuredData}
      />
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-2xl animate-float-glow-slow" />
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
                  className="h-full"
                >
                  <Card className="glass-effect overflow-hidden hover-lift border-white/10 group h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden flex-shrink-0">
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

                    <div className="p-6 flex-grow flex flex-col gap-4">
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

                      <div className="mt-auto">
                        <Button variant="outline" asChild className="w-full glass-effect group">
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
    </div>
    </>
  );
};

export default Portfolio;
