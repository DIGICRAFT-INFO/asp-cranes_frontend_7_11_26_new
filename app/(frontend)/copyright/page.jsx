import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import banner from "@/public/about/banner.jpg";

export const metadata = {
  title: "Copyright Notice | ASP Cranes",
  description: "Copyright, intellectual property rights, and terms of use for the ASP Cranes website.",
};

export default function CopyrightPage() {
  const year = new Date().getFullYear();

  return (
    <div>
      <Breadcrumbs
        breadcrumbImage={banner}
        title="Copyright Notice"
        breadcrumbLabel="Copyright"
        parentPages={[{ label: "Home", href: "/" }]}
      />

      <section className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Legal</p>
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">
            Copyright &amp; Intellectual Property Notice
          </h1>
          <p className="text-gray-500 text-sm">Effective Year: {year} &nbsp;|&nbsp; ASP Cranes — Aadishakti Projects, Raipur, India</p>
          <div className="mt-4 h-1 w-16 bg-red-600 rounded-full" />
        </div>

        {/* Sections */}
        <div className="space-y-10">

          {/* 1 */}
          <div className="border-l-4 border-red-600 pl-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Ownership of Content</h2>
            <p className="text-gray-600 leading-relaxed">
              All content published on this website — including but not limited to text, graphics, photographs, 
              videos, logos, icons, data compilations, and software — is the exclusive intellectual property of 
              <strong> ASP Cranes (Aadishakti Projects)</strong> or its licensed content providers. 
              This content is protected under applicable Indian and international copyright laws, 
              including the <em>Copyright Act, 1957</em> (India) and the Berne Convention.
            </p>
          </div>

          {/* 2 */}
          <div className="border-l-4 border-red-600 pl-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Trademarks &amp; Brand Identity</h2>
            <p className="text-gray-600 leading-relaxed">
              The ASP Cranes name, logo, tagline, and all associated brand identifiers are trademarks 
              of Aadishakti Projects. Unauthorized use, reproduction, modification, or distribution 
              of any trademark or brand material — in whole or in part — without prior written 
              consent from ASP Cranes is strictly prohibited and may result in legal action.
            </p>
          </div>

          {/* 3 */}
          <div className="border-l-4 border-red-600 pl-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Permitted Use</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You are permitted to access and view the content on this website for personal, 
              non-commercial informational purposes only. Permitted use includes:
            </p>
            <ul className="list-none space-y-2 text-gray-600">
              {[
                "Printing or saving single copies of web pages for personal reference",
                "Sharing links to publicly accessible pages of this website",
                "Citing content with full attribution to ASP Cranes and a link to the source",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4 */}
          <div className="border-l-4 border-red-600 pl-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Prohibited Use</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              The following actions are expressly prohibited without written authorization from ASP Cranes:
            </p>
            <ul className="list-none space-y-2 text-gray-600">
              {[
                "Reproducing, duplicating, or copying content for commercial purposes",
                "Modifying, adapting, or creating derivative works from website content",
                "Selling, reselling, or exploiting any portion of the website or its content",
                "Scraping, crawling, or data-mining the website using automated tools",
                "Using the ASP Cranes brand, name, or logo in any promotional material without consent",
                "Framing or mirroring any content on another website without permission",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5 */}
          <div className="border-l-4 border-red-600 pl-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Content</h2>
            <p className="text-gray-600 leading-relaxed">
              Certain images, icons, or media used on this website may be licensed from third-party 
              providers such as Unsplash or other royalty-free sources. These materials are used 
              in compliance with their respective licenses. ASP Cranes does not claim ownership of 
              such third-party assets.
            </p>
          </div>

          {/* 6 */}
          <div className="border-l-4 border-red-600 pl-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Digital Millennium Copyright Act (DMCA)</h2>
            <p className="text-gray-600 leading-relaxed">
              If you believe that any content on this website infringes upon your copyright, 
              please notify us in writing with the following information: a description of the 
              copyrighted work, the URL where the infringing content appears, your contact 
              information, and a statement of good faith belief. We will investigate and 
              respond promptly to all valid claims.
            </p>
          </div>

          {/* 7 */}
          <div className="border-l-4 border-red-600 pl-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed">
              The content on this website is provided on an "as is" basis without warranties of any kind, 
              either express or implied. ASP Cranes makes no representations regarding the accuracy, 
              completeness, or timeliness of information on this site and reserves the right to 
              modify or remove content at any time without notice.
            </p>
          </div>

          {/* 8 */}
          <div className="border-l-4 border-red-600 pl-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              This Copyright Notice and any disputes arising from the use of this website shall 
              be governed by and construed in accordance with the laws of India. Any legal 
              proceedings shall be subject to the exclusive jurisdiction of the courts in 
              <strong> Raipur, Chhattisgarh, India</strong>.
            </p>
          </div>

          {/* 9 */}
          <div className="border-l-4 border-red-600 pl-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact for Permissions</h2>
            <p className="text-gray-600 leading-relaxed">
              For licensing inquiries, permission requests, or copyright-related concerns, 
              please contact us directly.
            </p>
            <div className="mt-4">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-md font-semibold text-sm hover:bg-red-700 transition">
                Contact ASP Cranes
              </Link>
            </div>
          </div>

        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm text-center">
            &copy; {year} ASP Cranes (Aadishakti Projects). All Rights Reserved. &nbsp;|&nbsp;{" "}
            <Link href="/privacy-policy" className="text-red-600 hover:underline">Privacy Policy</Link>
            {" "}&nbsp;|&nbsp;{" "}
            <Link href="/sitemap" className="text-red-600 hover:underline">Sitemap</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
