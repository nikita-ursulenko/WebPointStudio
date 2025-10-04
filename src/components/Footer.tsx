import { Link } from 'react-router-dom';
import { FaWhatsapp, FaTelegram, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const serviceLinks = [
    { path: '/services#landing', label: t('services.landing') },
    { path: '/services#business', label: t('services.business') },
    { path: '/services#shop', label: t('services.shop') },
  ];

  return (
    <footer className="bg-card border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-white">W</span>
              </div>
              <span className="text-xl font-bold gradient-text">WebPoint</span>
            </div>
            <p className="text-muted-foreground text-sm">{t('footer.about.text')}</p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('nav.home')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/portfolio"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('nav.portfolio')}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">info@webpoint.md</p>
              <p className="text-muted-foreground text-sm">+373 60 123 456</p>
              <div className="flex space-x-3 pt-2">
                <a
                  href="https://wa.me/37360123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center text-xl hover:text-primary transition-all hover-lift"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://t.me/webpoint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center text-xl hover:text-primary transition-all hover-lift"
                >
                  <FaTelegram />
                </a>
                <a
                  href="https://facebook.com/webpoint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center text-xl hover:text-primary transition-all hover-lift"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://instagram.com/webpoint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center text-xl hover:text-primary transition-all hover-lift"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} WebPoint. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
