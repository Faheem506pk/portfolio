import React from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaRocket, FaLightbulb, FaHeart, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa'

const About = () => {
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

  const stats = [
    { number: "1+", label: "Years Experience", icon: FaCode },
    { number: "34+", label: "GitHub Repositories", icon: FaRocket },
    { number: "100%", label: "Client Satisfaction", icon: FaHeart },
    { number: "24/7", label: "Learning Mode", icon: FaLightbulb }
  ]

  const skills = [
    { name: "ReactJS Development", level: 95 },
    { name: "TypeScript", level: 85 },
    { name: "WordPress Development", level: 80 },
    { name: "UI/UX Design", level: 85 },
    { name: "Next.js", level: 75 },
    { name: "Firebase Integration", level: 70 }
  ]

  return (
    <section className="min-h-screen py-20 relative">
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
              About Me
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A passionate developer with a love for creating exceptional digital experiences
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Story */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="glass-effect rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FaGraduationCap className="w-6 h-6 text-primary-400 mr-3" />
                  My Journey
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  I'm a passionate ReactJS Frontend Developer with over 1 year of professional experience 
                  building scalable, responsive web applications. My journey began with a curiosity about 
                  how websites work, which led me to dive deep into modern frontend technologies.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Based in Islamabad, Pakistan, I specialize in ReactJS, Next.js, TypeScript, and WordPress 
                  development. I excel at converting Figma designs to pixel-perfect code and creating 
                  exceptional user experiences with attention to detail and design fidelity.
                </p>
                <div className="flex items-center text-gray-400">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                  <span>Islamabad, Pakistan</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="glass-effect rounded-xl p-6 text-center"
                  >
                    <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Skills */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="glass-effect rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Technical Skills</h3>
                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-primary-400 font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Personal Traits */}
              <div className="glass-effect rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">What Drives Me</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: FaCode, text: "Clean Code" },
                    { icon: FaRocket, text: "Innovation" },
                    { icon: FaLightbulb, text: "Problem Solving" },
                    { icon: FaHeart, text: "User Experience" }
                  ].map((trait, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <trait.icon className="w-5 h-5 text-primary-400" />
                      <span className="text-gray-300">{trait.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Let's Work Together
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
