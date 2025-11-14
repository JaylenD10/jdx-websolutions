"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  results: string[];
}

const ResultsSection: React.FC = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Web Development",
      description: "Complete online store with payment integration",
      imageUrl: "/api/placeholder/600/400",
      results: [
        "300% increase in sales",
        "50% faster load time",
        "Mobile-first design",
      ],
    },
    {
      id: 2,
      title: "Mobile Banking App",
      category: "Mobile Development",
      description: "Secure banking application for iOS and Android",
      imageUrl: "/api/placeholder/600/400",
      results: ["100k+ downloads", "4.8 star rating", "99.9% uptime"],
    },
    {
      id: 3,
      title: "SaaS Dashboard",
      category: "Web Application",
      description: "Analytics dashboard for business intelligence",
      imageUrl: "/api/placeholder/600/400",
      results: [
        "Real-time analytics",
        "60% productivity boost",
        "Automated reporting",
      ],
    },
  ];

  return (
    <section id="results" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Results</h2>
          <p className="text-xl text-gray-600">
            Success stories from our clients
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-blue-600 text-sm font-semibold">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Key Results:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {project.results.map((result, idx) => (
                      <li key={idx}>• {result}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
