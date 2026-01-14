import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { translatePortfolioProject } from '@/lib/groq';
import { portfolioService, type PortfolioProject as DBPortfolioProject } from '@/lib/db';

type ProjectType = 'landing' | 'business' | 'shop';

interface ProjectTranslations {
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
}

interface Project {
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
  translations?: ProjectTranslations;
}

interface ProjectFormData {
  type: ProjectType;
  title: string;
  category: string;
  image: string;
  images: string;
  problem: string;
  solution: string;
  result: string;
  website: string;
  technologies: string;
  client: string;
  date: string;
}

const AdminPortfolio = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    type: 'landing',
    title: '',
    category: '',
    image: '',
    images: '',
    problem: '',
    solution: '',
    result: '',
    website: '',
    technologies: '',
    client: '',
    date: '',
  });

  // Загрузка проектов из БД
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await portfolioService.getAll();
        setProjects(data as Project[]);
      } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem('portfolio_projects');
        if (stored) {
          try {
            setProjects(JSON.parse(stored));
          } catch (e) {
            setProjects([]);
          }
        }
      }
    };
    loadProjects();
  }, []);

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      type: 'landing',
      title: '',
      category: '',
      image: '',
      images: '',
      problem: '',
      solution: '',
      result: '',
      website: '',
      technologies: '',
      client: '',
      date: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      type: project.type,
      title: project.title,
      category: project.category,
      image: project.image,
      images: project.images?.join('\n') || '',
      problem: project.problem,
      solution: project.solution,
      result: project.result,
      website: project.website || '',
      technologies: project.technologies?.join(', ') || '',
      client: project.client || '',
      date: project.date || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setProjectToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete !== null) {
      try {
        const success = await portfolioService.delete(projectToDelete);
        if (success) {
          const newProjects = projects.filter((p) => p.id !== projectToDelete);
          setProjects(newProjects);
          toast.success('Проект удален');
        } else {
          toast.error('Ошибка при удалении проекта');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        // Fallback to localStorage
        const newProjects = projects.filter((p) => p.id !== projectToDelete);
        setProjects(newProjects);
        localStorage.setItem('portfolio_projects', JSON.stringify(newProjects));
        toast.success('Проект удален (localStorage)');
      }
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.image || !formData.problem || !formData.solution || !formData.result) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    try {
      // Сначала переводим (обязательный шаг), потом сохраняем
      setIsTranslating(true);
      let translations: ProjectTranslations;
      try {
        translations = await translatePortfolioProject({
          title: formData.title,
          category: formData.category,
          problem: formData.problem,
          solution: formData.solution,
          result: formData.result,
        });
      } catch (translationError) {
        console.error('Translation failed:', translationError);
        toast.error('Не удалось перевести через Groq. Проект НЕ сохранен. Проверь модель/ключ.');
        return;
      } finally {
        setIsTranslating(false);
      }

      const projectData: DBPortfolioProject = {
        id: editingProject?.id,
        type: formData.type,
        title: formData.title,
        category: formData.category,
        image: formData.image,
        images: formData.images ? formData.images.split('\n').filter(img => img.trim()) : [],
        problem: formData.problem,
        solution: formData.solution,
        result: formData.result,
        website: formData.website || undefined,
        technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()) : undefined,
        client: formData.client || undefined,
        date: formData.date || undefined,
        translations,
      };

      try {
        if (editingProject && editingProject.id) {
          // Update existing project
          const updated = await portfolioService.update(editingProject.id, projectData);
          if (updated) {
            const newProjects = projects.map((p) => (p.id === editingProject.id ? updated as Project : p));
            setProjects(newProjects);
            toast.success('Проект обновлен');
          } else {
            toast.error('Ошибка при обновлении проекта');
            return;
          }
        } else {
          // Create new project
          const created = await portfolioService.create(projectData);
          if (created) {
            setProjects([created as Project, ...projects]);
            toast.success('Проект создан');
          } else {
            toast.error('Ошибка при создании проекта');
            return;
          }
        }

        setIsDialogOpen(false);
        setEditingProject(null);
      } catch (error) {
        console.error('Error saving project:', error);
        toast.error('Ошибка при сохранении проекта');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Ошибка при сохранении проекта');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: ProjectType) => {
    const labels = {
      landing: 'Лендинг',
      business: 'Сайт-визитка',
      shop: 'Интернет-магазин',
    };
    return labels[type];
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление портфолио</h1>
          <p className="text-muted-foreground">
            Создавайте и редактируйте проекты портфолио
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <FaPlus className="mr-2" />
          Добавить проект
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="glass-effect p-12 text-center border-white/10">
          <FaImage className="mx-auto text-4xl text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Проектов пока нет</h3>
          <p className="text-muted-foreground mb-6">
            Добавьте первый проект в портфолио
          </p>
          <Button onClick={handleAdd} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <FaPlus className="mr-2" />
            Добавить проект
          </Button>
        </Card>
      ) : (
        <Card className="glass-effect border-white/10">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t('admin.portfolio.typeLabel')}</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>{t('admin.portfolio.category')}</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{getTypeLabel(project.type)}</TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(project)}
                        >
                          <FaEdit className="mr-1" />
                          Редактировать
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <FaTrash className="mr-1" />
                          Удалить
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Dialog для создания/редактирования */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Редактировать проект' : 'Создать проект'}
            </DialogTitle>
            <DialogDescription>
              При сохранении проект автоматически переводится на RO и EN через Groq.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">{t('admin.portfolio.type')} *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as ProjectType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing">{t('services.landing')}</SelectItem>
                    <SelectItem value="business">{t('services.business')}</SelectItem>
                    <SelectItem value="shop">{t('services.shop')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">{t('admin.portfolio.category')} *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Например: Салон красоты"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Название проекта *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Например: Beauty Salon Premium"
              />
            </div>

            <div>
              <Label htmlFor="image">Главное изображение (URL) *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="/images/portfolio/project.jpg"
              />
            </div>

            <div>
              <Label htmlFor="images">Дополнительные изображения (по одному на строку)</Label>
              <Textarea
                id="images"
                value={formData.images}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.value })
                }
                placeholder="/images/portfolio/slide1.jpg&#10;/images/portfolio/slide2.jpg"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="problem">Проблема *</Label>
              <Textarea
                id="problem"
                value={formData.problem}
                onChange={(e) =>
                  setFormData({ ...formData, problem: e.target.value })
                }
                placeholder="Описание проблемы, которую решал проект"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="solution">Решение *</Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) =>
                  setFormData({ ...formData, solution: e.target.value })
                }
                placeholder="Описание решения, которое было реализовано"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="result">Результат *</Label>
              <Textarea
                id="result"
                value={formData.result}
                onChange={(e) =>
                  setFormData({ ...formData, result: e.target.value })
                }
                placeholder="Описание достигнутых результатов"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Сайт проекта (URL)</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="date">Дата</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  placeholder="Январь 2024"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="client">Клиент</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                placeholder="Название компании-клиента"
              />
            </div>

            <div>
              <Label htmlFor="technologies">Технологии (через запятую)</Label>
              <Input
                id="technologies"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({ ...formData, technologies: e.target.value })
                }
                placeholder="React, TypeScript, Tailwind CSS"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting || isTranslating}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                disabled={isSubmitting || isTranslating}
              >
                {isSubmitting
                  ? 'Сохранение...'
                  : isTranslating
                  ? 'Перевод...'
                  : editingProject
                  ? 'Сохранить изменения'
                  : 'Создать проект'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Проект будет безвозвратно удален.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPortfolio;
