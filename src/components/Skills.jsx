import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaServer, FaDatabase, FaCloud, FaMobile, FaPalette } from 'react-icons/fa'

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('frontend')

  const skillCategories = {
    frontend: {
      title: 'Frontend Development',
      icon: FaCode,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'ReactJS', level: 95, experience: '1+ years' },
        { name: 'JavaScript', level: 90, experience: '2+ years' },
        { name: 'TypeScript', level: 85, experience: '1+ years' },
        { name: 'HTML/CSS', level: 95, experience: '3+ years' },
        { name: 'Tailwind CSS', level: 90, experience: '1+ years' },
        { name: 'Next.js', level: 80, experience: '6+ months' },
        { name: 'Material UI', level: 85, experience: '1+ years' },
        { name: 'Ant Design', level: 80, experience: '6+ months' }
      ]
    },
    backend: {
      title: 'Backend Development',
      icon: FaServer,
      color: 'from-green-500 to-emerald-500',
      skills: [
        { name: 'WordPress', level: 85, experience: '1+ years' },
        { name: 'PHP', level: 80, experience: '1+ years' },
        { name: 'Firebase', level: 85, experience: '1+ years' },
        { name: 'MySQL', level: 75, experience: '1+ years' },
        { name: 'REST APIs', level: 80, experience: '1+ years' },
        { name: 'Node.js', level: 70, experience: '6+ months' },
        { name: 'Express.js', level: 65, experience: '6+ months' },
        { name: 'MongoDB', level: 70, experience: '6+ months' }
      ]
    },
    database: {
      title: 'Database & Storage',
      icon: FaDatabase,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'Firebase', level: 85, experience: '1+ years' },
        { name: 'MySQL', level: 80, experience: '1+ years' },
        { name: 'MongoDB', level: 75, experience: '6+ months' },
        { name: 'IndexedDB', level: 80, experience: '6+ months' },
        { name: 'LocalStorage', level: 90, experience: '1+ years' },
        { name: 'Firestore', level: 85, experience: '1+ years' },
        { name: 'SQLite', level: 70, experience: '6+ months' },
        { name: 'PostgreSQL', level: 65, experience: '3+ months' }
      ]
    },
    cloud: {
      title: 'Cloud & DevOps',
      icon: FaCloud,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'Vercel', level: 90, experience: '1+ years' },
        { name: 'Git', level: 85, experience: '2+ years' },
        { name: 'GitHub', level: 90, experience: '2+ years' },
        { name: 'Firebase Hosting', level: 85, experience: '1+ years' },
        { name: 'Netlify', level: 75, experience: '6+ months' },
        { name: 'Linux', level: 70, experience: '1+ years' },
        { name: 'Docker', level: 60, experience: '3+ months' },
        { name: 'CI/CD', level: 65, experience: '6+ months' }
      ]
    },
    mobile: {
      title: 'Mobile Development',
      icon: FaMobile,
      color: 'from-indigo-500 to-purple-500',
      skills: [
        { name: 'PWA', level: 85, experience: '1+ years' },
        { name: 'React Native', level: 70, experience: '6+ months' },
        { name: 'Responsive Design', level: 95, experience: '2+ years' },
        { name: 'Mobile Optimization', level: 90, experience: '1+ years' },
        { name: 'Touch Interactions', level: 85, experience: '1+ years' },
        { name: 'Mobile Testing', level: 80, experience: '6+ months' },
        { name: 'Cross-browser', level: 90, experience: '1+ years' },
        { name: 'Performance', level: 85, experience: '1+ years' }
      ]
    },
    design: {
      title: 'Design & Tools',
      icon: FaPalette,
      color: 'from-pink-500 to-rose-500',
      skills: [
        { name: 'Figma', level: 90, experience: '1+ years' },
        { name: 'Photoshop', level: 85, experience: '3+ years' },
        { name: 'After Effects', level: 80, experience: '2+ years' },
        { name: 'Framer Motion', level: 85, experience: '1+ years' },
        { name: 'Canva', level: 90, experience: '2+ years' },
        { name: 'UI/UX Design', level: 85, experience: '1+ years' },
        { name: 'Wireframing', level: 80, experience: '1+ years' },
        { name: 'Prototyping', level: 75, experience: '6+ months' }
      ]
    }
  }

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
              Skills & Expertise
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A comprehensive overview of my technical skills and experience
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div variants={itemVariants} className="flex justify-center mb-12">
            <div className="glass-effect rounded-2xl p-2">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {Object.entries(skillCategories).map(([key, category]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(key)}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                      activeCategory === key
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <category.icon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium text-center">{category.title}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skills Content */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex items-center mb-8">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${skillCategories[activeCategory].color} flex items-center justify-center mr-4`}>
                <skillCategories[activeCategory].icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{skillCategories[activeCategory].title}</h3>
                <p className="text-gray-400">Proficiency levels and experience</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {skillCategories[activeCategory].skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary-400 font-bold">{skill.level}%</span>
                      <span className="text-gray-400 text-sm">({skill.experience})</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-3 bg-gradient-to-r ${skillCategories[activeCategory].color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">34+</div>
              <div className="text-gray-300">GitHub Repositories</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-secondary-400 mb-2">1+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-accent-400 mb-2">100%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
