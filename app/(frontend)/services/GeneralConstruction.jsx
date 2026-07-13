"use client";

import React, { useState, useEffect } from "react";
import { HardHat, Ruler, Construction, Loader2, Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

const getIcon = (title = "") => {
  const t = title.toLowerCase();
  const cls = "w-6 h-6 text-red-600";
  if (t.includes("shift") || t.includes("load")) return <Construction className={cls} />;
  if (t.includes("winch") || t.includes("handl")) return <Ruler className={cls} />;
  return <HardHat className={cls} />;
};

function ServiceCard({ service }) {
  const coverImage = service.images?.[0] || service.image || null;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative w-full h-52 overflow-hidden flex-shrink-0 bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <HardHat className="w-16 h-16 text-red-200" />
          </div>
        )}
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {service.isFeatured && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
            <Star className="w-3 h-3 fill-white" /> Featured
          </span>
        )}
      </div>

      {/* Card footer — always same height */}
      <div className="flex items-center gap-3 p-5 flex-1">
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
          {getIcon(service.title)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{service.title}</h3>
          {service.subtitle && (
            <p className="text-xs text-red-600 font-medium mt-0.5 line-clamp-1">{service.subtitle}</p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
}

export default function GeneralConstruction() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/services")
      .then((r) => { if (r.success) setServices(r.data); else throw new Error("Failed"); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="text-center py-12 text-red-600 font-medium">Error loading services: {error}</div>
  );

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto font-sans">
      <div className="mb-12">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">What We Offer</span>
        <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">The services we provide</h2>
        <p className="text-gray-500 leading-relaxed max-w-3xl text-sm md:text-base">
          We deliver heavy industrial setups, equipment alignments, and field maintenance with over 7 years of specialized expertise.
        </p>
      </div>

      {/* Grid — items-stretch for equal height rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </section>
  );
}
