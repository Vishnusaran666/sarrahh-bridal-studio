import { useEffect, useRef, useState, type ReactNode } from "react";
import heroImg from "@/assets/hero.jpg";
import craftImg from "@/assets/craft.jpg";
import bride1 from "@/assets/bride1.jpg";
import bride2 from "@/assets/bride2.jpg";
import bride3 from "@/assets/bride3.jpg";
import { CalendarHeart, Scissors, Wand2, Star, Play, Plus, CheckCircle2 } from "lucide-react";

type RevealVariant = "up" | "left" | "right" | "scale";
function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const anim =
    variant === "left"
      ? "fade-in-left"
      : variant === "right"
        ? "fade-in-right"
        : variant === "scale"
          ? "scale-in"
          : "fade-up";
  return (
    <div
      ref={ref}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
      className={`${className} ${visible ? anim : "opacity-0"}`}
    >
      {children}
    </div>
  );
}

function useParallax() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}

function Counter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number;
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) window.requestAnimationFrame(step);
          };
          window.requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

function Carousel({
  items,
  renderItem,
  className = "",
  visible = 3,
}: {
  items: Array<{ key: string }>;
  renderItem: (item: { key: string }, i: number) => ReactNode;
  className?: string;
  visible?: number;
}) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    const compute = () =>
      setPerView(window.innerWidth >= 1024 ? visible : window.innerWidth >= 640 ? 2 : 1);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [visible]);
  const maxIndex = Math.max(0, items.length - perView);
  const clamped = Math.min(index, maxIndex);
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));
  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
          style={{ transform: `translateX(-${(clamped * 100) / perView}%)` }}
        >
          {items.map((item, i) => (
            <div key={item.key} className="shrink-0 px-3" style={{ width: `${100 / perView}%` }}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          disabled={clamped === 0}
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--gold)]/60 text-wine transition-all hover:bg-gold hover:text-cream-soft disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === clamped ? "w-8 bg-gold" : "w-2 bg-wine/25 hover:bg-wine/50"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          disabled={clamped >= maxIndex}
          aria-label="Next"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--gold)]/60 text-wine transition-all hover:bg-gold hover:text-cream-soft disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
    </div>
  );
}

type BookingType = "studio" | "online";

function BookingModal({
  open,
  onClose,
  type,
}: {
  open: boolean;
  onClose: () => void;
  type: BookingType;
}) {
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (!open) setSubmitted(false);
  }, [open]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-[color:var(--wine-deep)]/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-cream-soft p-8 shadow-2xl ring-1 ring-[color:var(--gold)]/40">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-wine hover:text-gold text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Sarrahh</p>
          <h3 className="mt-2 font-serif text-3xl text-wine">
            {type === "studio" ? "Book Studio Visit" : "Book Online Consultation"}
          </h3>
          <div className="gold-divider mx-auto mt-4 w-24" />
        </div>
        {submitted ? (
          <div className="py-6 text-center">
            <p className="font-serif text-2xl text-wine">Thank you.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Our bridal team will reach out within 24 hours to confirm your appointment.
            </p>
            <button
              onClick={onClose}
              className="btn-gold mt-6 rounded-full px-6 py-2.5 text-sm font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <Field label="Full Name" name="name" type="text" required />
            <Field label="Phone Number" name="phone" type="tel" required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Preferred Date" name="preferred" type="date" required />
              <Field label="Wedding Date" name="wedding" type="date" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-wine/80">
                Consultation Type
              </label>
              <select
                defaultValue={type}
                className="w-full rounded-lg border border-[color:var(--gold)]/50 bg-white px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
              >
                <option value="studio">Studio Visit</option>
                <option value="online">Online Consultation</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-gold mt-2 w-full rounded-full px-6 py-3 text-sm font-medium tracking-wide"
            >
              Confirm Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-wider text-wine/80">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-[color:var(--gold)]/50 bg-white px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
      />
    </div>
  );
}

const NAV_LINKS = [
  { href: "#why", label: "Why Sarrahh" },
  { href: "#process", label: "Process" },
  { href: "#brides", label: "Brides" },
  { href: "#faq", label: "FAQ" },
  { href: "#book", label: "Book" },
];

