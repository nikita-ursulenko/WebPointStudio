// Database service layer
// Abstracts database operations for portfolio and blog

import { supabase } from './supabase';

// ============ PORTFOLIO ============

export interface PortfolioProject {
  id?: number;
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
  created_at?: string;
  updated_at?: string;
}

export const portfolioService = {
  // Get all projects
  async getAll(): Promise<PortfolioProject[]> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching portfolio projects:', error);
      // Fallback to localStorage if Supabase fails
      return this.getFromLocalStorage();
    }

    return data || [];
  },

  // Get single project
  async getById(id: number): Promise<PortfolioProject | null> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data;
  },

  // Create project
  async create(project: PortfolioProject): Promise<PortfolioProject | null> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([project])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      // Fallback to localStorage
      return this.saveToLocalStorage(project);
    }

    return data;
  },

  // Update project
  async update(id: number, project: Partial<PortfolioProject>): Promise<PortfolioProject | null> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return null;
    }

    return data;
  },

  // Delete project
  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }

    return true;
  },

  // Fallback methods for localStorage
  getFromLocalStorage(): PortfolioProject[] {
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing localStorage:', error);
        return [];
      }
    }
    return [];
  },

  saveToLocalStorage(project: PortfolioProject): PortfolioProject {
    const projects = this.getFromLocalStorage();
    const newProject = { ...project, id: project.id || Date.now() };
    projects.push(newProject);
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    return newProject;
  },
};

// ============ BLOG ============

export interface BlogArticle {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  categoryKey: 'prices' | 'tips' | 'seo' | 'design' | 'ecommerce';
  // В БД колонка называется categorykey (lowercase)
  readTime: number;
  date: string;
  translations?: {
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
  };
  created_at?: string;
  updated_at?: string;
}

export const blogService = {
  // Get all articles
  async getAll(): Promise<BlogArticle[]> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog articles:', error);
      // Fallback to localStorage if Supabase fails
      return this.getFromLocalStorage();
    }

    // Преобразуем categorykey в categoryKey и readtime в readTime для совместимости
    return (data || []).map((article: any) => ({
      ...article,
      categoryKey: article.categorykey || article.categoryKey,
      readTime: article.readtime || article.readTime,
    }));
  },

  // Get single article
  async getById(id: number): Promise<BlogArticle | null> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    // Преобразуем categorykey в categoryKey и readtime в readTime для совместимости
    return data ? {
      ...data,
      categoryKey: data.categorykey || data.categoryKey,
      readTime: data.readtime || data.readTime,
    } : null;
  },

  // Create article
  async create(article: BlogArticle): Promise<BlogArticle | null> {
    // Преобразуем categoryKey в categorykey и readTime в readtime для БД
    const { categoryKey, readTime, ...rest } = article;
    const dbArticle = {
      ...rest,
      categorykey: categoryKey,
      readtime: readTime,
    };

    const { data, error } = await supabase
      .from('blog_articles')
      .insert([dbArticle])
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      // Fallback to localStorage
      return this.saveToLocalStorage(article);
    }

    // Преобразуем обратно для совместимости
    return data ? {
      ...data,
      categoryKey: data.categorykey || data.categoryKey,
      readTime: data.readtime || data.readTime,
    } : null;
  },

  // Update article
  async update(id: number, article: Partial<BlogArticle>): Promise<BlogArticle | null> {
    // Преобразуем categoryKey в categorykey и readTime в readtime для БД
    const { categoryKey, readTime, ...rest } = article;
    const dbArticle: any = {
      ...rest,
      updated_at: new Date().toISOString(),
    };
    if (categoryKey) {
      dbArticle.categorykey = categoryKey;
    }
    if (readTime !== undefined) {
      dbArticle.readtime = readTime;
    }

    const { data, error } = await supabase
      .from('blog_articles')
      .update(dbArticle)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating article:', error);
      return null;
    }

    // Преобразуем обратно для совместимости
    return data ? {
      ...data,
      categoryKey: data.categorykey || data.categoryKey,
      readTime: data.readtime || data.readTime,
    } : null;
  },

  // Delete article
  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('blog_articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      return false;
    }

    return true;
  },

  // Fallback methods for localStorage
  getFromLocalStorage(): BlogArticle[] {
    const stored = localStorage.getItem('blog_articles');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing localStorage:', error);
        return [];
      }
    }
    return [];
  },

  saveToLocalStorage(article: BlogArticle): BlogArticle {
    const articles = this.getFromLocalStorage();
    const newArticle = { ...article, id: article.id || Date.now() };
    articles.push(newArticle);
    localStorage.setItem('blog_articles', JSON.stringify(articles));
    return newArticle;
  },
};
