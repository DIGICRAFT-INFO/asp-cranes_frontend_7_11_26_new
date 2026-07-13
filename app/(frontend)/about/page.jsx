import Breadcrumbs from "@/components/Breadcrumbs";
import React from "react";
import About from "./About";
import Projects from "./Projects";
import Services from "./Services";
import Contact from "@/homepage/Contact";
import WhoWeAre from "@/homepage/WhoWeAre";
import banner from "@/public/about/banner.jpg"

export default function page() {
  return (
    <div>
      <Breadcrumbs
        breadcrumbImage={banner}
        title="About Us"
        breadcrumbLabel="About"
        parentPages={[
          { label: "Home", href: "/" },
        ]}
      />
      <About/>
      <WhoWeAre/>
      <Services/>
      {/* <Projects/> */}
      <Contact/>
    </div>
  );
}
