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
import { translateBlogArticle } from '@/lib/groq';
import { blogService, type BlogArticle as DBBlogArticle } from '@/lib/db';
import { uploadBlogImage, getBlogImageUrl } from '@/lib/storage';

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

interface Article {
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

interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  imageFile: File | null; // Файл для загрузки
  categoryKey: ArticleCategory;
  readTime: string;
  date: string;
  dateInput?: string; // Для HTML5 date input (формат yyyy-MM-dd)
}

const AdminBlog = () => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    imageFile: null,
    categoryKey: 'tips',
    readTime: '5',
    date: '',
    dateInput: format(new Date(), 'yyyy-MM-dd'),
  });

  // Загрузка статей из БД
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await blogService.getAll();
        setArticles(data as Article[]);
      } catch (error) {
        console.error('Error loading articles:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem('blog_articles');
        if (stored) {
          try {
            setArticles(JSON.parse(stored));
          } catch (e) {
            setArticles([]);
          }
        }
      }
    };
    loadArticles();
  }, []);

  const handleAddArticle = () => {
    setEditingArticle(null);
    // Автоматически устанавливаем текущую дату
    const today = format(new Date(), 'yyyy-MM-dd');
    const formattedDate = format(new Date(), 'd MMMM yyyy', { locale: ru });
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      imageFile: null,
      categoryKey: 'tips',
      readTime: '5',
      date: formattedDate,
      dateInput: today, // Для HTML5 date input
    });
    setImagePreview('');
    setIsDialogOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    // Преобразуем дату из формата "15 января 2025" в формат для date input
    let dateInput = '';
    try {
      const parsedDate = parse(article.date, 'd MMMM yyyy', new Date(), { locale: ru });
      dateInput = format(parsedDate, 'yyyy-MM-dd');
    } catch (e) {
      // Если не удалось распарсить, используем текущую дату
      dateInput = format(new Date(), 'yyyy-MM-dd');
    }
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      imageFile: null,
      categoryKey: article.categoryKey,
      readTime: article.readTime.toString(),
      date: article.date,
      dateInput: dateInput,
    });
    // Устанавливаем предпросмотр изображения
    setImagePreview(article.image ? getBlogImageUrl(article.image) : '');
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setArticleToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (articleToDelete !== null) {
      try {
        const success = await blogService.delete(articleToDelete);
        if (success) {
          // Обновляем список статей из БД
          const newArticles = await blogService.getAll();
          setArticles(newArticles as Article[]);
          toast.success(t('admin.blog.deletedSuccess'));
        } else {
          toast.error(t('admin.blog.deleteError') || 'Ошибка при удалении статьи');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        toast.error(t('admin.blog.deleteError') || 'Ошибка при удалении статьи');
      }
      setIsDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите изображение');
        return;
      }

      // Проверяем размер (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB');
        return;
      }

      setFormData({ ...formData, imageFile: file, image: '' }); // Очищаем image URL при загрузке файла
      
      // Создаем предпросмотр
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    // Проверяем, что есть либо изображение (файл), либо ссылка
    if (!formData.imageFile && !formData.image) {
      toast.error('Добавьте изображение или укажите ссылку');
      return;
    }

    setIsSubmitting(true);
    setIsTranslating(true);

    // Пока не загружаем изображение, сохраним путь для использования после создания статьи
    let imagePath = formData.image; // Используем существующую ссылку, если файл не загружен
    const fileToUpload = formData.imageFile; // Сохраняем файл для загрузки после создания статьи

    let translations: ArticleTranslations | undefined;
    try {
      const translated = await translateBlogArticle({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.categoryKey === 'prices' ? 'Цены' :
                 formData.categoryKey === 'tips' ? 'Советы' :
                 formData.categoryKey === 'seo' ? 'SEO' :
                 formData.categoryKey === 'design' ? 'Дизайн' :
                 'E-commerce',
      });
      translations = translated;
      toast.success('Переводы созданы автоматически');
    } catch (translationError) {
      console.warn('Translation failed, article will be saved without translations:', translationError);
      toast.error('Ошибка перевода. Статья не будет сохранена. Проверьте ключ Groq API или модель.');
      setIsSubmitting(false);
      setIsTranslating(false);
      return; // Не сохраняем статью, если перевод не удался
    } finally {
      setIsTranslating(false);
    }

    try {
      const categoryLabels: Record<ArticleCategory, string> = {
        prices: 'Цены',
        tips: 'Советы',
        seo: 'SEO',
        design: 'Дизайн',
        ecommerce: 'E-commerce',
      };

      const articleData: DBBlogArticle = {
        id: editingArticle?.id,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image: imagePath, // Используем загруженный путь или существующую ссылку
        category: categoryLabels[formData.categoryKey],
        categoryKey: formData.categoryKey,
        readTime: parseInt(formData.readTime, 10),
        date: formData.date || format(new Date(), 'd MMMM yyyy', { locale: ru }),
        translations: translations,
      };

      try {
        let savedArticle: Article | null = null;
        
        if (editingArticle && editingArticle.id) {
          // Update existing article
          // Если загружен новый файл, загружаем его с правильным ID
          if (fileToUpload) {
            setIsUploadingImage(true);
            try {
              const correctPath = await uploadBlogImage(fileToUpload, editingArticle.id);
              articleData.image = correctPath;
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
          
          const updatedArticle = await blogService.update(editingArticle.id, articleData);
          if (!updatedArticle || !updatedArticle.id) {
            toast.error(t('admin.blog.saveError'));
            setIsSubmitting(false);
            return;
          }
          savedArticle = updatedArticle as Article;
        } else {
          // Create new article first to get ID
          const createdArticle = await blogService.create(articleData);
          if (!createdArticle || !createdArticle.id) {
            toast.error(t('admin.blog.saveError'));
            setIsSubmitting(false);
            return;
          }
          savedArticle = createdArticle as Article;
          
          // Если загружен файл, загружаем его с правильным ID
          if (fileToUpload && savedArticle.id) {
            setIsUploadingImage(true);
            try {
              const correctPath = await uploadBlogImage(fileToUpload, savedArticle.id);
              // Обновляем статью с правильным путем
              await blogService.update(savedArticle.id, { ...articleData, image: correctPath });
              savedArticle = { ...savedArticle, image: correctPath };
            } catch (error: any) {
              console.error('Error uploading image with correct ID:', error);
              toast.error(`Ошибка загрузки изображения: ${error?.message || 'Неизвестная ошибка'}`);
              // Продолжаем, даже если не удалось загрузить
            } finally {
              setIsUploadingImage(false);
            }
          }
        }

        // Обновляем список статей из БД
        const newArticles = await blogService.getAll();
        setArticles(newArticles as Article[]);
        toast.success(editingArticle ? t('admin.blog.updatedSuccess') : t('admin.blog.savedSuccess'));

        setIsDialogOpen(false);
        setEditingArticle(null);
        setIsSubmitting(false);
      } catch (error) {
        console.error('Error saving article:', error);
        toast.error(t('admin.blog.saveError'));
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error(t('admin.blog.saveError'));
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryLabel = (categoryKey: ArticleCategory) => {
    const labels: Record<ArticleCategory, string> = {
      prices: t('blog.categories.prices'),
      tips: t('blog.categories.tips'),
      seo: t('blog.categories.seo'),
      design: t('blog.categories.design'),
      ecommerce: t('blog.categories.ecommerce'),
    };
    return labels[categoryKey];
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление блогом</h1>
        <Button onClick={handleAddArticle} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <FaPlus className="mr-2" /> Добавить статью
        </Button>
      </div>

      {articles.length === 0 ? (
        <Card className="glass-effect p-8 text-center border-white/10">
          <p className="text-muted-foreground">Пока нет статей. Добавьте первую статью!</p>
          <Button onClick={handleAddArticle} className="mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <FaPlus className="mr-2" /> Добавить статью
          </Button>
        </Card>
      ) : (
        <Card className="glass-effect p-0 border-white/10">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.id}</TableCell>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{getCategoryLabel(article.categoryKey)}</TableCell>
                    <TableCell>{article.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditArticle(article)}>
                        <FaEdit /> Редактировать
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>
                        <FaTrash /> Удалить
                      </Button>
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
              {editingArticle ? 'Редактировать статью' : 'Создать статью'}
            </DialogTitle>
            <DialogDescription>
              При сохранении статья автоматически переводится на RO и EN через Groq.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Название статьи *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Как создать сайт за 7 дней"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">
                Изображение *
              </Label>
              
              {/* Загрузка файла */}
              <div className="space-y-2">
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
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

            <div className="space-y-2">
              <Label htmlFor="categoryKey">
                Категория *
              </Label>
              <Select
                value={formData.categoryKey}
                onValueChange={(value: ArticleCategory) =>
                  setFormData({ ...formData, categoryKey: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prices">{t('blog.categories.prices')}</SelectItem>
                  <SelectItem value="tips">{t('blog.categories.tips')}</SelectItem>
                  <SelectItem value="seo">{t('blog.categories.seo')}</SelectItem>
                  <SelectItem value="design">{t('blog.categories.design')}</SelectItem>
                  <SelectItem value="ecommerce">{t('blog.categories.ecommerce')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">
                Краткое описание *
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Краткое описание статьи для превью"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Содержание статьи *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Полное содержание статьи"
                className="min-h-[200px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="readTime">
                  Время чтения (мин)
                </Label>
                <Input
                  id="readTime"
                  type="number"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">
                  Дата
                </Label>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {isSubmitting ? (isTranslating ? 'Перевожу...' : 'Сохраняю...') : 'Сохранить'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass-effect border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены, что хотите удалить эту статью?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Статья будет безвозвратно удалена.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBlog;
