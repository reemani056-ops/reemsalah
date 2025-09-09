document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------
  // 1️⃣ Speech Synthesis Button
  // ----------------------------
  const btn = document.getElementById("readPage");
  if (btn) {
    let isSpeaking = false;
    let utterance;

    btn.addEventListener("click", function () {
      if (!isSpeaking) {
        const lang = document.documentElement.lang || "en";
        const text = document.body.innerText;

        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = (lang === "ar") ? "ar-SA" : "en-US";
        utterance.rate = 0.9;

        window.speechSynthesis.speak(utterance);

        isSpeaking = true;
        btn.textContent = "⏹";

        utterance.onend = () => {
          isSpeaking = false;
          btn.textContent = "🔊";
        };
      } else {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        btn.textContent = "🔊";
      }
    });
  }

  // ----------------------------
  // 2️⃣ Animated Story Text
  // ----------------------------
  const paragraph = document.getElementById("animated-story");
  if (paragraph) {
    const words = paragraph.innerHTML.trim().split(/\s+/);
    const groupedWords = [];
    for (let i = 0; i < words.length; i += 2) {
      const pair = words[i] + (words[i + 1] ? " " + words[i + 1] : "");
      groupedWords.push(`<span class="word">${pair}</span>`);
    }
    paragraph.innerHTML = groupedWords.join(" ");

    const wordSpans = paragraph.querySelectorAll(".word");
    const visual = document.querySelector(".story-visual");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          wordSpans.forEach((span, i) => {
            setTimeout(() => span.classList.add("visible"), i * 300);
          });

          setTimeout(() => visual.classList.add("visible"), wordSpans.length * 300 + 800);

          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(paragraph);
  }

  // ----------------------------
  // 3️⃣ GSAP Animations
  // ----------------------------
  gsap.registerPlugin(ScrollTrigger);

  const text = "After exploring who is investing in Ajman, the next question is who is choosing to live here? Ajman is not just a business zone, but a growing city where people build lives, raise families, and contribute to the local community. ";
  const words = text.split(" ");
  const wordContainer = document.querySelector("#word-anim");
  if (wordContainer) {
    const groups = [];
    for (let i = 0; i < words.length; i += 4) {
      groups.push(words.slice(i, i + 4).join(" "));
    }

    groups.forEach(group => {
      const span = document.createElement("span");
      span.classList.add("word-group");
      span.textContent = group;
      wordContainer.appendChild(span);
    });

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

    gsap.to(".story-visual", {
      scale: 1,
      opacity: 1,
      scrollTrigger: {
        trigger: ".word-group:last-child",
        start: "bottom 100%",
        end: "+=300",
        scrub: true,
        pin: true
      },
      ease: "power2.out"
    });

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

    gsap.fromTo(".insight-section",
      { scale: 1.2, opacity: 0, transformOrigin: "center center" },
      {
        scale: 1, opacity: 1, ease: "power3.inOut",
        scrollTrigger: {
          trigger: ".transition-section",
          start: "top center",
          end: "bottom top",
          scrub: true
        }
      }
    );
  }

  // ----------------------------
  // 4️⃣ Leaflet Map
  // ----------------------------
  if (document.getElementById("ajman-map")) {
    const map = L.map('ajman-map').setView([25.4052, 55.5136], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const ajmanTooltip = `
    <b>Top 5 Nationalities in Ajman:</b><br>
    Russian Federation – 36,970<br>
    India – 33,699<br>
    United Arab Emirates – 33,458<br>
    Egypt – 22,919<br>
    Oman – 22,200
    `;

    L.marker([25.4052, 55.5136]).addTo(map)
      .bindTooltip(ajmanTooltip, {direction: 'top', offset: [0, -10], opacity: 0.9})
      .openTooltip();
  }

}); // End DOMContentLoaded

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});



