"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  FaCalendar,
  FaClock,
  FaVideo,
  FaPhone,
  FaMapMarkerAlt,
  FaCheck,
} from "react-icons/fa";

interface ConsultationData {
  name: string;
  email: string;
  company: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: "video" | "phone" | "in-person";
  projectDetails: string;
  budget: string;
  timeline: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function Consultation() {
  const [formData, setFormData] = useState<ConsultationData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    consultationType: "video",
    projectDetails: "",
    budget: "",
    timeline: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Sample time slots - in production, these would come from a backend
  const timeSlots: TimeSlot[] = [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: false },
    { time: "05:00 PM", available: true },
  ];

  const budgetRanges = [
    "Under $1,000",
    "$1,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000+",
  ];

  const timelines = [
    "ASAP",
    "Within 1 month",
    "1-3 months",
    "3-6 months",
    "6+ months",
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Consultation booked:", formData);
      setShowConfirmation(true);
      setIsSubmitting(false);

      // Reset form after showing confirmation
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          preferredDate: "",
          preferredTime: "",
          consultationType: "video",
          projectDetails: "",
          budget: "",
          timeline: "",
        });
      }, 2000);
    }, 1500);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Book a Free Consultation
            </h1>
            <p className="text-xl text-gray-600">
              Let's discuss your project and how we can help bring your vision
              to life
            </p>
          </div>

          {showConfirmation ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center"
            >
              <FaCheck className="text-5xl text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Consultation Booked Successfully!
              </h2>
              <p className="text-green-700">
                We'll send you a confirmation email shortly with all the
                details.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Consultation Types */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold mb-6">
                  Choose Consultation Type
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <label
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      formData.consultationType === "video"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="consultationType"
                      value="video"
                      checked={formData.consultationType === "video"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <FaVideo className="text-3xl mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold">Video Call</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Via Zoom or Google Meet
                      </p>
                    </div>
                  </label>

                  <label
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      formData.consultationType === "phone"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="consultationType"
                      value="phone"
                      checked={formData.consultationType === "phone"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <FaPhone className="text-3xl mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold">Phone Call</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        We'll call you
                      </p>
                    </div>
                  </label>

                  <label
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      formData.consultationType === "in-person"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="consultationType"
                      value="in-person"
                      checked={formData.consultationType === "in-person"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <FaMapMarkerAlt className="text-3xl mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold">In-Person</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        At our office
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Booking Form */}
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold mb-6">
                  Your Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Full Name *
                    </label>
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
                    <label className="block text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
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

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="preferredDate"
                        required
                        min={today}
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <FaCalendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <select
                        name="preferredTime"
                        required
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none"
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((slot) => (
                          <option
                            key={slot.time}
                            value={slot.time}
                            disabled={!slot.available}
                          >
                            {slot.time} {!slot.available && "(Unavailable)"}
                          </option>
                        ))}
                      </select>
                      <FaClock className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Timeline</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>
                          {timeline}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Project Details *
                  </label>
                  <textarea
                    name="projectDetails"
                    required
                    value={formData.projectDetails}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Tell us about your project, goals, and any specific requirements..."
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
                  {isSubmitting ? "Booking..." : "Book Consultation"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
