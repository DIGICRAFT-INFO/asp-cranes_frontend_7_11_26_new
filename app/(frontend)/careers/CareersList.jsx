"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Briefcase, Clock, Loader2, X, Send, CheckCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

// ─── Apply Modal ──────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverLetter: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.coverLetter) {
      setError("Name, email, and cover letter are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const res = await fetch(`${apiUrl}/career-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId: job._id, ...form }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Submission failed");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">{job.department}</p>
            <h2 className="text-xl font-extrabold text-gray-900">Apply for {job.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition mt-0.5">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-500 mb-6">
              Thank you for applying. We&apos;ve sent a confirmation to your email. Our team will review your application and get back to you soon.
            </p>
            <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Letter / Description <span className="text-red-500">*</span></label>
              <textarea
                value={form.coverLetter}
                onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
                placeholder="Tell us about yourself, your experience, and why you want to join ASP Cranes..."
                required
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Application</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Careers List ─────────────────────────────────────────────────────────────
export default function CareersList() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    let mounted = true;
    apiFetch("/careers")
      .then((json) => { if (mounted) setCareers(json.data || []); })
      .catch(() => mounted && setError(true))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 text-gray-500">
        Couldn&apos;t load job openings right now. Please check back shortly.
      </div>
    );
  }

  if (careers.length === 0) {
    return (
      <div className="text-center py-24 max-w-xl mx-auto">
        <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">No open positions right now</h3>
        <p className="text-gray-500 mb-6">
          We&apos;re not actively hiring at the moment, but we&apos;re always glad to hear from
          skilled operators, technicians, and engineers.
        </p>
        <Link href="/contact"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition">
          Get In Touch
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid gap-6">
          {careers.map((job) => (
            <div key={job._id}
              className="border border-gray-200 rounded-2xl p-6 md:p-8 hover:border-red-300 hover:shadow-lg transition-all bg-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-widest">{job.department}</span>
                  <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.employmentType}</span>
                    {job.experience && (
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.experience}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setApplyJob(job)}
                  className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg text-center transition cursor-pointer">
                  Apply Now
                </button>
              </div>
              {job.description && <p className="text-gray-600 mt-5 leading-relaxed">{job.description}</p>}
              {job.requirements?.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Requirements</h4>
                  <ul className="space-y-1.5">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </>
  );
}
