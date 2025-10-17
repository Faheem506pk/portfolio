import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaCode, FaEye } from 'react-icons/fa'

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredProject, setHoveredProject] = useState(null)

  const projects = [
    {
      id: 1,
      title: "PeekGamer",
      description: "A modern game discovery platform built with Next.js 14 and TypeScript. Features custom dark-themed UI, SEO optimization, advanced search/filtering, and server-side rendering.",
      image: "/api/placeholder/600/400",
      category: "frontend",
      technologies: ["Next.js 14", "TypeScript", "Ant Design", "Vercel"],
      github: "https://github.com/faheem506pk/peekgamer",
      live: "https://peekgamer.vercel.app",
      featured: true
    },
    {
      id: 2,
      title: "StitchSmart",
      description: "A comprehensive tailor shop management system with role-based access, offline-first functionality using IndexedDB, and analytics dashboard.",
      image: "/api/placeholder/600/400",
      category: "fullstack",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Firebase", "Zustand", "IndexedDB"],
      github: "https://github.com/faheem506pk/stitchsmart",
      live: "https://stitchsmart.vercel.app",
      featured: true
    },
    {
      id: 3,
      title: "Qotion",
      description: "A Notion-style table clone with drag-and-drop functionality, real-time sync via Firebase, and customizable data types.",
      image: "/api/placeholder/600/400",
      category: "frontend",
      technologies: ["React", "TypeScript", "Jotai", "Zustand", "Firebase", "Tailwind CSS"],
      github: "https://github.com/faheem506pk/notion_table_clone",
      live: "https://qotion.vercel.app",
      featured: true
    },
    {
      id: 4,
      title: "KaTable App",
      description: "A dynamic and customizable table application featuring editable columns, column renaming, and persistent data storage using localStorage.",
      image: "/api/placeholder/600/400",
      category: "frontend",
      technologies: ["React", "TypeScript", "Material UI", "KaTable"],
      github: "https://github.com/faheem506pk/my-katable-app",
      live: "https://iotion.vercel.app",
      featured: false
    },
    {
      id: 5,
      title: "PlantPulse",
      description: "An IoT-based greenhouse monitoring system with ESP32, React dashboard, and Firebase integration for real-time plant health monitoring.",
      image: "/api/placeholder/600/400",
      category: "fullstack",
      technologies: ["ESP32", "React", "Firebase", "C++", "Arduino IDE"],
      github: "https://github.com/faheem506pk/PlantPulse",
      live: "https://plantpulse.vercel.app",
      featured: true
    },
    {
      id: 6,
      title: "Cinematic Vistas",
      description: "A modern movie browsing platform with responsive design, search functionality, and dynamic content integration.",
      image: "/api/placeholder/600/400",
      category: "frontend",
      technologies: ["React", "TypeScript", "Tailwind CSS", "API Integration"],
      github: "https://github.com/faheem506pk/cinematic-vistas",
      live: "https://cinematic-vistas.vercel.app",
      featured: false
    },
    {
      id: 7,
      title: "ExplorePak",
      description: "A tourism platform with admin panel for package and booking management, built with PHP and MySQL.",
      image: "/api/placeholder/600/400",
      category: "fullstack",
      technologies: ["PHP", "MySQL", "HTML5", "CSS3", "Bootstrap"],
      github: "https://github.com/faheem506pk/ExplorePak",
      live: "https://explorepak.vercel.app",
      featured: false
    },
    {
      id: 8,
      title: "Speedy Eats",
      description: "A fully dynamic WordPress website with custom theme, ACF integration, and SEO optimization for food delivery services.",
      image: "/api/placeholder/600/400",
      category: "fullstack",
      technologies: ["WordPress", "ACF", "PHP", "CSS", "JavaScript"],
      github: "https://github.com/faheem506pk/speedy-eats",
      live: "https://speedy-eats.vercel.app",
      featured: true
    }
  ]

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'fullstack', label: 'Full Stack' }
  ]

  const filteredProjects = projects.filter(project => 
    activeFilter === 'all' || project.category === activeFilter
  )

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
    <section className="min-h-screen py-20 relative">
      <div className="container-max section-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A showcase of my recent work and side projects
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div variants={itemVariants} className="flex justify-center mb-12">
            <div className="glass-effect rounded-full p-2">
              <div className="flex flex-wrap justify-center gap-2">
                {filters.map((filter) => (
                  <motion.button
                    key={filter.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeFilter === filter.key
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredProject(project.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                  className={`glass-effect rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 ${
                    project.featured ? 'ring-2 ring-primary-500/50' : ''
                  }`}
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 flex items-center justify-center">
                      <FaCode className="w-16 h-16 text-white/50" />
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-accent-500 text-white text-sm font-medium rounded-full">
                        Featured
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: hoveredProject === project.id ? 1 : 0 
                      }}
                      className="absolute inset-0 bg-black/70 flex items-center justify-center space-x-4"
                    >
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-colors"
                      >
                        <FaGithub className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-colors"
                      >
                        <FaExternalLinkAlt className="w-5 h-5" />
                      </motion.a>
                    </motion.div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
                      >
                        <FaGithub className="w-4 h-4" />
                        <span>Code</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>Live</span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              View All Projects on GitHub
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
