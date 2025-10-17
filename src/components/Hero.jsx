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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-code-bg">
      {/* Code Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-green-400 font-mono text-sm">
          <div>&lt;div className="hero"&gt;</div>
          <div className="ml-4">&lt;h1&gt;Muhammad Faheem Iqbal&lt;/h1&gt;</div>
          <div className="ml-4">&lt;p&gt;ReactJS Developer&lt;/p&gt;</div>
          <div>&lt;/div&gt;</div>
        </div>
        <div className="absolute top-32 right-20 text-blue-400 font-mono text-sm">
          <div>const developer = {`{`}</div>
          <div className="ml-4">name: "Faheem",</div>
          <div className="ml-4">skills: ["React", "TypeScript"],</div>
          <div className="ml-4">experience: "1+ years"</div>
          <div>{`};`}</div>
        </div>
        <div className="absolute bottom-20 left-1/4 text-purple-400 font-mono text-sm">
          <div>npm install react</div>
          <div>npm install typescript</div>
          <div>npm install tailwindcss</div>
        </div>
      </div>

      <div className="container-max section-padding text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Terminal Window */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="terminal-window max-w-4xl mx-auto mb-8"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500"></div>
              <div className="terminal-dot bg-yellow-500"></div>
              <div className="terminal-dot bg-green-500"></div>
              <span className="text-gray-300 text-sm ml-4 font-mono">portfolio.js</span>
            </div>
            <div className="p-8 text-left">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">$</span>
                  <span className="text-gray-300">whoami</span>
                </div>
                <div className="text-4xl md:text-6xl font-bold gradient-text mb-4">
                  Muhammad Faheem Iqbal
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">$</span>
                  <span className="text-gray-300">cat role.txt</span>
                </div>
                <div className="text-2xl md:text-3xl text-green-400 mb-6">
                  {texts[currentText]}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">$</span>
                  <span className="text-gray-300">cat description.txt</span>
                </div>
                <div className="text-gray-300 leading-relaxed max-w-3xl">
                  ReactJS Frontend Developer with 1+ year of professional experience building scalable, 
                  responsive web applications. Passionate about converting Figma designs to pixel-perfect code 
                  and creating exceptional user experiences.
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
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
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2"
            >
              <FaDownload className="w-4 h-4" />
              <span>Download CV</span>
            </motion.button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex items-center justify-center space-x-6"
          >
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              href="https://github.com/faheem506pk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 code-card rounded-lg flex items-center justify-center text-gray-300 hover:text-green-400 transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.linkedin.com/in/faheem506pk/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 code-card rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-400 transition-colors"
            >
              <FaLinkedin className="w-6 h-6" />
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              href="mailto:faheemiqbalm@gmail.com"
              className="w-12 h-12 code-card rounded-lg flex items-center justify-center text-gray-300 hover:text-purple-400 transition-colors"
            >
              <FaEnvelope className="w-6 h-6" />
            </motion.a>
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
