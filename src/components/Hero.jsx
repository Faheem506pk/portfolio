import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaChevronDown, FaCode, FaTerminal } from 'react-icons/fa'

const Hero = ({ setActiveSection }) => {
  const [currentText, setCurrentText] = useState(0)
  
  const texts = [
    "ReactJS Developer",
    "Frontend Specialist", 
    "UI/UX Enthusiast",
    "WordPress Developer",
    "IoT Enthusiast"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToNext = () => {
    setActiveSection('about')
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-code-bg py-[130px]">
      {/* Simplified background pattern - better performance */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-20 left-4 text-green-400 font-mono text-xs opacity-50">
          <div>&lt;React&gt;</div>
          <div className="ml-2">&lt;Developer/&gt;</div>
        </div>
        <div className="absolute bottom-20 right-4 text-blue-400 font-mono text-xs opacity-50">
          <div>const dev = "Faheem"</div>
        </div>
      </div>

      <div className="container-max section-padding text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 mt-8 flex justify-center"
          >
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden profile-frame">
                <img 
                  src="/images/faheem506pk.jpeg" 
                  alt="Muhammad Faheem Iqbal"
                  className="w-full h-full object-cover profile-image"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </motion.div>

          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="terminal-window max-w-4xl mx-auto mb-8"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500"></div>
              <div className="terminal-dot bg-yellow-500"></div>
              <div className="terminal-dot bg-green-500"></div>
              <span className="text-gray-300 text-sm ml-4 font-mono">portfolio.js</span>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 text-left">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">$</span>
                  <span className="text-gray-300">whoami</span>
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-3 sm:mb-4">
                  Muhammad Faheem Iqbal
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">$</span>
                  <span className="text-gray-300">cat role.txt</span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl text-green-400 mb-4 sm:mb-6">
                  {texts[currentText]}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">$</span>
                  <span className="text-gray-300">cat description.txt</span>
                </div>
                <div className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-2xl">
                  ReactJS Frontend Developer with 1+ year of professional experience building scalable, 
                  responsive web applications. Passionate about converting Figma designs to pixel-perfect code 
                  and creating exceptional user experiences.
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection('projects')}
              className="btn-primary flex items-center space-x-2"
            >
              <FaCode className="w-4 h-4" />
              <span>View Projects</span>
            </motion.button>
            
            <motion.a
              href="/cv/M_Faheem_Iqbal_Resume.pdf"
              download="Muhammad_Faheem_Iqbal_Resume.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2"
            >
              <FaDownload className="w-4 h-4" />
              <span>Download CV</span>
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex items-center justify-center space-x-4 sm:space-x-6"
          >
            <a
              href="https://github.com/faheem506pk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 hover:text-green-400 hover:bg-white/20 transition-all duration-300"
            >
              <FaGithub className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            
            <a
              href="https://www.linkedin.com/in/faheem506pk/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-white/20 transition-all duration-300"
            >
              <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            
            <a
              href="mailto:faheemiqbalm@gmail.com"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 hover:text-purple-400 hover:bg-white/20 transition-all duration-300"
            >
              <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={scrollToNext}
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            <FaChevronDown className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
