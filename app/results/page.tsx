"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaExternalLinkAlt,
  FaQuoteLeft,
  FaStar,
  FaArrowUp,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

interface CaseStudy {
  id: number;
  title: string;
  client: string;
  industry: string;
  duration: string;
  imageUrl: string;
  description: string;
  challenge: string;
  solution: string;
  technologies: string[];
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  testimonial: {
    content: string;
    author: string;
    position: string;
    rating: number;
  };
  link?: string;
}

type FilterCategory = "all" | "web" | "mobile" | "ecommerce" | "enterprise";

export default function ResultsPage() {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: "E-Commerce Platform Transformation",
      client: "Fashion Boutique Co.",
      industry: "Retail",
      duration: "3 months",
      imageUrl: "/api/placeholder/800/600",
      description:
        "Complete redesign and development of an e-commerce platform resulting in significant sales increase.",
      challenge:
        "The client's outdated website was losing customers due to poor user experience and lack of mobile responsiveness.",
      solution:
        "We built a modern, responsive e-commerce platform with advanced filtering, personalized recommendations, and streamlined checkout process.",
      technologies: ["Next.js", "Shopify API", "Stripe", "AWS", "React"],
      results: [
        {
          metric: "Sales Increase",
          value: "300%",
          description: "Year-over-year growth",
        },
        {
          metric: "Load Time",
          value: "50%",
          description: "Faster page loading",
        },
        {
          metric: "Conversion Rate",
          value: "2.5x",
          description: "Improved checkout flow",
        },
      ],
      testimonial: {
        content:
          "The new platform exceeded our expectations. Our online sales have tripled, and customer satisfaction is at an all-time high.",
        author: "Sarah Johnson",
        position: "CEO, Fashion Boutique Co.",
        rating: 5,
      },
      link: "https://example.com",
    },
    {
      id: 2,
      title: "Mobile Banking Application",
      client: "FinTech Innovations",
      industry: "Finance",
      duration: "6 months",
      imageUrl: "/api/placeholder/800/600",
      description:
        "Secure mobile banking app with biometric authentication and real-time transactions.",
      challenge:
        "Creating a secure, user-friendly mobile banking solution that meets strict regulatory requirements.",
      solution:
        "Developed native iOS and Android apps with advanced security features, intuitive UI, and seamless integration with existing banking systems.",
      technologies: [
        "React Native",
        "Node.js",
        "PostgreSQL",
        "AWS",
        "Plaid API",
      ],
      results: [
        {
          metric: "User Adoption",
          value: "100k+",
          description: "Active users in 6 months",
        },
        {
          metric: "App Rating",
          value: "4.8★",
          description: "App Store rating",
        },
        {
          metric: "Transaction Volume",
          value: "$50M+",
          description: "Processed monthly",
        },
      ],
      testimonial: {
        content:
          "The team delivered a world-class mobile banking solution that our customers love. Security and usability are perfectly balanced.",
        author: "Michael Chen",
        position: "CTO, FinTech Innovations",
        rating: 5,
      },
    },
    {
      id: 3,
      title: "SaaS Analytics Dashboard",
      client: "DataMetrics Pro",
      industry: "Technology",
      duration: "4 months",
      imageUrl: "/api/placeholder/800/600",
      description:
        "Real-time analytics dashboard for business intelligence and data visualization.",
      challenge:
        "Processing and visualizing large datasets in real-time while maintaining performance.",
      solution:
        "Built a scalable dashboard with real-time data processing, customizable widgets, and automated reporting features.",
      technologies: [
        "React",
        "D3.js",
        "Python",
        "Redis",
        "PostgreSQL",
        "WebSockets",
      ],
      results: [
        {
          metric: "Data Processing",
          value: "10x",
          description: "Faster analytics",
        },
        {
          metric: "User Productivity",
          value: "60%",
          description: "Time saved on reports",
        },
        {
          metric: "Customer Retention",
          value: "95%",
          description: "Annual retention rate",
        },
      ],
      testimonial: {
        content:
          "This dashboard transformed how our clients interact with their data. The real-time insights have been game-changing.",
        author: "Emily Rodriguez",
        position: "Product Manager, DataMetrics Pro",
        rating: 5,
      },
    },
    {
      id: 4,
      title: "Healthcare Patient Portal",
      client: "MedCare Solutions",
      industry: "Healthcare",
      duration: "5 months",
      imageUrl: "/api/placeholder/800/600",
      description:
        "HIPAA-compliant patient portal with telemedicine capabilities.",
      challenge:
        "Creating a secure, compliant platform that simplifies patient-provider communication.",
      solution:
        "Developed a comprehensive portal with appointment scheduling, medical records access, and video consultation features.",
      technologies: [
        "Next.js",
        "Node.js",
        "MongoDB",
        "Twilio",
        "AWS HealthLake",
      ],
      results: [
        {
          metric: "Patient Engagement",
          value: "85%",
          description: "Active portal users",
        },
        {
          metric: "Appointment No-shows",
          value: "-40%",
          description: "Reduction in missed appointments",
        },
        {
          metric: "Patient Satisfaction",
          value: "4.9★",
          description: "Average rating",
        },
      ],
      testimonial: {
        content:
          "The patient portal has revolutionized our practice. Patients love the convenience, and our staff efficiency has improved dramatically.",
        author: "Dr. James Wilson",
        position: "Medical Director, MedCare Solutions",
        rating: 5,
      },
    },
  ];

  const filteredStudies =
    filter === "all"
      ? caseStudies
      : caseStudies.filter((study) => {
          if (filter === "web")
            return (
              study.technologies.includes("Next.js") ||
              study.technologies.includes("React")
            );
          if (filter === "mobile")
            return study.technologies.includes("React Native");
          if (filter === "ecommerce") return study.industry === "Retail";
          if (filter === "enterprise")
            return study.duration.includes("6") || study.duration.includes("5");
          return true;
        });

  const stats = [
    { icon: FaUsers, value: "100+", label: "Happy Clients" },
    { icon: FaChartLine, value: "150+", label: "Projects Completed" },
    { icon: FaStar, value: "4.9", label: "Average Rating" },
    { icon: FaArrowUp, value: "200%", label: "Avg. ROI Increase" },
  ];

  const filterButtons: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "All Projects" },
    { value: "web", label: "Web Development" },
    { value: "mobile", label: "Mobile Apps" },
    { value: "ecommerce", label: "E-Commerce" },
    { value: "enterprise", label: "Enterprise" },
  ];

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4">Our Success Stories</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Real results from real clients. Discover how we&#39;ve helped
              businesses transform their digital presence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="text-4xl text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  filter === btn.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-64 relative bg-gray-200">
                  <Image
                    src={study.imageUrl}
                    alt={study.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {study.industry}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{study.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {study.client} • {study.duration}
                  </p>
                  <p className="text-gray-700 mb-6">{study.description}</p>

                  {/* Key Results */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.value}
                        </div>
                        <div className="text-xs text-gray-600">
                          {result.metric}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                    {study.technologies.length > 4 && (
                      <span className="text-gray-500 text-sm">
                        +{study.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Testimonial */}
                  <div className="border-t pt-6">
                    <div className="flex items-start mb-3">
                      <FaQuoteLeft className="text-gray-300 mr-2 mt-1" />
                      <p className="text-gray-600 italic">
                        {study.testimonial.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {study.testimonial.author}
                        </p>
                        <p className="text-sm text-gray-600">
                          {study.testimonial.position}
                        </p>
                      </div>
                      <div className="flex">
                        {[...Array(study.testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setSelectedStudy(study)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                    {study.link && (
                      <a
                        href={study.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        Visit Site <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="text-xl mb-8">
            Let&#39;s work together to achieve remarkable results for your
            business
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/consultation"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Your Project
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      {/* Modal for Selected Study */}
      {selectedStudy && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStudy(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <Image
                src={selectedStudy.imageUrl}
                alt={selectedStudy.title}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedStudy(null)}
                className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold mb-4">{selectedStudy.title}</h2>
              <div className="flex gap-4 mb-6">
                <span className="text-gray-600">
                  Client: {selectedStudy.client}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600">
                  Industry: {selectedStudy.industry}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600">
                  Duration: {selectedStudy.duration}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">The Challenge</h3>
                  <p className="text-gray-700">{selectedStudy.challenge}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Our Solution</h3>
                  <p className="text-gray-700">{selectedStudy.solution}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudy.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Results</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {selectedStudy.results.map((result, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-lg text-center"
                      >
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {result.value}
                        </div>
                        <div className="font-semibold">{result.metric}</div>
                        <div className="text-sm text-gray-600">
                          {result.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <FaQuoteLeft className="text-blue-300 text-2xl mb-3" />
                  <p className="text-gray-700 italic mb-4">
                    {selectedStudy.testimonial.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {selectedStudy.testimonial.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedStudy.testimonial.position}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(selectedStudy.testimonial.rating)].map(
                        (_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                {selectedStudy.link && (
                  <a
                    href={selectedStudy.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                  >
                    Visit Live Site
                  </a>
                )}
                <Link
                  href="/consultation"
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition text-center"
                >
                  Start Similar Project
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
