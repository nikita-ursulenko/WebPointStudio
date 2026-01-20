import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { trackEvent } from '@/lib/analytics';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/portfolio', label: t('nav.portfolio') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const languages = [
    { code: 'ru' as const, flag: '🇷🇺', name: 'Русский' },
    { code: 'ro' as const, flag: '🇷🇴', name: 'Română' },
    { code: 'en' as const, flag: '🇬🇧', name: 'English' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* Logo */}
          <div className="justify-self-start">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-8 md:h-10 w-auto flex items-center justify-center">
                <img src="/WebPoint.webp" alt="WebPoint Logo" className="h-full object-contain" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 justify-self-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors ${isActive(link.path)
                  ? 'text-primary'
                  : 'text-foreground/80 hover:text-primary'
                  }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Language Switcher & CTA */}
          <div className="hidden md:flex items-center space-x-4 justify-self-end">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="glass-effect border-white/20 hover:bg-white/10 gap-1 px-2 h-8 min-w-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <span className="text-base">{currentLanguage.flag}</span>
                  <span className="text-sm font-bold uppercase">{currentLanguage.code}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-effect border-white/20 min-w-[150px]" onCloseAutoFocus={(e) => e.preventDefault()}>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer flex items-center gap-2 ${language === lang.code ? 'bg-primary text-white font-medium focus:bg-primary focus:text-white' : ''
                      }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:opacity-100 glow-effect transition-all duration-500 hover:bg-right hover:scale-110 hover:shadow-xl active:scale-95" onClick={() => trackEvent('Клик по кнопке', 'Меню - Оставить заявку (Десктоп)', 'click')}>
              <Link to="/contact">{t('hero.cta')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl text-foreground"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-lg font-medium transition-colors ${isActive(link.path)
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-primary'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-300 ${language === lang.code
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                      : 'glass-effect border-white/10 text-foreground/70 hover:bg-white/5'
                      }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:opacity-100 glow-effect transition-all duration-500 hover:bg-right hover:scale-105 hover:shadow-xl active:scale-95" onClick={() => trackEvent('Клик по кнопке', 'Меню - Оставить заявку (Мобильное)', 'click')}>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('hero.cta')}</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav >
  );
};

export default Navigation;
