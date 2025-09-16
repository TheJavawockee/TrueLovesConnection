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
const installBtn = document.getElementById('install-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Achievement container
const achievementContainer = document.createElement('div');
achievementContainer.id = "achievement-container";
achievementContainer.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999;";
document.body.appendChild(achievementContainer);

// ------------------ DAILY MESSAGE ------------------
const messageDiv = document.createElement("div");
messageDiv.id = "daily-message";
messageDiv.innerHTML = `
  Here's your daily reminder:<br>
  <strong>${getRandomMessage()}</strong><br>
  You’re amazing and you matter to me every single day.
`;
noteDiv.appendChild(messageDiv);

// Heart count divs for both users
const yourHeartDiv = document.createElement('div');
const herHeartDiv = document.createElement('div');
noteDiv.appendChild(yourHeartDiv);
noteDiv.appendChild(herHeartDiv);

// ------------------ HEART TAP ------------------
const heartAchievements = [
  { count: 10, message: "🎉 10 taps! You’re extra loved today ❤️" },
  { count: 50, message: "💖 50 taps! Love legend in the making!" },
  { count: 100, message: "🏆 100 taps! Ultimate heart master 💘" },
];

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

// ------------------ FIREBASE ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

let currentUser = null;

// ------------------ TIMESTAMP FORMATTER ------------------
function formatTimestamp(ts) {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

// ------------------ AUTH ------------------
loginBtn.addEventListener('click', () => signInWithPopup(auth, provider).catch(console.error));
logoutBtn.addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, async user => {
  currentUser = user;
  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';

    // Listen heart counts in real-time
    listenHeartCounts();

    // Listen to notes in real-time
    const q = query(collection(db, "notes"), orderBy("timestamp"));
    onSnapshot(q, snapshot => {
      notesList.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const time = formatTimestamp(data.timestamp);
        const li = document.createElement("li");
        li.textContent = `[${time}] ${data.author || 'Anonymous'}: ${data.text}`;
        notesList.appendChild(li);
      });
    });

  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    notesList.innerHTML = "";
    yourHeartDiv.innerHTML = '';
    herHeartDiv.innerHTML = '';
  }
});

// ------------------ HEART COUNTS LOGIC ------------------
let yourCount = 0;
let herCount = 0;

function updateHeartDisplays() {
  yourHeartDiv.innerHTML = `💖 Joe's taps: <strong>${yourCount}</strong>`;
  herHeartDiv.innerHTML = `💖 Patrycja's taps: <strong>${herCount}</strong>`;
}

function listenHeartCounts() {
  if (!currentUser) return;

  const yourRef = doc(db, 'heartCounts', currentUser.uid);
  const herUid = currentUser.uid === 'JNT0LyAOCxfNuZOBaaMQ3wYqEiI3'
    ? 'KZPXhrCbdtOsMRINlcU3JWmCUVu2'
    : 'JNT0LyAOCxfNuZOBaaMQ3wYqEiI3';
  const herRef = doc(db, 'heartCounts', herUid);

  onSnapshot(yourRef, (docSnap) => {
    yourCount = docSnap.exists() ? docSnap.data().count : 0;
    updateHeartDisplays();
  });

  onSnapshot(herRef, (docSnap) => {
    herCount = docSnap.exists() ? docSnap.data().count : 0;
    updateHeartDisplays();
  });
}

// Heart tap event
heart.addEventListener('click', async () => {
  if (!currentUser) return alert('Please log in first!');
  yourCount++;
  await setDoc(doc(db, 'heartCounts', currentUser.uid), { count: yourCount });

  // Achievements
  heartAchievements.forEach(ach => {
    if (yourCount === ach.count) showAchievement(ach.message);
  });
});

// ------------------ SEND NOTES ------------------
sendNoteBtn.addEventListener("click", async () => {
  if (!currentUser) return alert('Please log in first!');
  const text = noteInput.value.trim();
  if (!text) return;

  await addDoc(collection(db, "notes"), {
    text,
    timestamp: Date.now(),
    author: currentUser.displayName
  });

  noteInput.value = "";
});

// ------------------ PWA INSTALL PROMPT ------------------
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
  installBtn.style.display = 'none';
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(outcome === 'accepted' ? '✅ Installed' : '❌ Dismissed');
    deferredPrompt = null;
  }
});
