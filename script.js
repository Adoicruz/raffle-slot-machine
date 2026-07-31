// Read the raffle data sent from Glide
const params = new URLSearchParams(window.location.search);

const namesText = params.get("names") || "";
const selectedWinner = params.get("winner") || "";

// Convert "John Smith|||Test 1|||Test 2" into an array
let entrantNames = namesText
  .split("|||")
  .map(name => name.trim())
  .filter(Boolean);

// Demo fallback, used only when the page is opened directly
if (entrantNames.length === 0) {
  entrantNames = ["John Smith", "Sarah Jones", "Mike Brown"];
}

// Ensure the saved winner is included
if (
  selectedWinner &&
  !entrantNames.some(
    name => name.toLowerCase() === selectedWinner.toLowerCase()
  )
) {
  entrantNames.push(selectedWinner);
}

const reel = document.getElementById("reel");
const drawButton = document.getElementById("drawButton");
const modal = document.getElementById("winnerModal");
const winnerName = document.getElementById("winnerName");
const closeWinner = document.getElementById("closeWinner");

const ITEM_HEIGHT = 80;
const STOP_INDEX = 85;

// Shuffle a copy of an array
function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }

  return copy;
}

// Build a long reel that always lands on Glide's saved winner
function buildReel() {
  reel.innerHTML = "";
  reel.style.transition = "none";
  reel.style.transform = "translateY(0px)";

  const spinNames = [];

  while (spinNames.length <= STOP_INDEX + 4) {
    spinNames.push(...shuffle(entrantNames));
  }

  // The center row will stop on this item
  spinNames[STOP_INDEX + 1] =
    selectedWinner || entrantNames[Math.floor(Math.random() * entrantNames.length)];

  spinNames.forEach(name => {
    const item = document.createElement("div");
    item.className = "reel-item";
    item.textContent = name;
    reel.appendChild(item);
  });

  return spinNames[STOP_INDEX + 1];
}

function spin() {
  if (entrantNames.length === 0) {
    alert("No raffle entrants were found.");
    return;
  }

  drawButton.disabled = true;
  modal.style.display = "none";

  const finalWinner = buildReel();

  // Allow the browser to render the reset position first
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      reel.style.transition =
        "transform 5s cubic-bezier(0.12, 0.72, 0.18, 1)";

      const finalOffset = STOP_INDEX * ITEM_HEIGHT;

      reel.style.transform = `translateY(-${finalOffset}px)`;
    });
  });

  window.setTimeout(() => {
    const items = [...document.querySelectorAll(".reel-item")];

    items.forEach(item => item.classList.remove("active"));

    const winningItem = items[STOP_INDEX + 1];

    if (winningItem) {
      winningItem.classList.add("active");
    }

    winnerName.textContent = finalWinner;
    modal.style.display = "flex";
    drawButton.disabled = false;
  }, 5100);
}

drawButton.addEventListener("click", spin);

closeWinner.addEventListener("click", () => {
  modal.style.display = "none";
});

// Automatically begin when opened from Glide
if (namesText && selectedWinner) {
  window.setTimeout(spin, 500);
} else {
  buildReel();
}
