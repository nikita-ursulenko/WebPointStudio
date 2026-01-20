// Database service layer
// Abstracts database operations for portfolio and blog

import { supabase } from './supabase';

// ============ PORTFOLIO ============

// Helper to invoke email notification function
async function sendNotification(type: 'contact' | 'newsletter', payload: any) {
  try {
    const { data, error } = await supabase.functions.invoke('resend-notification', {
      body: { type, payload },
    });
    console.log('📧 Notification sent:', { data, error });
    if (error) console.error('Error sending notification:', error);
  } catch (e) {
    console.error('Failed to invoke notification function:', e);
  }
}

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
      return [];
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
      return null;
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



  // ============ BLOG ============

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
      return [];
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
      return null;
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



  // ============ CONTACTS ============

};

// ============ CONTACTS ============

export interface Contact {
  id?: number;
  phone: string;
  email: string;
  address: string;
  whatsapp_link: string;
  telegram_link: string;
  facebook_link?: string;
  instagram_link?: string;
  created_at?: string;
  updated_at?: string;
}

export const contactService = {
  // Get contact (только одна запись контактов)
  async get(): Promise<Contact | null> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching contact:', error);
      return null;
    }

    return data;
  },

  // Update contact
  async update(id: number, contact: Partial<Contact>): Promise<Contact | null> {
    const { data, error } = await supabase
      .from('contacts')
      .update({ ...contact, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact:', error);
      return null;
    }

    return data;
  },

  // Create contact (если нет записи)
  async create(contact: Contact): Promise<Contact | null> {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      return null;
    }

    return data;
  },
};

// ============ CONTACT REQUESTS ============

export interface ContactRequest {
  id?: number;
  name: string;
  email: string;
  phone: string;
  project_type: 'landing' | 'business' | 'shop' | 'support' | 'seo' | 'ads';
  message: string;
  status?: 'new' | 'read' | 'processed' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export const contactRequestService = {
  // Get all contact requests
  async getAll(): Promise<ContactRequest[]> {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact requests:', error);
      return [];
    }

    return data || [];
  },

  // Get single contact request
  async getById(id: number): Promise<ContactRequest | null> {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching contact request:', error);
      return null;
    }

    return data;
  },

  // Create contact request
  // Возвращает boolean, так как анонимные пользователи не имеют права на SELECT
  async create(request: Omit<ContactRequest, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<boolean> {
    const { error } = await supabase
      .from('contact_requests')
      .insert([request]);

    if (error) {
      console.error('Error creating contact request:', error);
      return false;
    }

    // Send notification
    await sendNotification('contact', {
      ...request,
      // Add a note about untracked IP if available/needed or just let the function handle defaults
      ip_address: (request as any).ip_address // pass if available
    });

    return true;
  },

  // Update contact request (for status changes)
  async update(id: number, request: Partial<ContactRequest>): Promise<ContactRequest | null> {
    const { data, error } = await supabase
      .from('contact_requests')
      .update({ ...request, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact request:', error);
      return null;
    }

    return data;
  },

  // Delete contact request
  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('contact_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact request:', error);
      return false;
    }

    return true;
  },
};

// ============ NEWSLETTER ============

export interface NewsletterSubscriber {
  id?: number;
  email: string;
  status?: 'subscribed' | 'unsubscribed';
  created_at?: string;
  updated_at?: string;
}

export const newsletterService = {
  // Subscribe to newsletter
  async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) {
      // Check for unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return { success: true, message: 'already_subscribed' };
      }
      console.error('Error subscribing to newsletter:', error);
      return { success: false, message: 'error' };
    }

    // Send notification
    await sendNotification('newsletter', { email });

    return { success: true, message: 'success' };
  },
};

// ============ ANALYTICS ============

export interface AnalyticsStats {
  totalSessions: number;
  uniqueVisitors: number;
  avgDuration: number;
  totalEvents: number;
  totalConversions: number;
}

export interface EventStat {
  event_name: string;
  event_label: string | null;
  count: number;
}

