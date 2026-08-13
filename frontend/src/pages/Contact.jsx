import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const contactDetails = [
  {
    title: 'Email us',
    value: 'support@ishoes.com',
    sub: 'We reply within 24 hours',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    title: 'Hours',
    value: 'Mon – Sat, 9am – 6pm',
    sub: 'PKT (UTC+5)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Shipping',
    value: 'Worldwide delivery',
    sub: 'Tracked & insured',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Returns',
    value: '30-day easy returns',
    sub: 'No questions asked',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
      </svg>
    ),
  },
];

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5–10 business days. Express options are available at checkout for 2–3 business day delivery.' },
  { q: 'Can I return or exchange my order?', a: 'Yes. We offer free returns within 30 days of delivery for unworn items in original packaging. Exchanges are processed within 3–5 business days.' },
  { q: 'How do I find my correct size?', a: 'Each product page includes a full size guide with measurements in EU, UK, and US sizing. When in doubt, size up.' },
  { q: 'Do you ship internationally?', a: 'We ship to over 80 countries worldwide. Duties and taxes may apply depending on your region and are calculated at checkout.' },
  { q: 'How do I track my order?', a: "Once your order ships, you'll receive a tracking number by email. You can also check your order history in your account dashboard." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', delay: i * 0.07 },
  }),
};

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app this would call an API endpoint
    setSubmitted(true);
  };

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
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="section-kicker text-[#00FF88]">Get in touch</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.95] md:text-7xl">
            We'd love to
            <span className="block text-[#00FF88]">hear from you.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-white/70">
            Have a question about an order, a product, or just want to say hello? Fill in the form below and we'll get back to you as soon as possible.
          </p>
        </div>
      </motion.section>

      {/* ── Info cards ───────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {contactDetails.map((item, i) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            custom={i}
            className="glass-panel rounded-[28px] p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-black/5 text-black/70">
              {item.icon}
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-black/40">{item.title}</p>
            <p className="mt-1 text-base font-semibold text-black">{item.value}</p>
            <p className="mt-0.5 text-xs text-black/50">{item.sub}</p>
          </motion.div>
        ))}
      </section>

      {/* ── Contact form ─────────────────────────────────────────────────── */}
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="glass-panel rounded-[36px] p-8 md:p-10"
        >
          <p className="section-kicker">Send a message</p>
          <h2 className="section-title">We're here to help.</h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="mt-8 rounded-[24px] border border-[#00FF88]/30 bg-[#00FF88]/8 p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00FF88] text-black">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-black">Message sent!</h3>
              <p className="mt-2 text-sm text-black/55">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-6 rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold text-black/70 transition hover:text-black"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Aizaz Khan"
                    className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3.5 text-sm text-black outline-none placeholder:text-black/30 transition focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3.5 text-sm text-black outline-none placeholder:text-black/30 transition focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Order inquiry, product question…"
                  className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3.5 text-sm text-black outline-none placeholder:text-black/30 transition focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help…"
                  className="w-full resize-none rounded-2xl border border-black/10 bg-white/90 px-4 py-3.5 text-sm text-black outline-none placeholder:text-black/30 transition focus:border-[#00FF88] focus:ring-2 focus:ring-[#00FF88]/20"
                />
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                data-magnetic
                data-magnetic-strength="0.12"
                className="w-full rounded-2xl bg-black py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-black/80"
              >
                Send message
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          custom={1}
          className="space-y-4"
        >
          <div className="mb-6">
            <p className="section-kicker">Quick answers</p>
            <h2 className="section-title">Frequently asked</h2>
          </div>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[22px] border border-black/8 bg-white/80 backdrop-blur"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-black"
                aria-expanded={openFaq === i}
              >
                {faq.q}
                <motion.span
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-xl leading-none text-black/40"
                >
                  +
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <p className="px-6 pb-5 text-sm leading-7 text-black/58">{faq.a}</p>
              </motion.div>
            </div>
          ))}

          <div className="mt-6 rounded-[22px] bg-[#0b0b0b] p-6 text-white">
            <p className="text-sm font-semibold text-[#00FF88]">Still need help?</p>
            <p className="mt-1 text-sm leading-7 text-white/65">Can't find the answer you're looking for? Drop us a message and we'll respond within 24 hours.</p>
            <a href="mailto:support@ishoes.com" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15">
              support@ishoes.com
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Contact;
