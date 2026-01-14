import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaBlog,
  FaFolderOpen,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChartLine,
  FaAddressBook,
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Выход выполнен');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Главная', icon: FaChartLine },
    { path: '/admin/blog', label: 'Статьи блога', icon: FaBlog },
    { path: '/admin/portfolio', label: 'Портфолио', icon: FaFolderOpen },
    { path: '/admin/contacts', label: 'Контакты', icon: FaAddressBook },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-white">W</span>
            </div>
            <span className="text-xl font-bold gradient-text">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-white/10 z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 pt-16 lg:pt-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10 hidden lg:block">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
                <span className="text-2xl font-bold text-white">W</span>
              </div>
              <div>
                <div className="text-xl font-bold gradient-text">WebPoint</div>
                <div className="text-xs text-muted-foreground">Админ-панель</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  <Icon />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaHome />
              <span className="font-medium">На сайт</span>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-3" />
              Выйти
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay для мобильного меню */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
