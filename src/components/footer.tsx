"use client";

import { siteConfig, navLinks } from "@/lib/data";
import { LinkedinIcon, GithubIcon } from "./icons";
import { Mail, Heart } from "lucide-react";

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-gray-200/60 dark:border-white/5 bg-gray-50/50 dark:bg-[#050508]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {siteConfig.name.split(" ")[0]}
              <span className="text-blue-600 dark:text-blue-400">.</span>
            </button>
            <p className="text-sm text-gray-700 dark:text-gray-400 mt-3 max-w-xs leading-relaxed">
              {siteConfig.role} crafting high-performance, scalable web applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-gray-200/60 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                aria-label="GitHub"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-gray-200/60 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="p-2.5 rounded-xl border border-gray-200/60 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-600 flex items-center gap-1.5">
            © {new Date().getFullYear()} {siteConfig.name}. Built with
            <Heart size={14} className="text-red-500 fill-red-500 inline" />
            using Next.js & Tailwind.
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-600">
            Designed for performance. Deployed with purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
