// List of love notes 💖
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
  "You make my heart so full 💓"
];

function getRandomMessage() {
  const index = Math.floor(Math.random() * loveMessages.length);
  return loveMessages[index];
}

document.addEventListener("DOMContentLoaded", () => {
  const noteDiv = document.querySelector(".note");
  noteDiv.textContent = ""; // clear any existing content first
  noteDiv.innerHTML = `
    Here's your daily reminder:<br>
    <strong>${getRandomMessage()}</strong><br>
    You’re amazing and you matter to me every single day.
  `;
});


// Notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Notifications allowed");
    }
  });
}

// Show a notification with a random message
function sendLoveNotification() {
  if (Notification.permission === "granted") {
    new Notification("💌 Just a reminder", {
      body: getRandomMessage(),
      icon: "icon.png"
    });
  }
}

// Send one now (for demo/testing)
sendLoveNotification();

// Repeat every 24 hours (86,400,000ms). For testing, you can use a smaller value like 60000.
setInterval(sendLoveNotification, 86400000);

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker registered"));
}
