"use client";

import { Button } from "@/components/ui/button";
import heroPreview from "@/assets/hero-preview.png";
import { Lens } from "@/components/ui/magnifier-lens";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const [hovering, setHovering] = useState<boolean>(false);
  const router = useRouter();

  return (
    <section className="flex flex-col md:flex-row items-center justify-between my-20 gap-12">
      {/* Text Section */}
      <div className="flex flex-col gap-6 max-w-xl">
        {/* Heading Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="text-4xl md:text-5xl font-extrabold text-primary leading-tight"
        >
          Generate Smart, Customized Forms Instantly with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.7,
            ease: "easeOut",
          }}
          className="text-foreground/80 text-lg leading-relaxed"
        >
          Create, save, and share forms effortlessly by providing a prompt or an image.
        </motion.p>

        {/* Button Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.8,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
        >
          <Button
            onClick={() => router.push("/signup")}
            className="w-fit !bg-primary text-primary-foreground px-8 py-3 rounded-md shadow-md hover:brightness-110 transition"
          >
            Get Started for Free
          </Button>
        </motion.div>
      </div>

      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 1,
          duration: 0.8,
          ease: "easeOut",
        }}
        className="max-w-lg w-full rounded-lg shadow-lg overflow-hidden p-1 bg-primary/50"
      >
        <Lens hovering={hovering} setHovering={setHovering}>
          <img
            src={heroPreview.src}
            alt="AI generated form preview"
            className="object-contain"
          />
        </Lens>
      </motion.div>
    </section>
  );
};

export default HeroSection;
