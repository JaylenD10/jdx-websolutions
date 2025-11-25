"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaCheck,
  FaTimes,
  FaRocket,
  FaStar,
  FaCrown,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface PricingFeature {
  name: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

interface FAQ {
  question: string;
  answer: string;
}

type BillingPeriod = "monthly" | "yearly";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const features: PricingFeature[] = [
    {
      name: "Number of Projects",
      starter: "1",
      professional: "5",
      enterprise: "Unlimited",
    },
    {
      name: "Pages/Screens",
      starter: "Up to 5",
      professional: "Up to 15",
      enterprise: "Unlimited",
    },
    {
      name: "Custom Design",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      name: "Responsive Design",
      starter: true,
      professional: true,
      enterprise: true,
    },
    {
      name: "SEO Optimization",
      starter: "Basic",
      professional: "Advanced",
      enterprise: "Premium",
    },
    {
      name: "CMS Integration",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      name: "E-Commerce Features",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      name: "API Integration",
      starter: "Basic",
      professional: "Advanced",
      enterprise: "Custom",
    },
    {
      name: "Database Setup",
      starter: true,
      professional: true,
      enterprise: true,
    },
    {
      name: "Cloud Deployment",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      name: "SSL Certificate",
      starter: true,
      professional: true,
      enterprise: true,
    },
    {
      name: "Analytics Setup",
      starter: "Basic",
      professional: "Advanced",
      enterprise: "Custom",
    },
    {
      name: "Support Period",
      starter: "1 month",
      professional: "3 months",
      enterprise: "12 months",
    },
    {
      name: "Revisions",
      starter: "2",
      professional: "5",
      enterprise: "Unlimited",
    },
    {
      name: "Priority Support",
      starter: false,
      professional: false,
      enterprise: true,
    },
    {
      name: "Dedicated Manager",
      starter: false,
      professional: false,
      enterprise: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "What's included in the support period?",
      answer:
        "During the support period, we provide bug fixes, minor updates, technical assistance, and help with any issues that arise. This ensures your application runs smoothly after launch.",
    },
    {
      question: "Can I upgrade my plan later?",
      answer:
        "Yes! You can upgrade your plan at any time. We'll calculate the prorated difference and apply it to your upgrade. This flexibility allows your plan to grow with your business needs.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, bank transfers, and for enterprise clients, we can arrange custom payment terms including NET 30/60 invoicing.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 14-day money-back guarantee if you're not satisfied with our services. After development begins, refunds are handled on a case-by-case basis based on work completed.",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "Project timelines vary based on complexity. Starter projects typically take 2-4 weeks, Professional projects 4-8 weeks, and Enterprise projects 8-16+ weeks. We'll provide a detailed timeline during consultation.",
    },
    {
      question: "What if I need features not listed in any plan?",
      answer:
        "We offer custom solutions! Contact us for a personalized quote. Our Enterprise plan is fully customizable to meet your specific requirements.",
    },
  ];

  const monthlyPrices = {
    starter: 999,
    professional: 2999,
    enterprise: "Custom",
  };

  const yearlyPrices = {
    starter: 899,
    professional: 2699,
    enterprise: "Custom",
  };

  const currentPrices =
    billingPeriod === "monthly" ? monthlyPrices : yearlyPrices;

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4">Transparent Pricing</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your business. All plans include our
              core features and exceptional support.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-6 py-2 rounded-md transition ${
                  billingPeriod === "monthly"
                    ? "bg-white text-blue-600 font-semibold"
                    : "text-white hover:text-gray-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-6 py-2 rounded-md transition ${
                  billingPeriod === "yearly"
                    ? "bg-white text-blue-600 font-semibold"
                    : "text-white hover:text-gray-200"
                }`}
              >
                Yearly (Save 10%)
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 -mt-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <FaRocket className="text-4xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <p className="text-gray-600 mb-4">
                  Perfect for small projects and startups
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    ${currentPrices.starter}
                  </span>
                  <span className="text-gray-600">
                    /{billingPeriod === "monthly" ? "project" : "project/yr"}
                  </span>
                </div>
                <Link
                  href="/consultation"
                  className="w-full block bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  Get Started
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Up to 5 pages</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Responsive design</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Basic SEO</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Contact form</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>1 month support</span>
                </div>
              </div>
            </motion.div>

            {/* Professional Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-xl p-8 ring-2 ring-blue-600 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-8">
                <FaStar className="text-4xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-gray-600 mb-4">For growing businesses</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-blue-600">
                    ${currentPrices.professional}
                  </span>
                  <span className="text-gray-600">
                    /{billingPeriod === "monthly" ? "project" : "project/yr"}
                  </span>
                </div>
                <Link
                  href="/consultation"
                  className="w-full block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Up to 15 pages</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Custom design</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Advanced SEO</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>CMS integration</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>E-commerce ready</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>3 months support</span>
                </div>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <FaCrown className="text-4xl text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-4">
                  Tailored solutions for large organizations
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">Custom</span>
                  <span className="text-gray-600">/quote</span>
                </div>
                <Link
                  href="/consultation"
                  className="w-full block bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Contact Sales
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Unlimited pages</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Custom features</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Dedicated manager</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>SLA guarantee</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>12 months support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Detailed Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4">Features</th>
                  <th className="text-center p-4">Starter</th>
                  <th className="text-center p-4 bg-blue-50">Professional</th>
                  <th className="text-center p-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{feature.name}</td>
                    <td className="text-center p-4">
                      {typeof feature.starter === "boolean" ? (
                        feature.starter ? (
                          <FaCheck className="text-green-500 mx-auto" />
                        ) : (
                          <FaTimes className="text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{feature.starter}</span>
                      )}
                    </td>
                    <td className="text-center p-4 bg-blue-50">
                      {typeof feature.professional === "boolean" ? (
                        feature.professional ? (
                          <FaCheck className="text-green-500 mx-auto" />
                        ) : (
                          <FaTimes className="text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">
                          {feature.professional}
                        </span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof feature.enterprise === "boolean" ? (
                        feature.enterprise ? (
                          <FaCheck className="text-green-500 mx-auto" />
                        ) : (
                          <FaTimes className="text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">
                          {feature.enterprise}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition flex justify-between items-center"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  {openFAQ === index ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-gray-50 p-6 rounded-b-lg -mt-2"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full mb-6">
                <FaCheck className="text-3xl" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                14-Day Money Back Guarantee
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We&#39;re confident in our ability to deliver exceptional
                results. If you&#39;re not completely satisfied with our
                services within the first 14 days, we&#39;ll provide a full
                refund—no questions asked.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-2">Risk-Free Trial</h3>
                  <p className="text-gray-600 text-sm">
                    Start your project with complete peace of mind
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-2">Quality Assurance</h3>
                  <p className="text-gray-600 text-sm">
                    We deliver excellence in every project we undertake
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-2">Customer Satisfaction</h3>
                  <p className="text-gray-600 text-sm">
                    Your success is our top priority
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Every business is unique. If our standard plans don&#39;t meet
              your needs, let&#39;s create a custom package that&#39;s perfect
              for you.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/consultation"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Schedule Consultation
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
