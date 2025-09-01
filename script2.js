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
  
  
document.addEventListener("DOMContentLoaded", () => {
  const paragraph = document.getElementById("animated-story");
  if (!paragraph) return;

  // Split into words and group them into pairs
  const words = paragraph.innerHTML.trim().split(/\s+/);
  const groupedWords = [];
  for (let i = 0; i < words.length; i += 2) {
    const pair = words[i] + (words[i + 1] ? " " + words[i + 1] : "");
    groupedWords.push(`<span class="word">${pair}</span>`);
  }
  paragraph.innerHTML = groupedWords.join(" ");

  const wordSpans = paragraph.querySelectorAll(".word");
  const visual = document.querySelector(".story-visual");

  // Intersection observer triggers animation when story section is visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        wordSpans.forEach((span, i) => {
          setTimeout(() => {
            span.classList.add("visible");
          }, i * 300); // smooth stagger (pairs appear every 300ms)
        });

        // Show the photo after text animation finishes
        setTimeout(() => {
          visual.classList.add("visible");
        }, wordSpans.length * 300 + 800);

        observer.disconnect(); // run once
      }
    });
  }, { threshold: 0.3 });

  observer.observe(paragraph);
});
gsap.registerPlugin(ScrollTrigger);

// Story text
const text = "After exploring who is investing in Ajman, the next question is who is choosing to live here? Ajman is not just a business zone, but a growing city where people build lives, raise families, and contribute to the local community. ";

// Split into words
const words = text.split(" ");
const wordContainer = document.querySelector("#word-anim");

// Group words into 4s
const groups = [];
for (let i = 0; i < words.length; i += 4) {
  groups.push(words.slice(i, i + 4).join(" "));
}

// Inject groups
groups.forEach(group => {
  const span = document.createElement("span");
  span.classList.add("word-group");
  span.textContent = group;
  wordContainer.appendChild(span);
});

// Animate word groups sequentially as you scroll
gsap.utils.toArray(".word-group").forEach((el, i) => {
  gsap.fromTo(el,
    {opacity:0, y:50, scale:0.8},
    {
      opacity:1, y:0, scale:1,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "bottom 60%",
        scrub: true
      },
      duration: 0.6,
      ease: "power2.out"
    }
  );
});

// Animate image as full-window popup AFTER last word group
gsap.to(".story-visual", {
  scale: 1,
  opacity: 1,
  scrollTrigger: {
    trigger: ".word-group:last-child", // image triggers only after last words
    start: "bottom 100%",             // ensures last word fully visible first
    end: "+=300",                      // scroll distance for animation
    scrub: true,
    pin: true                          // pins the image full-window
  },
  ease: "power2.out"
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
// Initialize the map centered on Ajman
var map = L.map('ajman-map').setView([25.4052, 55.5136], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Top 5 nationalities data
var ajmanTooltip = `
<b>Top 5 Nationalities in Ajman:</b><br>
Russian Federation – 36,970<br>
India – 33,699<br>
United Arab Emirates – 33,458<br>
Egypt – 22,919<br>
Oman – 22,200
`;

// Add a marker for Ajman
L.marker([25.4052, 55.5136]).addTo(map)
  .bindTooltip(ajmanTooltip, {direction: 'top', offset: [0, -10], opacity: 0.9})
  .openTooltip();


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

