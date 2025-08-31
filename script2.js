 // Wait until browser loads available voices
    let voices = [];
    function loadVoices() {
      voices = speechSynthesis.getVoices();
    }
    speechSynthesis.onvoiceschanged = loadVoices;

    // Add voice icons automatically
    document.querySelectorAll("p, h1, h2, h3, h4, h5, h6,div").forEach(el => {
      const icon = document.createElement("span");
      icon.textContent = "🔊";
      icon.classList.add("voice-reader");

      icon.addEventListener("click", () => {
        const text = el.innerText.trim();
        const lang = el.getAttribute("lang") || "en-US"; // fallback English

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // Try to match a proper voice for the language
        if (voices.length > 0) {
          const voice = voices.find(v => v.lang.startsWith(lang));
          if (voice) utterance.voice = voice;
        }

        utterance.rate = 1;
        utterance.pitch = 1;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      });

      el.appendChild(icon);
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