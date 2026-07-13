import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Phone, Mail, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Contact from "@/homepage/Contact";
import hero1 from "@/public/homepage/hero1.jpg";

// Server component: NEXT_PUBLIC_ vars are available at build time when set in Vercel
// Set NEXT_PUBLIC_API_URL in Vercel dashboard → Project Settings → Environment Variables
const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, '');

async function getService(slug) {
  try {
    const res = await fetch(`${API}/services/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

async function getAllServices() {
  try {
    const res = await fetch(`${API}/services`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const service = await getService(params.slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} | ASP Cranes`,
    description: service.description?.slice(0, 155) || service.subtitle || "",
  };
}

export default async function ServiceDetailPage({ params }) {
  const [service, allServices] = await Promise.all([
    getService(params.slug),
    getAllServices(),
  ]);

  if (!service) notFound();

  const coverImage = service.images?.[0] || service.image || null;
  const galleryImages = service.images?.slice(1) || [];
  const related = allServices.filter(s => s._id !== service._id && s.slug !== params.slug).slice(0, 3);

  return (
    <div className="font-sans">
      {/* Breadcrumb */}
      <Breadcrumbs
        breadcrumbImage={coverImage ? null : hero1}
        breadcrumbImageSrc={coverImage || null}
        title={service.title}
        breadcrumbLabel={service.title}
        parentPages={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
      />

      {/* Hero image */}
      {coverImage && (
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <Image src={coverImage} alt={service.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 py-8 max-w-7xl mx-auto">
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Our Services</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 leading-tight drop-shadow">
              {service.title}
            </h1>
            {service.subtitle && (
              <p className="text-red-300 font-semibold mt-2 text-sm md:text-base">{service.subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Main Content ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title (if no cover image) */}
            {!coverImage && (
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Our Services</span>
                <h1 className="text-4xl font-extrabold text-gray-900 mt-1">{service.title}</h1>
                {service.subtitle && <p className="text-red-600 font-semibold mt-2">{service.subtitle}</p>}
              </div>
            )}

            {/* Description */}
            {service.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">{service.description}</p>
              </div>
            )}

            {/* Features / Technical Checklist */}
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

            {/* Image Gallery */}
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

            {/* Back link */}
            <Link href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to all services
            </Link>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* CTA Card */}
            <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Book This Service</h3>
              <p className="text-red-100 text-sm leading-relaxed mb-5">
                Get a free quote for {service.title}. Our team will respond within 24 hours.
              </p>
              <Link href="/contact"
                className="block text-center bg-white text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-red-50 transition-colors text-sm">
                Get a Free Quote →
              </Link>
            </div>

            {/* Contact quick links */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Quick Contact</h3>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <Phone className="w-4 h-4 text-red-600" /> +91 98765 43210
              </a>
              <a href="mailto:info@aspcranes.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <Mail className="w-4 h-4 text-red-600" /> info@aspcranes.com
              </a>
            </div>

            {/* Related Services */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Other Services</h3>
                <div className="space-y-3">
                  {related.map((s) => (
                    <Link key={s._id} href={`/services/${s.slug}`}
                      className="flex items-center gap-3 group">
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
