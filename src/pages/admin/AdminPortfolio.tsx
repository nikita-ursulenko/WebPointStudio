import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
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
import { uploadBlogImage, getBlogImageUrl } from '@/lib/storage';

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
  imageFile: File | null; // Файл для загрузки главного изображения
  images: string;
  imagesFiles: File[]; // Файлы для загрузки дополнительных изображений
  problem: string;
  solution: string;
  result: string;
  website: string;
  technologies: string;
  client: string;
  date: string;
  dateInput?: string; // Для HTML5 date input (формат yyyy-MM-dd)
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
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    type: 'landing',
    title: '',
    category: '',
    image: '',
    imageFile: null,
    images: '',
    imagesFiles: [],
    problem: '',
    solution: '',
    result: '',
    website: '',
    technologies: '',
    client: '',
    date: '',
    dateInput: format(new Date(), 'yyyy-MM-dd'),
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
    // Автоматически устанавливаем текущую дату
    const today = format(new Date(), 'yyyy-MM-dd');
    const formattedDate = format(new Date(), 'd MMMM yyyy', { locale: ru });
    setFormData({
      type: 'landing',
      title: '',
      category: '',
      image: '',
      imageFile: null,
      images: '',
      imagesFiles: [],
      problem: '',
      solution: '',
      result: '',
      website: '',
      technologies: '',
      client: '',
      date: formattedDate,
      dateInput: today, // Для HTML5 date input
    });
    setImagePreview('');
    setImagesPreview([]);
    setIsDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    // Преобразуем дату из формата "15 января 2025" в формат для date input
    let dateInput = '';
    if (project.date) {
      try {
        const parsedDate = parse(project.date, 'd MMMM yyyy', new Date(), { locale: ru });
        dateInput = format(parsedDate, 'yyyy-MM-dd');
      } catch (e) {
        // Если не удалось распарсить, используем текущую дату
        dateInput = format(new Date(), 'yyyy-MM-dd');
      }
    } else {
      dateInput = format(new Date(), 'yyyy-MM-dd');
    }
    setFormData({
      type: project.type,
      title: project.title,
      category: project.category,
      image: project.image,
      imageFile: null,
      images: project.images?.join('\n') || '',
      imagesFiles: [],
      problem: project.problem,
      solution: project.solution,
      result: project.result,
      website: project.website || '',
      technologies: project.technologies?.join(', ') || '',
      client: project.client || '',
      date: project.date || '',
      dateInput: dateInput,
    });
    setImagePreview(project.image ? getBlogImageUrl(project.image) : '');
    setImagesPreview(project.images?.map(img => getBlogImageUrl(img)) || []);
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
          // Обновляем список проектов из БД
          const newProjects = await portfolioService.getAll();
          setProjects(newProjects as Project[]);
          toast.success('Проект удален');
        } else {
          toast.error('Ошибка при удалении проекта');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Ошибка при удалении проекта');
      }
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите изображение');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB');
        return;
      }
      setFormData({ ...formData, imageFile: file, image: '' });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`Файл ${file.name} не является изображением`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Файл ${file.name} превышает 5MB`);
          return false;
        }
        return true;
      });
      setFormData({ ...formData, imagesFiles: [...formData.imagesFiles, ...validFiles], images: '' });
      const readers = validFiles.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
        });
      });
      Promise.all(readers).then(previews => {
        setImagesPreview([...imagesPreview, ...previews]);
      });
    }
  };

  const removeImagePreview = (index: number) => {
    const newFiles = formData.imagesFiles.filter((_, i) => i !== index);
    const newPreviews = imagesPreview.filter((_, i) => i !== index);
    setFormData({ ...formData, imagesFiles: newFiles });
    setImagesPreview(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.problem || !formData.solution || !formData.result) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    // Проверяем, что есть либо главное изображение (файл), либо ссылка
    if (!formData.imageFile && !formData.image) {
      toast.error('Добавьте главное изображение или укажите ссылку');
      return;
    }

    setIsSubmitting(true);
    setIsTranslating(true);

    let imagePath = formData.image;
    const fileToUpload = formData.imageFile;
    const additionalFilesToUpload = formData.imagesFiles;

    let translations: ProjectTranslations;
    try {
      translations = await translatePortfolioProject({
        title: formData.title,
        category: formData.category,
        problem: formData.problem,
        solution: formData.solution,
        result: formData.result,
      });
      toast.success('Переводы созданы автоматически');
    } catch (translationError) {
      console.error('Translation failed:', translationError);
      toast.error('Не удалось перевести через Groq. Проект НЕ сохранен. Проверь модель/ключ.');
      setIsSubmitting(false);
      setIsTranslating(false);
      return;
    } finally {
      setIsTranslating(false);
    }

    try {
      let savedProject: Project | null = null;

      const projectData: DBPortfolioProject = {
        type: formData.type,
        title: formData.title,
        category: formData.category,
        image: imagePath,
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

      if (editingProject && editingProject.id) {
        // Update existing project
        if (fileToUpload) {
          setIsUploadingImage(true);
          try {
            const correctPath = await uploadBlogImage(fileToUpload, editingProject.id);
            projectData.image = correctPath;
          } catch (error: any) {
            console.error('Error uploading image:', error);
            toast.error(`Ошибка загрузки изображения: ${error?.message || 'Неизвестная ошибка'}`);
            setIsSubmitting(false);
            setIsUploadingImage(false);
            return;
          } finally {
            setIsUploadingImage(false);
          }
        }

        // Загружаем дополнительные изображения
        if (additionalFilesToUpload.length > 0) {
          setIsUploadingImage(true);
          try {
            const uploadedImages = await Promise.all(
              additionalFilesToUpload.map(file => uploadBlogImage(file, editingProject.id))
            );
            projectData.images = [...(projectData.images || []), ...uploadedImages];
          } catch (error: any) {
            console.error('Error uploading additional images:', error);
            toast.error(`Ошибка загрузки дополнительных изображений: ${error?.message || 'Неизвестная ошибка'}`);
          } finally {
            setIsUploadingImage(false);
          }
        }

        const updated = await portfolioService.update(editingProject.id, projectData);
        if (!updated) {
          toast.error('Ошибка при обновлении проекта');
          setIsSubmitting(false);
          return;
        }
        savedProject = updated as Project;
      } else {
        // Create new project first to get ID
        const created = await portfolioService.create(projectData);
        if (!created || !created.id) {
          toast.error('Ошибка при создании проекта');
          setIsSubmitting(false);
          return;
        }
        savedProject = created as Project;

        // Если загружен файл главного изображения, загружаем его с правильным ID
        if (fileToUpload && savedProject.id) {
          setIsUploadingImage(true);
          try {
            const correctPath = await uploadBlogImage(fileToUpload, savedProject.id);
            await portfolioService.update(savedProject.id, { ...projectData, image: correctPath });
            savedProject = { ...savedProject, image: correctPath };
          } catch (error: any) {
            console.error('Error uploading image with correct ID:', error);
            toast.error(`Ошибка загрузки изображения: ${error?.message || 'Неизвестная ошибка'}`);
          } finally {
            setIsUploadingImage(false);
          }
        }

        // Загружаем дополнительные изображения
        if (additionalFilesToUpload.length > 0 && savedProject.id) {
          setIsUploadingImage(true);
          try {
            const uploadedImages = await Promise.all(
              additionalFilesToUpload.map(file => uploadBlogImage(file, savedProject.id))
            );
            await portfolioService.update(savedProject.id, {
              ...projectData,
              images: [...(projectData.images || []), ...uploadedImages],
            });
            savedProject = { ...savedProject, images: [...(savedProject.images || []), ...uploadedImages] };
          } catch (error: any) {
            console.error('Error uploading additional images:', error);
            toast.error(`Ошибка загрузки дополнительных изображений: ${error?.message || 'Неизвестная ошибка'}`);
          } finally {
            setIsUploadingImage(false);
          }
        }
      }

      // Обновляем список проектов из БД
      const newProjects = await portfolioService.getAll();
      setProjects(newProjects as Project[]);
      toast.success(editingProject ? 'Проект обновлен' : 'Проект создан');

      setIsDialogOpen(false);
      setEditingProject(null);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Ошибка при сохранении проекта');
      setIsSubmitting(false);
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
              <Label htmlFor="image">Главное изображение *</Label>
              
              {/* Загрузка файла */}
              <div className="space-y-2">
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Или укажите ссылку на изображение
                </p>
              </div>

              {/* Поле для ссылки */}
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value, imageFile: null });
                  setImagePreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-..."
              />

              {/* Предпросмотр изображения */}
              {(imagePreview || formData.image) && (
                <div className="mt-4">
                  <img
                    src={imagePreview || getBlogImageUrl(formData.image)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-white/10"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="images">Дополнительные изображения</Label>
              
              {/* Загрузка файлов */}
              <div className="space-y-2">
                <Input
                  id="imagesFiles"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesFilesChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Или укажите ссылки на изображения (по одному на строку)
                </p>
              </div>

              {/* Поле для ссылок */}
              <Textarea
                id="images"
                value={formData.images}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.value, imagesFiles: [] })
                }
                placeholder="/images/portfolio/slide1.jpg&#10;/images/portfolio/slide2.jpg"
                rows={4}
              />

              {/* Предпросмотр дополнительных изображений */}
              {imagesPreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {imagesPreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeImagePreview(index)}
                        className="absolute top-2 right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                  type="date"
                  value={formData.dateInput || format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const parsedDate = parse(selectedDate, 'yyyy-MM-dd', new Date());
                    const formattedDate = format(parsedDate, 'd MMMM yyyy', { locale: ru });
                    setFormData({ ...formData, dateInput: selectedDate, date: formattedDate });
                  }}
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
