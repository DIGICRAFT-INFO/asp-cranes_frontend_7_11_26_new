"use client";
import React, { useEffect, useState } from "react";
import logo from "@/public/footerlogo.jpeg";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

// Social media icons from react-icons
import { TiSocialInstagram } from "react-icons/ti";
import { FaSquareFacebook } from "react-icons/fa6";
import { GrLinkedin } from "react-icons/gr";
import { FaTwitterSquare } from "react-icons/fa";
import { FaSquareYoutube } from "react-icons/fa6";

// Map social key → icon component + label
const SOCIAL_CONFIG = {
  linkedin:  { icon: GrLinkedin,         label: "LinkedIn"  },
  facebook:  { icon: FaSquareFacebook,   label: "Facebook"  },
  instagram: { icon: TiSocialInstagram,  label: "Instagram" },
  twitter:   { icon: FaTwitterSquare,    label: "Twitter"   },
  youtube:   { icon: FaSquareYoutube,    label: "YouTube"   },
};

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch site settings (phone, email, social links)
    apiFetch("/settings")
      .then((json) => { if (json.success && json.data) setSettings(json.data); })
      .catch(() => {});

    // Fetch services dynamically so each gets its own slug link
    apiFetch("/services")
      .then((json) => { if (json.success && Array.isArray(json.data)) setServices(json.data.slice(0, 6)); })
      .catch(() => {});
  }, []);

  const phones   = settings?.phone?.length > 0 ? settings.phone : ["+91-20-66744700", "+966 59 705 9690"];
  const email    = settings?.email || "enquiry@aspcranes.com";
  const socials  = settings?.socialLinks || {};

  // Only show social icons that have a URL set in admin settings
  const activeSocials = Object.entries(SOCIAL_CONFIG).filter(([key]) => socials[key]);

  return (
    <footer className="w-full bg-black text-white relative overflow-hidden">

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-14 relative z-10">

        {/* ── Col 1: Logo + Description ────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="space-y-5"
        >
          <Image src={logo} alt="ASP Cranes" className="h-34 w-auto" />
          <p className="text-sm text-gray-400 leading-relaxed">
            ASP Cranes is a leading crane rental and heavy lifting solutions
            provider, serving industries across India and the Middle East with
            precision and reliability.
          </p>
        </motion.div>

        {/* ── Col 2: Quick Links ───────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          <h3 className="font-semibold mb-6 text-lg tracking-wide">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            {[
              { label: "Services",  href: "/services"  },
              { label: "About Us",  href: "/about"     },
              { label: "Projects",  href: "/projects"  },
              { label: "Blog",      href: "/blog"      },
              { label: "Careers",   href: "/careers"   },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-red-500 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Col 3: Our Cranes ────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
        >
          <h3 className="font-semibold mb-6 text-lg tracking-wide">Our Cranes</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            {[
              { label: "Tower Cranes",         href: "/our-cranes?category=tower"         },
              { label: "Truck-Mounted Cranes",  href: "/our-cranes?category=truck-mounted" },
              { label: "Crawler Cranes",        href: "/our-cranes?category=crawler"       },
              { label: "Pick & Carry Cranes",   href: "/our-cranes?category=pick-carry"    },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-red-500 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Col 4: Services (dynamic from API with individual slugs) ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
        >
          <h3 className="font-semibold mb-6 text-lg tracking-wide">Services</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            {services.length > 0
              ? services.map((svc) => (
                  <li key={svc._id}>
                    <Link
                      href={`/services/${svc.slug}`}
                      className="hover:text-red-500 transition-colors duration-200"
                    >
                      {svc.title}
                    </Link>
                  </li>
                ))
              : /* Static fallback if API hasn't loaded yet */
                [
                  { label: "Shifting & Loading",          slug: "shifting-loading"              },
                  { label: "Winch Handling",               slug: "winch-handling"                },
                  { label: "Material Handling",            slug: "material-handling"             },
                  { label: "Jacking",                      slug: "jacking"                       },
                  { label: "Operations & Maintenance",     slug: "operations-maintenance"        },
                ].map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="hover:text-red-500 transition-colors duration-200"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
          </ul>
        </motion.div>

        {/* ── Col 5: Contact ───────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
        >
          <h3 className="font-semibold mb-6 text-lg tracking-wide">Contact</h3>
          <div className="text-sm text-gray-400 space-y-4">

            {/* Phone numbers — one per line */}
            <div className="space-y-1">
              {phones.map((phone, i) => (
                <a
                  key={i}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="block hover:text-red-500 transition-colors duration-200"
                >
                  {phone}
                </a>
              ))}
            </div>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="block hover:text-red-500 transition-colors duration-200"
            >
              {email}
            </a>

            {/* Social Icons — only show if URL is set in admin */}
            {activeSocials.length > 0 && (
              <div className="flex gap-3 pt-1 flex-wrap">
                {activeSocials.map(([key, { icon: Icon, label }]) => (
                  <a
                    key={key}
                    href={socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <Icon size={28} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-800 max-w-7xl mx-auto" />

      {/* ── Bottom Bar ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>
          &copy;{" "}
          <Link href="/copyright" className="hover:text-red-500 transition-colors duration-200">
            Copyrights
          </Link>{" "}
          {new Date().getFullYear()} {settings?.siteName || "ASP Cranes"}. All Rights Reserved
        </p>

        <p className="flex gap-2">
          <Link href="/sitemap"       className="hover:text-red-500 transition-colors duration-200">Site Map</Link>
          <span>|</span>
          <Link href="/privacy-policy" className="hover:text-red-500 transition-colors duration-200">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
