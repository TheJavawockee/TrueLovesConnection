// 💖 List of love notes
const loveMessages = [
  "I love you more every single day 💗",
  "You make my world brighter 🌞",
  "You're my favourite person in the universe 🌌",
  "Every moment with you is magic ✨",
  "You’re strong, beautiful, and deeply loved 💪❤️",
  "Your smile is my sunshine ☀️",
  "Just in case you forgot: I LOVE YOU! 💞",
  "You’re not alone—I'm always with you 💫",
  "You are my home 🏡",
  "You make my heart so full 💓",
  "Together is my favourite place to be 💕",
  "You light up my darkest days 🌟",
  "With you, I am whole 💖",
  "You are my forever and always 🌹",
  "Every love story is beautiful, but ours is my favourite 📖❤️",
  "I fall for you more every minute 💘",
  "Your laugh is my favourite song 🎶",
  "You are my dream come true 💫",
  "I cherish every moment spent with you ⏳",
  "You make my soul smile 😄💖",
  "In your arms, I’ve found my home 🏠❤️"
];

// Get a random love message
function getRandomMessage() {
  const index = Math.floor(Math.random() * loveMessages.length);
  return loveMessages[index];
}

// Request notification permission if not already granted
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("✅ Notifications allowed");
      }
    });
  }
}

// Send a love notification with a random message
function sendLoveNotification() {
  if (Notification.permission === "granted") {
    new Notification("💌 Just a reminder", {
      body: getRandomMessage(),
      icon: "icon.png"
    });
  }
}

// Register Service Worker for PWA functionality
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log("✅ Service Worker registered"))
      .catch(err => console.error("❌ Service Worker failed:", err));
  }
}

// Handle Android PWA install prompt
function setupInstallPrompt() {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (!document.getElementById('install-btn')) {
      const installBtn = document.createElement('button');
      installBtn.id = 'install-btn';
      installBtn.textContent = '📲 Install Love Notes';
      installBtn.style.cssText = `
        display: block;
        margin: 2rem auto;
        padding: 1rem 2rem;
        background-color: #ff69b4;
        color: white;
        font-size: 1rem;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      `;

      document.body.appendChild(installBtn);

      installBtn.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            console.log('✅ User accepted the A2HS prompt');
          } else {
            console.log('❌ User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
          installBtn.remove();
        });
      });
    }
  });
}

// Create simple confetti animation at (x, y)
function createConfetti(x, y) {
  const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb6c1', '#ff4081'];
  const confettiCount = 30;
  const container = document.createElement('div');

  container.style.position = 'fixed';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.left = '0px';
    confetti.style.top = '0px';
    confetti.style.opacity = '1';
    confetti.style.animation = `confetti-fall 1.2s ease-out forwards`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${Math.random() * -200}px)`;

    container.appendChild(confetti);
  }

  document.body.appendChild(container);

  setTimeout(() => {
    container.remove();
  }, 1500);
}

// Main app logic on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Persistent love count
  let loveCount = parseInt(localStorage.getItem('loveCount')) || 0;

  const noteDiv = document.querySelector(".note");
  const heart = document.querySelector(".heart");
  const musicToggle = document.getElementById('music-toggle');
  const music = document.getElementById('background-music');

  // Show a daily love message on page load
  if (noteDiv) {
    noteDiv.innerHTML = `
      Here's your daily reminder:<br>
      <strong>${getRandomMessage()}</strong><br>
      You’re amazing and you matter to me every single day.
    `;
  }

  // Setup music play/pause toggle
  if (music && musicToggle) {
    const savedMusicPlaying = localStorage.getItem('musicPlaying') === 'true';

    if (savedMusicPlaying) {
      music.play();
      musicToggle.textContent = '🔇 Pause Music';
    } else {
      musicToggle.textContent = '🎵 Play Music';
    }

    musicToggle.addEventListener('click', () => {
      if (music.paused) {
        music.play();
        musicToggle.textContent = '🔇 Pause Music';
        localStorage.setItem('musicPlaying', 'true');
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      } else {
        music.pause();
        musicToggle.textContent = '🎵 Play Music';
        localStorage.setItem('musicPlaying', 'false');
      }
    });
  }

  // Heart tap interaction
  if (heart && noteDiv) {
    heart.style.cursor = 'pointer';

    heart.addEventListener('click', (e) => {
      loveCount++;
      localStorage.setItem('loveCount', loveCount);
      createConfetti(e.clientX, e.clientY);
      noteDiv.innerHTML = `
        This is how much I love you:<br>
        <strong>${loveCount}</strong> ${loveCount === 1 ? 'time' : 'times'} ❤️
      `;

      // Optional: show a notification on each tap
      sendLoveNotification();
    });
  }

  // Initialize notifications and PWA install prompt
  requestNotificationPermission();
  registerServiceWorker();
  setupInstallPrompt();

  // Start daily notifications (every 24 hours)
  setInterval(sendLoveNotification, 86400000);
});
