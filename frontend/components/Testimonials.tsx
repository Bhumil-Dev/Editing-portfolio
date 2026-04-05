'use client'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { testimonials } from '@/data'

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding relative overflow-hidden bg-dark-100">
      <div className="absolute inset-0 bg-gradient-to-b from-dark to-dark-100" />
      {/* Decorative quote — hidden on mobile to avoid overlap */}
      <div className="absolute top-20 left-10 text-cyan/3 text-[120px] md:text-[200px] font-display leading-none select-none pointer-events-none hidden sm:block">"</div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan" />
            <span className="text-cyan font-mono text-xs tracking-[0.4em]">TESTIMONIALS</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-white"
          >
            What Clients <span className="cyan-text">Say</span>
          </motion.h2>
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Swiper modules={[Autoplay, Pagination]} spaceBetween={24} slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="pb-12"
          >
            {testimonials.map(t => (
              <SwiperSlide key={t.id}>
                <div className="glass p-8 rounded-2xl h-full hover:glass-cyan transition-all duration-300 group border border-white/5 hover:border-cyan/20">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-cyan text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 group-hover:text-white/70 transition-colors">"{t.review}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan/20 flex-shrink-0">
                      <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-display font-bold text-sm">{t.name}</p>
                      <p className="text-cyan/50 font-mono text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  )
}
