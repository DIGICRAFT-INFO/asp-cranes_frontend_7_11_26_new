"use client";

import React, { useState, useEffect } from "react";
import { HardHat, Ruler, Construction, Loader2, CheckCircle2, ChevronDown, ChevronUp, Star } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

// ─── Icon by title ────────────────────────────────────────────────────────────
const getIcon = (title = "") => {
  const t = title.toLowerCase();
  const cls = "w-7 h-7 text-red-600";
  if (t.includes("shift") || t.includes("load")) return <Construction className={cls} />;
  if (t.includes("winch") || t.includes("handl")) return <Ruler className={cls} />;
  return <HardHat className={cls} />;
};

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service }) {
  const [expanded, setExpanded] = useState(false);
  const coverImage = service.images?.[0] || service.image || null;
  const hasFeatures = service.features?.length > 0;
  const canExpand = hasFeatures || (service.description?.length > 120) || (service.images?.length > 1);

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Cover Image */}
      {coverImage && (
        <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
          <Image src={coverImage} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          {service.isFeatured && (
            <span className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
              <Star className="w-3 h-3 fill-white" /> Featured
            </span>
          )}
          {/* Red gradient overlay bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      {/* Card Body — flex-1 so all cards stretch equally */}
      <div className="flex flex-col flex-1 p-6">

        {/* Icon + Title + Subtitle */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            {getIcon(service.title)}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">{service.title}</h3>
            {service.subtitle && (
              <p className="text-xs text-red-600 font-semibold mt-0.5 leading-tight">{service.subtitle}</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-3" />

        {/* Description */}
        {service.description && (
          <p className={`text-gray-500 text-sm leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
            {service.description}
          </p>
        )}

        {/* Features — only when expanded */}
        {hasFeatures && expanded && (
          <ul className="mt-4 space-y-2">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Extra image thumbnails — only when expanded */}
        {service.images?.length > 1 && expanded && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {service.images.slice(1).map((img, i) => (
              <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100">
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* Read more toggle — always at bottom */}
        {canExpand && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-4 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors self-start border-b border-red-200 hover:border-red-500 pb-0.5"
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Read more</>
            }
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
const GeneralConstruction = () => {
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
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">What We Offer</span>
        <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">The services we provide</h2>
        <p className="text-gray-500 leading-relaxed max-w-3xl text-sm md:text-base">
          We deliver heavy industrial setups, equipment alignments, and field maintenance with over 7 years of specialized expertise.
        </p>
      </div>

      {/* Grid — items-stretch ensures equal height rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </section>
  );
};

export default GeneralConstruction;
