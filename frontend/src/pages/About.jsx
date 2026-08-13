import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const stats = [
  { value: '10K+', label: 'Happy customers' },
  { value: '500+', label: 'Premium styles' },
  { value: '50+', label: 'Global brands' },
  { value: '4.9★', label: 'Average rating' },
];

const values = [
  {
    title: 'Premium quality',
    copy: 'Every pair is sourced from verified manufacturers and passes a strict quality review before it reaches your door.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: 'Built to last',
    copy: 'We believe footwear should outlast trends. Our curation focuses on durability, comfort, and timeless silhouettes.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Worldwide delivery',
    copy: 'Fast, tracked, and insured shipping to over 80 countries. Your order is protected from warehouse to doorstep.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'Customer first',
    copy: 'Easy returns, responsive support, and a checkout experience designed to feel effortless at every step.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const team = [
  { name: 'Aizaz Khan', role: 'Founder & CEO', initials: 'AK' },
  { name: 'Sara Ahmed', role: 'Head of Design', initials: 'SA' },
  { name: 'Omar Farooq', role: 'Lead Engineer', initials: 'OF' },
  { name: 'Nadia Malik', role: 'Customer Experience', initials: 'NM' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', delay: i * 0.07 },
  }),
};

const About = () => {
  return (
    <div className="space-y-20 pb-16">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[38px] bg-[radial-gradient(circle_at_top_left,_rgba(0,255,136,0.18),_transparent_28%),linear-gradient(135deg,#0B0B0B_0%,#121212_50%,#1A1A1A_100%)] px-6 py-16 text-white shadow-[0_35px_100px_rgba(11,11,11,0.22)] md:px-12 md:py-24"
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="section-kicker text-[#00FF88]">Our story</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.95] md:text-7xl">
            We exist to move
            <span className="block text-[#00FF88]">people forward.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/70 md:text-lg">
            I.Shoes was founded on a simple belief — that premium footwear should be accessible, beautifully presented, and backed by a shopping experience that matches the quality of the product.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/products" className="rounded-full bg-[#00FF88] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5">
              Shop now
            </Link>
            <Link to="/contact" className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur transition-transform hover:-translate-y-0.5">
              Get in touch
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            custom={i}
            className="glass-panel rounded-[28px] p-6 text-center"
          >
            <div className="text-4xl font-semibold text-black">{stat.value}</div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-black/45">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="grid gap-10 rounded-[36px] bg-white/70 p-8 shadow-[0_24px_70px_rgba(11,11,11,0.06)] backdrop-blur md:grid-cols-2 md:p-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="section-kicker">Our mission</p>
          <h2 className="section-title">Footwear that moves with you.</h2>
          <p className="mt-4 text-sm leading-8 text-black/60">
            We set out to build more than a store. I.Shoes is a curated destination where every product is chosen for quality, design, and real-world wearability. From everyday sneakers to occasion-ready boots, we cover every step of your journey.
          </p>
          <p className="mt-4 text-sm leading-8 text-black/60">
            Our platform is built from the ground up with a focus on speed, clarity, and a checkout experience that feels as premium as the shoes themselves.
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          custom={1}
          className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0b0b0b,#1a1a1a)] p-8 text-white"
        >
          <p className="section-kicker text-[#00FF88]">What drives us</p>
          <ul className="mt-6 space-y-5">
            {['Design that earns attention', 'Quality that justifies the price', 'Commerce that respects your time', 'Delivery that you can trust'].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-7 text-white/75">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00FF88]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-8 text-center">
          <p className="section-kicker">What we stand for</p>
          <h2 className="section-title">Our core values</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {values.map((val, i) => (
            <motion.div
              key={val.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              className="glass-panel rounded-[28px] p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-black/5 text-black/70">
                {val.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-black">{val.title}</h3>
              <p className="mt-2 text-sm leading-7 text-black/58">{val.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="rounded-[36px] bg-[#0b0b0b] px-8 py-12 text-white shadow-[0_30px_80px_rgba(11,11,11,0.2)]">
        <div className="mb-10 text-center">
          <p className="section-kicker text-[#00FF88]">The people</p>
          <h2 className="section-title text-white">Behind I.Shoes</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00FF88] text-xl font-bold text-black">
                {member.initials}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{member.name}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="glass-panel rounded-[36px] p-10 text-center md:p-16"
      >
        <p className="section-kicker">Ready to shop?</p>
        <h2 className="section-title">Find your next favourite pair.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-black/58">
          Browse our full catalog and discover styles built for every occasion, season, and stride.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/products" className="rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5">
            Browse catalog
          </Link>
          <Link to="/contact" className="rounded-full border border-black/15 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black/70 transition hover:-translate-y-0.5 hover:text-black">
            Contact us
          </Link>
        </div>
      </motion.section>

    </div>
  );
};

export default About;
