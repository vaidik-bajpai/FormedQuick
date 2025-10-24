"use client";

import { motion } from "framer-motion";
import stepOne from "@/assets/step-1.png";
import stepTwo from "@/assets/step-2.png";
import stepThree from "@/assets/step-3.png";
import stepFour from "@/assets/step-4.png";

const steps = [
  {
    id: 1,
    title: "Sign Up & Log In",
    description: "Create an account to start building forms instantly.",
    imgSrc: stepOne.src,
  },
  {
    id: 2,
    title: "Provide a Prompt or Image",
    description: "Upload prompts or images for form generation.",
    imgSrc: stepTwo.src,
  },
  {
    id: 3,
    title: "Customize & Save",
    description: "Edit your form with ease and save your work.",
    imgSrc: stepThree.src,
  },
  {
    id: 4,
    title: "Share & Collect",
    description: "Share links and monitor responses seamlessly.",
    imgSrc: stepFour.src,
  },
];

const animationVariants = {
  fromLeft: {
    hidden: { opacity: 0, x: -70 },
    visible: { opacity: 1, x: 0 },
  },
  fromRight: {
    hidden: { opacity: 0, x: 70 },
    visible: { opacity: 1, x: 0 },
  },
};

const HowItWorksSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto my-24 px-6 relative z-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-16 tracking-tight">
        How It Works in 4 Steps
      </h2>

      <div className="flex flex-col gap-24">
        {steps.map((step, index) => {
          const isEven = index % 2 === 1;
          return (
            <motion.div
              key={step.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              variants={isEven ? animationVariants.fromRight : animationVariants.fromLeft}
              className={`flex flex-col md:flex-row items-center ${
                isEven ? "md:flex-row-reverse" : ""
              } md:gap-8 gap-10`}
            >
              <div className="md:w-[42%] flex justify-center">
                <img
                  src={step.imgSrc}
                  alt={step.title}
                  className="w-[80%] max-w-[380px] rounded-lg shadow-lg border border-border/40 object-contain"
                />
              </div>

              <div
                className={`md:w-[52%] flex flex-col justify-center ${
                  isEven ? "md:items-end md:text-right" : "md:items-start md:text-left"
                } text-center gap-3 md:gap-4`}
              >
                <h3 className="text-2xl md:text-3xl font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg md:text-[1.05rem] leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorksSection;
