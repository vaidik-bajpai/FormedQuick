"use client"

import { motion } from "framer-motion";
import { Bot, Settings, Link2, Smartphone } from "lucide-react";

const features = [
  {
    title: "AI Generation",
    description: "Automatically create forms from simple prompts or images—no technical skills required.",
    icon: <Bot className="text-primary/70 w-16 h-16 clip" />,
  },
  {
    title: "Easy Management",
    description: "Fine-tune form fields and manage responses efficiently from our intuitive dashboard.",
    icon: <Settings className="text-primary/70 w-16 h-16" />,
  },
  {
    title: "Secure Sharing",
    description: "Share clean links and monitor responses in real time, all with built-in privacy.",
    icon: <Link2 className="text-primary/70 w-16 h-16" />,
  },
];


const FeaturesSection = () => (
  <section className="relative w-full mx-auto my-20 px-6 z-10 bg-card max-w-7xl">
    <div className="absolute inset-0 top-12 pointer-events-none -z-10">
      <div className="w-2/3 h-40 bg-gradient-to-b from-primary/10 to-transparent mx-auto blur-xl rounded-full" />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative p-10 flex flex-col items-center gap-10 border border-border/30"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
        Why Choose FormedQuick?
      </h2>
      <div className="flex md:grid-cols-2 gap-8 w-full">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ delay: idx * 0.1, duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-4 bg-secondary/80 rounded p-8 shadow-sm hover:scale-[1.03] hover:shadow-md transition"
          >
            <div className="w-full flex items-center justify-center">{feature.icon}</div>
            <div className="flex flex-col items-center justify-center gap-2">
              <h3 className="text-2xl font-semibold text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

export default FeaturesSection;
