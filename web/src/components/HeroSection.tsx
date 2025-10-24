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
    <section className="flex flex-col md:flex-row items-center justify-between gap-12 w-7xl mt-30">
      {/* Text Section */}
      <div className="flex flex-col gap-12 max-w-xl">
        {/* Heading Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="text-4xl md:text-5xl font-extrabold leading-tight"
        >
          Generate Smart, <span className="text-primary/80">Customized Forms</span> Instantly with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.7,
            ease: "easeOut",
          }}
          className="text-foreground/80 leading-relaxed text-xl font-medium"
        >
          Create, save, and share forms effortlessly by providing a prompt or an image.
        </motion.p>

        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/signup")}
            className="w-fit !bg-primary text-primary-foreground px-8 py-6 text-lg rounded-md shadow-md hover:brightness-110 transition"
          >
            Get Started
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            className="w-fit !bg-secondary text-secondary-foreground px-8 py-6 text-lg  rounded-md shadow-md hover:brightness-110 transition"
          >
            How it Works?
          </Button>
        </div>
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
        className="rounded-lg shadow-lg overflow-hidden p-1 bg-primary/50"
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
