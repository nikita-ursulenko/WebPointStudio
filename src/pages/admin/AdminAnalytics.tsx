import { useState, useEffect } from 'react';
import { FaChartLine, FaUsers, FaClock, FaMousePointer, FaEye } from 'react-icons/fa';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyticsService, type AnalyticsStats, type EventStat } from '@/lib/db';

type TimeRange = '24h' | '7d' | '30d';

const AdminAnalytics = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [stats, setStats] = useState<AnalyticsStats>({
        totalSessions: 0,
        uniqueVisitors: 0,
        avgDuration: 0,
        totalEvents: 0,
        totalConversions: 0,
    });
    const [topActions, setTopActions] = useState<EventStat[]>([]);
    const [topArticles, setTopArticles] = useState<EventStat[]>([]);
    const [topProjects, setTopProjects] = useState<EventStat[]>([]);
    const [pageVisits, setPageVisits] = useState<{ category: string; count: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    const loadAnalytics = async () => {
        setIsLoading(true);
        try {
            const [statsData, actionsData, articlesData, projectsData, pageVisitsData] = await Promise.all([
                analyticsService.getStats(timeRange),
                analyticsService.getTopEvents(10, timeRange, 'general'),
                analyticsService.getTopEvents(5, timeRange, 'articles'),
                analyticsService.getTopEvents(5, timeRange, 'projects'),
                analyticsService.getPageVisits(timeRange),
            ]);
            setStats(statsData);
            setTopActions(actionsData);
            setTopArticles(articlesData);
            setTopProjects(projectsData);
            setPageVisits(pageVisitsData);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getEventLabel = (name: string, label: string | null): string => {
        // For general actions, translate known events
        const labels: Record<string, string> = {
            view_service_detail: 'Подробнее о услуге',
            order_cta: 'Кнопка "Заказать"',
            form_submit: 'Отправка формы',
            newsletter_subscribe: 'Подписка на новости',
        };

        const baseName = labels[name] || name;
        return label ? `${baseName} (${label})` : baseName;
    };

    const timeRangeLabels = {
        '24h': '24 часа',
        '7d': '7 дней',
        '30d': '30 дней',
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <Card className="glass-effect p-8 text-center border-white/10">
                    <p className="text-muted-foreground">Загрузка статистики...</p>
                </Card>
            </div>
        );
    }

    const renderEventList = (events: EventStat[], type: 'general' | 'content') => {
        if (events.length === 0) {
            return (
                <p className="text-muted-foreground text-center py-8">
                    Нет данных за выбранный период
                </p>
            );
        }

        return (
            <div className="space-y-3">
                {events.map((event, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                                {index + 1}
                            </div>
                            <span className="font-medium">
                                {type === 'general'
                                    ? getEventLabel(event.event_name, event.event_label)
                                    : event.event_label // For content, label is the title
                                }
                            </span>
                        </div>
                        <div className="text-lg font-bold text-primary">{event.count}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Статистика сайта</h1>
                <p className="text-muted-foreground">
                    Анализ поведения посетителей и эффективности контента
                </p>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2 mb-6">
                {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
                    <Button
                        key={range}
                        variant={timeRange === range ? 'default' : 'outline'}
                        onClick={() => setTimeRange(range)}
                        size="sm"
                    >
                        {timeRangeLabels[range]}
                    </Button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <Card className="glass-effect p-6 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/20">
                            <FaChartLine className="text-2xl text-blue-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalSessions}</div>
                    <div className="text-sm text-muted-foreground">Всего визитов</div>
                </Card>

                <Card className="glass-effect p-6 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-green-500/20">
                            <FaUsers className="text-2xl text-green-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.uniqueVisitors}</div>
                    <div className="text-sm text-muted-foreground">Уникальных посетителей</div>
                </Card>

                <Card className="glass-effect p-6 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-purple-500/20">
                            <FaClock className="text-2xl text-purple-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{formatDuration(stats.avgDuration)}</div>
                    <div className="text-sm text-muted-foreground">Среднее время на сайте</div>
                </Card>

                <Card className="glass-effect p-6 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-orange-500/20">
                            <FaMousePointer className="text-2xl text-orange-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalEvents}</div>
                    <div className="text-sm text-muted-foreground">Всего действий</div>
                </Card>

                <Card className="glass-effect p-6 border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-pink-500/20">
                            <FaChartLine className="text-2xl text-pink-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats.totalSessions > 0
                            ? ((stats.totalConversions / stats.totalSessions) * 100).toFixed(1)
                            : '0'}%
                    </div>
                    <div className="text-sm text-muted-foreground">Конверсия</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Page Visits Chart */}
                <div className="lg:col-span-1">
                    <Card className="glass-effect p-6 border-white/10 h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-cyan-500/20">
                                <FaEye className="text-xl text-cyan-400" />
                            </div>
                            <h2 className="text-xl font-bold">Просмотры разделов</h2>
                        </div>

                        <div className="space-y-4">
                            {pageVisits.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{item.category}</span>
                                        <span className="font-bold">{item.count}</span>
                                    </div>
                                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-cyan-500/50 rounded-full"
                                            style={{
                                                width: `${(item.count / Math.max(...pageVisits.map(v => v.count), 1)) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {pageVisits.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">Нет данных</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Tabbed Analytics */}
                <div className="lg:col-span-2">
                    <Card className="glass-effect p-6 border-white/10 h-full">
                        <Tabs defaultValue="actions" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="actions">Популярное</TabsTrigger>
                                <TabsTrigger value="blog">Топ 5 блогов</TabsTrigger>
                                <TabsTrigger value="portfolio">Топ 5 портфолио</TabsTrigger>
                            </TabsList>

                            <TabsContent value="actions">
                                <h2 className="text-xl font-bold mb-4">Популярные действия</h2>
                                {renderEventList(topActions, 'general')}
                            </TabsContent>

                            <TabsContent value="blog">
                                <h2 className="text-xl font-bold mb-4">Топ просматриваемых статей</h2>
                                {renderEventList(topArticles, 'content')}
                            </TabsContent>

                            <TabsContent value="portfolio">
                                <h2 className="text-xl font-bold mb-4">Топ просматриваемых проектов</h2>
                                {renderEventList(topProjects, 'content')}
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
