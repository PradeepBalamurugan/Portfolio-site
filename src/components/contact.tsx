"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/data";
import AnimatedSection from "./animated-section";
import { LinkedinIcon, GithubIcon } from "./icons";
import { Mail, Send, MapPin, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (res.status === 429) {
          throw new Error("Too many requests. Please try again later.");
        }
        // Show validation errors if available
        if (errorData?.errors) {
          const fieldErrors = Object.values(errorData.errors).flat().join(", ");
          throw new Error(fieldErrors || "Please check your inputs.");
        }
        throw new Error(errorData?.message || "Failed to send message. Please try again later.");
      }

      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("idle");
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const contactLinks = [
    {
      name: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      icon: <Mail size={20} />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      name: "LinkedIn",
      value: "Pradeep Balamurugan",
      href: siteConfig.linkedin,
      icon: <LinkedinIcon size={20} />,
      color: "text-blue-700 dark:text-blue-300",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      name: "GitHub",
      value: "pradeepbalamurugan",
      href: siteConfig.github,
      icon: <GithubIcon size={20} />,
      color: "text-gray-800 dark:text-gray-300",
      bg: "bg-gray-100 dark:bg-white/5",
    },
    {
      name: "Location",
      value: siteConfig.location,
      href: "#",
      icon: <MapPin size={20} />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
  ];

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10" />
      <div className="relative max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-blue-500/50" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              Contact
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Let&apos;s{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
              connect.
            </span>
          </h2>
          <p className="text-gray-700 dark:text-gray-400 max-w-xl mb-12">
            I&apos;m always open to discussing new opportunities, interesting projects, or just
            having a great conversation about technology.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Links */}
          <AnimatedSection delay={100}>
            <div className="space-y-4">
              {contactLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`group flex items-center gap-4 p-4 rounded-xl border border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm hover:border-gray-300/60 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 ${
                    link.href === "#" ? "cursor-default" : ""
                  }`}
                >
                  <div className={`p-3 rounded-xl ${link.bg} ${link.color}`}>
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider">
                      {link.name}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium mt-0.5">
                      {link.value}
                    </p>
                  </div>
                  {link.href !== "#" && (
                    <ArrowUpRight
                      size={16}
                      className="text-gray-500 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors"
                    />
                  )}
                </a>
              ))}
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection delay={200}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-sm"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-none text-sm"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-gray-900/20 dark:shadow-white/10 hover:shadow-xl disabled:opacity-50"
              >
                {status === "sent" ? (
                  "Message sent! ✓"
                ) : status === "sending" ? (
                  "Sending securely..."
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
              {errorMsg && (
                <p className="text-red-500 text-sm mt-2 text-center">{errorMsg}</p>
              )}
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
