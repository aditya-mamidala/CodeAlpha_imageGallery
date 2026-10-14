const photos = [
  { title: "Where the Earth Breathes", category: "nature", label: "Nature", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85", alt: "Layered mountain peaks above the clouds" },
  { title: "Lines of the City", category: "architecture", label: "Architecture", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85", alt: "Minimal modern architecture against the sky" },
  { title: "A Quiet Escape", category: "travel", label: "Travel", src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=85", alt: "Colorful coastal village beside the sea" },
  { title: "Wild at Heart", category: "wildlife", label: "Wildlife", src: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=85", alt: "Elephant standing in a natural landscape" },
  { title: "Into the Blue", category: "nature", label: "Nature", src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85", alt: "Open landscape under a dramatic sky" },
  { title: "Concrete Poetry", category: "architecture", label: "Architecture", src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=85", alt: "Sculptural contemporary building" },
  { title: "The Long Way Home", category: "travel", label: "Travel", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=85", alt: "Sunlight spilling over a green mountain valley" },
  { title: "Eyes of the Wild", category: "wildlife", label: "Wildlife", src: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1000&q=85", alt: "Colorful bird perched on a branch" }
];

const grid = document.querySelector("#gallery-grid");
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const visibleCount = document.querySelector("#visible-count");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCategory = document.querySelector("#lightbox-category");
const lightboxCounter = document.querySelector("#lightbox-counter");
const closeButton = document.querySelector("#lightbox-close");
const prevButton = document.querySelector("#lightbox-prev");
const nextButton = document.querySelector("#lightbox-next");

let activeFilter = "all";
let visiblePhotos = [...photos];
let currentIndex = 0;
let lastFocusedElement = null;
let touchStartX = 0;

document.querySelector("#year").textContent = new Date().getFullYear();

function renderGallery() {
  visiblePhotos = activeFilter === "all"
    ? [...photos]
    : photos.filter(photo => photo.category === activeFilter);

  grid.innerHTML = visiblePhotos.map((photo, index) => `
    <button class="gallery-card" type="button" data-index="${index}"
      aria-label="Open ${photo.title}">
      <span class="card-image">
        <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async">
        <span class="card-overlay"></span>
        <span class="card-open" aria-hidden="true">↗</span>
        <span class="card-info">
          <span><span class="card-category">${photo.label}</span><span class="card-title">${photo.title}</span></span>
          <span class="card-index">${String(index + 1).padStart(2, "0")}</span>
        </span>
      </span>
    </button>
  `).join("");

  visibleCount.textContent = String(visiblePhotos.length).padStart(2, "0");
  const allButton = filterButtons.find(button => button.dataset.filter === "all");
  if (allButton) allButton.innerHTML = `All frames <span>${String(photos.length).padStart(2, "0")}</span>`;
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach(button => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderGallery();
}

function openLightbox(index) {
  if (!visiblePhotos.length) return;
  currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
  lastFocusedElement = document.activeElement;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-active");
  closeButton.focus();
}

function updateLightbox() {
  const photo = visiblePhotos[currentIndex];
  lightboxImage.src = photo.src.replace("w=1000", "w=1800");
  lightboxImage.alt = photo.alt;
  lightboxTitle.textContent = photo.title;
  lightboxCategory.textContent = photo.label;
  lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")}`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-active");
  lightboxImage.src = "";
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
}

function moveLightbox(direction) {
  currentIndex = (currentIndex + direction + visiblePhotos.length) % visiblePhotos.length;
  updateLightbox();
}

filterButtons.forEach(button => button.addEventListener("click", () => setFilter(button.dataset.filter)));
grid.addEventListener("click", event => {
  const card = event.target.closest(".gallery-card");
  if (card) openLightbox(Number(card.dataset.index));
});
closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", () => moveLightbox(-1));
nextButton.addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
lightbox.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener("touchend", event => {
  const difference = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(difference) > 55) moveLightbox(difference < 0 ? 1 : -1);
}, { passive: true });

renderGallery();
