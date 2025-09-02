const btn = document.getElementById("readPage");
let isSpeaking = false;
let utterance;

btn.addEventListener("click", function () {
  if (!isSpeaking) {
    // detect page language
    const lang = document.documentElement.lang || "en";
    const text = document.body.innerText;

    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = (lang === "ar") ? "ar-SA" : "en-US";
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);

    isSpeaking = true;
    btn.textContent = "⏹"; // change icon to stop

    utterance.onend = () => {
      isSpeaking = false;
      btn.textContent = "🔊"; // back to speaker
    };
  } else {
    // Stop reading
    window.speechSynthesis.cancel();
    isSpeaking = false;
    btn.textContent = "🔊"; // back to speaker
  }
});

// ===== Reveal step texts + transition text =====
const sections = document.querySelectorAll('.step1-text, .step2-text, .step3-text, .transition-text');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show-text');
    }
  });
}, { threshold: 0.2 });

sections.forEach(sec => observer.observe(sec));

// ===== Counter Animation (basic) =====
const counters = document.querySelectorAll(".counter");

const runCounter = (counter) => {
  const target = +counter.getAttribute("data-target");
  let count = 0;
  const increment = Math.ceil(target / 200);

  const update = () => {
    count += increment;
    if (count > target) count = target;
    counter.innerText = count.toLocaleString();
    if (count < target) requestAnimationFrame(update);
  };
  update();
};

// ===== Timeline reveal =====
const stages = document.querySelectorAll('.timeline-stage');

function revealTimeline() {
  stages.forEach(stage => {
    const rect = stage.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      stage.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealTimeline);
window.addEventListener('load', revealTimeline);

// ===== Reveal timeline blocks on scroll + animate counters =====
document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.timeline-block');

  const blockObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show'); // makes it visible
        // animate counters inside this block once
        entry.target.querySelectorAll('.counter').forEach(animateCounter);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  blocks.forEach(b => blockObserver.observe(b));

  // Fallback for very old browsers
  if (!('IntersectionObserver' in window)) {
    blocks.forEach(b => b.classList.add('show'));
    document.querySelectorAll('.counter').forEach(animateCounter);
  }

  // Counter animation function
  function animateCounter(el) {
    const target = +el.getAttribute('data-target') || 0;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 100));

    const tick = () => {
      current += step;
      if (current >= target) {
        current = target;
      } else {
        requestAnimationFrame(tick);
      }
      el.textContent = current.toLocaleString();
    };
    tick();
  }
});

gsap.registerPlugin(ScrollTrigger);

// ===== Animated headline text (word by word on scroll) =====
document.addEventListener("DOMContentLoaded", () => {
  const text = document.getElementById("animated-text");
  if (!text) return; // prevent errors if not found

  const words = text.innerText.split(" ");
  text.innerHTML = words.map(word => `<span style="opacity:0; display:inline-block; transform:translateY(20px)"> ${word} </span>`).join(" ");

  const spans = text.querySelectorAll("span");

  gsap.to(spans, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.12, // word by word
    scrollTrigger: {
      trigger: text,
      start: "top 80%",   // when it comes into view
      toggleActions: "play none none none"
    }
  });
});

// Transition section zooms out & fades
gsap.to(".transition-section", {
  scale: 0.8,
  opacity: 0,
  zIndex: 1,
  ease: "power3.inOut",
  scrollTrigger: {
    trigger: ".transition-section",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
    pinSpacing: false
  }
});

// Insight section zooms in as full window
gsap.fromTo(".insight-section",
  { scale: 1.2, opacity: 0, transformOrigin: "center center" }, // zoomed out initially
  { scale: 1, opacity: 1, ease: "power3.inOut",
    scrollTrigger: {
      trigger: ".transition-section",
      start: "top center", // starts as previous shrinks
      end: "bottom top",
      scrub: true
    }
  }
);

// ===== MOBILE ONLY: Word-by-word animation for investors intro =====
if (window.innerWidth <= 900) {
  const investorText = document.querySelectorAll('.investors-intro p');
  investorText.forEach(p => {
    const words = p.innerText.split(" ");
    p.innerHTML = words.map(word => `<span style="opacity:0; display:inline-block; transform:translateY(20px); margin-right:4px">${word}</span>`).join(" ");

    const spans = p.querySelectorAll("span");

    gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: p,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
}
