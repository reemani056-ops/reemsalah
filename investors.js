document.addEventListener("DOMContentLoaded", () => {
  /* ===== HAMBURGER MENU ===== */
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("show");
  });
  });


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
document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.getElementById("animated-text");
  const text = textElement.textContent.trim();
  
  textElement.textContent = ""; // clear text for animation
  textElement.style.opacity = "1";

  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      textElement.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 40); // typing speed
    } else {
      textElement.style.borderRight = "none"; // remove cursor after typing
    }
  }

  typeWriter();
});
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const icon = hamburger.querySelector('i');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  
  // Toggle icon between bars and X
  if (icon.classList.contains('fa-bars')) {
    icon.classList.replace('fa-bars', 'fa-times');
  } else {
    icon.classList.replace('fa-times', 'fa-bars');
  }
});
