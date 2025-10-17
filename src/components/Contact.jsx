import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaPaperPlane } from 'react-icons/fa'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // EmailJS configuration - Your actual IDs
      const serviceId = 'service_e3mg9bl'
      const templateId = 'template_b8exa6y'
      const publicKey = 'YOUR_PUBLIC_KEY' // Get from https://dashboard.emailjs.com/admin/account
      
      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, {
        name: formData.name,
        email: formData.email,
        title: formData.subject,
        message: formData.message,
        time: new Date().toLocaleString()
      }, publicKey)
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Show success toast
      alert('✅ Message sent successfully! I\'ll get back to you soon.')
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000)
    } catch (error) {
      console.error('EmailJS Error:', error)
      setSubmitStatus('error')
      
      // Show error toast with helpful message
      if (error.text && error.text.includes('Public Key is invalid')) {
        alert('❌ EmailJS configuration error. Please check your Public Key setup.')
      } else {
        alert('❌ Failed to send message. Please try again or contact me directly.')
      }
      
      setTimeout(() => setSubmitStatus(null), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'faheemiqbalm@gmail.com',
      link: 'mailto:faheemiqbalm@gmail.com'
    },
    {
      icon: FaPhone,
      title: 'Phone',
      value: '+92 (332) 5194976',
      link: 'tel:+923325194976'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      value: 'Khanna Pul, Islamabad, Pakistan',
      link: null
    }
  ]

  const socialLinks = [
    {
      icon: FaGithub,
      name: 'GitHub',
      url: 'https://github.com/faheem506pk',
      color: 'hover:text-gray-300'
    },
    {
      icon: FaLinkedin,
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/faheem506pk/',
      color: 'hover:text-blue-400'
    },
    {
      icon: FaTwitter,
      name: 'Instagram',
      url: 'https://instagram.com/faheem506pk_',
      color: 'hover:text-pink-400'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section className="min-h-screen py-20 relative" style={{ paddingTop: '150px' }}>
      <div className="container-max section-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to start your next project? Let's discuss how we can work together to bring your ideas to life.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="code-card rounded-2xl card-spacing">
                <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you have a question, want to collaborate, or just want to say hi, 
                  I'd love to hear from you!
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={index}
                      whileHover={{ x: 10 }}
                      href={info.link}
                      className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                        info.link ? 'hover:bg-white/10 cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                        <info.icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">{info.title}</div>
                        <div className="text-white font-medium">{info.value}</div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Follow Me</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 glass-effect rounded-xl flex items-center justify-center text-gray-400 transition-colors ${social.color}`}
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              <motion.div
                variants={itemVariants}
                className="glass-effect rounded-2xl p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <h4 className="text-lg font-semibold text-white">Currently Available</h4>
                </div>
                <p className="text-gray-300 mb-4">
                  I'm currently available for new projects and collaborations. 
                  Let's discuss your requirements and how I can help bring your vision to life.
                </p>
                <div className="text-sm text-gray-400">
                  <div>Response time: Usually within 24 hours</div>
                  <div>Availability: Full-time</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants} className="code-card rounded-2xl card-spacing">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-400 bg-green-500/20 border border-green-500/30 rounded-xl py-3"
                  >
                    Message sent successfully! I'll get back to you soon.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