export const analyticsService = {
  async getStats(timeRange: '24h' | '7d' | '30d'): Promise<AnalyticsStats> {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    try {
      // Get session stats
      const { data: sessions, error: sessionsError } = await supabase
        .from('analytics_sessions')
        .select('visitor_id, duration')
        .gte('created_at', startDate.toISOString());

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        return { totalSessions: 0, uniqueVisitors: 0, avgDuration: 0, totalEvents: 0, totalConversions: 0 };
      }

      const totalSessions = sessions?.length || 0;
      const uniqueVisitors = new Set(sessions?.map(s => s.visitor_id) || []).size;
      const totalDuration = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
      const avgDuration = totalSessions > 0 ? Math.floor(totalDuration / totalSessions) : 0;

      // Get event count
      const { count: totalEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Get conversions count
      const { count: totalConversions } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'submit')
        .gte('created_at', startDate.toISOString());

      return {
        totalSessions,
        uniqueVisitors,
        avgDuration,
        totalEvents: totalEvents || 0,
        totalConversions: totalConversions || 0,
      };
    } catch (error) {
      console.error('Error getting analytics stats:', error);
      return { totalSessions: 0, uniqueVisitors: 0, avgDuration: 0, totalEvents: 0, totalConversions: 0 };
    }
  },

  async getTopEvents(limit: number = 10, timeRange: '24h' | '7d' | '30d' = '7d', type: 'general' | 'articles' | 'projects' = 'general'): Promise<EventStat[]> {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    try {
      let query = supabase
        .from('analytics_events')
        .select('event_name, event_label')
        .gte('created_at', startDate.toISOString());

      if (type === 'articles') {
        query = query.eq('event_name', 'Просмотр статьи');
      } else if (type === 'projects') {
        query = query.eq('event_name', 'Просмотр проекта');
      } else {
        // General actions - exclude views
        query = query.neq('event_name', 'Просмотр статьи').neq('event_name', 'Просмотр проекта');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      // Group and count events
      const eventCounts = new Map<string, number>();
      const eventLabels = new Map<string, string | null>();

      data?.forEach(event => {
        const key = type === 'general'
          ? `${event.event_name}::${event.event_label || ''}`
          : event.event_label || 'Unknown'; // For content views, just show the title label

        eventCounts.set(key, (eventCounts.get(key) || 0) + 1);
        eventLabels.set(key, event.event_label);
      });

      // Convert to array and sort
      const topEvents: EventStat[] = Array.from(eventCounts.entries())
        .map(([key, count]) => {
          if (type === 'general') {
            const event_name = key.split('::')[0];
            const event_label = eventLabels.get(key) || null;
            return { event_name, event_label, count };
          } else {
            // For content views, label is the title
            return { event_name: type === 'articles' ? 'Статья' : 'Проект', event_label: key, count };
          }
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return topEvents;
    } catch (error) {
      console.error('Error getting top events:', error);
      return [];
    }
  },


  async getPageVisits(timeRange: '24h' | '7d' | '30d'): Promise<{ category: string; count: number }[]> {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    try {
      const { data, error } = await supabase
        .from('analytics_sessions')
        .select('page_path')
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error('Error fetching page visits:', error);
        return [];
      }

      const categories: Record<string, number> = {
        'Главная': 0,
        'Услуги': 0,
        'Портфолио': 0,
        'Блог': 0,
        'Контакты': 0,
      };

      data?.forEach(session => {
        const path = session.page_path;

        // Skip admin paths
        if (path.startsWith('/admin')) return;

        if (path === '/' || path === '/en' || path === '/ro') {
          categories['Главная']++;
        } else if (path.startsWith('/services')) {
          categories['Услуги']++;
        } else if (path.startsWith('/portfolio')) {
          categories['Портфолио']++;
        } else if (path.startsWith('/blog')) {
          categories['Блог']++;
        } else if (path.startsWith('/contact')) {
          categories['Контакты']++;
        }
      });

      return Object.entries(categories)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error getting page visits:', error);
      return [];
    }
  },
};
