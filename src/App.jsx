import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Simplified background - no heavy particles for better performance */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50"></div>
      
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {activeSection === 'hero' && <Hero setActiveSection={setActiveSection} />}
            {activeSection === 'about' && <About />}
            {activeSection === 'experience' && <Experience />}
            {activeSection === 'projects' && <Projects />}
            {activeSection === 'skills' && <Skills />}
            {activeSection === 'contact' && <Contact />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <ScrollToTop />
    </div>
  )
}

export default App
