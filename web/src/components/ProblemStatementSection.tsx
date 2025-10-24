"use client"

import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react"; 

const ProblemStatementSection = () => (
  <section className="relative w-full mx-auto mt-20 px-6 z-10">
    <div className="absolute inset-0 -top-10 pointer-events-none">
      <div className="w-2/3 h-40 bg-gradient-to-b from-primary/10 to-transparent mx-auto blur-xl rounded-full" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative bg-card text-card-foreground rounded-xl shadow-xl p-10 flex flex-col gap-6 border border-border/30"
    >
      <div className="flex items-center gap-3">
        <TriangleAlert className=" text-2xl" />
        <h2 className="text-2xl md:text-3xl font-bold text-primary">
          Why Creating Forms is Hard
        </h2>
      </div>
      <ul className="text-lg text-muted-foreground list-disc pl-6 space-y-3">
        <li>Building forms manually takes time and technical skills.</li>
        <li>Off-the-shelf form builders lack flexibility and customization.</li>
        <li>Sharing forms and tracking submissions can be inefficient and confusing.</li>
      </ul>
    </motion.div>
  </section>
);

export default ProblemStatementSection;
