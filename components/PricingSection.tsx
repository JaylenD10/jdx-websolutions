"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const PricingSection: React.FC = () => {
  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$999",
      period: "project",
      description: "Perfect for small projects",
      features: [
        "Up to 5 pages",
        "Responsive design",
        "Basic SEO",
        "Contact form",
        "1 month support",
      ],
    },
    {
      name: "Professional",
      price: "$2,999",
      period: "project",
      description: "For growing businesses",
      features: [
        "Up to 15 pages",
        "Custom design",
        "Advanced SEO",
        "CMS integration",
        "Payment integration",
        "3 months support",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "quote",
      description: "Tailored solutions",
      features: [
        "Unlimited pages",
        "Custom features",
        "Priority support",
        "Performance optimization",
        "Security audit",
        "12 months support",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Pricing Plans
          </h2>
          <p className="text-xl text-gray-600">
            Choose the perfect package for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-lg p-8 ${
                plan.highlighted
                  ? "ring-2 ring-blue-600 transform scale-105"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="bg-blue-600 text-white text-center py-2 px-4 rounded-t-lg -mt-8 -mx-8 mb-8">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <FaCheck className="text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/consultation"
                className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
