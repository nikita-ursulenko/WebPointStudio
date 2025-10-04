import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'ro';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.portfolio': 'Портфолио',
    'nav.blog': 'Блог',
    'nav.contact': 'Контакты',
    
    // Hero
    'hero.title': 'Создаём сайты, которые',
    'hero.highlight': 'продают',
    'hero.subtitle': 'Профессиональная разработка сайтов в Молдове. Лендинги, интернет-магазины и корпоративные сайты под ключ с гарантией результата.',
    'hero.cta': 'Оставить заявку',
    'hero.consultation': 'Бесплатная консультация',
    
    // About
    'about.title': 'О нас',
    'about.subtitle': 'WebPoint — это команда профессионалов, которая создаёт современные веб-решения для вашего бизнеса',
    'about.experience': 'Лет опыта',
    'about.projects': 'Проектов',
    'about.clients': 'Довольных клиентов',
    
    // Services
    'services.title': 'Наши услуги',
    'services.subtitle': 'Выберите подходящее решение для вашего бизнеса',
    'services.landing': 'Лендинг',
    'services.landing.desc': 'Продающая одностраничная страница для привлечения клиентов и увеличения конверсии',
    'services.business': 'Сайт-визитка',
    'services.business.desc': 'Многостраничный корпоративный сайт с полной информацией о вашей компании',
    'services.shop': 'Интернет-магазин',
    'services.shop.desc': 'Полнофункциональный онлайн-магазин с каталогом, корзиной и системой оплаты',
    'services.from': 'от',
    'services.order': 'Заказать',
    
    // Features
    'features.design': 'Современный дизайн',
    'features.design.desc': 'Уникальный дизайн, адаптированный под ваш бренд',
    'features.responsive': 'Адаптивная вёрстка',
    'features.responsive.desc': 'Корректное отображение на всех устройствах',
    'features.seo': 'SEO-оптимизация',
    'features.seo.desc': 'Настройка для поисковых систем и быстрой индексации',
    'features.support': 'Техподдержка',
    'features.support.desc': 'Гарантийная поддержка и обслуживание сайта',
    
    // Portfolio
    'portfolio.title': 'Наши работы',
    'portfolio.subtitle': 'Примеры успешно реализованных проектов',
    'portfolio.all': 'Все',
    'portfolio.landing': 'Лендинги',
    'portfolio.business': 'Сайты-визитки',
    'portfolio.shop': 'Магазины',
    'portfolio.problem': 'Проблема',
    'portfolio.solution': 'Решение',
    'portfolio.result': 'Результат',
    'portfolio.view': 'Посмотреть проект',
    
    // Blog
    'blog.title': 'Блог',
    'blog.subtitle': 'Полезные статьи о создании и продвижении сайтов',
    'blog.readMore': 'Читать далее',
    'blog.readTime': 'мин чтения',
    
    // Contact
    'contact.title': 'Свяжитесь с нами',
    'contact.subtitle': 'Готовы обсудить ваш проект? Оставьте заявку, и мы свяжемся с вами в ближайшее время',
    'contact.name': 'Ваше имя',
    'contact.email': 'Email',
    'contact.phone': 'Телефон',
    'contact.message': 'Сообщение',
    'contact.projectType': 'Тип проекта',
    'contact.send': 'Отправить заявку',
    'contact.sending': 'Отправка...',
    'contact.success': 'Спасибо! Мы свяжемся с вами в ближайшее время.',
    'contact.error': 'Произошла ошибка. Попробуйте позже.',
    
    // Footer
    'footer.about': 'О компании',
    'footer.about.text': 'Мы создаём современные веб-решения для бизнеса в Молдове',
    'footer.services': 'Услуги',
    'footer.contact': 'Контакты',
    'footer.social': 'Социальные сети',
    'footer.rights': 'Все права защищены',
  },
  ro: {
    // Navigation
    'nav.home': 'Acasă',
    'nav.services': 'Servicii',
    'nav.portfolio': 'Portofoliu',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacte',
    
    // Hero
    'hero.title': 'Creăm site-uri care',
    'hero.highlight': 'vând',
    'hero.subtitle': 'Dezvoltare profesională de site-uri în Moldova. Landing pages, magazine online și site-uri corporative la cheie cu garanție de rezultat.',
    'hero.cta': 'Lasă o cerere',
    'hero.consultation': 'Consultație gratuită',
    
    // About
    'about.title': 'Despre noi',
    'about.subtitle': 'WebPoint — o echipă de profesioniști care creează soluții web moderne pentru afacerea ta',
    'about.experience': 'Ani de experiență',
    'about.projects': 'Proiecte',
    'about.clients': 'Clienți mulțumiți',
    
    // Services
    'services.title': 'Serviciile noastre',
    'services.subtitle': 'Alege soluția potrivită pentru afacerea ta',
    'services.landing': 'Landing Page',
    'services.landing.desc': 'Pagină unică de vânzare pentru atragerea clienților și creșterea conversiilor',
    'services.business': 'Site vizită',
    'services.business.desc': 'Site corporativ cu mai multe pagini cu informații complete despre compania ta',
    'services.shop': 'Magazin online',
    'services.shop.desc': 'Magazin online complet funcțional cu catalog, coș și sistem de plată',
    'services.from': 'de la',
    'services.order': 'Comandă',
    
    // Features
    'features.design': 'Design modern',
    'features.design.desc': 'Design unic adaptat brandului tău',
    'features.responsive': 'Design responsive',
    'features.responsive.desc': 'Afișare corectă pe toate dispozitivele',
    'features.seo': 'Optimizare SEO',
    'features.seo.desc': 'Configurare pentru motoarele de căutare și indexare rapidă',
    'features.support': 'Suport tehnic',
    'features.support.desc': 'Suport și întreținere sub garanție',
    
    // Portfolio
    'portfolio.title': 'Lucrările noastre',
    'portfolio.subtitle': 'Exemple de proiecte realizate cu succes',
    'portfolio.all': 'Toate',
    'portfolio.landing': 'Landing Pages',
    'portfolio.business': 'Site-uri vizită',
    'portfolio.shop': 'Magazine',
    'portfolio.problem': 'Problemă',
    'portfolio.solution': 'Soluție',
    'portfolio.result': 'Rezultat',
    'portfolio.view': 'Vezi proiectul',
    
    // Blog
    'blog.title': 'Blog',
    'blog.subtitle': 'Articole utile despre crearea și promovarea site-urilor',
    'blog.readMore': 'Citește mai mult',
    'blog.readTime': 'min citire',
    
    // Contact
    'contact.title': 'Contactează-ne',
    'contact.subtitle': 'Pregătit să discutăm proiectul tău? Lasă o cerere și te vom contacta în curând',
    'contact.name': 'Numele tău',
    'contact.email': 'Email',
    'contact.phone': 'Telefon',
    'contact.message': 'Mesaj',
    'contact.projectType': 'Tipul proiectului',
    'contact.send': 'Trimite cererea',
    'contact.sending': 'Se trimite...',
    'contact.success': 'Mulțumim! Te vom contacta în curând.',
    'contact.error': 'A apărut o eroare. Încearcă mai târziu.',
    
    // Footer
    'footer.about': 'Despre companie',
    'footer.about.text': 'Creăm soluții web moderne pentru afaceri în Moldova',
    'footer.services': 'Servicii',
    'footer.contact': 'Contacte',
    'footer.social': 'Rețele sociale',
    'footer.rights': 'Toate drepturile rezervate',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ru']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
