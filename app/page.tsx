"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Services from "@/components/Services";
import PricingSection from "@/components/PricingSection";
import ResultsSection from "@/components/ResultsSection";
import { FaRocket, FaCode, FaMobile, FaCloud } from "react-icons/fa";
import { IconType } from "react-icons";

interface Feature {
  icon: IconType;
  title: string;
  desc: string;
}

export default function Home() {
  const features: Feature[] = [
    { icon: FaRocket, title: "Fast Delivery", desc: "Quick turnaround times" },
    { icon: FaCode, title: "Clean Code", desc: "Maintainable solutions" },
    { icon: FaMobile, title: "Responsive", desc: "Works on all devices" },
    { icon: FaCloud, title: "Cloud Ready", desc: "Scalable infrastructure" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transform Your Ideas Into Reality
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Professional software development services tailored to your
              business needs
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/consultation"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Book Consultation
              </Link>
              <Link
                href="#services"
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <feature.icon className="text-4xl text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Pricing Section */}
      <PricingSection />

      {/* Results Section */}
      <ResultsSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8">
            Let&#39;s discuss how we can help your business grow
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
