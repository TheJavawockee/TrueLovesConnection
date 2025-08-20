// ------------------ LOVE MESSAGES ------------------
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
  return loveMessages[Math.floor(Math.random() * loveMessages.length)];
}

// ------------------ DOM ELEMENTS ------------------
const noteDiv = document.querySelector(".note");
const heart = document.querySelector(".heart");
const musicToggle = document.getElementById('music-toggle');
const music = document.getElementById('background-music');
const notesList = document.getElementById("notes");
const noteInput = document.getElementById("noteInput");
const sendNoteBtn = document.getElementById("sendNote");

// Add achievement container
const achievementContainer = document.createElement('div');
achievementContainer.id = "achievement-container";
achievementContainer.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999;";
document.body.appendChild(achievementContainer);

// ------------------ DAILY MESSAGE ------------------
noteDiv.innerHTML = `
  Here's your daily reminder:<br>
  <strong>${getRandomMessage()}</strong><br>
  You’re amazing and you matter to me every single day.
`;

// ------------------ HEART TAP ------------------
const heartAchievements = [
  { count: 10, message: "🎉 10 taps! You’re extra loved today ❤️" },
  { count: 50, message: "💖 50 taps! Love legend in the making!" },
  { count: 100, message: "🏆 100 taps! Ultimate heart master 💘" },
];

// Load saved count
let loveCount = parseInt(localStorage.getItem('loveCount')) || 0;

// Update display function
function updateHeartDisplay() {
  noteDiv.innerHTML = `
    This is how much I love you:<br>
    <strong>${loveCount}</strong> ${loveCount === 1 ? 'time' : 'times'} ❤️
  `;
}

// Function to show achievement popup
function showAchievement(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.cssText = `
    background: #ff69b4;
    color: white;
    padding: 1rem 2rem;
    margin-top: 0.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.5s ease-out;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
  `;

  achievementContainer.appendChild(popup);

  requestAnimationFrame(() => {
    popup.style.opacity = 1;
    popup.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    popup.style.opacity = 0;
    popup.style.transform = 'translateY(-20px)';
    setTimeout(() => achievementContainer.removeChild(popup), 500);
  }, 3000);
}

// Initial display
updateHeartDisplay();

// ------------------ FIREBASE ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWtN8SaDA6DV36zTATKP7pT4y5OllS9HQ",
  authDomain: "true-loves-connection.firebaseapp.com",
  projectId: "true-loves-connection",
  storageBucket: "true-loves-connection.firebasestorage.app",
  messagingSenderId: "107010363938",
  appId: "1:107010363938:web:3d44c5b25f3633d4aef07b",
  measurementId: "G-0FT36T6PQP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// ------------------ AUTH ------------------
const loginBtn = document.createElement('button');
loginBtn.textContent = '🔑 Sign in with Google';
loginBtn.style.cssText = 'display:block;margin:1rem auto;padding:0.5rem 1rem;background:#ff69b4;color:white;border:none;border-radius:5px;cursor:pointer;';
document.body.prepend(loginBtn);

let currentUser = null;

loginBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider).catch(console.error);
});

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loginBtn.style.display = 'none';
  } else {
    currentUser = null;
    loginBtn.style.display = 'block';
  }
});

// ------------------ FIRESTORE NOTES ------------------
sendNoteBtn.addEventListener("click", async () => {
  const text = noteInput.value.trim();
  if (!text || !currentUser) return;

  await addDoc(collection(db, "notes"), {
    text,
    timestamp: Date.now(),
    author: currentUser.displayName
  });

  noteInput.value = "";
});

const q = query(collection(db, "notes"), orderBy("timestamp"));
onSnapshot(q, snapshot => {
  notesList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.author || 'Anonymous'}: ${data.text}`;
    notesList.appendChild(li);
  });
});

// ------------------ GLOBAL HEART ACHIEVEMENTS ------------------
const achievementsRef = collection(db, "achievements");

onSnapshot(achievementsRef, snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === "added") {
      const ach = change.doc.data();
      showAchievement(`${ach.user}: ${ach.message}`);
    }
  });
});

// ------------------ HEART TAP WITH GLOBAL ------------------
heart.addEventListener('click', async () => {
  loveCount++;
  updateHeartDisplay();
  localStorage.setItem('loveCount', loveCount);

  if (currentUser) {
    // Save per-user heart count
    const userRef = doc(db, 'heartCounts', currentUser.uid);
    await setDoc(userRef, { count: loveCount });

    // Check for achievements
    for (const ach of heartAchievements) {
      if (loveCount === ach.count) {
        showAchievement(ach.message);
        await addDoc(achievementsRef, {
          user: currentUser.displayName,
          message: ach.message,
          timestamp: Date.now()
        });
      }
    }
  } else {
    // Local achievement only
    heartAchievements.forEach(ach => {
      if (loveCount === ach.count) showAchievement(ach.message);
    });
  }
});

// ------------------ MUSIC TOGGLE ------------------
if (music && musicToggle) {
  const savedMusicPlaying = localStorage.getItem('musicPlaying') === 'true';
  if (savedMusicPlaying) {
    music.play();
    musicToggle.textContent = '🔇 Pause Music';
  }

  musicToggle.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      musicToggle.textContent = '🔇 Pause Music';
      localStorage.setItem('musicPlaying', 'true');
      if (navigator.vibrate) navigator.vibrate([100,50,100]);
    } else {
      music.pause();
      musicToggle.textContent = '🎵 Play Music';
      localStorage.setItem('musicPlaying', 'false');
    }
  });
}

// ------------------ PWA INSTALL PROMPT ------------------
let deferredPrompt;
const installBtn = document.createElement('button');
installBtn.textContent = '📲 Install App';
installBtn.style.cssText = 'display:block;margin:1rem auto;padding:0.5rem 1rem;background:#ff69b4;color:white;border:none;border-radius:5px;cursor:pointer;';
document.body.prepend(installBtn);
installBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    installBtn.style.display = 'none';
  }
  deferredPrompt = null;
});
