"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  FaVideo,
  FaPhone,
  FaMapMarkerAlt,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import CalendarBooking from "@/components/CalendarBooking";

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
  const [currentStep, setCurrentStep] = useState<number>(1);

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

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowConfirmation(true);
        // Reset form after 3 seconds
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
          setCurrentStep(1);
        }, 3000);
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to book consultation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

  const handleDateTimeChange = (date: string, time: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredDate: date,
      preferredTime: time,
    }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.consultationType !== undefined;
      case 2:
        return formData.preferredDate !== "" && formData.preferredTime !== "";
      case 3:
        return (
          formData.name !== "" &&
          formData.email !== "" &&
          formData.phone !== "" &&
          formData.projectDetails !== ""
        );
      default:
        return true;
    }
  };

  const steps = [
    { number: 1, title: "Consultation Type" },
    { number: 2, title: "Date & Time" },
    { number: 3, title: "Your Information" },
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
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
              {/* Progress Steps */}
              <div className="flex justify-between mb-8 max-w-2xl mx-auto">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex items-center ${
                      step.number < steps.length ? "flex-1" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                        currentStep >= step.number
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {currentStep > step.number ? <FaCheck /> : step.number}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-semibold">{step.title}</p>
                    </div>
                    {step.number < steps.length && (
                      <div
                        className={`flex-1 h-1 mx-4 ${
                          currentStep > step.number
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Consultation Type */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg shadow-lg p-8"
                  >
                    <h2 className="text-2xl font-semibold mb-6">
                      Choose Consultation Type
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      <label
                        className={`border-2 rounded-lg p-6 cursor-pointer transition ${
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
                          <FaVideo className="text-4xl mx-auto mb-3 text-blue-600" />
                          <h3 className="font-semibold text-lg mb-2">
                            Video Call
                          </h3>
                          <p className="text-sm text-gray-600">
                            Via Zoom (30-60 min)
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Best for detailed discussions
                          </p>
                        </div>
                      </label>

                      <label
                        className={`border-2 rounded-lg p-6 cursor-pointer transition ${
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
                          <FaPhone className="text-4xl mx-auto mb-3 text-blue-600" />
                          <h3 className="font-semibold text-lg mb-2">
                            Phone Call
                          </h3>
                          <p className="text-sm text-gray-600">
                            We'll call you (15-30 min)
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Quick consultation
                          </p>
                        </div>
                      </label>

                      <label
                        className={`border-2 rounded-lg p-6 cursor-pointer transition ${
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
                          <FaMapMarkerAlt className="text-4xl mx-auto mb-3 text-blue-600" />
                          <h3 className="font-semibold text-lg mb-2">
                            In-Person
                          </h3>
                          <p className="text-sm text-gray-600">
                            At our office (1-2 hr)
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Face-to-face meeting
                          </p>
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Date & Time Selection */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg shadow-lg p-8"
                  >
                    <h2 className="text-2xl font-semibold mb-6">
                      Select Date & Time
                    </h2>

                    <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-start">
                      <FaInfoCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">
                          Booking Information:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>All times are shown in your local timezone</li>
                          <li>Consultations are available Monday-Friday</li>
                          <li>Book at least 24 hours in advance</li>
                        </ul>
                      </div>
                    </div>

                    <CalendarBooking
                      value={{
                        date: formData.preferredDate,
                        time: formData.preferredTime,
                      }}
                      onChange={handleDateTimeChange}
                      consultationType={formData.consultationType}
                    />
                  </motion.div>
                )}

                {/* Step 3: Personal Information */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
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
                        <label className="block text-gray-700 mb-2">
                          Email *
                        </label>
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
                        <label className="block text-gray-700 mb-2">
                          Company
                        </label>
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
                        <label className="block text-gray-700 mb-2">
                          Timeline
                        </label>
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

                    {/* Summary Box */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold mb-4 text-gray-800">
                        Booking Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">
                            {formData.consultationType === "video"
                              ? "📹 Video Call (60 min)"
                              : formData.consultationType === "phone"
                              ? "📞 Phone Call (30 min)"
                              : "🤝 In-Person Meeting (60 min)"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {formData.preferredDate
                              ? new Date(
                                  formData.preferredDate
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">
                            {formData.preferredTime || "Not selected"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Previous
                    </button>
                  )}

                  <div className={currentStep === 1 ? "ml-auto" : ""}>
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={() =>
                          isStepValid(currentStep) &&
                          setCurrentStep(currentStep + 1)
                        }
                        disabled={!isStepValid(currentStep)}
                        className={`px-8 py-3 rounded-lg font-semibold transition ${
                          isStepValid(currentStep)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || !isStepValid(3)}
                        className={`px-8 py-3 rounded-lg font-semibold transition ${
                          isSubmitting || !isStepValid(3)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isSubmitting ? "Booking..." : "Confirm Booking"}
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Help Section */}
              <div className="mt-12 bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-blue-900">
                  Need Help?
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      What to Expect
                    </h4>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Free consultation</li>
                      <li>• No commitment required</li>
                      <li>• Expert advice</li>
                      <li>• Project roadmap</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Preparation Tips
                    </h4>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Define your goals</li>
                      <li>• Gather requirements</li>
                      <li>• Prepare questions</li>
                      <li>• Know your budget</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Contact Us
                    </h4>
                    <p className="text-blue-700">
                      Email:{" "}
                      {process.env.NEXT_PUBLIC_COMPANY_EMAIL ||
                        "info@yourcompany.com"}
                      <br />
                      Phone:{" "}
                      {process.env.NEXT_PUBLIC_COMPANY_PHONE ||
                        "+1 (555) 123-4567"}
                      <br />
                      Hours: Mon-Fri, 9AM-5PM EST
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
