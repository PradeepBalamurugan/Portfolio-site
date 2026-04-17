"use client";

import { experiences } from "@/lib/data";
import AnimatedSection from "./animated-section";
import { Briefcase, MapPin, Calendar } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/30 to-transparent dark:via-violet-950/10" />
      <div className="relative max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-blue-500/50" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              Experience
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Where I&apos;ve{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
              made impact.
            </span>
          </h2>
        </AnimatedSection>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/20 via-violet-500/20 to-transparent hidden sm:block" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <AnimatedSection key={exp.company} delay={i * 150}>
                <div className="flex gap-6">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                      <Briefcase size={18} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 sm:p-8 rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm hover:border-gray-300/60 dark:hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {exp.role}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0 text-sm text-gray-700 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {exp.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mt-5">
                      {exp.achievements.map((achievement, j) => (
                        <li key={j} className="flex items-start gap-3 group/item">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 dark:bg-blue-400/50 mt-2.5 shrink-0 group-hover/item:bg-blue-500 dark:group-hover/item:bg-blue-400 transition-colors" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover/item:text-gray-800 dark:group-hover/item:text-gray-300 transition-colors">
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
