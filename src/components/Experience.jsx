import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa'

const Experience = () => {
  const [activeTab, setActiveTab] = useState(0)

  const experiences = [
    {
      title: "Associate Software Engineer",
      company: "MicroMerger Pvt Ltd",
      location: "Islamabad, Pakistan",
      period: "Feb 2025 - Present",
      type: "Full-time",
      description: "Develop dynamic ReactJS applications and WordPress solutions using ACF, converting Figma designs to pixel-perfect code.",
      achievements: [
        "Develop dynamic ReactJS applications and WordPress solutions using ACF",
        "Convert Figma designs to pixel-perfect, responsive React components",
        "Implement SEO best practices including semantic HTML, meta tags, structured data",
        "Build responsive dashboards and admin panels with Ant Design, HTML5, CSS3, JavaScript",
        "Work with Frappe framework basics for business applications",
        "Deploy applications to Vercel and maintain production environments",
        "Delivered Speedy Eats, a dynamic WordPress website with custom CMS integration"
      ],
      technologies: ["React", "WordPress", "ACF", "Ant Design", "JavaScript", "Vercel", "Frappe"]
    },
    {
      title: "Frontend Intern",
      company: "Alphabase (US-based)",
      location: "NSTP, Islamabad, Pakistan",
      period: "Nov 2024 - Jan 2025",
      type: "Internship",
      description: "Developed Qotion, a Notion-style collaborative table application and enhanced UI/UX on Zaplead.ai platform.",
      achievements: [
        "Developed Qotion, a Notion-style collaborative table application",
        "Converted Figma mockups into functional React components",
        "Implemented state management using Jotai, Zustand, React Context API",
        "Enhanced UI/UX on Zaplead.ai platform",
        "Collaborated using Git for version control"
      ],
      technologies: ["React", "TypeScript", "Jotai", "Zustand", "Firebase", "Tailwind CSS", "Git"]
    },
    {
      title: "Frontend Developer",
      company: "Juhuu Gmbh (Austria-based)",
      location: "Remote",
      period: "Sep 2023 - Mar 2024",
      type: "Contract",
      description: "Designed, developed and maintained web applications using React.js, Tailwind CSS, and JavaScript.",
      achievements: [
        "Designed, developed and maintained web applications using React.js, Tailwind CSS, and JavaScript",
        "Built the JUHUU Marketplace and BikeBox websites, optimizing for performance and responsive design",
        "Collaborated remotely with the JUHUU team to iterate on UI/UX and implement new features",
        "Developed an e-commerce platform for bike rentals and accessories",
        "Optimized performance and mobile responsiveness to improve customer engagement",
        "Integrated product listing, filtering, and booking functionalities"
      ],
      technologies: ["React", "Tailwind CSS", "JavaScript", "HTML", "CSS", "Git"]
    },
    {
      title: "Social Media Manager",
      company: "BestMobile.pk",
      location: "Remote",
      period: "Jan 2020 - Jun 2024",
      type: "Part-time",
      description: "Managed social media strategy across multiple platforms and created visual content using Photoshop and After Effects.",
      achievements: [
        "Managed social media strategy across multiple platforms",
        "Created visual content using Photoshop and After Effects",
        "Developed engaging content and animations for social media campaigns",
        "Maintained consistent brand voice across all platforms"
      ],
      technologies: ["Photoshop", "After Effects", "Social Media Management", "Content Creation"]
    }
  ]

  const education = [
    {
      degree: "Bachelor of Science in Information Technology",
      institution: "University of Chakwal",
      location: "Punjab, Pakistan",
      period: "Oct 2020 - Sep 2024",
      description: "Specialized in Information Technology with focus on web development and modern technologies"
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
    <section className="section-spacing relative">
      <div className="container-max section-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 sm:mb-6">
              Experience & Education
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              My professional journey and academic background
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div variants={itemVariants} className="flex justify-center mb-12">
            <div className="glass-effect rounded-full p-2">
              <div className="flex space-x-2">
                {['Experience', 'Education'].map((tab, index) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(index)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTab === index
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 0 ? (
              <motion.div
                key="experience"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="glass-effect rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                        <div className="flex items-center text-primary-400 font-semibold mb-2">
                          <FaBriefcase className="w-4 h-4 mr-2" />
                          {exp.company}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
                          <div className="flex items-center">
                            <FaCalendarAlt className="w-4 h-4 mr-1" />
                            {exp.period}
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                            {exp.location}
                          </div>
                          <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">
                            {exp.type}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4">{exp.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start">
                            <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-300">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 rounded-full text-sm border border-primary-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="education"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="glass-effect rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                        <div className="text-primary-400 font-semibold mb-2">{edu.institution}</div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
                          <div className="flex items-center">
                            <FaCalendarAlt className="w-4 h-4 mr-1" />
                            {edu.period}
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                            {edu.location}
                          </div>
                        </div>
                        <p className="text-gray-300">{edu.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default Experience
