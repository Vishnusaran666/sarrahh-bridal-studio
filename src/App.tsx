import { useEffect, useRef, useState, type ReactNode } from "react";
import heroImg from "@/assets/hero.jpg";
import craftImg from "@/assets/craft.jpg";
import bride1 from "@/assets/bride1.jpg";
import bride2 from "@/assets/bride2.jpg";
import bride3 from "@/assets/bride3.jpg";
import {
  CalendarHeart,
  Scissors,
  Wand2,
  Star,
  Play,
  Plus,
  CheckCircle2,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Heart,
  Award,
  Globe
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";

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
  decimals = 0,
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
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
            setCount(progress * end);
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

  const displayCount = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}
      {displayCount}
      {suffix}
    </span>
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
        className="absolute inset-0 bg-[color:var(--wine-deep)]/75 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-cream-soft p-8 shadow-2xl ring-1 ring-[color:var(--gold)]/40 transition-all duration-300 transform scale-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-wine hover:text-gold text-2xl leading-none transition-colors"
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-gold font-semibold">Sarrahh Bridal</p>
          <h3 className="mt-2 font-serif text-3xl text-wine">
            {type === "studio" ? "Book Studio Visit" : "Book Online Consultation"}
          </h3>
          <div className="gold-divider mx-auto mt-4 w-24" />
        </div>
        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-wine">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="font-serif text-2xl text-wine">Thank you, Bride.</p>
            <p className="mt-2 text-sm text-muted-foreground px-2">
              Our bridal team will reach out via WhatsApp or Call within 24 hours to finalize your customized consultation slot.
            </p>
            <button
              onClick={onClose}
              className="btn-gold mt-6 rounded-full px-8 py-2.5 text-sm font-medium"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get("name") as string;
              const phone = formData.get("phone") as string;
              const preferred = formData.get("preferred") as string;
              const wedding = formData.get("wedding") as string;
              const consultType = formData.get("type") as string;

              const message = `Hello Sarrahh Boutique! 🌸\n\nI would like to book a bridal consultation. Here are my details:\n\n*Name:* ${name}\n*Phone/WhatsApp:* ${phone}\n*Preferred Date:* ${preferred}\n*Wedding Date:* ${wedding || "Not fixed yet"}\n*Consultation Type:* ${consultType === "studio" ? "Studio Visit (Kangayam Studio)" : "Online Consultation (Video Call)"}\n\nPlease confirm my slot. Thank you!`;

              const whatsappUrl = `https://api.whatsapp.com/send?phone=919786412345&text=${encodeURIComponent(message)}`;

              window.open(whatsappUrl, "_blank");
              setSubmitted(true);
            }}
          >
            <Field label="Full Name" name="name" type="text" placeholder="Enter your full name" required />
            <Field label="Phone Number / WhatsApp" name="phone" type="tel" placeholder="Enter 10 digit number" required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Preferred Date" name="preferred" type="date" required />
              <Field label="Wedding Date" name="wedding" type="date" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-wine/80 font-medium">
                Consultation Type
              </label>
              <select
                name="type"
                defaultValue={type}
                className="w-full rounded-lg border border-[color:var(--gold)]/50 bg-white px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="studio">Studio Visit (Kangayam Studio)</option>
                <option value="online">Online Consultation (Video Call)</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-gold mt-4 w-full rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-widest"
            >
              Request Consultation
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
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-wider text-wine/80 font-medium">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-[color:var(--gold)]/50 bg-white px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
      />
    </div>
  );
}

