"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";
import { FaComments, FaHeart, FaShareAlt, FaArrowRight } from "react-icons/fa";



const CoverPage = ({ onGetStarted }) => {
  return (
    <section className="min-h-screen flex flex-col justify-between items-center text-center bg-background text-foreground p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* Top Section */}
      <div className="pt-12 z-10 relative">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
          Quadra
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect. Share. Inspire.
        </p>
      </div>

      {/* Middle Section */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-6 z-10 relative">
        <TypeAnimation
          sequence={["Connect.", 1200, "Share.", 1200, "Inspire.", 1200]}
          wrapper="h2"
          repeat={Infinity}
          className="text-3xl sm:text-5xl font-bold text-foreground"
        />

        <p className="max-w-xl text-muted-foreground text-lg mt-4 leading-relaxed">
          Join the next generation of social connection —  
          where authentic conversations meet beautiful design.
        </p>

        {/* Floating Icons */}
        <div className="flex gap-12 text-4xl mt-6 text-primary">
          <div className="animate-bounce-slow"><FaComments /></div>
          <div className="animate-bounce-slower"><FaHeart /></div>
          <div className="animate-bounce-fast"><FaShareAlt /></div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 pb-12 z-10 relative">
        <button
          onClick={onGetStarted}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium text-lg transition-all shadow-sm"
        >
          Join the journey <FaArrowRight />
        </button>

        <p className="text-sm text-muted-foreground">
          Join thousands of users already on{" "}
          <span className="font-semibold text-foreground">Quadra</span>.
        </p>
      </div>

      {/* Footer */}
      <footer className="w-full text-center border-t border-border py-4 text-xs text-muted-foreground z-10 relative">
        © 2025 Quadra — Connecting the world, one post at a time.
      </footer>

      {/* Background Circles */}
      <div className="absolute inset-0">
        <div className="absolute w-6 h-6 bg-primary/10 rounded-full top-[10%] left-[5%] animate-float-slow"></div>
        <div className="absolute w-8 h-8 bg-primary/10 rounded-full top-[30%] left-[85%] animate-float-slower"></div>
        <div className="absolute w-7 h-7 bg-primary/10 rounded-full top-[70%] left-[20%] animate-float-fast"></div>
      </div>
    </section>
  );
};

export default CoverPage;
