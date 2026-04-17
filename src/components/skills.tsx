"use client";

import { skillGroups } from "@/lib/data";
import AnimatedSection from "./animated-section";
import { Monitor, Server, Database, Wrench } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  monitor: <Monitor size={22} />,
  server: <Server size={22} />,
  database: <Database size={22} />,
  wrench: <Wrench size={22} />,
};

export default function Skills() {
  return (
    <section id="skills" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-blue-500/50" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              Skills
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12">
            Technologies I{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
              work with.
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group, i) => (
            <AnimatedSection key={group.category} delay={i * 100}>
              <div className="group h-full p-6 rounded-2xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm hover:border-gray-300/60 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${group.gradient} text-white mb-5 shadow-lg shadow-black/10`}>
                  {iconMap[group.icon]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200/60 dark:border-white/5 hover:bg-gray-200/80 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