const NAV_LINKS = [
  { href: "#why", label: "Why Sarrahh" },
  { href: "#transformations", label: "Transformations" },
  { href: "#process", label: "Process" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

const PHOTOS = [
  { url: "/photos/Picsart_26-06-27_09-41-27-355.png", title: "Velvet Red Bridal Perfection" },
  { url: "/photos/Picsart_26-06-27_09-50-20-474.png", title: "Handcrafted Golden Peacock Aari Motif" },
  { url: "/photos/Picsart_26-06-27_09-54-43-854.png", title: "Intricate Sleeves Detail Work" },
  { url: "/photos/Picsart_26-06-28_17-47-19-185.jpg.jpeg", title: "Symmetric Border Stitching Elegance" },
  { url: "/photos/Picsart_26-06-28_17-48-08-437.png", title: "Custom Fit Silk Blouse Finish" },
  { url: "/photos/202394.png", title: "Exquisite Bridal Look" },
  { url: "/photos/202411.jpg.jpeg", title: "Traditional Silk Beauty" },
  { url: "/photos/202413.jpg.jpeg", title: "Classic Aari Embellishment" },
  { url: "/photos/202415.png", title: "Elegant Back Neck Design" },
  { url: "/photos/202417.png", title: "Golden Thread Intricacy" },
  { url: "/photos/202427.png", title: "Perfect Shoulder Fit" },
  { url: "/photos/202444.jpg.jpeg", title: "Custom Fitted Bridal Blouse" },
  { url: "/photos/202449.png", title: "Regal Bridal Transformation" },
  { url: "/photos/202461.png", title: "Bespoke Handcrafted Detail" },
  { url: "/photos/202463.png", title: "Timeless Elegance Stitching" },
  { url: "/photos/202469.png", title: "Master Tailored Finish" }
];

const VIDEOS = [
  { url: "/transformation_videos/VID-20260704-WA0010.mp4", category: "Transformations", title: "Perfect Sleeve Fit & Aari Detail" },
  { url: "/transformation_videos/VID-20260704-WA0011.mp4", category: "Transformations", title: "Heavy Bridal Back Neck Finishing" },
  { url: "/transformation_videos/VID-20260704-WA0013.mp4", category: "Transformations", title: "Golden Zardosi Detailing Reel" },
  { url: "/transformation_videos/VID-20260704-WA0014.mp4", category: "Transformations", title: "Exquisite Sleeve Handwork Showcase" },
  { url: "/transformation_videos/202290.mp4", category: "Transformations", title: "Bridal Fitting Transformation" },
  { url: "/transformation_videos/202292.mp4", category: "Transformations", title: "Perfect Stitching Walkthrough" },

  { url: "/transformation_videos/VID-20260704-WA0015.mp4", category: "Experiences", title: "First Trial Fit & Embroidery Glow" },
  { url: "/transformation_videos/VID-20260704-WA0016.mp4", category: "Experiences", title: "Happy Bride In Studio Fitting room" },
  { url: "/transformation_videos/VID-20260704-WA0017.mp4", category: "Experiences", title: "Real-time Blouse Finishing Inspection" },
  { url: "/transformation_videos/VID-20260704-WA0020.mp4", category: "Experiences", title: "Reception Look Final Trial Walk" },

  { url: "/transformation_videos/VID-20260526-WA0032.mp4", category: "Stories", title: "Saree Pleating & Fitted Blouse Match" },
  { url: "/transformation_videos/VID-20260704-WA0027.mp4", category: "Stories", title: "Details Of Master Tailoring Process" }
];

interface Review {
  id: number;
  name: string;
  avatar: string;
  role?: string;
  meta: string; // "Local Guide · 44 reviews"
  date: string;
  rating: number;
  text: string;
  tags: string[];
  photos?: string[];
  ownerReply?: string;
}

const REVIEWS_DATA: Review[] = [
  {
    id: 1,
    name: "Cool Breeze",
    avatar: "C",
    role: "Local Guide · 44 reviews",
    meta: "Local Guide · 44 reviews · 8 photos",
    date: "a month ago",
    rating: 5,
    text: "Really happy with their work! The blouse fitting was perfect, and the aari work was done beautifully with great finishing and detailing. They also help with design ideas and suggestions, which was very useful. The team is very approachable and professional.",
    tags: ["fitting", "aari work"],
    photos: ["/photos/Picsart_26-06-27_09-41-27-355.png", "/photos/Picsart_26-06-27_09-50-20-474.png"]
  },
  {
    id: 2,
    name: "Rosilla Robert",
    avatar: "R",
    role: "2 reviews",
    meta: "2 reviews · 2 photos",
    date: "2 weeks ago",
    rating: 5,
    text: "The work and fit of the blouses were awesome, no alterations needed. Whether it's normal blouse or bridal blouses best results with great precision. Worth for every penny. Akkas work is awesome, can come here and never be disappointed.",
    tags: ["fitting", "blouse stitching"],
    ownerReply: "Dear Rosilla, Reading your review felt like receiving a personal note from a friend. Knowing that you loved the fitting, finishing, and overall experience means a lot to us. Your trust inspires us to keep raising our standards every single day. Thank you for being part of the Sarrahh family. Warm regards, Sarrahh Boutique & Tailors"
  },
  {
    id: 3,
    name: "Jeevitha",
    avatar: "J",
    role: "1 review",
    meta: "1 review",
    date: "2 months ago",
    rating: 5,
    text: "Sarrahh truly understands customer needs and delivers exactly what is requested. The stitching and craftsmanship are outstanding. Every detail was carefully attended to and I am completely satisfied with the results.",
    tags: ["blouse stitching"]
  },
  {
    id: 4,
    name: "Selva Krithika",
    avatar: "S",
    role: "2 reviews",
    meta: "2 reviews",
    date: "4 months ago",
    rating: 5,
    text: "I and my sis had a great experience with this boutique for blouse and chudi stitching. The tailoring was neat, precise, and perfectly matched our measurements. The fitting was excellent, especially around the shoulders and sleeves, which is usually very tricky. Highly recommend!",
    tags: ["fitting", "blouse stitching"]
  },
  {
    id: 5,
    name: "Selvanayaki M",
    avatar: "S",
    role: "1 review",
    meta: "1 review",
    date: "a month ago",
    rating: 5,
    text: "Excellent stitching work with neat finishing and perfect fitting. The dress was completed on time and designed exactly as expected. Good fabric and you fulfilled my expectations mam.",
    tags: ["fitting", "blouse stitching"]
  },
  {
    id: 6,
    name: "Harivarsha 3333",
    avatar: "H",
    role: "2 reviews",
    meta: "2 reviews",
    date: "5 months ago",
    rating: 5,
    text: "The dress stitching experience was truly delightful and fulfilling. From selecting the fabric and taking careful measurements to cutting the pieces and joining them with neat stitches, every step felt creative and exciting. As the design came together, it was really satisfying to see the final result. Great work!",
    tags: ["blouse stitching"]
  },
  {
    id: 7,
    name: "karthika sadhasivam",
    avatar: "K",
    role: "6 reviews",
    meta: "6 reviews · 2 photos",
    date: "4 months ago",
    rating: 5,
    text: "Finding that \"perfect fit\" for an Aari work blouse is a blend of precision tailoring and strategic design and the team Sarrahh has done it on point.",
    tags: ["fitting", "aari work"],
    photos: ["/photos/Picsart_26-06-27_09-54-43-854.png"]
  },
  {
    id: 8,
    name: "Aaraadanas Nest",
    avatar: "A",
    role: "1 review",
    meta: "1 review",
    date: "a month ago",
    rating: 1,
    text: "I came here after reading these reviews about this boutique..but I didn't expect this worst stitching style.. not worth for money which i paid..charged too much fair this worst stitching ..I paid more for this and the neckline is uneven.",
    tags: ["blouse stitching"]
  },
  {
    id: 9,
    name: "shanthi thangavel",
    avatar: "S",
    role: "1 review",
    meta: "1 review · 5 photos",
    date: "5 months ago",
    rating: 5,
    text: "Amazing service! She listens to you carefully and stitches exactly what you request for nd very good stitching and perfect fitting, I loved the finishing of the blouses. Thank you so much for timely delivery and for stitching the blouses perfectly sisy ….. I’m so happy with your service sisy …I highly recommend.",
    tags: ["fitting", "blouse stitching"],
    photos: ["/photos/Picsart_26-06-28_17-47-19-185.jpg.jpeg", "/photos/Picsart_26-06-28_17-48-08-437.png"]
  },
  {
    id: 10,
    name: "Nivetha Moorthi",
    avatar: "N",
    role: "4 reviews",
    meta: "4 reviews · 3 photos",
    date: "a year ago",
    rating: 5,
    text: "I had placed my wedding blouses orders here. The work and fitting were so satisfying. You can share your preferences and get the exact output. Any type of alterations can be done immediately. I am really happy with their work.",
    tags: ["fitting", "blouse designs"],
    photos: ["/photos/Picsart_26-06-27_09-41-27-355.png"]
  },
  {
    id: 11,
    name: "Yamu Senthil",
    avatar: "Y",
    role: "1 review",
    meta: "1 review",
    date: "2 weeks ago",
    rating: 5,
    text: "Perfect stitching and fittings. Specifically timing is perfect. My blouses are all beautiful. Thank you akka.",
    tags: ["fitting", "blouse stitching"],
    ownerReply: "Dear yamuna, Behind every blouse we create is a team that works with passion and care. Your appreciation reminds us why we love what we do. Thank you for choosing us and for taking the time to share your experience. We are grateful to be a small part of your special moments. With love, Sarrahh Boutique"
  },
  {
    id: 12,
    name: "Teenu Pappu",
    avatar: "T",
    role: "1 review",
    meta: "1 review",
    date: "3 weeks ago",
    rating: 5,
    text: "Perfect fitting and excellent stitching. Very comfortable to wear—highly satisfied with Sarahh Boutique! 😊",
    tags: ["fitting", "blouse stitching"],
    ownerReply: "Dear Teena, Among hundreds of designs, fittings, and busy days, messages like yours make us pause and smile. Thank you for noticing the effort behind our work. We are grateful to have customers like you. Love, Team Sarrahh"
  },
  {
    id: 13,
    name: "Sahajan Sk",
    avatar: "S",
    role: "1 review",
    meta: "1 review",
    date: "6 months ago",
    rating: 5,
    text: "I stitched two of my bridal blouses at sarrahh. Two in another shop. I regret for not giving all my blouses here, because those two blouses were completely spoiled and took matching clothes and done all the reworks at sarrahh. They were my lifesavers. Truly recommend sarrahh for any bridal stitching!",
    tags: ["fitting", "blouse designs"]
  },
  {
    id: 14,
    name: "Govarthini Shanmugam",
    avatar: "G",
    role: "2 reviews",
    meta: "2 reviews",
    date: "5 months ago",
    rating: 5,
    text: "Excellent stitching. After ages i found a nice place without any hype they are doing their work perfectly. No noise, no exaggeration. Simply perfect. I strongly recommend nd once you visit you will realise what I'm telling.",
    tags: ["blouse stitching"]
  },
  {
    id: 15,
    name: "Kani Raj",
    avatar: "K",
    role: "2 reviews",
    meta: "2 reviews · 2 photos",
    date: "a year ago",
    rating: 5,
    text: "This is my first experience in Sarrah botique..Even I gave them at the last moment, within 3 days I got all my 3 blouses beautifully stitched and worked as in the reference given. The best thing is that the aari works are neat. We can trust them to the fullest.",
    tags: ["aari work", "blouse stitching"],
    photos: ["/photos/Picsart_26-06-27_09-50-20-474.png"],
    ownerReply: "Thank you so much da. It's our pleasure to be a part of your happy moments."
  },
  {
    id: 16,
    name: "Santhiya V",
    avatar: "S",
    role: "3 reviews",
    meta: "3 reviews",
    date: "2 months ago",
    rating: 5,
    text: "I stitched 2 blouses here, first time I got my perfect fittings.they made my expectations fulfilled,Thank you soo much sister..Will continue with my future fittings🤝",
    tags: ["fitting", "blouse stitching"]
  },
  {
    id: 17,
    name: "Hema Santhosh",
    avatar: "H",
    role: "Local Guide · 39 reviews",
    meta: "Local Guide · 39 reviews · 6 photos",
    date: "2 years ago",
    rating: 5,
    text: "Regular follower of Sarrahh boutique in insta. Got my first designer blouse stitched. I am impressed by their aari work. Stitching is good and work is quite decent and professional and they made exactly what I asked for. Inspite of her busy schedule, she took out time and gave personal attention which I really appreciated.",
    tags: ["aari work", "blouse stitching"],
    photos: ["/photos/Picsart_26-06-27_09-41-27-355.png"],
    ownerReply: "Thank you dear 🙏 you really made my day 🥰"
  },
  {
    id: 18,
    name: "Mohana Priya T",
    avatar: "M",
    role: "2 reviews",
    meta: "2 reviews",
    date: "a month ago",
    rating: 5,
    text: "Stitching was so nice for my reception ..the outfit came out very well..All the guests appreciated about the outfit",
    tags: ["blouse stitching"]
  },
  {
    id: 19,
    name: "Michael Michael",
    avatar: "M",
    role: "1 review",
    meta: "1 review",
    date: "a month ago",
    rating: 5,
    text: "Awesome fitting and finishing. Really after long I got what I want. Frock is really very cute. Just loved it.",
    tags: ["fitting"]
  },
  {
    id: 20,
    name: "kavi kutty",
    avatar: "K",
    role: "1 review",
    meta: "1 review · 1 photo",
    date: "2 months ago",
    rating: 5,
    text: "Yenakku romba pudichurukku nice romba happy na tq akka nalla irukku yenakku romba romba pudichurukku",
    tags: ["blouse stitching"]
  },
  {
    id: 21,
    name: "Subhashini Sathiyaseelan",
    avatar: "S",
    role: "3 reviews",
    meta: "3 reviews",
    date: "3 weeks ago",
    rating: 5,
    text: "Satisfied, stitching was good and whatever we are asking they are doing as expected.",
    tags: ["blouse stitching"],
    ownerReply: "Dear Suba, Some customers walk into our boutique and leave as customers. Some leave as a beautiful memory. Thank you for your kind words and for trusting us with your outfit. Your appreciation means more than you know. With heartfelt gratitude, Sarrahh Boutique"
  }
];

export default function App() {
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [transTab, setTransTab] = useState<"gallery" | "experiences">("gallery");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxVideo, setLightboxVideo] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<string>("All");
  const [reviewSort, setReviewSort] = useState<string>("Most relevant");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [reviewsHovered, setReviewsHovered] = useState(false);

  const scrollReviews = (direction: "left" | "right") => {
    const container = reviewScrollRef.current;
    if (container) {
      const scrollAmount = 405;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = reviewScrollRef.current;
    if (!container || reviewsHovered) return;

    const interval = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 405, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [reviewsHovered]);

  const [experiencesHovered, setExperiencesHovered] = useState(false);

  useEffect(() => {
    const container = expScrollRef.current;
    if (!container || experiencesHovered || transTab !== "experiences") return;

    const interval = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const scrollAmount = container.clientWidth * 0.75;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [experiencesHovered, transTab]);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const transScrollRef = useRef<HTMLDivElement>(null);
  const expScrollRef = useRef<HTMLDivElement>(null);
  const storiesScrollRef = useRef<HTMLDivElement>(null);
  const photoStoriesScrollRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const scrollY = useParallax();
  const open = (t: BookingType) => setBooking(t);

  const handleVideoHoverStart = (url: string) => {
    const video = videoRefs.current[url];
    if (video) {
      video.play().catch(() => { });
    }
  };

  const handleVideoHoverEnd = (url: string) => {
    const video = videoRefs.current[url];
    if (video) {
      video.pause();
    }
  };

  // Filter & Sort Reviews
  const getFilteredReviews = () => {
    let list = [...REVIEWS_DATA];

    // Filter
    if (reviewFilter !== "All") {
      list = list.filter((r) => r.tags.includes(reviewFilter.toLowerCase()));
    }

    // Sort
    if (reviewSort === "Newest") {
      // Custom ordering mimicking dates
      const dateWeight: Record<string, number> = {
        "2 weeks ago": 1,
        "3 weeks ago": 2,
        "a month ago": 3,
        "2 months ago": 4,
        "4 months ago": 5,
        "5 months ago": 6,
        "6 months ago": 7,
        "a year ago": 8,
        "2 years ago": 9,
      };
      list.sort((a, b) => (dateWeight[a.date] || 99) - (dateWeight[b.date] || 99));
    } else if (reviewSort === "Highest") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (reviewSort === "Lowest") {
      list.sort((a, b) => a.rating - b.rating);
    } else {
      // "Most relevant" - custom weight
      const relevance: Record<number, number> = {
        2: 1, // Rosilla Robert
        1: 2, // Cool Breeze
        13: 3, // Sahajan Sk
        14: 4, // Govarthini
        9: 5, // Shanthi Thangavel
        11: 6, // Yamu
        12: 7, // Teenu
      };
      list.sort((a, b) => (relevance[a.id] || 99) - (relevance[b.id] || 99));
    }
    return list;
  };

  const filteredReviews = getFilteredReviews();

  return (
    <div className="min-h-screen bg-cream text-foreground antialiased" style={{ scrollBehavior: "smooth" }}>

      {/* Top Urgency Strip — auto-running ticker */}
      <div className="bg-[color:var(--wine-deep)] text-cream-soft border-b border-[color:var(--gold)]/20 sticky top-0 z-[60] overflow-hidden">
        <div className="relative flex items-center h-9" aria-label="Announcement ticker">
          {/* Scrolling track — duplicated for seamless loop */}
          <div className="ticker-run flex items-center whitespace-nowrap will-change-transform">
            {[0, 1].map((copy) => (
              <span key={copy} className="flex items-center">
                {/* Message 1 */}
                <span className="flex items-center gap-2 px-10 text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
                  <span className="pulse-strip inline-block h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <span className="font-semibold text-gold-soft">Every outfit here is handmade.</span>
                </span>
                {/* Divider */}
                <span className="text-gold/40 px-2 text-base leading-none select-none">✦</span>
                {/* Message 2 */}
                <span className="flex items-center gap-2 px-10 text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
                  <span className="pulse-strip inline-block h-1.5 w-1.5 rounded-full bg-gold shrink-0" style={{ animationDelay: "0.9s" }} />
                  <span className="font-semibold text-gold-soft">That means we take limited bookings each month.</span>
                </span>
                {/* Divider */}
                <span className="text-gold/40 px-2 text-base leading-none select-none">✦</span>
              </span>
            ))}
          </div>
          {/* Live badge pinned to right edge */}
          <span className="absolute right-4 flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-gold/70 font-semibold pointer-events-none select-none">
            <span className="pulse-strip inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            Live
          </span>
        </div>
      </div>


      {/* Navbar */}
      <header
        className={`sticky top-[36px] z-50 border-b border-[color:var(--gold)]/20 transition-all duration-500 flex items-center ${scrollY > 50
          ? "bg-[color:var(--cream-soft)]/90 backdrop-blur-xl h-16 shadow-[0_10px_30px_-10px_rgba(40,10,15,0.08)]"
          : "bg-cream/40 backdrop-blur h-24"
          }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="flex items-center">
            <img
              src="/new_logo.png"
              alt="Sarrahh Logo"
              className={`w-auto object-contain transition-all duration-500 ${scrollY > 50 ? "h-11 sm:h-12" : "h-16 sm:h-20"
                }`}
            />
          </a>
          <nav className="hidden justify-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs uppercase tracking-[0.18em] font-medium text-wine/80 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => open("studio")}
              className="btn-gold hidden rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-widest md:inline-flex"
            >
              Book Studio Visit
            </button>
            <button
              className="md:hidden ml-auto rounded-md border border-wine/30 p-2 text-wine"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Menu"
            >
              <span className="block h-0.5 w-5 bg-wine" />
              <span className="mt-1.5 block h-0.5 w-5 bg-wine" />
              <span className="mt-1.5 block h-0.5 w-5 bg-wine" />
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="absolute top-full left-0 right-0 border-b border-[color:var(--gold)]/25 bg-cream md:hidden shadow-xl animate-fade-in">
            <nav className="flex flex-col px-6 py-5 space-y-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setNavOpen(false)}
                  className="text-xs uppercase tracking-[0.18em] font-medium text-wine/85 hover:text-gold py-1.5 border-b border-gold/10"
                >
                  {l.label}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setNavOpen(false);
                    open("studio");
                  }}
                  className="btn-gold rounded-full py-3 text-[10px] font-bold uppercase tracking-widest text-center"
                >
                  Studio Visit
                </button>
                <button
                  onClick={() => {
                    setNavOpen(false);
                    open("online");
                  }}
                  className="btn-outline-gold rounded-full py-3 text-[10px] font-bold uppercase tracking-widest text-center"
                >
                  Online Call
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="top" className="relative overflow-hidden min-h-[100dvh] sm:min-h-[92vh] flex items-center">

        {/* ── Gold shimmer top border ── */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent z-20" />

        {/* ── Parallax Background ── */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(0, ${scrollY * 0.28}px, 0) scale(${1 + Math.min(scrollY, 500) * 0.0003})` }}
        >
          <img
            src="/herobg.png"
            alt="Sarrahh bridal couture collection"
            width={1920}
            height={1280}
            className="h-full w-full object-cover object-center sm:h-[115%]"
          />
          {/* Deep cinematic overlay stack */}
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--wine-deep)]/80 via-[color:var(--wine)]/55 to-[color:var(--wine-deep)]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
          {/* Warm golden center spotlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_55%,rgba(197,160,90,0.10)_0%,rgba(0,0,0,0)_65%,rgba(0,0,0,0.5)_100%)]" />
        </div>

        {/* ── Floating ambient gold orbs ── */}
        <div className="absolute top-[12%] left-[8%] w-48 h-48 rounded-full bg-gold/15 blur-3xl pointer-events-none orb-pulse" />
        <div className="absolute bottom-[18%] right-[6%] w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" style={{ animation: "orb-pulse 8s ease-in-out 2s infinite" }} />
        <div className="absolute top-[40%] right-[15%] w-32 h-32 rounded-full bg-gold-soft/10 blur-2xl pointer-events-none" style={{ animation: "orb-pulse 5s ease-in-out 1s infinite" }} />

        {/* ── Floating gold dust particles ── */}
        <div className="absolute top-[22%] left-[18%] w-2.5 h-2.5 rounded-full bg-gold/70 pointer-events-none hero-float-1" />
        <div className="absolute top-[35%] left-[72%] w-1.5 h-1.5 rounded-full bg-gold-soft/80 pointer-events-none hero-float-2" />
        <div className="absolute top-[65%] left-[28%] w-2 h-2 rounded-full bg-gold/60 pointer-events-none hero-float-3" />
        <div className="absolute top-[55%] right-[22%] w-1.5 h-1.5 rounded-full bg-gold-soft/70 pointer-events-none hero-float-1" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[78%] left-[55%] w-2 h-2 rounded-full bg-gold/50 pointer-events-none hero-float-2" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[18%] right-[32%] w-1 h-1 rounded-full bg-gold/90 pointer-events-none hero-float-3" style={{ animationDelay: "1.5s" }} />

        {/* ── Sparkle stars ── */}
        <div className="absolute top-[28%] left-[38%] text-gold/70 text-lg pointer-events-none sparkle-1">✦</div>
        <div className="absolute top-[72%] right-[38%] text-gold-soft/60 text-sm pointer-events-none sparkle-2">✦</div>
        <div className="absolute top-[48%] left-[12%] text-gold/50 text-base pointer-events-none sparkle-3">✦</div>

        {/* ── Main content ── */}
        <div
          className="relative mx-auto w-full max-w-5xl px-6 py-24 text-center text-cream-soft sm:py-36 z-10"
          style={{ transform: `translate3d(0, ${scrollY * -0.08}px, 0)` }}
        >
          <Reveal>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-sm mb-6"
              style={{ animation: "hero-badge-pop 0.9s cubic-bezier(0.22,0.61,0.36,1) both" }}
            >
              <span className="text-gold ornament-glow">✦</span>
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-bold">Established Bridal Craftsmanship</span>
              <span className="text-gold ornament-glow">✦</span>
            </div>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
              <span className="text-gold/80 text-lg ornament-glow">❧</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
            </div>

            {/* Glowing headline */}
            <h1
              className="font-serif text-5xl leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight"
              style={{ textShadow: "0 0 80px rgba(197,160,90,0.3), 0 4px 12px rgba(0,0,0,0.6)" }}
            >
              Your Wedding Wardrobe
              <br />
              <span
                className="italic font-light"
                style={{
                  background: "linear-gradient(120deg, #c5a05a 0%, #e8d5a3 40%, #c5a05a 60%, #f0e6c8 80%, #c5a05a 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "text-shimmer 4s linear infinite",
                  textShadow: "none",
                  fontSize: "1.15em",
                  letterSpacing: "0.02em",
                  filter: "drop-shadow(0 0 18px rgba(197,160,90,0.55))",
                }}
              >
                Partner.
              </span>
            </h1>

            {/* Tagline */}
            <p
              className="mx-auto mt-8 max-w-2xl text-sm leading-loose text-cream-soft/95 font-normal sm:text-base md:text-[1.05rem] tracking-wide"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)", letterSpacing: "0.04em" }}
            >
              Made to be worn, Not managed — because confidence comes from
              <br className="hidden sm:block" />
              forgetting about the outfit and enjoying the moment.
            </p>

            {/* Divider with diamond */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/50" />
              <div className="w-1.5 h-1.5 rotate-45 bg-gold/70" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/50" />
            </div>

            {/* CTA Buttons — premium card style */}
            <div className="relative mt-8 flex flex-col items-center gap-6 w-full">
              {/* Ambient glow */}
              <div className="absolute inset-x-[5%] -inset-y-6 bg-gold/10 blur-3xl rounded-full pointer-events-none" />

              {/* Tagline */}
              <p
                className="text-sm tracking-[0.18em] font-medium italic"
                style={{
                  background: "linear-gradient(90deg, #c5a05a, #f0e6c8, #c5a05a)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "text-shimmer 5s linear infinite",
                }}
              >
                ✦ &nbsp; This is the right time to reach out. &nbsp; ✦
              </p>

              {/* Two large CTA cards */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl relative">

                {/* Book Studio Visit */}
                <button
                  onClick={() => open("studio")}
                  className="group flex-1 flex items-center gap-4 rounded-2xl px-6 py-5 text-left transition-all duration-300 hover:scale-[1.02] hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #c5a05a 0%, #e8d5a3 50%, #b8934a 100%)",
                    boxShadow: "0 0 32px rgba(197,160,90,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(120,50,30,0.18)" }}
                  >
                    <CalendarHeart className="w-6 h-6" style={{ color: "#7a2e1a" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#3d1508" }}>Book Studio Visit</p>
                    <p className="text-[11px] mt-0.5 font-light" style={{ color: "rgba(61,21,8,0.75)" }}>Experience in person</p>
                  </div>
                </button>

                {/* Book Online Consultation */}
                <button
                  onClick={() => open("online")}
                  className="group flex-1 flex items-center gap-4 rounded-2xl px-6 py-5 text-left transition-all duration-300 hover:scale-[1.02] hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #5a1220 0%, #7a1f2e 50%, #4a0e1a 100%)",
                    border: "1px solid rgba(197,160,90,0.35)",
                    boxShadow: "0 0 24px rgba(90,18,32,0.5), inset 0 1px 0 rgba(197,160,90,0.15)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(197,160,90,0.12)" }}
                  >
                    <Globe className="w-6 h-6" style={{ color: "#c5a05a" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#c5a05a" }}>Book Online Consultation</p>
                    <p className="text-[11px] mt-0.5 font-light" style={{ color: "rgba(197,160,90,0.65)" }}>Connect from anywhere</p>
                  </div>
                </button>

              </div>

              {/* Three trust badges */}
              {/* <div
                className="flex flex-col sm:flex-row items-center gap-0 w-full max-w-2xl rounded-2xl overflow-hidden relative"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(197,160,90,0.15)",
                }}
              >
                {[
                  { icon: <Wand2 className="w-5 h-5" />, label: "PERSONALISED STYLING", sub: "Just for you" },
                  { icon: <Star className="w-5 h-5" />, label: "PREMIUM QUALITY", sub: "Crafted to perfection" },
                  { icon: <Heart className="w-5 h-5" />, label: "TIMELESS ELEGANCE", sub: "Made to be cherished" },
                ].map((badge, i) => (
                  <div
                    key={badge.label}
                    className={`flex items-center gap-3 flex-1 px-5 py-4 ${
                      i < 2 ? "border-b sm:border-b-0 sm:border-r border-gold/10" : ""
                    }`}
                  >
                    <span style={{ color: "rgba(197,160,90,0.75)" }}>{badge.icon}</span>
                    <div className="text-left">
                      <p className="text-[9px] uppercase tracking-[0.22em] font-bold" style={{ color: "rgba(197,160,90,0.85)" }}>{badge.label}</p>
                      <p className="text-[10px] font-light mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{badge.sub}</p>
                    </div>
                  </div>
                ))}
              </div> */}

            </div>
          </Reveal>
        </div>

        {/* ── Gold shimmer bottom border ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/70 to-transparent z-20" />
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="relative z-10 mt-12 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              question: "Can I trust them?",
              value: <Counter end={4.8} decimals={1} suffix=" Rating" />,
              desc: "By Real Customers",
              icon: <Star className="w-5 h-5 text-[#B8892E] fill-[#B8892E]" />,
            },
            {
              question: "Have others chosen them?",
              value: <Counter end={250} suffix="+ Brides" />,
              desc: "Happy & Trusted",
              icon: <Heart className="w-5 h-5 text-[#B8892E] fill-[#B8892E]" />,
            },
            {
              question: "Do they have experience?",
              value: <Counter end={8} suffix="+ Years" />,
              desc: "Bridal Craftsmanship",
              icon: <Scissors className="w-5 h-5 text-[#B8892E]" />,
            },
            {
              question: "Are they specialists?",
              value: <Counter end={100} suffix="K+ Blouses" />,
              desc: "Delivered with Love",
              icon: <Sparkles className="w-5 h-5 text-[#B8892E]" />,
            },
          ].map((p, idx) => (
            <Reveal key={p.question} variant="up" delay={idx * 80}>
              <div className="trust-card group h-[200px] rounded-[24px] bg-white border border-[rgba(201,151,43,0.18)] shadow-[0_12px_40px_-20px_rgba(91,31,42,0.15)] p-6 flex flex-col items-center justify-between text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.01] hover:border-[#C9972B] hover:shadow-[0_24px_50px_-15px_rgba(201,151,43,0.3)]">
                {/* Icon wrapper */}
                <div className="trust-icon flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[rgba(201,151,43,0.1)] transition-transform duration-300 ease-out group-hover:rotate-6">
                  {p.icon}
                </div>

                {/* Metrics */}
                <div className="flex flex-col gap-0.5 mt-2 flex-grow justify-center">
                  <span className="font-bold text-[#5B1F2A] text-xl sm:text-2xl tracking-tight transition-transform duration-300 ease-out group-hover:scale-105 block">
                    {p.value}
                  </span>
                  <span className="text-xs text-foreground/70 font-medium">
                    {p.desc}
                  </span>
                </div>

                {/* Subtitle / Question */}
                <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-[#B8892E] font-semibold border-t border-gold/10 pt-2 w-full">
                  {p.question}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY SARRAHH SECTION */}
      <section id="why" className="py-12 bg-gradient-to-b from-cream to-cream-soft overflow-hidden">
        <div className="mx-auto max-w-[90rem] px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-gold font-semibold">THE SARRAHH DIFFERENCE</p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl md:text-6xl font-light">Why Sarrahh?</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>

          {/* THE FIT PHILOSOPHY */}
          <Reveal className="mt-16">
            <div className="relative rounded-3xl overflow-hidden border border-gold/25 bg-gradient-to-br from-wine-deep to-wine p-8 sm:p-12 text-cream-soft">
              {/* Decorative glow */}
              <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-40px] right-[-40px] w-56 h-56 rounded-full bg-gold/8 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.4em] text-gold font-semibold mb-4">THE FIT PHILOSOPHY</p>
                <div className="gold-divider w-20 mb-8" />
                <p className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-cream-soft leading-snug mb-8">
                  A bridal outfit should never ask you to adjust yourself.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm sm:text-base leading-relaxed text-cream-soft/85 font-light">
                  <p>Every bride worries about the design. Very few realise that the perfect fit is what gives them confidence.</p>
                  <p>An outfit shouldn't feel tight during the ceremony. It shouldn't need constant fixing. It shouldn't make you conscious every time someone takes a photo.</p>
                  <p className="sm:col-span-2 lg:col-span-1 italic text-gold-soft font-medium">At Sarrahh, we believe your outfit should move with you — not against you. Because when the fit disappears, your confidence takes its place.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-12">

            {/* LEFT — Featured Founder Video */}
            <div className="flex flex-col items-center justify-center lg:col-span-1 lg:items-start">
              <Reveal variant="scale" className="flex justify-center w-full max-w-[400px]">
                <div className="w-full rounded-[2rem] overflow-hidden border border-gold/25 bg-cream-soft p-3.5 shadow-2xl relative group">
                  <div className="absolute inset-0 rounded-[2rem] border border-dashed border-gold/25 pointer-events-none m-1.5" />
                  <div className="relative rounded-2xl overflow-hidden aspect-[9/16] h-[600px] w-full bg-wine/5 shadow-inner">
                    <video
                      src="/transformation_videos/founder_intro.mp4"
                      className="w-full h-full object-cover rounded-2xl"
                      controls
                      playsInline
                      loop
                      muted
                      preload="metadata"
                      ref={(el) => { if (el) el.muted = true; }}
                    />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT - Craftsmanship and Personal Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:col-span-2 items-stretch">
              {/* THE CRAFTSMANSHIP */}
              <Reveal variant="up" delay={50} className="flex h-full w-full">
                <div className="glass-card card-lift rounded-3xl p-8 flex flex-col border border-gold/25 relative overflow-hidden bg-cream-soft/60 w-full h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full pointer-events-none" />
                  <div className="flex flex-col flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-wine mb-6 border border-gold/20 shrink-0">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-gold font-semibold shrink-0">THE CRAFTSMANSHIP</h3>
                    <div className="flex-1">
                      <h4 className="mt-3 font-serif text-xl xl:text-2xl text-wine leading-tight">
                        Anyone can add more stones. Anyone can follow a trend. Real craftsmanship is quieter.
                      </h4>
                    </div>
                    <div className="w-12 h-[1px] bg-gold/40 my-5 shrink-0" />
                    <div className="mt-auto rounded-xl overflow-hidden border border-gold/20 relative h-[220px] xl:h-[260px] shrink-0">
                      <img src="/photos/download.jpg" alt="Craftsmanship detail" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="mt-8 pt-5 border-t border-gold/10 shrink-0 min-h-[90px] flex items-start">
                    <p className="font-serif italic text-[14px] xl:text-[15px] text-wine/90 leading-relaxed">
                      Quiet elegance. Handcrafted thread-by-thread under expert master supervision in our Kangayam studio.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* PERSONAL DESIGN */}
              <Reveal variant="right" delay={100} className="flex h-full w-full">
                <div className="glass-card card-lift rounded-3xl p-8 flex flex-col border border-gold/25 relative overflow-hidden bg-cream-soft/60 w-full h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full pointer-events-none" />
                  <div className="flex flex-col flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-wine mb-6 border border-gold/20 shrink-0">
                      <Wand2 className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-gold font-semibold shrink-0">YOUR WEDDING DESIGN</h3>
                    <div className="flex-1">
                      <h4 className="mt-3 font-serif text-xl xl:text-2xl text-wine leading-tight">
                        Finding the right outfit shouldn't mean adjusting yourself to a catalogue. We don't follow catalogues.
                      </h4>
                    </div>
                    <div className="w-12 h-[1px] bg-gold/40 my-5 shrink-0" />
                    <div className="mt-auto rounded-xl overflow-hidden border border-gold/20 relative h-[220px] xl:h-[260px] shrink-0">
                      <img src="/photos/202427.png" alt="Personal Design detail" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="mt-8 pt-5 border-t border-gold/10 shrink-0 min-h-[90px] flex items-start">
                    <p className="font-serif text-[14px] xl:text-base font-medium text-wine leading-relaxed tracking-wider uppercase">
                      Your Wedding. Your Style.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>

          {/* Why CTA blocks */}
          <Reveal className="mt-16 text-center">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => open("studio")}
                className="btn-gold w-full rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-widest sm:w-auto"
              >
                Book Studio Visit
              </button>
              <button
                onClick={() => open("online")}
                className="btn-outline-gold w-full rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-widest sm:w-auto"
              >
                Book Online Consultation
              </button>
            </div>
            <p className="mt-4 text-xs font-medium text-wine/80 tracking-wide">
              ⚡ If your wedding date is already fixed, don't wait too long
            </p>
          </Reveal>
        </div>
      </section>

      {/* TRANSFORMATIONS SECTION */}
      <section id="transformations" className="py-12 bg-gradient-to-b from-cream-soft to-cream border-t border-gold/20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-gold font-semibold">GALLERY & EXPERIENCES</p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl md:text-6xl font-light">Bridal Transformations</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>

          {/* Interactive Navigation Tabs — 2 tabs only */}
          <div className="mt-12 flex justify-center border-b border-gold/20 max-w-lg mx-auto">
            <div className="flex space-x-8 sm:space-x-12 pb-3">
              {[
                { id: "gallery", label: "Blouse Gallery" },
                { id: "experiences", label: "Bride Experiences" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTransTab(t.id as any)}
                  className={`text-xs sm:text-sm uppercase tracking-wider font-semibold pb-1.5 transition-all relative ${transTab === t.id
                    ? "text-wine scale-105"
                    : "text-foreground/50 hover:text-wine/80"
                    }`}
                >
                  {t.label}
                  {transTab === t.id && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-14">

            {/* GALLERY TAB — Blouse Photos from /photos/ */}
            {transTab === "gallery" && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {PHOTOS.map((pic) => (
                    <div
                      key={pic.url}
                      className="relative group rounded-2xl overflow-hidden border border-gold/20 aspect-[3/4] cursor-pointer shadow-md bg-cream-soft"
                      onClick={() => setLightboxImg(pic.url)}
                    >
                      <img
                        src={pic.url}
                        alt={pic.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-[11px] text-cream-soft leading-tight font-serif italic">{pic.title}</p>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 rounded-full bg-gold/90 flex items-center justify-center">
                          <Maximize2 className="w-3.5 h-3.5 text-wine-deep" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BRIDE EXPERIENCES TAB — Videos */}
            {transTab === "experiences" && (
              <div className="relative group/carousel">
                {/* Left Arrow */}
                <button
                  onClick={() => scrollCarousel(expScrollRef, "left")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-wine/90 hover:bg-wine text-cream-soft p-3 rounded-full border border-gold/30 shadow-xl transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5 text-gold" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => scrollCarousel(expScrollRef, "right")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-wine/90 hover:bg-wine text-cream-soft p-3 rounded-full border border-gold/30 shadow-xl transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-5 h-5 text-gold" />
                </button>

                <div
                  ref={expScrollRef}
                  onMouseEnter={() => setExperiencesHovered(true)}
                  onMouseLeave={() => setExperiencesHovered(false)}
                  className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-8 hide-scrollbar -mx-6 px-6"
                >
                  {VIDEOS.filter((v) => v.category === "Experiences" || v.category === "Transformations").map((vid) => (
                    <div
                      key={vid.url}
                      className="relative group rounded-3xl overflow-hidden shadow-lg border border-gold/25 bg-wine-deep aspect-[9/16] cursor-pointer shrink-0 snap-center w-[75vw] sm:w-[45vw] lg:w-[320px]"
                      onMouseEnter={() => handleVideoHoverStart(vid.url)}
                      onMouseLeave={() => handleVideoHoverEnd(vid.url)}
                      onClick={() => setLightboxVideo(vid.url)}
                    >
                      <video
                        ref={(el) => {
                          videoRefs.current[vid.url] = el;
                          if (el) el.muted = true;
                        }}
                        src={vid.url}
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/95 via-wine-deep/30 to-transparent flex flex-col justify-end p-5">
                        <div>
                          <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-gold-soft mb-1 font-semibold">
                            <Play className="w-3 h-3 fill-current" />
                            <span>Tap to watch</span>
                          </div>
                          <h4 className="font-serif text-lg text-cream-soft leading-tight">{vid.title}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>


        </div>
      </section>

      {/* THE SARRAHH PROCESS */}
      <section id="process" className="py-12 bg-gradient-to-b from-cream to-cream-soft overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-gold font-semibold">THREE STEPS TO CONFIDENCE</p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl md:text-6xl font-light">The Sarrahh Process</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>

          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-6 relative">
            {[
              {
                step: "Step 1",
                title: "Book Your Bridal Consultation",
                desc: "Meet us in the studio or connect online.",
                icon: <CalendarHeart className="w-6 h-6 text-cream-soft" />,
                details: "We start by understanding your wedding details, saree color, and theme."
              },
              {
                step: "Step 2",
                title: "Design Your Dream Outfit",
                desc: "We understand your vision and customize it with expert craftsmanship.",
                icon: <Scissors className="w-6 h-6 text-cream-soft" />,
                details: "No catalogue copies. We draft bespoke necklines and pattern work matching your shoulders."
              },
              {
                step: "Step 3",
                title: "Walk Into Your Wedding With Confidence",
                desc: "Receive your perfectly crafted bridal outfit, ready for your biggest day.",
                icon: <Wand2 className="w-6 h-6 text-cream-soft" />,
                details: "A trial run in the studio ensures flawless fit, comfort, and ultimate confidence."
              }
            ].map((p, idx) => (
              <Reveal key={p.step} className="relative flex flex-col items-center" delay={idx * 150}>
                <div className="glass-card w-full rounded-3xl p-8 text-center flex flex-col items-center h-full relative z-10 border border-gold/20 hover:border-gold/50 transition-all">
                  <span className="font-serif text-xs uppercase tracking-[0.25em] text-gold font-semibold">{p.step}</span>
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full mt-5 mb-6 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, var(--gold) 0%, var(--wine) 100%)",
                    }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-serif text-2xl text-wine leading-tight mb-3">{p.title}</h3>
                  <p className="text-sm font-semibold text-foreground/80 mb-4">{p.desc}</p>
                  <p className="text-xs text-foreground/60 leading-relaxed font-light">{p.details}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden lg:block absolute left-[90%] top-[40%] w-[25%] h-[1px] bg-gradient-to-r from-gold/70 via-gold/10 to-transparent z-0">
                    <span className="absolute right-0 top-[-3.5px] border-t-4 border-b-4 border-l-6 border-transparent border-l-gold" />
                  </div>
                )}
                {idx < 2 && (
                  <div className="lg:hidden my-4 text-gold flex flex-col items-center">
                    <span className="text-2xl font-light">↓</span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-12 bg-gradient-to-b from-cream-soft to-cream border-t border-gold/25 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="text-left font-sans">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gold font-bold">GOOGLE REVIEWS</p>
              <h2 className="mt-3 font-serif text-4xl text-wine sm:text-5xl md:text-6xl font-light tracking-tight leading-none">
                What Our <span className="text-gold font-normal italic font-serif">Brides</span> Say
              </h2>
            </div>

            {/* Nav Arrows */}
            <div className="flex gap-3 self-start sm:self-auto">
              <button
                onClick={() => scrollReviews("left")}
                aria-label="Previous review"
                className="h-12 w-12 rounded-full bg-wine text-cream-soft hover:bg-wine-deep flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer border border-gold/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gold-soft">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
              </button>

              <button
                onClick={() => scrollReviews("right")}
                aria-label="Next review"
                className="h-12 w-12 rounded-full bg-wine text-cream-soft hover:bg-wine-deep flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer border border-gold/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gold-soft">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel Slider Row */}
          <div
            ref={reviewScrollRef}
            onMouseEnter={() => setReviewsHovered(true)}
            onMouseLeave={() => setReviewsHovered(false)}
            className="mt-12 flex gap-6 overflow-x-auto scrollbar-none pb-6 scroll-smooth snap-x snap-mandatory"
          >
            {REVIEWS_DATA.filter((r) => r.rating >= 5).map((r) => {
              return (
                <div
                  key={r.id}
                  className="w-[290px] sm:w-[380px] shrink-0 snap-start glass-card bg-cream-soft/85 border border-gold/25 rounded-[2.5rem] p-8 shadow-sm hover:shadow-lg hover:border-gold/45 transition-all duration-500 flex flex-col justify-between relative text-left h-auto min-h-[300px]"
                >
                  <div className="flex flex-col h-full">
                    {/* Top card row */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-[#E8F0FE] text-[#1967D2] flex items-center justify-center font-sans text-xl font-medium shrink-0 select-none overflow-hidden uppercase">
                          {r.avatar}
                        </div>
                        <div>
                          <div className="font-sans text-[15px] font-bold text-wine">{r.name}</div>
                          <div className="font-sans text-[13px] text-wine/60">{r.role || "Local Guide"}</div>
                        </div>
                      </div>

                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex gap-0.5 text-[#FBBC04] mt-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-[15px] sm:text-[16px] text-wine/90 leading-relaxed mt-4 font-sans">
                      {r.text}
                    </p>

                    <span className="text-[11px] text-wine/50 block mt-auto pt-6 tracking-wide uppercase">
                      {r.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-12 bg-gradient-to-b from-cream to-cream-soft border-t border-gold/20 overflow-hidden">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-gold font-semibold">ANSWERS FOR EVERY BRIDE</p>
            <h2 className="mt-4 font-serif text-4xl text-wine sm:text-5xl md:text-6xl font-light">Frequently Asked Questions</h2>
            <div className="gold-divider mx-auto mt-6 w-24" />
          </Reveal>

          <div className="mt-16 space-y-4">
            {[
              {
                q: "Do I need to travel for a premium customised outfit?",
                a: "Not at all. Sarrahh offers fully personalized bridal craftsmanship and premium customization with online consultations available. Brides from across Tamil Nadu and beyond can connect via video call to finalize their design before a single visit."
              },
              {
                q: "Can you create my own design?",
                a: "Yes. Every bridal outfit is customized based on your own ideas, Pinterest reference pins, saree colors, and design preferences—not from a pre-made catalogue."
              },
              {
                q: "When should I book my bridal appointment?",
                a: "We recommend booking as early as possible (ideally 2 to 3 months) after your wedding date is finalized. This secures your preferred consultation slot and gives our craftsmen ample time to perform design iterations."
              },
              {
                q: "Can I book an online consultation first?",
                a: "Yes. Brides living in other cities or overseas can start with an online video consultation, where we finalize design sketches before scheduling fitting dates."
              },
              {
                q: "Do you customize bridal blouses and lehengas?",
                a: "Yes. We specialize in fully customized bridal blouses, design-heavy Aari embroidery, reception lehengas, and bridal outfits designed exclusively for each bride."
              }
            ].map((f, fIdx) => (
              <Reveal key={f.q} delay={fIdx * 80}>
                <details
                  data-faq
                  className="glass-card group rounded-2xl px-6 py-5 transition-all duration-300 border border-gold/20 open:border-[color:var(--gold)]/70 hover:border-gold/45 bg-cream-soft/60"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 select-none outline-none">
                    <span className="font-serif text-lg text-wine font-medium">{f.q}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--gold)]/50 text-gold transition-transform duration-500 group-open:rotate-[135deg] group-open:border-[color:var(--gold)] group-open:bg-gold group-open:text-cream-soft">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <div className="faq-body">
                    <div>
                      <p className="pt-4 text-sm leading-relaxed text-foreground/75 font-light">{f.a}</p>
                    </div>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section
        id="book"
        className="py-12 bg-gradient-to-b from-cream to-cream-soft border-t border-gold/25 overflow-hidden"
      >
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-14 bg-gradient-to-r from-wine to-wine-deep text-cream-soft shadow-2xl border border-gold/30">

              {/* Floating ambient circle elements */}
              <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-[-120px] right-[-60px] w-80 h-80 rounded-full bg-gold-soft/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-20px] left-[35%] w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center justify-between">

                {/* Left Side Info */}
                <div className="flex flex-col items-start text-left gap-5">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cream-soft text-[10px] font-bold tracking-widest text-wine uppercase shadow-md border border-gold/20">
                    <span className="text-gold font-bold">✦</span>
                    <span>Bespoke Bridal Couture</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    Let's Create Something{" "}
                    <span className="text-gold-soft font-light italic">Unique</span>{" "}
                    That Feels Yours.
                  </h2>

                  <p className="text-sm sm:text-base text-cream-soft/85 max-w-xl leading-relaxed font-normal tracking-wide">
                    Because, every bride has a different story.
                    <br />
                    Your bridal outfit should reflect that.
                  </p>

                </div>

                {/* Right Side CTAs & Social Proof */}
                <div className="flex flex-col items-start lg:items-end gap-6">

                  {/* Button row */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto">
                    <button
                      onClick={() => open("studio")}
                      className="btn-gold px-8 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 group shrink-0"
                    >
                      <span>Book Studio Visit</span>
                      <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                    </button>

                    <button
                      onClick={() => open("online")}
                      className="border-2 border-gold-soft/60 text-cream-soft hover:bg-gold/15 px-8 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all text-center shrink-0"
                    >
                      <span>Book Online Consultation</span>
                    </button>
                  </div>

                  {/* Social Proof Line */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-cream-soft/75 font-light">
                    <span className="text-gold-soft font-semibold">Trusted by 250+ brides</span>
                    <span className="text-gold/50">•</span>
                    <span>⭐ 4.8 Google Rating • 8+ Years of Bridal Craftsmanship</span>
                  </div>

                </div>

              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-wine-deep py-16 text-cream-soft/75 border-t border-gold/15">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-4 sm:gap-8">
          <div>
            <img
              src="/new_logo.png"
              alt="Sarrahh Logo"
              className="h-16 sm:h-20 w-auto object-contain brightness-0 invert opacity-95 mb-4"
            />
            <div className="gold-divider w-16" />
            <p className="mt-5 text-xs leading-relaxed font-light text-cream-soft/70">
              Personalized bridal blouses, design-heavy Aari embroidery, and bespoke wedding couture created exclusively near you.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold font-semibold">Explore</h4>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <a href="#why" className="hover:text-gold transition-colors">
                  Why Sarrahh
                </a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-gold transition-colors">
                  Transformations
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-gold transition-colors">
                  Our Process
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-gold transition-colors">
                  Brides Reviews
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-gold transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold font-semibold">Kangayam Studio</h4>
            <p className="text-xs leading-relaxed font-light text-cream-soft/70 space-y-1.5 flex flex-col">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold/80" />
                <span>Kangayam, Tiruppur District, Tamil Nadu</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold/80" />
                <span>10:00 AM - 8:30 PM (Sunday Closed)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold/80" />
                <span>+91 97864 12345</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold/80" />
                <span>consultation@sarrahh.in</span>
              </span>
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold font-semibold">Follow Our Work</h4>
            <p className="text-xs font-light text-cream-soft/60 mb-4">View daily fit reels and real bride stories on social channels.</p>
            <div className="flex gap-3">
              {[
                { name: "Instagram", href: "https://www.instagram.com/sarrahh_boutique?igsh=MTQ1eHA5cnZkNGhuYw==", icon: <FaInstagram className="w-4 h-4" /> },
                { name: "WhatsApp", href: "https://wa.me/919865297121", icon: <FaWhatsapp className="w-4 h-4" /> },
                { name: "Facebook", href: "https://www.facebook.com/share/18erQZ79kK/", icon: <FaFacebook className="w-4 h-4" /> }
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--gold)]/30 text-[10px] uppercase font-semibold text-gold-soft transition-all hover:bg-gold hover:text-wine-deep"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-6xl border-t border-cream-soft/10 px-6 pt-8 text-center text-[10px] tracking-wider uppercase text-cream-soft/40">
          © {new Date().getFullYear()} Sarrahh Bridal Studio Kangayam. All rights reserved. Designed to inspire confidence.
        </div>
      </footer>

      {/* Booking Form Dialog Modal */}
      <BookingModal
        open={booking !== null}
        type={booking ?? "studio"}
        onClose={() => setBooking(null)}
      />

      {/* PHOTO LIGHTBOX MODAL */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setLightboxImg(null)}>
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 text-cream-soft hover:text-gold transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-gold/25" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImg} alt="Enlarged detailed work" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* VIDEO LIGHTBOX MODAL */}
      {lightboxVideo && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setLightboxVideo(null)}>
          <button
            onClick={() => setLightboxVideo(null)}
            className="absolute top-6 right-6 text-cream-soft hover:text-gold transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-md w-full aspect-[9/16] rounded-3xl overflow-hidden border border-gold/25 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <video
              src={lightboxVideo}
              autoPlay
              loop
              playsInline
              muted
              ref={(el) => { if (el) el.muted = true; }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

    </div>
  );
}
