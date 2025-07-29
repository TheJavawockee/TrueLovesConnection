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

function getRandomMessage() {
  const index = Math.floor(Math.random() * loveMessages.length);
  return loveMessages[index];
}

// 🌸 Notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("✅ Notifications allowed");
    }
  });
}

// 💌 Show a notification
function sendLoveNotification() {
  if (Notification.permission === "granted") {
    new Notification("💌 Just a reminder", {
      body: getRandomMessage(),
      icon: "icon.png"
    });
  }
}

// 🔁 Daily notification (can be adjusted for testing)
setInterval(sendLoveNotification, 86400000); // 24 hours

// ✅ Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("✅ Service Worker registered"))
    .catch(err => console.error("❌ Service Worker failed:", err));
}

// 📲 Android PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (!document.getElementById('install-btn')) {
    const installBtn = document.createElement('button');
    installBtn.id = 'install-btn';
    installBtn.textContent = '📲 Install Love Notes';
    installBtn.style = `
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

// 🎵 Music toggle + daily message
document.addEventListener("DOMContentLoaded", () => {
  const noteDiv = document.querySelector(".note");
  noteDiv.innerHTML = `
    Here's your daily reminder:<br>
    <strong>${getRandomMessage()}</strong><br>
    You’re amazing and you matter to me every single day.
  `;

  const musicToggle = document.getElementById('music-toggle');
  const music = document.getElementById('background-music');

  if (music && musicToggle) {
    if (localStorage.getItem('musicPlaying') === 'true') {
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
});
