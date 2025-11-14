"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaLaptopCode,
  FaMobile,
  FaShoppingCart,
  FaCloud,
  FaDatabase,
  FaCogs,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
  FaCheck,
} from "react-icons/fa";

interface Service {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  startingPrice: string;
}

interface Process {
  step: number;
  title: string;
  description: string;
}

export default function ServicesPage() {
  const services: Service[] = [
    {
      id: "web",
      icon: FaLaptopCode,
      title: "Web Development",
      description:
        "Create powerful, scalable web applications tailored to your business needs. From simple websites to complex enterprise solutions.",
      features: [
        "Custom web applications",
        "Responsive design",
        "Progressive Web Apps (PWA)",
        "Single Page Applications (SPA)",
        "Content Management Systems",
        "SEO optimization",
      ],
      technologies: [
        "React",
        "Next.js",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "MongoDB",
      ],
      startingPrice: "$999",
    },
    {
      id: "mobile",
      icon: FaMobile,
      title: "Mobile Development",
      description:
        "Build native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.",
      features: [
        "Native iOS & Android apps",
        "Cross-platform development",
        "App Store optimization",
        "Push notifications",
        "Offline functionality",
        "In-app purchases",
      ],
      technologies: [
        "React Native",
        "Flutter",
        "Swift",
        "Kotlin",
        "Firebase",
        "Expo",
      ],
      startingPrice: "$2,499",
    },
    {
      id: "ecommerce",
      icon: FaShoppingCart,
      title: "E-Commerce Solutions",
      description:
        "Launch and scale your online store with our comprehensive e-commerce solutions, complete with payment processing and inventory management.",
      features: [
        "Custom online stores",
        "Payment gateway integration",
        "Inventory management",
        "Order tracking",
        "Customer accounts",
        "Analytics dashboard",
      ],
      technologies: [
        "Shopify",
        "WooCommerce",
        "Stripe",
        "PayPal",
        "Next.js Commerce",
      ],
      startingPrice: "$1,999",
    },
    {
      id: "cloud",
      icon: FaCloud,
      title: "Cloud Services",
      description:
        "Leverage the power of cloud computing to scale your infrastructure, improve reliability, and reduce costs.",
      features: [
        "Cloud migration",
        "Infrastructure setup",
        "Auto-scaling",
        "Load balancing",
        "Backup & disaster recovery",
        "DevOps automation",
      ],
      technologies: [
        "AWS",
        "Google Cloud",
        "Azure",
        "Docker",
        "Kubernetes",
        "Terraform",
      ],
      startingPrice: "$1,499",
    },
    {
      id: "database",
      icon: FaDatabase,
      title: "Database Design",
      description:
        "Design and optimize database architectures that ensure data integrity, security, and lightning-fast performance.",
      features: [
        "Database architecture",
        "Performance optimization",
        "Data migration",
        "Backup strategies",
        "Real-time sync",
        "Data analytics",
      ],
      technologies: [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Redis",
        "Elasticsearch",
        "GraphQL",
      ],
      startingPrice: "$799",
    },
    {
      id: "api",
      icon: FaCogs,
      title: "API Development",
      description:
        "Build robust, scalable APIs that power your applications and enable seamless integrations with third-party services.",
      features: [
        "RESTful APIs",
        "GraphQL APIs",
        "API documentation",
        "Authentication & authorization",
        "Rate limiting",
        "Webhook integration",
      ],
      technologies: [
        "Node.js",
        "Express",
        "FastAPI",
        "Django",
        "GraphQL",
        "Swagger",
      ],
      startingPrice: "$899",
    },
    {
      id: "analytics",
      icon: FaChartLine,
      title: "Analytics & BI",
      description:
        "Transform your data into actionable insights with custom analytics solutions and business intelligence tools.",
      features: [
        "Custom dashboards",
        "Data visualization",
        "Real-time analytics",
        "Predictive analytics",
        "Report generation",
        "KPI tracking",
      ],
      technologies: [
        "Tableau",
        "Power BI",
        "Google Analytics",
        "Mixpanel",
        "D3.js",
      ],
      startingPrice: "$1,299",
    },
    {
      id: "security",
      icon: FaShieldAlt,
      title: "Security & Compliance",
      description:
        "Protect your applications and data with enterprise-grade security measures and compliance implementations.",
      features: [
        "Security audits",
        "Penetration testing",
        "GDPR compliance",
        "SSL certificates",
        "Two-factor authentication",
        "Encryption",
      ],
      technologies: ["OAuth", "JWT", "SSL/TLS", "OWASP", "Cloudflare", "Auth0"],
      startingPrice: "$999",
    },
  ];

  const process: Process[] = [
    {
      step: 1,
      title: "Discovery & Planning",
      description:
        "We start by understanding your business goals, target audience, and project requirements.",
    },
    {
      step: 2,
      title: "Design & Prototyping",
      description:
        "Our team creates wireframes and prototypes to visualize the solution before development.",
    },
    {
      step: 3,
      title: "Development",
      description:
        "We build your solution using agile methodology, ensuring quality and timely delivery.",
    },
    {
      step: 4,
      title: "Testing & QA",
      description:
        "Rigorous testing ensures your application is bug-free and performs optimally.",
    },
    {
      step: 5,
      title: "Deployment",
      description:
        "We deploy your application to production with zero downtime and full monitoring.",
    },
    {
      step: 6,
      title: "Support & Maintenance",
      description:
        "Ongoing support and updates keep your application secure and running smoothly.",
    },
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
            <h1 className="text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Comprehensive software development services to help your business
              thrive in the digital age
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition"
              >
                <div className="flex items-start mb-4">
                  <service.icon className="text-4xl text-blue-600 mr-4 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                  <div>
                    <span className="text-gray-500">Starting from</span>
                    <div className="text-2xl font-bold text-blue-600">
                      {service.startingPrice}
                    </div>
                  </div>
                  <Link
                    href="/consultation"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Get Quote
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Development Process</h2>
            <p className="text-xl text-gray-600">
              A proven methodology that ensures project success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-300">
                    <FaRocket className="text-2xl rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-gray-600">
              We deliver more than just code - we deliver solutions that drive
              results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Team",
                description:
                  "Skilled developers with years of experience in cutting-edge technologies",
              },
              {
                title: "Agile Approach",
                description:
                  "Flexible development process that adapts to your changing needs",
              },
              {
                title: "Quality Assurance",
                description:
                  "Rigorous testing ensures bug-free, high-performance applications",
              },
              {
                title: "Transparent Communication",
                description:
                  "Regular updates and clear communication throughout the project",
              },
              {
                title: "On-Time Delivery",
                description:
                  "We respect deadlines and deliver projects on schedule",
              },
              {
                title: "Post-Launch Support",
                description:
                  "Comprehensive maintenance and support after deployment",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8">
            Let's discuss how our services can help transform your business
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/consultation"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Book Free Consultation
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
