import { useState, useEffect } from "react";

// Replace with your actual Google Calendar embed src from calendar.google.com > Settings > your calendar > "Integrate calendar"
const GOOGLE_CAL_EMBED = "https://calendar.google.com/calendar/embed?src=sounds.of.buben%40gmail.com&ctz=UTC&mode=MONTH&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0";

const NAV_LINKS = ["Home", "Gear", "Book", "Contact"];

const GEAR = {
  name: "15\" PA System + Mixer",
  description:
    "Professional-grade 15-inch PA speaker with a full-channel mixer. Ideal for small venues, outdoor events, rehearsals, parties, and presentations.",
  specs: [
    { label: "Speaker", value: '15" Electro Voice ZLX-15 BT' },
    { label: "Power", value: "1000W Peak (Powered)" },
    { label: "Mixer", value: "Multi-channel with EQ" },
   // { label: "Coverage", value: "Up to ~200 people" },
    { label: "Includes", value: "Cables, Stands, 10 Channel Yamaha mixer with built-in FX" },
   // { label: "Rental Period", value: "Daily / Weekend" },
  ],
};

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", startDate: "", endDate: "", eventType: "", notes: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFormChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.startDate || !form.endDate) return;
    setFormStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setFormStatus("success");
      else setFormStatus("error");
    } catch {
      setFormStatus("error");
    }
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    setActiveSection(id.toLowerCase());
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.root}>
      {/* Grain overlay */}
      <div style={styles.grain} />

      {/* NAV */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <span style={styles.navLogo} onClick={() => scrollTo("home")}>
          BUBEN<span style={styles.logoAccent}>SOUND</span>
        </span>
        <div style={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              style={{
                ...styles.navLink,
                ...(activeSection === l.toLowerCase() ? styles.navLinkActive : {}),
              }}
              onClick={() => scrollTo(l)}
            >
              {l}
            </button>
          ))}
        </div>
        <button style={styles.hamburger} onClick={() => setMenuOpen((v) => !v)}>
          <span style={{ ...styles.bar, ...(menuOpen ? styles.barTop : {}) }} />
          <span style={{ ...styles.bar, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...styles.bar, ...(menuOpen ? styles.barBot : {}) }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {NAV_LINKS.map((l) => (
            <button key={l} style={styles.mobileLink} onClick={() => scrollTo(l)}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroVisual}>
          <img src="/speaker.jpg" alt="PA System" style={styles.heroImg} class="center"/>
        </div>
        <div style={styles.heroInner}>
          <p style={styles.eyebrow}>— Sound Rental · Nashville, TN</p>
          <p style={styles.heroSub}>
            Professional PA system with mixer available for your event. Request a booking in minutes.
          </p>
          <div style={styles.heroCtas}>
            <button style={styles.ctaPrimary} onClick={() => scrollTo("book")}>
              Book Now
            </button>
            <button style={styles.ctaSecondary} onClick={() => scrollTo("gear")}>
              See the Gear →
            </button>
          </div>
        </div>
        
      </section>

      {/* DIVIDER */}
      <div style={styles.divider} />

      {/* GEAR */}
      <section id="gear" style={styles.section}>
        <p style={styles.sectionEye}>— What We Rent</p>
        <h2 style={styles.sectionTitle}>The Setup</h2>
        <div style={styles.gearCard}>
          <div style={styles.gearLeft}>
            <h3 style={styles.gearName}>{GEAR.name}</h3>
            <p style={styles.gearDesc}>{GEAR.description}</p>
            <button style={styles.ctaPrimary} onClick={() => scrollTo("book")}>
              Request This Setup
            </button>
          </div>
          <div style={styles.gearRight}>
            {GEAR.specs.map((s) => (
              <div key={s.label} style={styles.specRow}>
                <span style={styles.specLabel}>{s.label}</span>
                <span style={styles.specValue}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div style={styles.divider} />

      {/* HOW IT WORKS */}
      <section id="how" style={styles.section}>
        <p style={styles.sectionEye}>— Process</p>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.steps}>
          {[
            { n: "01", t: "Pick a Date", d: "Check my calendar for available dates." },
            { n: "02", t: "Submit Request", d: "Fill in your event details and send a booking request" },
            { n: "03", t: "Pick Up", d: "I'll send you my address to pick up in East Nashville 37206 :), pay and sign quick contract." },
            { n: "04", t: "Return", d: "Return on agreed date (please)!." },
          ].map((s) => (
            <div key={s.n} style={styles.stepCard}>
              <span style={styles.stepNum}>{s.n}</span>
              <h4 style={styles.stepTitle}>{s.t}</h4>
              <p style={styles.stepDesc}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div style={styles.divider} />

      {/* BOOK */}
      <section id="book" style={styles.section}>
        <p style={styles.sectionEye}>— Availability & Booking</p>
        <h2 style={styles.sectionTitle}>Request a Rental</h2>
        <p style={styles.bookSub}>
          Check the calendar for open dates, then fill out the form below. All bookings are manually confirmed within 24 hours. Call or text my number if immediate confirmation is needed for last minute events ;).
        </p>

        {/* Google Calendar */}
        <div style={styles.calWrapper}>
          <p style={styles.calLabel}>Availability Calendar</p>
          <iframe
            src={GOOGLE_CAL_EMBED}
            style={styles.calFrame}
            title="Availability Calendar"
            frameBorder="0"
            scrolling="no"
          />
          <p style={styles.calNote}>Blocked dates = already booked. Reach out if you're unsure.</p>
        </div>

        {/* Booking Form */}
        <div style={styles.formCard}>
          <p style={styles.formHeading}>Booking Request</p>

          {formStatus === "success" ? (
            <div style={styles.successBox}>
              <span style={styles.successIcon}>✓</span>
              <p style={styles.successTitle}>Request received!</p>
              <p style={styles.successSub}>I'll confirm your booking within 24 hours.</p>
            </div>
          ) : (
            <>
              <div style={styles.formGrid}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleFormChange} style={styles.input} placeholder="Jane Smith" />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange} style={styles.input} placeholder="jane@email.com" />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Phone</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleFormChange} style={styles.input} placeholder="(615) 000-0000" />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Event Type</label>
                  <input name="eventType" value={form.eventType} onChange={handleFormChange} style={styles.input} placeholder="e.g. Birthday party, Band rehearsal" />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Start Date *</label>
                  <input name="startDate" type="date" value={form.startDate} onChange={handleFormChange} style={styles.input} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>End Date *</label>
                  <input name="endDate" type="date" value={form.endDate} onChange={handleFormChange} style={styles.input} />
                </div>
              </div>
              <div style={{ ...styles.fieldGroup, marginTop: "1rem" }}>
                <label style={styles.label}>Additional Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleFormChange} style={styles.textarea} rows={4} placeholder="Venue address, setup time, questions..." />
              </div>
              {formStatus === "error" && (
                <p style={styles.errorMsg}>Something went wrong. Please email us directly at hello@bubensound.com</p>
              )}
              <button
                style={{ ...styles.ctaPrimary, marginTop: "1.5rem", opacity: formStatus === "sending" ? 0.6 : 1 }}
                onClick={handleSubmit}
                disabled={formStatus === "sending"}
              >
                {formStatus === "sending" ? "Sending..." : "Submit Request"}
              </button>
            </>
          )}
        </div>
      </section>

      {/* DIVIDER */}
      <div style={styles.divider} />

      {/* CONTACT */}
      <section id="contact" style={styles.section}>
        <p style={styles.sectionEye}>— Get in Touch</p>
        <h2 style={styles.sectionTitle}>Contact</h2>
        <div style={styles.contactGrid}>
          {[
            { label: "Email", val: "hello@bubensound.com", href: "mailto:hello@bubensound.com" },
            { label: "Location", val: "Nashville, TN", href: null },
            { label: "Response Time", val: "Within 24 hours", href: null },
          ].map((c) => (
            <div key={c.label} style={styles.contactCard}>
              <span style={styles.contactLabel}>{c.label}</span>
              {c.href ? (
                <a href={c.href} style={styles.contactVal}>{c.val}</a>
              ) : (
                <span style={styles.contactValPlain}>{c.val}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.footerLogo}>BUBEN<span style={styles.logoAccent}>SOUND</span></span>
        <span style={styles.footerCopy}>© {new Date().getFullYear()} Buben Sound. All rights reserved.</span>
      </footer>
    </div>
  );
}

function SpeakerSVG() {
  return (
    <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="180" height="260" rx="12" fill="#111" stroke="#333" strokeWidth="1.5" />
      <rect x="20" y="20" width="160" height="240" rx="8" fill="#0a0a0a" stroke="#222" strokeWidth="1" />
      {/* woofer */}
      <circle cx="100" cy="130" r="62" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
      <circle cx="100" cy="130" r="50" fill="#111" stroke="#333" strokeWidth="1" />
      <circle cx="100" cy="130" r="36" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
      <circle cx="100" cy="130" r="22" fill="#111" stroke="#555" strokeWidth="1" />
      <circle cx="100" cy="130" r="10" fill="#fff" stroke="#888" strokeWidth="1" />
      {/* tweeter */}
      <ellipse cx="100" cy="40" rx="20" ry="10" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
      <ellipse cx="100" cy="40" rx="10" ry="5" fill="#fff" stroke="#888" strokeWidth="0.5" />
      {/* bass port */}
      <rect x="60" y="225" width="80" height="14" rx="7" fill="#0a0a0a" stroke="#444" strokeWidth="1" />
      {/* handle */}
      <rect x="80" y="6" width="40" height="8" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
    </svg>
  );
}

const styles = {
  root: {
    background: "#080808",
    color: "#f0f0f0",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    minHeight: "100vh",
    position: "relative",
    overflowX: "hidden",
  },
  grain: {
    position: "fixed",
    inset: 0,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundSize: "200px",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.5,
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.2rem 2.5rem",
    transition: "background 0.3s, border-bottom 0.3s",
  },
  navScrolled: {
    background: "rgba(8,8,8,0.92)",
    borderBottom: "0.5px solid #222",
    backdropFilter: "blur(12px)",
  },
  navLogo: {
    fontSize: "1.15rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    cursor: "pointer",
    fontFamily: "'DM Mono', monospace",
  },
  logoAccent: {
    color: "#888",
    fontWeight: 300,
  },
  navLinks: {
    display: "flex",
    gap: "2rem",
    "@media(maxWidth:640px)": { display: "none" },
  },
  navLink: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "4px 0",
    transition: "color 0.2s",
  },
  navLinkActive: {
    color: "#f0f0f0",
    borderBottom: "1px solid #f0f0f0",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "5px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
  },
  bar: {
    display: "block",
    width: "22px",
    height: "1.5px",
    background: "#f0f0f0",
    transition: "transform 0.2s, opacity 0.2s",
  },
  barTop: { transform: "translateY(6.5px) rotate(45deg)" },
  barBot: { transform: "translateY(-6.5px) rotate(-45deg)" },
  mobileMenu: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "#080808",
    zIndex: 90,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2rem",
  },
  mobileLink: {
    background: "none",
    border: "none",
    color: "#f0f0f0",
    fontSize: "1.8rem",
    fontWeight: 300,
    letterSpacing: "0.1em",
    cursor: "pointer",
    textTransform: "uppercase",
  },
  hero: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingTop: "4rem",
    gap: "0",
    position: "relative",
    zIndex: 1,
    flexWrap: "wrap",
  },
  heroInner: {
    flex: "1 1 380px",
    maxWidth: "560px",
    padding: "6rem 2.5rem 4rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    color: "#666",
    textTransform: "uppercase",
    marginBottom: "1.5rem",
  },
  heroTitle: {
    fontSize: "clamp(3rem, 7vw, 5.5rem)",
    fontWeight: 700,
    lineHeight: 1.05,
    marginBottom: "1.5rem",
    letterSpacing: "-0.02em",
  },
  heroTitleStroke: {
    WebkitTextStroke: "1px #f0f0f0",
    color: "transparent",
  },
  heroSub: {
    fontSize: "1.05rem",
    color: "#888",
    lineHeight: 1.7,
    marginBottom: "2.5rem",
    maxWidth: "420px",
  },
  heroCtas: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  ctaPrimary: {
    background: "#f0f0f0",
    color: "#080808",
    border: "none",
    padding: "0.75rem 1.8rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  ctaSecondary: {
    background: "transparent",
    color: "#f0f0f0",
    border: "0.5px solid #444",
    padding: "0.75rem 1.8rem",
    fontSize: "0.85rem",
    letterSpacing: "0.04em",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  heroVisual: {
    flex: "0 1 480px",        // ← controls image column width
    display: "flex",
    alignItems: "stretch"
  },
  speakerBox: {
    width: "90%",
    height: "90%",
    minHeight: "500px",
    objectFit: "cover",
  },
  divider: {
    height: "0.5px",
    background: "#1e1e1e",
    margin: "0 2.5rem",
    position: "relative",
    zIndex: 1,
  },
  section: {
    padding: "6rem 2.5rem",
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  sectionEye: {
    fontSize: "0.72rem",
    letterSpacing: "0.15em",
    color: "#555",
    textTransform: "uppercase",
    marginBottom: "0.75rem",
  },
  sectionTitle: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    marginBottom: "3rem",
  },
  gearCard: {
    display: "flex",
    gap: "3rem",
    flexWrap: "wrap",
    border: "0.5px solid #1e1e1e",
    padding: "2.5rem",
  },
  gearLeft: {
    flex: "1 1 280px",
  },
  gearName: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "1rem",
    letterSpacing: "-0.01em",
  },
  gearDesc: {
    color: "#888",
    lineHeight: 1.7,
    marginBottom: "2rem",
    fontSize: "0.95rem",
  },
  gearRight: {
    flex: "1 1 240px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  specRow: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "0.5px solid #1a1a1a",
    paddingBottom: "0.6rem",
  },
  specLabel: {
    fontSize: "0.78rem",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  specValue: {
    fontSize: "0.88rem",
    color: "#ccc",
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
  stepCard: {
    border: "0.5px solid #1e1e1e",
    padding: "1.75rem",
  },
  stepNum: {
    display: "block",
    fontSize: "0.7rem",
    color: "#444",
    letterSpacing: "0.1em",
    marginBottom: "1rem",
    fontFamily: "'DM Mono', monospace",
  },
  stepTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
  },
  stepDesc: {
    fontSize: "0.85rem",
    color: "#666",
    lineHeight: 1.6,
  },
  bookSub: {
    color: "#777",
    marginTop: "-2rem",
    marginBottom: "2.5rem",
    maxWidth: "520px",
    lineHeight: 1.7,
    fontSize: "0.95rem",
  },
  calWrapper: {
    border: "0.5px solid #1e1e1e",
    overflow: "hidden",
    marginBottom: "2.5rem",
  },
  calLabel: {
    padding: "0.75rem 1.25rem",
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#555",
    borderBottom: "0.5px solid #1a1a1a",
  },
  calFrame: {
    width: "100%",
    height: "520px",
    border: "none",
    display: "block",
    background: "#080808",
    colorScheme: "dark",
  },
  calNote: {
    textAlign: "center",
    padding: "0.75rem 1rem",
    fontSize: "0.78rem",
    color: "#444",
    borderTop: "0.5px solid #1a1a1a",
  },
  formCard: {
    border: "0.5px solid #1e1e1e",
    padding: "2.5rem",
  },
  formHeading: {
    fontSize: "1rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    marginBottom: "2rem",
    textTransform: "uppercase",
    color: "#aaa",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.25rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.72rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#555",
  },
  input: {
    background: "#0d0d0d",
    border: "0.5px solid #2a2a2a",
    color: "#f0f0f0",
    padding: "0.65rem 0.9rem",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
  },
  textarea: {
    background: "#0d0d0d",
    border: "0.5px solid #2a2a2a",
    color: "#f0f0f0",
    padding: "0.65rem 0.9rem",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    resize: "vertical",
  },
  errorMsg: {
    color: "#cc4444",
    fontSize: "0.82rem",
    marginTop: "1rem",
  },
  successBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 1rem",
    gap: "0.75rem",
  },
  successIcon: {
    fontSize: "2rem",
    color: "#f0f0f0",
  },
  successTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
  },
  successSub: {
    color: "#666",
    fontSize: "0.9rem",
  },
  link: {
    color: "#aaa",
    textDecoration: "underline",
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1px",
    border: "0.5px solid #1e1e1e",
    overflow: "hidden",
  },
  contactCard: {
    padding: "1.75rem",
    background: "#0d0d0d",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  contactLabel: {
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    color: "#555",
    textTransform: "uppercase",
  },
  contactVal: {
    fontSize: "1rem",
    color: "#ccc",
    textDecoration: "none",
  },
  contactValPlain: {
    fontSize: "1rem",
    color: "#ccc",
  },
  footer: {
    borderTop: "0.5px solid #1a1a1a",
    padding: "2rem 2.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    position: "relative",
    zIndex: 1,
  },
  footerLogo: {
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    fontFamily: "'DM Mono', monospace",
  },
  footerCopy: {
    fontSize: "0.78rem",
    color: "#444",
  },
};
