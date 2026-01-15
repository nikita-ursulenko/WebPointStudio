import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const success = await login(email, password);

    if (success) {
      toast.success('Успешный вход в админ-панель');
      navigate('/admin');
    } else {
      toast.error('Ошибка входа. Проверьте Email и пароль.');
    }
  };

  return (
    <>
      <SEO
        title="Вход в админ-панель | WebPoint"
        description="Вход в административную панель WebPoint"
        url="/admin/login"
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-2xl animate-float-glow" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-2xl animate-float-glow-slow" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full mx-auto"
          >
            <Card className="glass-effect p-8 border-white/10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 glow-effect">
                  <span className="text-3xl font-bold text-white">W</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Админ-панель</h1>
                <p className="text-muted-foreground">Войдите используя Supabase Auth</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Пароль
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Вход...'
                  ) : (
                    <>
                      <FaSignInAlt className="mr-2" />
                      Войти
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
