import React, { useState, useEffect, useRef } from "react";
import { useToast } from "../context/useToast";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars

export default function Contact() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Animation controls
  const controls = useAnimation();
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.3 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.2 });
  const isInfoInView = useInView(infoRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isHeaderInView) {
      controls.start("visible");
    }
    if (isFormInView) {
      controls.start("visible");
    }
    if (isInfoInView) {
      controls.start("visible");
    }
  }, [controls, isHeaderInView, isFormInView, isInfoInView]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast("Please fix the errors in the form", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with real fetch pattern
    try {
      // Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast("Your message has been sent successfully!", "success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      console.error(err);
      addToast("Failed to send message. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 80 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Animated Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <motion.circle
            cx="50%"
            cy="50%"
            r="100"
            fill="none"
            stroke="rgba(139, 92, 246, 0.1)"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          />
        </svg>
      </div>

      {/* Header Container with Parallax Effect */}
      <motion.div 
        ref={headerRef}
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
        className="relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold mb-6 shadow-lg">
                Let's Connect
              </span>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight mb-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Have a question about an order, a product, or just want to say hi? We'd love to hear from you.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-20">
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-200/50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          
          {/* Contact Info (Left Side) with Glassmorphism */}
          <motion.div 
            ref={infoRef}
            initial="hidden"
            animate={controls}
            variants={slideInLeft}
            className="lg:w-1/3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
            
            <div className="relative z-10">
              <motion.h3 
                className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Contact Information
              </motion.h3>
              
              <motion.ul 
                className="space-y-8"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[
                  { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", text: "123 Fashion Avenue\nSuite 400\nNew York, NY 10001", label: "Address" },
                  { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", text: "+1 (555) 123-4567", label: "Phone" },
                  { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: "support@hexashop.com", label: "Email" }
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    variants={fadeInUp}
                    className="flex items-start group/item"
                    whileHover={{ x: 10 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                      <svg className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="text-sm text-purple-400 mb-1">{item.label}</p>
                      <span className="text-gray-300 whitespace-pre-line">{item.text}</span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <motion.div 
              className="mt-16 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h4 className="text-sm font-bold tracking-widest uppercase text-purple-400 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {[
                  { href: "#", icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z", label: "Twitter" },
                  { href: "#", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", label: "Instagram" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 relative overflow-hidden group"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form (Right Side) */}
          <motion.div 
            ref={formRef}
            initial="hidden"
            animate={controls}
            variants={slideInRight}
            className="lg:w-2/3 p-10 lg:p-12 pl-10 lg:pl-16 relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Send us a message
              </h2>
              <p className="text-gray-500 mb-8">We'll get back to you within 24 hours</p>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                        errors.name 
                          ? 'border-red-500 focus:border-red-500' 
                          : focusedField === 'name'
                          ? 'border-purple-500 shadow-lg'
                          : 'border-gray-200 focus:border-gray-900'
                      }`}
                      placeholder="John Doe" 
                    />
                    {focusedField === 'name' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-3 top-3 text-purple-500"
                      >
                        ✨
                      </motion.div>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : focusedField === 'email'
                          ? 'border-purple-500 shadow-lg'
                          : 'border-gray-200 focus:border-gray-900'
                      }`}
                      placeholder="you@example.com" 
                    />
                    {focusedField === 'email' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-3 top-3 text-purple-500"
                      >
                        📧
                      </motion.div>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <div className="relative">
                  <select 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange}
                    onFocus={() => handleFocus('subject')}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 cursor-pointer ${
                      focusedField === 'subject'
                        ? 'border-purple-500 shadow-lg'
                        : 'border-gray-200 focus:border-gray-900'
                    }`}
                  >
                    <option value="">Select a subject...</option>
                    <option value="order_issue">Issue with an order</option>
                    <option value="product_question">Question about a product</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <div className="relative">
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    required 
                    rows="5" 
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-500' 
                        : focusedField === 'message'
                        ? 'border-purple-500 shadow-lg'
                        : 'border-gray-200 focus:border-gray-900'
                    }`}
                    placeholder="How can we help you?"
                  ></textarea>
                  {focusedField === 'message' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-3 bottom-3 text-purple-500"
                    >
                      💬
                    </motion.div>
                  )}
                </div>
                <AnimatePresence>
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div 
                className="pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-10 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  whileHover={!isSubmitting ? { y: -2 } : {}}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Send Message</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}