import { motion } from "framer-motion";
import { Globe, Users, FlaskConical, Truck } from "lucide-react";
import Header from "@/components/Header";
import VideoBackground from "@/components/VideoBackground";
import PortalCard from "@/components/PortalCard";

const portals = [
  {
    title: "Website",
    icon: Globe,
    href: "https://www.groenkunsmis.co.za",
  },
  {
    title: "Human Resources",
    icon: Users,
    href: "https://app.groenkunsmis.co.za",
  },
  {
    title: "Formulations",
    icon: FlaskConical,
    href: "https://form.groenkunsmis.co.za",
  },
  {
    title: "Operations",
    icon: Truck,
    href: "https://ops.groenkunsmis.co.za",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-16">
        <VideoBackground />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-foreground">Welcome to </span>
              <span className="text-gradient">Groen Kunsmis</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Select a system below
            </motion.p>
          </motion.div>

          {/* Portal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {portals.map((portal, index) => (
              <div key={portal.title} className="min-w-0">
                <PortalCard {...portal} delay={0.5 + index * 0.15} />
              </div>
            ))}
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-20 text-center"
          >
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Groen Kunsmis. All rights reserved.
            </p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
