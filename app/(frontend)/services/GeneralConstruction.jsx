"use client";

import React, { useState, useEffect } from "react";
import { HardHat, Ruler, Construction, Loader2, CheckCircle2, ChevronDown, ChevronUp, Star } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

// ─── Icon mapping by title keywords ──────────────────────────────────────────
const getIcon = (title = "", iconClass = "w-8 h-8 text-orange-600") => {
  const t = title.toLowerCase();
  if (t.includes("shift") || t.includes("load")) return <Construction className={iconClass} />;
  if (t.includes("winch") || t.includes("handl")) return <Ruler className={iconClass} />;
  return <HardHat className={iconClass} />;
};

// ─── Single Service Card ──────────────────────────────────────────────────────
function ServiceCard({ service, index }) {
  const [expanded, setExpanded] = useState(false);
  const hasImage = service.images?.length > 0 || service.image;
  const coverImage = service.images?.[0] || service.image || null;
  const hasFeatures = service.features?.length > 0;
  const hasSubtitle = !!service.subtitle;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Cover Image */}
      {hasImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={coverImage}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          {service.isFeatured && (
            <span className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className="relative flex-shrink-0 mt-0.5">
            <div className="absolute -inset-2 bg-red-100 rounded-full opacity-50 scale-110" />
            <div className="relative">{getIcon(service.title)}</div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-snug">{service.title}</h3>
            {hasSubtitle && (
              <p className="text-xs text-orange-600 font-semibold mt-0.5">{service.subtitle}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p className={`text-gray-500 text-sm leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
            {service.description}
          </p>
        )}

        {/* Features list */}
        {hasFeatures && expanded && (
          <ul className="mt-4 space-y-1.5">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Extra images (thumbnails) when expanded */}
        {service.images?.length > 1 && expanded && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {service.images.slice(1).map((img, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Expand toggle — only if there's more to show */}
        {(hasFeatures || service.description?.length > 120 || service.images?.length > 1) && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-4 flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors self-start"
          >
            {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Read more</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const GeneralConstruction = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/services")
      .then((result) => {
        if (result.success) setServices(result.data);
        else throw new Error("Failed to load");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">
        Error loading services: {error}
      </div>
    );
  }

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">The services we provide</h2>
        <p className="text-gray-500 leading-relaxed max-w-3xl text-sm md:text-base">
          We deliver heavy industrial setups, equipment alignments, and field maintenance with over 7 years of specialized expertise.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={service._id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
};

export default GeneralConstruction;
