"use client";

import { aboutText, education, certifications } from "@/lib/data";
import AnimatedSection from "./animated-section";
import { GraduationCap, Award } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10" />
      <div className="relative max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-blue-500/50" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              About
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Building the future,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
              one line at a time.
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* About Text */}
          <div className="lg:col-span-3 space-y-6">
            {aboutText.map((paragraph, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
                  {paragraph}
                </p>
              </AnimatedSection>
            ))}
          </div>

          {/* Education & Certifications */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatedSection delay={100}>
              <div className="p-6 rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <GraduationCap size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Education</h3>
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                  {education.degree}
                </p>
                <p className="text-gray-700 dark:text-gray-400 text-sm mt-1">
                  {education.institution}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {education.period}
                  </span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">
                    CGPA: {education.cgpa}
                  </span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="p-6 rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-500/10">
                    <Award size={20} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Certifications</h3>
                </div>
                <ul className="space-y-3">
                  {certifications.map((cert, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 mt-2 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
