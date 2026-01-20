import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { portfolioService } from '@/lib/db';
import SEO from '@/components/SEO';
import { sendGAEvent } from '@/components/GoogleAnalytics';
import SeamlessVideoLoop from '@/components/SeamlessVideoLoop';

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

  // Используем только проекты из БД
  const allProjects: DisplayProject[] = adminProjects.map(getProjectDisplayData).sort((a, b) => (b.id || 0) - (a.id || 0)); // Сортируем по ID (новые сверху)

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
        description="Портфолио успешных проектов: лендинги, корпоративные сайты, интернет-магазины. Более 150 реализованных проектов. Реальные результаты и кейсы."
        keywords="портфолио сайтов, примеры лендингов, кейсы веб разработки, создание интернет магазинов"
        url="/portfolio"
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
                {t('portfolio.title')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('portfolio.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-card/50 border-y border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {filters.map((item, index) => (
                <motion.button
                  key={item.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setFilter(item.value)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${filter === item.value
                    ? 'bg-gradient-to-r from-primary to-accent text-white glow-effect'
                    : 'glass-effect text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
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
      </div>
    </>
  );
};

export default Portfolio;
