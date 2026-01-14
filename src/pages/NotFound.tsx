import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-2xl animate-float-glow" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-9xl font-bold gradient-text mb-4">404</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Страница не найдена</h1>
          <p className="text-xl text-muted-foreground mb-8">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Link to="/">
              <FaHome className="mr-2" />
              Вернуться на главную
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
