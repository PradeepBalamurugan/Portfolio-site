"use client";

import { useState } from "react";
import { projects } from "@/lib/data";
import AnimatedSection from "./animated-section";
import { ChevronRight, Layers, Lightbulb, Zap, ArrowUpRight } from "lucide-react";

export default function Projects() {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-blue-500/50" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              Projects
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
              case studies.
            </span>
          </h2>
          <p className="text-gray-700 dark:text-gray-400 max-w-2xl mb-12">
            Deep dives into projects where I led architecture, development, and delivery.
          </p>
        </AnimatedSection>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 150}>
              <div
                className={`group rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-gray-300/60 dark:hover:border-white/10 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/20 ${
                  expandedProject === i ? "ring-1 ring-blue-500/20" : ""
                }`}
              >
                {/* Header - Always visible */}
                <div
                  className="p-6 sm:p-8 cursor-pointer"
                  onClick={() => setExpandedProject(expandedProject === i ? null : i)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${project.gradient} shadow-lg`}>
                          <Layers size={18} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-base mt-2 ml-[44px]">
                        {project.subtitle}
                      </p>

                      {/* Tech Stack - always visible */}
                      <div className="flex flex-wrap gap-2 mt-4 ml-[44px]">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200/60 dark:border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="p-2 rounded-lg text-gray-600 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all shrink-0">
                      <ChevronRight
                        size={20}
                        className={`transition-transform duration-300 ${
                          expandedProject === i ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    expandedProject === i
                      ? "max-h-[800px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 sm:px-8 pb-8">
                    <div className="border-t border-gray-100 dark:border-white/5 pt-6">
                      <div className="grid sm:grid-cols-3 gap-6">
                        {/* Problem */}
                        <div className="p-5 rounded-xl bg-red-50/50 dark:bg-red-500/5 border border-red-100/60 dark:border-red-500/10">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb size={16} className="text-red-500 dark:text-red-400" />
                            <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                              Problem
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {project.problem}
                          </p>
                        </div>

                        {/* Solution */}
                        <div className="p-5 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100/60 dark:border-blue-500/10">
                          <div className="flex items-center gap-2 mb-3">
                            <ArrowUpRight size={16} className="text-blue-500 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                              Solution
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {project.solution}
                          </p>
                        </div>

                        {/* Impact */}
                        <div className="p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100/60 dark:border-emerald-500/10">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap size={16} className="text-emerald-500 dark:text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                              Impact
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {project.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
