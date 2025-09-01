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
  gsap.registerPlugin(ScrollTrigger);

  // Fade-up elements (hero, recommendations, video)
  gsap.utils.toArray(".fade-up").forEach(el => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
      }
    });
  });

  // Fade-card elements (insights cards)
  gsap.utils.toArray(".fade-card").forEach(el => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      }
    });
  });

  // Fade-list items (recommendations)
  gsap.utils.toArray(".fade-list li").forEach(el => {
    gsap.from(el, {
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      }
    });
  });

  // Video section
  gsap.utils.toArray(".video-section").forEach(el => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".insights-title");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        title.classList.add("visible");
        observer.disconnect(); // only trigger once
      }
    });
  }, { threshold: 0.3 });

  observer.observe(title);
});

document.querySelectorAll(".preview-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const file = btn.getAttribute("data-file"); // now includes folder: "ajmanC/investors.xlsx"
    const previewFrame = document.querySelector(".preview-frame");
    const iframe = document.getElementById("excel-preview");
    const title = document.getElementById("preview-title");

    previewFrame.classList.remove("hidden");
    title.textContent = `Preview: ${btn.textContent.trim()}`;

    const fileUrl = encodeURIComponent(`${window.location.origin}/${file}`);
    iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`;
  });
});

