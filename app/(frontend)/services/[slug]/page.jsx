"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Phone, Mail, ArrowRight, Loader2, HardHat } from "lucide-react";
import Contact from "@/homepage/Contact";
import { apiFetch } from "@/lib/api";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      apiFetch(`/services/${slug}`).catch(() => null),
      apiFetch("/services").catch(() => ({ data: [] })),
    ]).then(([svc, all]) => {
      if (!svc || !svc.success) { setNotFound(true); setLoading(false); return; }
      setService(svc.data);
      const others = (all.data || []).filter(s => s.slug !== slug).slice(0, 3);
      setRelated(others);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-sans">
      <HardHat className="w-16 h-16 text-red-200" />
      <h1 className="text-2xl font-bold text-gray-800">Service not found</h1>
      <Link href="/services" className="text-red-600 font-semibold hover:underline flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Link>
    </div>
  );

  const coverImage = service.images?.[0] || service.image || null;
  const galleryImages = service.images?.slice(1) || [];

  return (
    <div className="font-sans">
      {/* Breadcrumb */}
      <div className="bg-gray-900 text-white py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-red-400 transition">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-red-400 transition">Services</Link>
          <span>/</span>
          <span className="text-white">{service.title}</span>
        </div>
      </div>

      {/* Hero Image */}
      {coverImage ? (
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <Image src={coverImage} alt={service.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 py-8 max-w-7xl mx-auto">
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Our Services</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 leading-tight">{service.title}</h1>
            {service.subtitle && <p className="text-red-300 font-semibold mt-2">{service.subtitle}</p>}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Our Services</span>
            <h1 className="text-4xl font-extrabold text-white mt-1">{service.title}</h1>
            {service.subtitle && <p className="text-red-400 font-semibold mt-2">{service.subtitle}</p>}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {service.description && (
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">{service.description}</p>
            )}

            {service.features?.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-red-600 rounded-full inline-block" />
                  Key Highlights
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {galleryImages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-red-600 rounded-full inline-block" />
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <Image src={img} alt={`${service.title} ${i + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to all services
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Book This Service</h3>
              <p className="text-red-100 text-sm leading-relaxed mb-5">
                Get a free quote for {service.title}. Our team responds within 24 hours.
              </p>
              <Link href="/contact" className="block text-center bg-white text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-red-50 transition-colors text-sm">
                Get a Free Quote →
              </Link>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Quick Contact</h3>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <Phone className="w-4 h-4 text-red-600" /> +91 98765 43210
              </a>
              <a href="mailto:info@aspcranes.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <Mail className="w-4 h-4 text-red-600" /> info@aspcranes.com
              </a>
            </div>

            {related.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Other Services</h3>
                <div className="space-y-3">
                  {related.map((s) => (
                    <Link key={s._id} href={`/services/${s.slug}`} className="flex items-center gap-3 group">
                      {(s.images?.[0] || s.image) && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={s.images?.[0] || s.image} alt={s.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">{s.title}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-600 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Contact />
    </div>
  );
}
