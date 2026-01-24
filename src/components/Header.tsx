import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-50 bg-background border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src={logo} 
              alt="Groen Kunsmis" 
              className="h-16 w-auto object-contain"
            />
          </motion.div>
          
          <div className="hidden md:flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Systems Portal</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
