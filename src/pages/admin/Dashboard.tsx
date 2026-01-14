import { motion } from 'framer-motion';
import { FaBlog, FaFolderOpen, FaEye } from 'react-icons/fa';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const stats = [
    {
      title: 'Статьи блога',
      value: '6',
      icon: FaBlog,
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/blog',
    },
    {
      title: 'Проекты портфолио',
      value: '7',
      icon: FaFolderOpen,
      color: 'from-purple-500 to-pink-500',
      link: '/admin/portfolio',
    },
    {
      title: 'Просмотры сайта',
      value: '1,234',
      icon: FaEye,
      color: 'from-green-500 to-emerald-500',
      link: '/',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
        <p className="text-muted-foreground">
          Добро пожаловать в админ-панель WebPoint
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect p-6 border-white/10 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="text-white text-xl" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-muted-foreground mb-4">{stat.title}</div>
                {stat.link && (
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={stat.link}>Управлять</Link>
                  </Button>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="glass-effect p-6 border-white/10">
        <h2 className="text-2xl font-bold mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Link to="/admin/blog">Добавить статью</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/portfolio">Добавить проект</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
