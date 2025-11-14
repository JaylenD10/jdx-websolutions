"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaAward, FaUsers, FaProjectDiagram, FaCoffee } from "react-icons/fa";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
}

export default function About() {
  const teamMembers: TeamMember[] = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      bio: "10+ years of experience in software development and business strategy.",
      imageUrl: "/api/placeholder/200/200",
    },
    {
      name: "Jane Smith",
      role: "CTO",
      bio: "Expert in cloud architecture and scalable system design.",
      imageUrl: "/api/placeholder/200/200",
    },
    {
      name: "Mike Johnson",
      role: "Lead Developer",
      bio: "Full-stack developer specializing in React and Node.js.",
      imageUrl: "/api/placeholder/200/200",
    },
    {
      name: "Sarah Williams",
      role: "UI/UX Designer",
      bio: "Creating beautiful and intuitive user experiences.",
      imageUrl: "/api/placeholder/200/200",
    },
  ];

  const stats: Stat[] = [
    { icon: FaProjectDiagram, value: "150+", label: "Projects Completed" },
    { icon: FaUsers, value: "100+", label: "Happy Clients" },
    { icon: FaAward, value: "25+", label: "Awards Won" },
    { icon: FaCoffee, value: "∞", label: "Cups of Coffee" },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We stay ahead of technology trends to deliver cutting-edge solutions.",
    },
    {
      title: "Quality",
      description:
        "Every line of code is written with excellence and maintainability in mind.",
    },
    {
      title: "Collaboration",
      description:
        "We work closely with our clients to understand and exceed their expectations.",
    },
    {
      title: "Integrity",
      description:
        "Honest communication and transparent processes are at our core.",
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
            <h1 className="text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl max-w-2xl mx-auto">
              We're a team of passionate developers, designers, and strategists
              dedicated to creating exceptional digital solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2015, YourCompany started with a simple mission: to
                help businesses leverage technology to achieve their goals. What
                began as a small team of developers has grown into a
                full-service software development company.
              </p>
              <p className="text-gray-600 mb-4">
                Over the years, we've worked with startups, small businesses,
                and enterprises, delivering solutions that drive real results.
                Our commitment to quality and innovation has made us a trusted
                partner for companies worldwide.
              </p>
              <p className="text-gray-600">
                Today, we continue to push boundaries, exploring new
                technologies and methodologies to deliver even better solutions
                for our clients.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative h-96"
            >
              <Image
                src="/api/placeholder/600/400"
                alt="Our team at work"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="text-5xl text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's create something amazing together
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/consultation"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/contact"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
