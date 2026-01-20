import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBlog, FaFolderOpen, FaEye } from 'react-icons/fa';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { blogService, portfolioService, analyticsService } from '@/lib/db';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [blogCount, setBlogCount] = useState<number>(0);
  const [portfolioCount, setPortfolioCount] = useState<number>(0);
  const [dailyStats, setDailyStats] = useState<{ date: string; count: number; visitors: number; events: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [blogArticles, portfolioProjects, stats] = await Promise.all([
          blogService.getAll(),
          portfolioService.getAll(),
          analyticsService.getDailyStats(7),
        ]);
        setBlogCount(blogArticles.length);
        setPortfolioCount(portfolioProjects.length);
        setDailyStats(stats);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const stats = [
    {
      title: 'Статьи блога',
      value: isLoading ? '...' : blogCount.toString(),
      icon: FaBlog,
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/blog',
    },
    {
      title: 'Проекты портфолио',
      value: isLoading ? '...' : portfolioCount.toString(),
      icon: FaFolderOpen,
      color: 'from-purple-500 to-pink-500',
      link: '/admin/portfolio',
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <Card className="glass-effect p-6 border-white/10 h-full">
            <h2 className="text-2xl font-bold mb-6">Активность за 7 дней</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStats}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUniques" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="date"
                    stroke="#ffffff50"
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}.${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis stroke="#ffffff50" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#aaa', marginBottom: '4px' }}
                    // formatter={(value: number) => [`${value} визитов`, 'Посетители']} 
                    labelFormatter={(label) => {
                      return new Date(label).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        weekday: 'long'
                      });
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Визиты"
                    stroke="#06b6d4"
                    fillOpacity={1}
                    fill="url(#colorVisits)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Уникальные"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorUniques)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="events"
                    name="События"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorEvents)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="glass-effect p-6 border-white/10 h-full">
            <h2 className="text-2xl font-bold mb-6">Быстрые действия</h2>
            <div className="space-y-4">
              <Button asChild className="w-full justify-start h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Link to="/admin/blog">
                  <span className="mr-2">+</span> Добавить статью
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-12 text-lg">
                <Link to="/admin/portfolio">
                  <span className="mr-2">+</span> Добавить проект
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full justify-start h-12 text-lg">
                <Link to="/admin/analytics">
                  <FaEye className="mr-2" /> Полная аналитика
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
