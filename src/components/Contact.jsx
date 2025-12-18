import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaPaperPlane } from 'react-icons/fa'
import RevealText from './reactbits/RevealText'
import AnimatedCard from './reactbits/AnimatedCard'
import AnimatedInput from './reactbits/AnimatedInput'
import AnimatedButton from './reactbits/AnimatedButton'
import SplitText from './reactbits/SplitText'
import { Mydata } from '../utils/MyCv'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Format email body with all form data
    const emailBody = `Hello ${Mydata.Name.split(' ')[0]},

My name is ${formData.name} and my email is ${formData.email}.

${formData.message}

Best regards,
${formData.name}`

    // Encode the subject and body for URL
    const encodedSubject = encodeURIComponent(formData.subject || 'Contact from Portfolio')
    const encodedBody = encodeURIComponent(emailBody)
    
    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(Mydata.Email)}&su=${encodedSubject}&body=${encodedBody}`
    
    // Open Gmail compose in new tab
    window.open(gmailUrl, '_blank')
    
    // Reset form after opening Gmail
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: Mydata.Email,
      link: `mailto:${Mydata.Email}`
    },
    {
      icon: FaPhone,
      title: 'Phone',
      value: Mydata.Phone.split(',')[0],
      link: `tel:${Mydata.Phone.split(',')[0].replace(/\s/g, '')}`
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      value: Mydata.Address,
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

  return (
    <section className="min-h-screen py-20 relative" style={{ paddingTop: '150px' }}>
      <div className="container-max section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <RevealText direction="up" delay={0} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <SplitText text="Get In Touch" className="gradient-text" delay={0.2} />
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to start your next project? Let's discuss how we can work together to bring your ideas to life.
            </p>
          </RevealText>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <RevealText direction="right" delay={0.2} className="space-y-6">
              <AnimatedCard className="code-card rounded-2xl card-spacing" hoverScale={true}>
                <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you have a question, want to collaborate, or just want to say hi, 
                  I'd love to hear from you!
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <RevealText key={index} delay={0.3 + index * 0.1} direction="left">
                      <a
                        href={info.link || undefined}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                          info.link ? 'hover:bg-white/10 cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">{info.title}</div>
                          <div className="text-white font-medium">{info.value}</div>
                        </div>
                      </a>
                    </RevealText>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Follow Me</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <RevealText key={index} delay={0.5 + index * 0.1} direction="up">
                        <AnimatedCard
                          className={`w-12 h-12 glass-effect rounded-xl flex items-center justify-center text-gray-400 transition-colors ${social.color}`}
                          hoverScale={true}
                        >
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full flex items-center justify-center"
                          >
                            <social.icon className="w-5 h-5" />
                          </a>
                        </AnimatedCard>
                      </RevealText>
                    ))}
                  </div>
                </div>
              </AnimatedCard>

              {/* Availability Status */}
              <AnimatedCard className="glass-effect rounded-2xl p-8" hoverScale={true}>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
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
              </AnimatedCard>
            </RevealText>

            {/* Contact Form */}
            <RevealText direction="left" delay={0.3} className="code-card rounded-2xl card-spacing">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <AnimatedInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    label="Name"
                    placeholder="Your name"
                    required
                  />
                  <AnimatedInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    label="Email"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <AnimatedInput
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  label="Subject"
                  placeholder="What's this about?"
                  required
                />

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
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <AnimatedButton
                  type="submit"
                  variant="primary"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <FaPaperPlane className="w-5 h-5" />
                  <span>Send Message</span>
                </AnimatedButton>

                <p className="text-xs text-slate-500 text-center mt-4">
                  Clicking "Send Message" will open Gmail with your message pre-filled
                </p>
              </form>
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
