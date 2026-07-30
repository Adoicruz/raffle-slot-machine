// ===== Demo Data =====
// Later these will come from Glide
const entrants = [
  { name: "John", tickets: 5 },
  { name: "Sarah", tickets: 2 },
  { name: "Mike", tickets: 1 },
  { name: "Ashley", tickets: 4 },
  { name: "Chris", tickets: 3 },
];

// Build weighted pool
const weightedPool = [];

entrants.forEach(person => {
  for (let i = 0; i < person.tickets; i++) {
    weightedPool.push(person.name);
  }
});

const reel = document.getElementById("reel");
const drawButton = document.getElementById("drawButton");
const modal = document.getElementById("winnerModal");
const winnerName = document.getElementById("winnerName");
const closeWinner = document.getElementById("closeWinner");

// Fill reel with many names
function buildReel() {
  reel.innerHTML = "";

  for (let i = 0; i < 100; i++) {
    const div = document.createElement("div");
    div.className = "reel-item";
    div.textContent =
      weightedPool[Math.floor(Math.random() * weightedPool.length)];

    reel.appendChild(div);
  }
}

buildReel();

drawButton.addEventListener("click", spin);

closeWinner.addEventListener("click", () => {
  modal.style.display = "none";
});

function spin() {
  drawButton.disabled = true;

  buildReel();

  const items = [...document.querySelectorAll(".reel-item")];

  let offset = 0;
  let speed = 38;

  const winner =
    weightedPool[Math.floor(Math.random() * weightedPool.length)];

  const stopIndex = 80;

  function animate() {
    offset += speed;

    reel.style.transform = `translateY(-${offset}px)`;

    if (speed > 4) {
      speed *= 0.985;
    }

    const current = Math.floor(offset / 80);

    items.forEach(item => item.classList.remove("active"));

    if (items[current + 1]) {
      items[current + 1].classList.add("active");
    }

    if (current < stopIndex) {
      requestAnimationFrame(animate);
    } else {
      winnerName.textContent = winner;

      modal.style.display = "flex";

      drawButton.disabled = false;
    }
  }

  animate();
}
