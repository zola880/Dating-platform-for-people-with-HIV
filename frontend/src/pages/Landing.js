import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-[#FEF9E6] font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B6B]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4ECDC4]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent"
          >
            Embrace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#2D3E50] mt-6 max-w-2xl mx-auto"
          >
            A safe space for connection, support, and love.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <button className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                Join Embrace
              </button>
            </Link>
            <Link to="/login">
              <button className="border-2 border-[#FF6B6B] text-[#FF6B6B] font-semibold px-8 py-3 rounded-full hover:bg-[#FF6B6B]/10 transition-all">
                Sign In
              </button>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FEF9E6] to-transparent" />
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-[#2D3E50]">How It Works</motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 mt-2">Three simple steps to meaningful connections</motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: "🌱", title: "Create Your Profile", desc: "Share your story, interests, and what you're looking for." },
              { icon: "💬", title: "Connect Safely", desc: "Discover like‑minded people in a private, moderated environment." },
              { icon: "❤️", title: "Build Relationships", desc: "Nurture genuine connections at your own pace." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Your safety, our priority</h2>
              <p className="text-gray-700 text-lg mb-6">
                We've built Embrace with trust at its core. Every profile is reviewed, conversations are private, and you're always in control.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><span className="text-[#FF6B6B] text-xl">✓</span> 24/7 moderation</li>
                <li className="flex items-center gap-2"><span className="text-[#FF6B6B] text-xl">✓</span> Encrypted messaging</li>
                <li className="flex items-center gap-2"><span className="text-[#FF6B6B] text-xl">✓</span> Report & block tools</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#FF6B6B]/20 to-[#4ECDC4]/20 flex items-center justify-center">
                <span className="text-7xl">🛡️</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-[#2D3E50]"
          >
            Real stories, real connections
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah", story: "I found a partner who truly understands me. Thank you, Embrace.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "David", story: "The community is so supportive. I finally feel safe to be myself.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Elena", story: "Embrace gave me hope again. I'm now in a loving relationship.", avatar: "https://randomuser.me/api/portraits/women/68.jpg" }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <h4 className="font-semibold text-lg">{t.name}</h4>
                </div>
                <p className="text-gray-600 italic">“{t.story}”</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands who have found love and support in a safe, welcoming space.</p>
          <Link to="/register">
            <button className="bg-white text-[#FF6B6B] font-semibold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
              Join Embrace Today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D3E50] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent">Embrace</h3>
              <p className="text-gray-300 mt-2">Find your anchor. Build your future.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Explore</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/about" className="hover:text-[#FF6B6B]">About</Link></li>
                <li><Link to="/privacy" className="hover:text-[#FF6B6B]">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-[#FF6B6B]">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-[#FF6B6B]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#FF6B6B]">Safety Tips</a></li>
                <li><a href="#" className="hover:text-[#FF6B6B]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-2xl hover:text-[#FF6B6B]">📘</a>
                <a href="#" className="text-2xl hover:text-[#FF6B6B]">📷</a>
                <a href="#" className="text-2xl hover:text-[#FF6B6B]">🐦</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 Embrace. All rights reserved. A safe space for everyone.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;