const TESTIMONIALS = [
  {
    key: "t1",
    img: bride1,
    quote:
      "I was planning to travel to Coimbatore, but after visiting Sarrahh, I knew this was the right place.",
    name: "Priya · Tiruppur",
  },
  {
    key: "t2",
    img: bride2,
    quote:
      "They designed my blouse around my grandmother's saree. It felt like the most personal thing I own.",
    name: "Meera · Karur",
  },
  {
    key: "t3",
    img: bride3,
    quote:
      "From consultation to final fitting, every step felt considered. I felt like their only bride.",
    name: "Anitha · Erode",
  },
  {
    key: "t4",
    img: bride1,
    quote: "The Aari work is impossibly fine. My blouse looked like an heirloom on day one.",
    name: "Kavya · Pollachi",
  },
  {
    key: "t5",
    img: bride2,
    quote: "Booked an online consultation first and it saved us three trips. So thoughtful.",
    name: "Divya · Chennai",
  },
];

const VIDEOS = [
  { key: "v1", title: "Bride Experiences", img: bride1 },
  { key: "v2", title: "Bridal Transformations", img: bride2 },
  { key: "v3", title: "Customer Stories", img: bride3 },
  { key: "v4", title: "Studio Fittings", img: bride1 },
];

export default function App() {
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const open = (t: BookingType) => setBooking(t);
  const scrollY = useParallax();

  return (
    <div className="min-h-screen bg-cream text-foreground" style={{ scrollBehavior: "smooth" }}>
      {/* Top urgency strip */}
      <div className="bg-[color:var(--wine-deep)] text-cream-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-[11px] tracking-[0.18em] uppercase sm:text-xs">
          <span className="pulse-strip inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          <span>
            Only <Counter end={10} /> appointments open this month — book now
          </span>
        </div>
      </div>

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 border-b border-[color:var(--gold)]/25 transition-all duration-500 flex items-center ${scrollY > 50 ? "bg-[color:var(--cream-soft)]/95 backdrop-blur-xl h-16 shadow-[0_10px_30px_-10px_rgba(40,10,15,0.08)]" : "bg-cream/40 backdrop-blur h-24"}`}
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-semibold tracking-[0.22em] text-wine">
              SARRAHH
            </span>
          </a>
          <nav className="hidden justify-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm uppercase tracking-[0.15em] text-wine/80 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => open("studio")}
              className="btn-gold hidden rounded-full px-5 py-2 text-xs font-medium uppercase tracking-widest md:inline-flex"
            >
              Book Now
            </button>
            <button
              className="md:hidden rounded-md border border-wine/30 p-2 text-wine"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Menu"
            >
              <span className="block h-0.5 w-5 bg-wine" />
              <span className="mt-1 block h-0.5 w-5 bg-wine" />
              <span className="mt-1 block h-0.5 w-5 bg-wine" />
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="border-t border-[color:var(--gold)]/25 bg-cream md:hidden">
            <nav className="flex flex-col px-6 py-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setNavOpen(false)}
                  className="py-2 text-sm uppercase tracking-[0.15em] text-wine/80"
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setNavOpen(false);
                  open("studio");
                }}
                className="btn-gold mt-3 rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-widest"
              >
                Book Appointment
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(${1 + Math.min(scrollY, 400) * 0.0004})`,
          }}
        >
          <img
            src={heroImg}
            alt="Sarrahh bridal collection"
            width={1920}
            height={1280}
            className="h-[120%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--wine-deep)]/85 via-[color:var(--wine)]/65 to-[color:var(--wine-deep)]/95" />
        </div>
        <div
          className="relative mx-auto max-w-6xl px-6 py-32 text-center text-cream-soft sm:py-44 md:py-52"
          style={{ transform: `translate3d(0, ${scrollY * -0.12}px, 0)` }}
        >
          <Reveal>
            <p className="text-xs uppercase tracking-[0.5em] text-gold-soft">
              Sarrahh · Est. Craft
            </p>
            <div className="gold-divider mx-auto mt-6 w-32" />
            <h1 className="mt-8 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              Your Wedding Wardrobe
              <br />
              <span className="italic text-gold-soft">Partner Near You.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm text-cream-soft/85 sm:text-base">
              Stop travelling to cities for your dream bridal outfit. At Sarrahh, we create bridal
              blouses and customized wedding outfits designed around your style, not catalogue
              designs.
            </p>
            <p className="mx-auto mt-4 max-w-xl font-serif text-sm italic text-gold-soft/95 sm:text-base">
              With ₹<Counter end={1} /> Lakh+ bridal Aari work creations and a craftsmanship-first
              approach, we help every bride feel confident on her biggest day.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={() => open("studio")}
                className="btn-gold w-full rounded-full px-8 py-3.5 text-sm font-medium uppercase tracking-[0.18em] sm:w-auto"
              >
                Book Studio Visit
              </button>
              <button
                onClick={() => open("online")}
                className="btn-outline-gold w-full rounded-full px-8 py-3.5 text-sm font-medium uppercase tracking-[0.18em] sm:w-auto"
              >
                Book Online Consultation
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY SARRAHH */}
      <section id="why" className="bg-gradient-to-b from-cream to-cream-soft py-32 sm:py-48">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <blockquote className="relative inline-block p-10 md:p-16">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
              <span className="text-6xl text-gold-soft/50 absolute top-4 left-4 font-serif leading-none opacity-50">
                “
              </span>
              <h2 className="relative font-serif text-3xl italic tracking-wide leading-relaxed text-wine sm:text-4xl md:text-5xl">
                Why travel far when your Wedding Wardrobe Partner is near you?
              </h2>
              <span className="text-6xl text-gold-soft/50 absolute bottom-0 right-4 font-serif leading-none opacity-50">
                ”
              </span>
            </blockquote>
            <p className="mx-auto mt-8 max-w-2xl text-sm tracking-[0.2em] uppercase text-foreground/60 font-medium">
              The Boutique Experience, Closer to Home
            </p>
          </Reveal>
        </div>
      </section>

      {/* WE DON'T FOLLOW CATALOGUES */}
      <section className="relative bg-gradient-to-b from-cream-soft to-cream py-32 sm:py-40">
        <div className="bg-luxury-pattern absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
          <Reveal variant="left">
            <div className="relative p-6 md:p-10 bg-cream">
              <div className="absolute inset-0 border border-[color:var(--gold)]/30 m-2" />
              <div className="img-luxury relative z-10 w-[105%] ml-[-2%] md:ml-[-5%] shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--wine)_55%,transparent)]">
                <img
                  src={craftImg}
                  alt="Aari craftsmanship close-up"
                  loading="lazy"
                  width={1200}
                  height={1408}
                  className="h-[560px] w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              Personalized · Handcrafted
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-wine sm:text-5xl">
              Your Wedding.
              <br />
              <span className="italic">Your Style.</span>
            </h2>
            <div className="gold-divider mt-6 w-20" />
            <p className="mt-6 text-base leading-relaxed text-foreground/80">
              We don't ask you to choose from hundreds of catalogue designs. Instead, we create
              outfits inspired by your personality, your saree, your vision, and your wedding style.
              Because every bride deserves a look that feels uniquely hers.
            </p>
            <button
              onClick={() => open("studio")}
              className="btn-gold mt-8 inline-flex rounded-full px-7 py-3 text-xs font-medium uppercase tracking-[0.18em]"
            >
              Start Your Design
            </button>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-gradient-to-b from-cream to-cream-soft py-32 sm:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              In Three Considered Steps
            </p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl">The Sarrahh Process</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
            {[
              {
                icon: <CalendarHeart className="icon-elegant w-8 h-8" />,
                title: "Book Your Bridal Consultation",
                text: "Meet us in the studio or connect online.",
              },
              {
                icon: <Scissors className="icon-elegant w-8 h-8" />,
                title: "Design Your Dream Outfit",
                text: "We understand your vision and customize it with expert craftsmanship.",
              },
              {
                icon: <Wand2 className="icon-elegant w-8 h-8" />,
                title: "Walk Into Your Wedding",
                text: "Receive your perfectly crafted bridal outfit, ready for your biggest day.",
              },
            ].map((s, i) => (
              <Reveal key={s.title} className="relative" delay={i * 120}>
                <div className="glass-card group card-lift relative flex h-full flex-col items-center rounded-3xl px-6 py-12 text-center">
                  <div className="mb-2 font-serif text-xs uppercase tracking-[0.3em] text-gold">
                    Step {i + 1}
                  </div>
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, var(--gold) 0%, var(--wine) 100%)",
                      color: "var(--cream-soft)",
                      boxShadow:
                        "0 12px 30px -12px color-mix(in oklab, var(--gold) 55%, transparent)",
                    }}
                  >
                    {s.icon}
                  </div>
                  <h3 className="mt-6 font-serif text-2xl text-wine">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">{s.text}</p>
                </div>
                {i < 2 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-full my-6 -translate-x-1/2 md:left-full md:top-1/2 md:my-0 md:-translate-x-1/2 md:-translate-y-1/2 z-0"
                  >
                    <div className="hidden md:block w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                    <div className="md:hidden w-[1px] h-10 bg-gradient-to-b from-transparent via-gold to-transparent" />
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BRIDES WHO TRUSTED */}
      <section
        id="brides"
        className="relative bg-gradient-to-b from-cream-soft to-cream py-32 sm:py-40"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <div className="flex justify-center gap-1.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="icon-elegant w-6 h-6 fill-current" />
              ))}
            </div>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl">
              Brides Who Trusted Sarrahh
            </h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {["Chennai", "Tiruppur", "Karur", "Erode", "Pollachi", "Dharapuram"].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[color:var(--gold)]/60 bg-cream px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-wine"
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Carousel
              items={TESTIMONIALS}
              renderItem={(item) => {
                const t = item as (typeof TESTIMONIALS)[number];
                return (
                  <article className="glass-card card-lift flex h-full flex-col p-8 rounded-3xl relative">
                    <span className="text-6xl text-gold/20 absolute right-8 top-8 font-serif leading-none pointer-events-none">
                      ”
                    </span>
                    <p className="mt-2 font-serif text-lg italic leading-relaxed text-foreground/85 relative z-10 grow">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-4 mt-8">
                      <img
                        src={t.img}
                        alt={t.name}
                        loading="lazy"
                        width={64}
                        height={64}
                        className="h-14 w-14 rounded-full object-cover ring-2 ring-[color:var(--gold)]/50 transition-transform duration-500 hover:scale-110 shadow-lg"
                      />
                      <div>
                        <div className="flex gap-0.5 text-gold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="mt-1 font-serif text-sm text-wine">{t.name}</p>
                      </div>
                    </div>
                  </article>
                );
              }}
            />
          </Reveal>
          <p className="mt-2 text-center text-xs text-foreground/50">
            (Real customer photos & reviews)
          </p>
        </div>
      </section>

      {/* WHY BRIDES CHOOSE US */}
      <section className="bg-gradient-to-b from-cream to-cream-soft py-32 sm:py-40">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              Craft · Care · Confidence
            </p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl">Why Brides Choose Us</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-y-16">
            {[
              "Designed around your own style",
              "No catalogue-based designs",
              "Personalized bridal consultation",
              "Premium Aari craftsmanship",
              "Perfect fitting process",
              "Bridal outfit customization",
            ].map((item, i) => (
              <Reveal key={item} delay={i * 80} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-wine mb-5 bg-[color:var(--gold-soft)]/10 relative">
                  <div className="absolute inset-0 rounded-full border border-gold/30 scale-[1.15]" />
                  <CheckCircle2
                    strokeWidth={1}
                    className="h-8 w-8 opacity-80 icon-elegant text-gold"
                  />
                </div>
                <span className="font-serif text-xl tracking-wide text-wine block mb-2 px-4">
                  {item}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <section className="relative bg-gradient-to-b from-cream-soft to-cream py-32 sm:py-40">
        <div className="bg-luxury-pattern absolute inset-0 opacity-40 pointer-events-none" />
        <Reveal className="relative mx-auto max-w-2xl px-6 flex justify-center">
          <div className="flex flex-col items-center justify-center p-12 bg-cream rounded-full w-80 h-80 shadow-[0_30px_60px_-20px_color-mix(in_oklab,var(--wine)_25%,transparent)] border border-[color:var(--gold)]/20 relative">
            <div className="absolute inset-4 rounded-full border border-dashed border-[color:var(--gold)]/50 pointer-events-none" />
            <div className="text-4xl text-gold mb-2 tracking-widest">★★★★★</div>
            <h3 className="font-serif text-3xl text-wine text-center">
              Google
              <br />
              Rating
            </h3>
            <p className="mt-4 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-foreground/50 text-center font-medium">
              Real Reviews
              <br />
              Real Brides
            </p>
          </div>
        </Reveal>
        <Reveal className="mt-8 text-center relative z-10 w-full flex justify-center">
          <div className="px-6 py-3 text-xs uppercase tracking-widest bg-wine text-cream-soft rounded-full shadow-xl opacity-90 inline-block border border-[color:var(--gold)]/30">
            [ Google Reviews widget embeds here ]
          </div>
        </Reveal>
      </section>

      {/* VIDEO TESTIMONIALS */}
      <section className="bg-gradient-to-b from-cream to-cream-soft py-32 sm:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Watch · Listen · Feel</p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl">Video Testimonials</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>
          <Reveal className="mt-12">
            <Carousel
              items={VIDEOS}
              renderItem={(item) => {
                const v = item as (typeof VIDEOS)[number];
                return (
                  <button className="img-luxury group relative block w-full text-left">
                    <img
                      src={v.img}
                      alt={v.title}
                      loading="lazy"
                      width={800}
                      height={1000}
                      className="h-80 w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--wine-deep)]/95 via-[color:var(--wine)]/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full text-cream-soft ring-[1px] ring-[color:var(--gold)] backdrop-blur-md bg-wine/40 transition-all duration-700 ease-out group-hover:scale-110 group-hover:bg-wine/60 shadow-[0_0_40px_rgba(40,10,15,0.4)]">
                        <Play className="ml-1 h-6 w-6 fill-current opacity-90" />
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                      <h4 className="font-serif text-xl text-cream-soft">{v.title}</h4>
                    </div>
                  </button>
                );
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gradient-to-b from-cream-soft to-cream py-32 sm:py-40">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Answers For Every Bride</p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>
          <div className="mt-12 space-y-3">
            {[
              {
                q: "Do I need to travel to Coimbatore for a premium bridal outfit?",
                a: "Not anymore. Sarrahh offers personalized bridal craftsmanship and premium customization right here, closer to you.",
              },
              {
                q: "Can you create my own design?",
                a: "Yes. Every bridal outfit is customized based on your ideas and preferences — not from a catalogue.",
              },
              {
                q: "When should I book my bridal appointment?",
                a: "We recommend booking as early as possible after your wedding date is finalized to secure your preferred consultation slot.",
              },
              {
                q: "Can I book an online consultation first?",
                a: "Yes. Brides from other cities can start with an online consultation before visiting our studio.",
              },
              {
                q: "Do you customize bridal blouses and lehengas?",
                a: "Yes. We specialize in customized bridal blouses and bridal outfits designed exclusively for each bride.",
              },
            ].map((f) => (
              <Reveal key={f.q}>
                <details
                  data-faq
                  className="glass-card group rounded-2xl px-6 py-5 transition-all duration-300 open:border-[color:var(--gold)]/70 hover:border-[color:var(--gold)]/60"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-serif text-lg text-wine">{f.q}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--gold)]/50 text-gold transition-transform duration-500 group-open:rotate-[135deg] group-open:border-[color:var(--gold)] group-open:bg-gold group-open:text-cream-soft">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <div className="faq-body">
                    <div>
                      <p className="pt-4 text-sm leading-relaxed text-foreground/75">{f.a}</p>
                    </div>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXCLUSIVE BENEFITS */}
      <section className="bg-gradient-to-b from-wine to-wine-deep py-32 sm:py-48">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="invitation-card px-8 text-wine py-16 sm:px-16 sm:py-20 text-center mx-auto max-w-2xl bg-luxury-pattern">
              <p className="text-center text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                A Considered Welcome
              </p>
              <h2 className="mt-6 text-center font-serif text-3xl sm:text-4xl italic font-light tracking-wide">
                Book your consultation and receive
              </h2>
              <div className="gold-divider mx-auto mt-8 w-16" />
              <ul className="mx-auto mt-10 max-w-lg space-y-6 text-left inline-block">
                {[
                  "Personalized Bridal Consultation",
                  "Design Suggestions Based on Your Style",
                  "Priority Appointment Slot",
                  "Exclusive Bridal Benefit (Shared Only During Consultation)",
                ].map((b) => (
                  <li key={b} className="group flex items-center gap-4">
                    <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-gold transition-transform duration-500 group-hover:scale-150" />
                    <span className="font-serif text-[1.15rem] text-wine/90 tracking-wide">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* URGENCY STRIP REPEAT */}
      <div
        className="border-y border-[color:var(--gold)]/50"
        style={{
          background:
            "linear-gradient(90deg, var(--wine) 0%, var(--wine-deep) 50%, var(--wine) 100%)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-4 text-center text-cream-soft">
          <span className="pulse-strip inline-block h-2 w-2 rounded-full bg-gold" />
          <p className="text-xs font-medium uppercase tracking-[0.2em] sm:text-sm">
            ⚡ Only 10 appointments open this month — Book now
          </p>
        </div>
      </div>

      {/* FINAL CTA */}
      <section
        id="book"
        className="relative overflow-hidden py-32 sm:py-48 bg-gradient-to-b from-wine to-wine-deep"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(circle at 20% 40%, var(--gold) 0%, transparent 50%), radial-gradient(circle at 80% 60%, var(--gold) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 bg-luxury-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-6 text-center text-cream-soft">
          <Reveal>
            <div className="gold-divider mx-auto w-24 mb-6" />
            <p className="text-sm uppercase tracking-[0.4em] text-gold-soft font-semibold">
              The Final Step
            </p>
            <h2 className="mt-8 font-serif text-4xl leading-tight sm:text-6xl font-light">
              Your dream bridal outfit doesn't have to begin with a long drive.
            </h2>
            <p className="mt-8 font-serif text-3xl italic text-gold-soft opacity-90">
              It begins with one consultation.
            </p>
            <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <button
                onClick={() => open("studio")}
                className="btn-gold w-full flex items-center justify-center gap-2 rounded-full px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] sm:w-auto ring-4 ring-gold/10"
              >
                <span>Book Studio Visit</span>
              </button>
              <button
                onClick={() => open("online")}
                className="btn-outline-gold w-full flex items-center justify-center gap-2 rounded-full px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] sm:w-auto"
              >
                <span>Online Consultation</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-wine-deep py-14 text-cream-soft/80">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-4">
          <div>
            <h3 className="font-serif text-2xl tracking-[0.22em] text-cream-soft">SARRAHH</h3>
            <div className="gold-divider mt-4 w-16" />
            <p className="mt-4 text-sm leading-relaxed">
              Handcrafted bridal outfits, designed around you. Your wedding wardrobe partner near
              you.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#top" className="hover:text-gold">
                  Home
                </a>
              </li>
              <li>
                <a href="#why" className="hover:text-gold">
                  Collections
                </a>
              </li>
              <li>
                <a href="#brides" className="hover:text-gold">
                  About Us
                </a>
              </li>
              <li>
                <a href="#book" className="hover:text-gold">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Contact</h4>
            <p className="text-sm leading-relaxed">
              Sarrahh Bridal Studio
              <br />
              Tiruppur, Tamil Nadu
              <br />
              +91 00000 00000
              <br />
              hello@sarrahh.in
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Follow</h4>
            <div className="flex gap-3">
              {["Instagram", "Facebook", "WhatsApp"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--gold)]/40 text-xs uppercase tracking-widest text-gold-soft transition-colors hover:bg-gold hover:text-wine-deep"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-cream-soft/10 px-6 pt-6 text-center text-xs text-cream-soft/50">
          © {new Date().getFullYear()} Sarrahh Bridal Studio. Crafted with care.
        </div>
      </footer>

      <BookingModal
        open={booking !== null}
        type={booking ?? "studio"}
        onClose={() => setBooking(null)}
      />
    </div>
  );
}
