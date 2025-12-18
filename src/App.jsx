import React, { useState, lazy, Suspense } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import RevealText from './components/reactbits/RevealText'

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'))
const About = lazy(() => import('./components/About'))
const Experience = lazy(() => import('./components/Experience'))
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const Contact = lazy(() => import('./components/Contact'))

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  const renderSection = () => {
    switch (activeSection) {
      case 'hero':
        return <Hero setActiveSection={setActiveSection} />
      case 'about':
        return <About />
      case 'experience':
        return <Experience />
      case 'projects':
        return <Projects />
      case 'skills':
        return <Skills />
      case 'contact':
        return <Contact />
      default:
        return <Hero setActiveSection={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Simplified background - no heavy particles for better performance */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50"></div>
      
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="relative z-10">
        <RevealText key={activeSection} delay={0} duration={0.5} direction="up">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            {renderSection()}
          </Suspense>
        </RevealText>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App
