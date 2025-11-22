"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheck } from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  businessType: "individual" | "startup" | "small-business" | "enterprise";
  message: string;
  services: string[];
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    businessType: "individual",
    message: "",
    services: [],
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const availableServices: string[] = [
    "Web Development",
    "Mobile Development",
    "E-Commerce",
    "Cloud Services",
    "Database Design",
    "API Development",
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      // If successful:
      console.log("Form submitted successfully to API");
      setShowConfirmation(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        businessType: "individual",
        message: "",
        services: [],
      });
    } catch (error) {
      console.error(`Submission error:, ${error}`);
      alert(`Failed to submit form, Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        services: checked
          ? [...prev.services, value]
          : prev.services.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <FaPhone className="text-3xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">(707) 398-1208</p>
            </div>
            <div className="text-center">
              <FaEnvelope className="text-3xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">jdxwebsolutions@gmail.com</p>
            </div>
            <div className="text-center">
              <FaMapMarkerAlt className="text-3xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-gray-600">HQ US-SC</p>
            </div>
          </div>

          {showConfirmation ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center"
            >
              <FaCheck className="text-5xl text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Contact Form Submitted Successfully!
              </h2>
              <p className="text-green-700">We'll contact you shortly.</p>
            </motion.div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="individual">Individual</option>
                    <option value="startup">Startup</option>
                    <option value="small-business">Small Business</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Services Interested In
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableServices.map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          name="services"
                          value={service}
                          checked={formData.services.includes(service)}
                          onChange={handleChange}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
