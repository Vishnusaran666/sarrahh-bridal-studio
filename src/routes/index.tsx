import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import heroImg from "@/assets/hero.jpg";
import craftImg from "@/assets/craft.jpg";
import bride1 from "@/assets/bride1.jpg";
import bride2 from "@/assets/bride2.jpg";
import bride3 from "@/assets/bride3.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

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
            <div
              key={item.key}
              className="shrink-0 px-3"
              style={{ width: `${100 / perView}%` }}
            >
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

function ArchFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden bg-wine"
      style={{ borderTopLeftRadius: "50% 30%", borderTopRightRadius: "50% 30%" }}
    >
      {children}
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

function Index() {
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const open = (t: BookingType) => setBooking(t);

  return (
    <div className="min-h-screen bg-cream text-foreground" style={{ scrollBehavior: "smooth" }}>
      {/* Top urgency strip */}
      <div className="bg-[color:var(--wine-deep)] text-cream-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-[11px] tracking-[0.18em] uppercase sm:text-xs">
          <span className="pulse-strip inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          <span>Only 10 appointments open this month — book now</span>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[color:var(--gold)]/25 bg-cream/85 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 sm:px-8">
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
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Sarrahh bridal collection"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--wine-deep)]/70 via-[color:var(--wine)]/55 to-[color:var(--wine-deep)]/90" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center text-cream-soft sm:py-32 md:py-40">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.5em] text-gold-soft">Sarrahh · Est. Craft</p>
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
              With ₹1 Lakh+ bridal Aari work creations and a craftsmanship-first approach, we help
              every bride feel confident on her biggest day.
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
      <section id="why" className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <div className="gold-divider mx-auto w-24" />
            <h2 className="mt-6 font-serif text-3xl leading-tight text-wine sm:text-4xl md:text-5xl">
              Why travel far when your Wedding Wardrobe Partner is near you?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/80">
              Most brides travel to bigger cities believing they'll find better bridal outfits. At
              Sarrahh, we bring the same premium bridal experience closer to home — with
              personalized designs, expert craftsmanship, and fittings that make you feel confident.
            </p>
            <div className="gold-divider mx-auto mt-8 w-24" />
          </Reveal>
        </div>
      </section>

      {/* WE DON'T FOLLOW CATALOGUES */}
      <section className="bg-cream-soft py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative">
              <div
                className="absolute -inset-4 -z-10 opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, var(--gold) 0%, transparent 60%)",
                }}
              />
              <ArchFrame>
                <img
                  src={craftImg}
                  alt="Aari craftsmanship close-up"
                  loading="lazy"
                  width={1200}
                  height={1408}
                  className="h-[520px] w-full object-cover"
                />
              </ArchFrame>
            </div>
          </Reveal>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Personalized · Handcrafted</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-wine sm:text-5xl">
              Your Wedding.
              <br />
              <span className="italic">Your Style.</span>
            </h2>
            <div className="gold-divider mt-6 w-20" />
            <p className="mt-6 text-base leading-relaxed text-foreground/80">
              We don't ask you to choose from hundreds of catalogue designs. Instead, we create
              outfits inspired by your personality, your saree, your vision, and your wedding
              style. Because every bride deserves a look that feels uniquely hers.
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
      <section id="process" className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">In Three Considered Steps</p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl">The Sarrahh Process</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
            {[
              {
                icon: "📅",
                title: "Book Your Bridal Consultation",
                text: "Meet us in the studio or connect online.",
              },
              {
                icon: "🪡",
                title: "Design Your Dream Outfit",
                text: "We understand your vision and customize it with expert craftsmanship.",
              },
              {
                icon: "✨",
                title: "Walk Into Your Wedding",
                text: "Receive your perfectly crafted bridal outfit, ready for your biggest day.",
              },
            ].map((s, i) => (
              <Reveal key={s.title} className="relative">
                <div className="relative flex h-full flex-col items-center rounded-2xl border border-[color:var(--gold)]/30 bg-cream-soft px-6 py-10 text-center shadow-sm">
                  <div className="mb-2 font-serif text-xs uppercase tracking-[0.3em] text-gold">
                    Step {i + 1}
                  </div>
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--gold) 0%, var(--wine) 100%)",
                      color: "var(--cream-soft)",
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
                    className="pointer-events-none absolute left-1/2 top-full my-4 -translate-x-1/2 text-gold md:left-full md:top-1/2 md:my-0 md:-translate-x-1/2 md:-translate-y-1/2"
                  >
                    <span className="hidden md:inline">— — —▸</span>
                    <span className="md:hidden">▼</span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BRIDES WHO TRUSTED */}
      <section id="brides" className="bg-cream-soft py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <div className="flex justify-center gap-1 text-2xl text-gold">
              {"★★★★★".split("").map((_, i) => (
                <span key={i}>★</span>
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

          <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-3 md:overflow-visible">
            {[
              {
                img: bride1,
                quote:
                  "I was planning to travel to Coimbatore, but after visiting Sarrahh, I knew this was the right place.",
                name: "Priya · Tiruppur",
              },
              {
                img: bride2,
                quote:
                  "They designed my blouse around my grandmother's saree. It felt like the most personal thing I own.",
                name: "Meera · Karur",
              },
              {
                img: bride3,
                quote:
                  "From consultation to final fitting, every step felt considered. I felt like their only bride.",
                name: "Anitha · Erode",
              },
            ].map((t) => (
              <Reveal key={t.name} className="min-w-[85%] snap-center md:min-w-0">
                <article className="flex h-full flex-col rounded-2xl border border-[color:var(--gold)]/30 bg-cream p-7 shadow-sm">
                  <div className="flex items-center gap-4">
                    <img
                      src={t.img}
                      alt={t.name}
                      loading="lazy"
                      width={64}
                      height={64}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-[color:var(--gold)]/50"
                    />
                    <div>
                      <div className="flex gap-0.5 text-sm text-gold">★★★★★</div>
                      <p className="font-serif text-sm text-wine">{t.name}</p>
                    </div>
                  </div>
                  <p className="mt-5 font-serif text-lg italic leading-relaxed text-foreground/85">
                    "{t.quote}"
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-foreground/50">
            (Real customer photos & reviews)
          </p>
        </div>
      </section>

      {/* WHY BRIDES CHOOSE US */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Craft · Care · Confidence</p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl">Why Brides Choose Us</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {[
              "Designed around your own style",
              "No catalogue-based designs",
              "Personalized bridal consultation",
              "Premium Aari craftsmanship",
              "Perfect fitting process",
              "Timely delivery",
              "Bridal outfit customization",
            ].map((item) => (
              <Reveal key={item}>
                <div className="flex items-center gap-4 rounded-xl border border-[color:var(--gold)]/25 bg-cream-soft px-5 py-4">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-cream-soft"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--gold) 0%, var(--wine) 100%)",
                    }}
                  >
                    ✓
                  </span>
                  <span className="font-serif text-lg text-wine">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <section className="bg-cream-soft py-20 sm:py-24">
        <Reveal className="mx-auto max-w-2xl px-6 text-center">
          <div className="text-5xl text-gold">★★★★★</div>
          <h3 className="mt-4 font-serif text-3xl text-wine sm:text-4xl">Google Rating</h3>
          <p className="mt-2 text-sm uppercase tracking-[0.28em] text-foreground/60">
            Real Reviews · Real Brides
          </p>
          <div className="gold-divider mx-auto mt-6 w-24" />
          <div className="mt-8 rounded-2xl border border-dashed border-[color:var(--gold)]/50 bg-cream px-6 py-10 text-sm text-foreground/60">
            [ Google Reviews widget embeds here ]
          </div>
        </Reveal>
      </section>

      {/* VIDEO TESTIMONIALS */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Watch · Listen · Feel</p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl">Video Testimonials</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { title: "Bride Experiences", img: bride1 },
              { title: "Bridal Transformations", img: bride2 },
              { title: "Customer Stories", img: bride3 },
            ].map((v) => (
              <Reveal key={v.title}>
                <button className="group relative block w-full overflow-hidden rounded-2xl">
                  <img
                    src={v.img}
                    alt={v.title}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--wine-deep)]/90 via-[color:var(--wine)]/30 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="flex h-16 w-16 items-center justify-center rounded-full text-2xl text-cream-soft ring-2 ring-[color:var(--gold)]"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--gold) 0%, var(--wine) 100%)",
                      }}
                    >
                      ▶
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                    <h4 className="font-serif text-xl text-cream-soft">{v.title}</h4>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-cream-soft py-20 sm:py-28">
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
                <details className="group rounded-xl border border-[color:var(--gold)]/30 bg-cream px-5 py-4 open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-serif text-lg text-wine">{f.q}</span>
                    <span className="text-2xl text-gold transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXCLUSIVE BENEFITS */}
      <section className="bg-wine py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div
              className="rounded-3xl p-1"
              style={{
                background:
                  "linear-gradient(135deg, var(--gold) 0%, var(--gold-soft) 50%, var(--gold) 100%)",
                boxShadow: "0 30px 80px -30px color-mix(in oklab, var(--gold) 60%, transparent)",
              }}
            >
              <div className="rounded-[calc(1.5rem-4px)] bg-wine-deep px-8 py-12 text-cream-soft">
                <p className="text-center text-xs uppercase tracking-[0.35em] text-gold-soft">
                  A Considered Welcome
                </p>
                <h2 className="mt-4 text-center font-serif text-3xl sm:text-4xl">
                  Book your consultation and receive
                </h2>
                <div className="gold-divider mx-auto mt-6 w-24" />
                <ul className="mx-auto mt-8 max-w-lg space-y-4">
                  {[
                    "Personalized Bridal Consultation",
                    "Design Suggestions Based on Your Style",
                    "Priority Appointment Slot",
                    "Exclusive Bridal Benefit (Shared Only During Consultation)",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-wine-deep">
                        ✓
                      </span>
                      <span className="font-serif text-lg">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* URGENCY STRIP REPEAT */}
      <div
        className="border-y border-[color:var(--gold)]/50"
        style={{
          background: "linear-gradient(90deg, var(--wine) 0%, var(--wine-deep) 50%, var(--wine) 100%)",
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
      <section id="book" className="relative overflow-hidden bg-wine py-24 sm:py-32">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, var(--gold) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--gold) 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center text-cream-soft">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-gold-soft">The Final Step</p>
            <h2 className="mt-6 font-serif text-3xl leading-tight sm:text-5xl">
              Your dream bridal outfit doesn't have to begin with a long drive to another city.
            </h2>
            <p className="mt-6 font-serif text-xl italic text-gold-soft">
              It begins with one consultation.
            </p>
            <div className="gold-divider mx-auto mt-8 w-32" />
            <p className="mt-8 font-serif text-2xl sm:text-3xl">
              Book Your Bridal Appointment Today
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={() => open("studio")}
                className="btn-gold w-full rounded-full px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] sm:w-auto"
              >
                Book Studio Visit
              </button>
              <button
                onClick={() => open("online")}
                className="btn-outline-gold w-full rounded-full px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] sm:w-auto"
              >
                Book Online Consultation
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
              <li><a href="#top" className="hover:text-gold">Home</a></li>
              <li><a href="#why" className="hover:text-gold">Collections</a></li>
              <li><a href="#brides" className="hover:text-gold">About Us</a></li>
              <li><a href="#book" className="hover:text-gold">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Contact</h4>
            <p className="text-sm leading-relaxed">
              Sarrahh Bridal Studio<br />
              Tiruppur, Tamil Nadu<br />
              +91 00000 00000<br />
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
