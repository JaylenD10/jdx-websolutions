"use client";
import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaMobile,
  FaShoppingCart,
  FaCloud,
  FaDatabase,
  FaCogs,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface Service {
  icon: IconType;
  title: string;
  description: string;
  features: string[];
}

const Services: React.FC = () => {
  const services: Service[] = [
    {
      icon: FaLaptopCode,
      title: "Web Development",
      description: "Custom web applications built with modern technologies",
      features: ["React/Next.js", "Node.js", "Responsive Design"],
    },
    {
      icon: FaMobile,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications",
      features: ["iOS", "Android", "React Native"],
    },
    {
      icon: FaShoppingCart,
      title: "E-Commerce Solutions",
      description: "Complete online store setup and customization",
      features: ["Payment Integration", "Inventory Management", "Analytics"],
    },
    {
      icon: FaCloud,
      title: "Cloud Services",
      description: "Cloud infrastructure and deployment solutions",
      features: ["AWS", "Google Cloud", "Azure"],
    },
    {
      icon: FaDatabase,
      title: "Database Design",
      description: "Efficient database architecture and optimization",
      features: ["SQL", "NoSQL", "Data Migration"],
    },
    {
      icon: FaCogs,
      title: "API Development",
      description: "RESTful and GraphQL API development",
      features: ["Integration", "Documentation", "Testing"],
    },
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600">
            Choose the perfect solution for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <service.icon className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="text-sm text-gray-500">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="mb-1">
                    • {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
