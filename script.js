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

