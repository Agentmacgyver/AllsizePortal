import { motion } from "framer-motion";
import { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface PortalCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
  delay?: number;
}

const PortalCard = forwardRef<HTMLAnchorElement, PortalCardProps>(
  ({ title, icon: Icon, href, delay = 0 }, ref) => {
    return (
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group block glass-card rounded-2xl p-8 border border-border/50 transition-all duration-500 hover:border-primary/50"
      >
        <div className="flex flex-col items-center text-center space-y-5">
          <motion.div
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:glow-primary transition-all duration-500"
            whileHover={{ rotate: 5 }}
          >
            <Icon className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110" />
          </motion.div>

          <h3 className="text-2xl font-semibold text-foreground group-hover:text-gradient transition-all duration-300">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Access Platform</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>
        </div>
      </motion.a>
    );
  }
);

PortalCard.displayName = "PortalCard";

export default PortalCard;
