import React, { useState } from 'react'
import { FaCode, FaServer, FaDatabase, FaCloud, FaMobile, FaPalette } from 'react-icons/fa'
import RevealText from './reactbits/RevealText'
import AnimatedCard from './reactbits/AnimatedCard'
import ProgressBar from './reactbits/ProgressBar'
import AnimatedTabs from './reactbits/AnimatedTabs'
import SplitText from './reactbits/SplitText'

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
        { name: 'TypeScript', level: 90, experience: '1+ years' },
        { name: 'HTML/CSS', level: 95, experience: '3+ years' },
        { name: 'Tailwind CSS', level: 90, experience: '1+ years' },
        { name: 'Next.js', level: 85, experience: '1+ years' },
        { name: 'Material UI', level: 85, experience: '1+ years' },
        { name: 'Ant Design', level: 85, experience: '1+ years' }
      ]
    },
    backend: {
      title: 'Backend Development',
      icon: FaServer,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'WordPress', level: 85, experience: '1+ years' },
        { name: 'PHP', level: 80, experience: '1+ years' },
        { name: 'Firebase', level: 85, experience: '1+ years' },
        { name: 'MySQL', level: 80, experience: '1+ years' },
        { name: 'REST APIs', level: 85, experience: '1+ years' },
        { name: 'Node.js', level: 75, experience: '1+ years' },
        { name: 'Express.js', level: 70, experience: '1+ years' },
        { name: 'MongoDB', level: 75, experience: '1+ years' }
      ]
    },
    database: {
      title: 'Database & Storage',
      icon: FaDatabase,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'Firebase', level: 85, experience: '1+ years' },
        { name: 'MySQL', level: 80, experience: '1+ years' },
        { name: 'MongoDB', level: 75, experience: '1+ years' },
        { name: 'IndexedDB', level: 80, experience: '1+ years' },
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
        { name: 'Git', level: 90, experience: '2+ years' },
        { name: 'GitHub', level: 90, experience: '2+ years' },
        { name: 'Firebase Hosting', level: 85, experience: '1+ years' },
        { name: 'Netlify', level: 75, experience: '6+ months' },
        { name: 'Linux', level: 80, experience: '1+ years' },
        { name: 'Docker', level: 60, experience: '3+ months' },
        { name: 'CI/CD', level: 70, experience: '1+ years' }
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
        { name: 'UI/UX Design', level: 90, experience: '1+ years' },
        { name: 'Wireframing', level: 85, experience: '1+ years' },
        { name: 'Prototyping', level: 80, experience: '1+ years' }
      ]
    }
  }

  return (
    <section className="min-h-screen py-20 relative" style={{ paddingTop: '150px' }}>
      <div className="container-max section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <RevealText direction="up" delay={0} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <SplitText text="Skills & Expertise" className="gradient-text" delay={0.2} />
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A comprehensive overview of my technical skills and experience
            </p>
          </RevealText>

          {/* Category Tabs */}
          <RevealText delay={0.3} className="flex justify-center mb-12">
            <div className="glass-effect rounded-2xl p-2">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {Object.entries(skillCategories).map(([key, category]) => (
                  <AnimatedCard
                    key={key}
                    hoverScale={true}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      activeCategory === key
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setActiveCategory(key)}
                  >
                    <category.icon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium text-center">{category.title}</span>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </RevealText>

          {/* Skills Content */}
          <RevealText key={activeCategory} delay={0.4} direction="up">
            <AnimatedCard className="glass-effect rounded-2xl p-8" hoverScale={false}>
              <div className="flex items-center mb-8">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${skillCategories[activeCategory].color} flex items-center justify-center mr-4`}>
                  {React.createElement(skillCategories[activeCategory].icon, { className: "w-6 h-6 text-white" })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{skillCategories[activeCategory].title}</h3>
                  <p className="text-gray-400">Proficiency levels and experience</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {skillCategories[activeCategory].skills.map((skill, index) => (
                  <RevealText
                    key={index}
                    delay={0.5 + index * 0.1}
                    direction="left"
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{skill.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400 font-bold">{skill.level}%</span>
                        <span className="text-gray-400 text-sm">({skill.experience})</span>
                      </div>
                    </div>
                    <ProgressBar
                      value={skill.level}
                      delay={0.6 + index * 0.1}
                      showLabel={false}
                      color={skillCategories[activeCategory].color}
                    />
                  </RevealText>
                ))}
              </div>
            </AnimatedCard>
          </RevealText>

          {/* Additional Info */}
          <RevealText delay={0.7} className="grid md:grid-cols-3 gap-8 mt-16">
            <AnimatedCard className="glass-effect rounded-2xl p-6 text-center" hoverScale={true}>
              <div className="text-3xl font-bold text-blue-400 mb-2">34+</div>
              <div className="text-gray-300">GitHub Repositories</div>
            </AnimatedCard>
            <AnimatedCard className="glass-effect rounded-2xl p-6 text-center" hoverScale={true}>
              <div className="text-3xl font-bold text-blue-400 mb-2">1+</div>
              <div className="text-gray-300">Years Experience</div>
            </AnimatedCard>
            <AnimatedCard className="glass-effect rounded-2xl p-6 text-center" hoverScale={true}>
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </AnimatedCard>
          </RevealText>
        </div>
      </div>
    </section>
  )
}

export default Skills
