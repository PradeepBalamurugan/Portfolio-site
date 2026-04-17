"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/data";
import { ArrowDown, FileText, Mail } from "lucide-react";
import { LinkedinIcon, GithubIcon } from "./icons";
import AnimatedSection from "./animated-section";

function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && (
        <span className="inline-block w-[2px] h-[1em] bg-blue-500 dark:bg-blue-400 ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-blue-950/20 dark:via-transparent dark:to-transparent" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-gray-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm text-sm text-gray-600 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available for opportunities
          </div>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            {siteConfig.name.split(" ")[0]}
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              {siteConfig.name.split(" ").slice(1).join(" ")}
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium mb-4">
            {siteConfig.role}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed min-h-[3em]">
            {mounted ? (
              <TypewriterText text={siteConfig.tagline} speed={30} />
            ) : (
              siteConfig.tagline
            )}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group flex items-center gap-2 px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-gray-900/20 dark:shadow-white/10 hover:shadow-xl hover:-translate-y-0.5"
            >
              View Projects
              <ArrowDown
                size={16}
                className="transition-transform group-hover:translate-y-0.5"
              />
            </button>

            <a
              href={siteConfig.resumeUrl}
              download
              className="group flex items-center gap-2 px-8 py-3.5 border border-gray-200 dark:border-white/10 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 hover:-translate-y-0.5"
            >
              <FileText size={16} />
              Download Resume
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={500}>
          <div className="flex items-center justify-center gap-4">
            <a
              href={`mailto:${siteConfig.email}`}
              className="p-3 rounded-xl border border-gray-200/60 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all duration-300"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-gray-200/60 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-gray-200/60 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all duration-300"
              aria-label="GitHub"
            >
              <GithubIcon size={20} />
            </a>
          </div>
        </AnimatedSection>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-gray-400 dark:bg-white/40 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
