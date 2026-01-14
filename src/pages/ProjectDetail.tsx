import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
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
import SEO from '@/components/SEO';

type ProjectType = 'landing' | 'business' | 'shop';

interface Project {
  id: number;
  type: ProjectType;
  title: string;
  category: string;
  image: string;
  images?: string[]; // Массив изображений для слайдера
  problem: string;
  solution: string;
  result: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Данные проектов (в будущем можно вынести в отдельный файл)
  const projects: Project[] = [
    {
      id: 7,
      type: 'landing',
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
      type: 'landing',
      title: t('portfolio.project.beauty.title'),
      category: t('portfolio.project.beauty.category'),
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
      problem: t('portfolio.project.beauty.problem'),
      solution: t('portfolio.project.beauty.solution'),
      result: t('portfolio.project.beauty.result'),
    },
    {
      id: 2,
      type: 'shop',
      title: t('portfolio.project.tech.title'),
      category: t('portfolio.project.tech.category'),
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80',
      problem: t('portfolio.project.tech.problem'),
      solution: t('portfolio.project.tech.solution'),
      result: t('portfolio.project.tech.result'),
    },
    {
      id: 3,
      type: 'business',
      title: t('portfolio.project.law.title'),
      category: t('portfolio.project.law.category'),
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80',
      problem: t('portfolio.project.law.problem'),
      solution: t('portfolio.project.law.solution'),
      result: t('portfolio.project.law.result'),
    },
    {
      id: 4,
      type: 'landing',
      title: t('portfolio.project.fitness.title'),
      category: t('portfolio.project.fitness.category'),
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
      problem: t('portfolio.project.fitness.problem'),
      solution: t('portfolio.project.fitness.solution'),
      result: t('portfolio.project.fitness.result'),
    },
    {
      id: 5,
      type: 'shop',
      title: t('portfolio.project.fashion.title'),
      category: t('portfolio.project.fashion.category'),
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
      problem: t('portfolio.project.fashion.problem'),
      solution: t('portfolio.project.fashion.solution'),
      result: t('portfolio.project.fashion.result'),
    },
    {
      id: 6,
      type: 'business',
      title: t('portfolio.project.restaurant.title'),
      category: t('portfolio.project.restaurant.category'),
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
      problem: t('portfolio.project.restaurant.problem'),
      solution: t('portfolio.project.restaurant.solution'),
      result: t('portfolio.project.restaurant.result'),
    },
  ];

  const projectId = id ? parseInt(id, 10) : null;
  const project = projectId ? projects.find(p => p.id === projectId) : null;

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
                      <div className="text-sm text-muted-foreground mb-2">Категория</div>
                      <div className="text-lg font-semibold">{project.category}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Тип проекта</div>
                      <div className="text-lg font-semibold">
                        {project.type === 'landing' && t('services.landing')}
                        {project.type === 'business' && t('services.business')}
                        {project.type === 'shop' && t('services.shop')}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 mb-4">
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
