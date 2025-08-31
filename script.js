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
  
  
  
  const sections = document.querySelectorAll('.step1-text, .step2-text, .step3-text');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-text');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => observer.observe(sec));
// ===== Counter Animation (trigger only when visible) =====
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
