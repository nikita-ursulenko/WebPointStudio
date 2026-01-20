import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { portfolioService } from '@/lib/db';
import SEO from '@/components/SEO';
import { trackEvent } from '@/lib/analytics';

type ProjectType = 'landing' | 'business' | 'shop';

interface ProjectFromAdmin {
  id: number;
  type: ProjectType;
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
  website?: string;
  technologies?: string[];
  client?: string;
  date?: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
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
      type: project.type,
      title,
      category,
      image: project.image,
      images: project.images,
      problem,
      solution,
      result,
      website: project.website,
      technologies: project.technologies,
      client: project.client,
      date: project.date,
    };
  };

  // Объединяем статические проекты с проектами из админ-панели
  const allProjects: DisplayProject[] = adminProjects.map(getProjectDisplayData);

  const projectId = id ? parseInt(id, 10) : null;
  const project = projectId ? allProjects.find(p => p.id === projectId) : null;

  // Track project view
  useEffect(() => {
    if (project) {
      trackEvent('Просмотр проекта', `Портфолио - ${project.title}`, 'view');
    }
  }, [project]);



  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Проект не найден</h1>
          <Button asChild>
            <Link to="/portfolio">Вернуться к портфолио</Link>
          </Button>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": `${project.problem} ${project.solution}. Результат: ${project.result}`,
    "image": project.image,
    "creator": {
      "@type": "Organization",
      "name": "WebPoint"
    }
  };

  return (
    <>
      <SEO
        title={`${project.title} | WebPoint - Портфолио`}
        description={`${project.problem} ${project.solution}. Результат: ${project.result}`}
        keywords={`${project.title}, портфолио webpoint, кейс ${project.category.toLowerCase()}`}
        url={`/portfolio/${project.id}`}
        structuredData={structuredData}
      />
      <div className="min-h-screen pt-20">
        {/* Image Slider */}
        <section className="relative bg-background">
          <Carousel className="w-full">
            <CarouselContent className="ml-0">
              {(project.images && project.images.length > 0
                ? project.images
                : [project.image]
              ).map((img, index) => (
                <CarouselItem key={index} className="pl-0">
                  <div className="relative w-full overflow-hidden bg-background flex items-center justify-center">
                    <img
                      src={img}
                      alt={`${project.title} - ${index + 1}`}
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-background/90 hover:bg-background border-white/20 z-10" />
            <CarouselNext className="right-4 bg-background/90 hover:bg-background border-white/20 z-10" />
          </Carousel>
        </section>

        {/* Project Header */}
        <section className="py-8 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="inline-block mb-3">
                  <span className="px-4 py-2 rounded-full glass-effect border border-primary/30 text-primary font-semibold text-sm">
                    {project.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold">{project.title}</h1>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate('/portfolio')}
                className="gap-2"
              >
                <FaArrowLeft />
                {t('portfolio.back')}
              </Button>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Problem */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="glass-effect p-8 border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                      </div>
                      <h2 className="text-2xl font-bold">{t('portfolio.problem')}</h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {project.problem}
                    </p>
                  </Card>
                </motion.div>

                {/* Solution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-effect p-8 border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <span className="text-2xl">💡</span>
                      </div>
                      <h2 className="text-2xl font-bold">{t('portfolio.solution')}</h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {project.solution}
                    </p>
                  </Card>
                </motion.div>

                {/* Result */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="glass-effect p-8 border-white/10 border-primary/30">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <FaCheckCircle className="text-2xl text-green-500" />
                      </div>
                      <h2 className="text-2xl font-bold gradient-text">{t('portfolio.result')}</h2>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {project.result}
                    </p>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="sticky top-24"
                >
                  <Card className="glass-effect p-6 border-white/10 space-y-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">{t('projectDetail.category')}</div>
                      <div className="text-lg font-semibold">{project.category}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">{t('projectDetail.type')}</div>
                      <div className="text-lg font-semibold">
                        {project.type === 'landing' && t('services.landing')}
                        {project.type === 'business' && t('services.business')}
                        {project.type === 'shop' && t('services.shop')}
                      </div>
                    </div>

                    {project.client && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Клиент</div>
                        <div className="text-lg font-semibold">{project.client}</div>
                      </div>
                    )}

                    {project.date && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Дата</div>
                        <div className="text-lg font-semibold">{project.date}</div>
                      </div>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Технологии</div>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full glass-effect text-sm border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-white/10 space-y-3">
                      {project.website && (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full glass-effect"
                        >
                          <a
                            href={project.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                            onClick={() => trackEvent('Переход на сайт проекта', `Портфолио - ${project.title} - Посмотреть сайт`, 'click')}
                          >
                            Посмотреть сайт
                            <FaExternalLinkAlt className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90" onClick={() => trackEvent('Начало заказа', `Портфолио - ${project.title} - Хочу такой сайт`, 'click')}>
                        <Link to="/contact">
                          {t('services.order')}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full glass-effect">
                        <Link to="/portfolio">
                          {t('portfolio.back')}
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectDetail;
