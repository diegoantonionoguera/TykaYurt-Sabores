import { flavors, PRODUCT, whatsappLink, productMessage, orderMessage } from "./catalog.js";

const tabs = document.querySelector(".flavor-tabs");
const quickFlavorGrid = document.querySelector("#quick-flavor-grid");
const flavorChoiceButton = document.querySelector(".flavor-choice-button");
const choiceLabel = document.querySelector(".choice-label");
const flavorSelect = document.querySelector("#flavor-select");
const quantityInput = document.querySelector("#quantity-input");
const quantityButtons = document.querySelectorAll(".quantity-button");
const notesInput = document.querySelector("#notes-input");
const orderForm = document.querySelector("#order-form");
const image = document.querySelector("#product-image");
const tag = document.querySelector("#product-tag");
const name = document.querySelector("#product-name");
const description = document.querySelector("#product-description");
const price = document.querySelector("#product-price");
const size = document.querySelector("#product-size");
const note = document.querySelector("#product-note");
const orderLink = document.querySelector("#order-link");

function renderFlavorOptions(activeId = "morango") {
  if (!flavorSelect) return;

  flavorSelect.innerHTML = flavors
    .map(
      (flavor) =>
        `<option value="${flavor.id}" ${flavor.id === activeId ? "selected" : ""}>${flavor.name}</option>`,
    )
    .join("");
}

function renderQuickFlavorCards(activeId = "morango") {
  if (!quickFlavorGrid) return;

  quickFlavorGrid.innerHTML = flavors
    .map(
      (flavor) => `
        <button
          type="button"
          data-flavor-id="${flavor.id}"
          class="quick-flavor-card ${flavor.id === activeId ? "active" : ""}"
          aria-pressed="${flavor.id === activeId}"
        >
          <span class="quick-flavor-name">${flavor.name}</span>
          <small>${flavor.label}</small>
        </button>
      `,
    )
    .join("");

  quickFlavorGrid.querySelectorAll(".quick-flavor-card").forEach((button) => {
    button.addEventListener("click", () => {
      const nextFlavor = button.dataset.flavorId;
      updateFlavor(nextFlavor);
      setFlavorMenu(false);
    });
  });

  if (flavorChoiceButton && choiceLabel) {
    const selected = flavors.find((item) => item.id === activeId) ?? flavors[0];
    choiceLabel.textContent = selected.name;
  }
}

function renderTabs(activeId = "morango") {
  tabs.innerHTML = "";

  flavors.forEach((flavor) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.flavorId = flavor.id;
    button.className = `tab ${flavor.id === activeId ? "active" : ""}`;
    button.setAttribute("aria-pressed", String(flavor.id === activeId));
    button.innerHTML = `
      <span class="tab-name">${flavor.name}</span>
      <small>${flavor.label}</small>
    `;
    button.addEventListener("click", () => updateFlavor(flavor.id));
    tabs.appendChild(button);
  });
}

function updateFlavor(id) {
  const flavor = flavors.find((item) => item.id === id) ?? flavors[0];

  image.src = flavor.image;
  image.alt = `Pote de iogurte artesanal sabor ${flavor.name}`;
  tag.textContent = flavor.tagline;
  name.textContent = flavor.name;
  description.textContent = flavor.description;
  price.textContent = PRODUCT.price;
  size.textContent = PRODUCT.size;
  note.textContent = PRODUCT.note;
  orderLink.href = whatsappLink(productMessage(flavor));
  orderLink.textContent = `Pedir ${flavor.name}`;

  if (flavorSelect) flavorSelect.value = flavor.id;
  for (const button of document.querySelectorAll("[data-flavor-id]")) {
    const selected = button.dataset.flavorId === flavor.id;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  }
  if (choiceLabel) choiceLabel.textContent = flavor.name;
}

function buildWhatsAppMessage() {
  const selected = flavors.find((item) => item.id === flavorSelect.value) ?? flavors[0];
  return orderMessage(selected, Number(quantityInput.value || 1), notesInput.value || "");
}
function setFlavorMenu(open) {
  quickFlavorGrid?.classList.toggle("open", open);
  flavorChoiceButton?.setAttribute("aria-expanded", String(open));
}

if (flavorChoiceButton) {
  flavorChoiceButton.addEventListener("click", () => {
    setFlavorMenu(!quickFlavorGrid?.classList.contains("open"));
  });

  document.addEventListener("click", (event) => {
    const clickedInside =
      flavorChoiceButton.contains(event.target) || quickFlavorGrid?.contains(event.target);
    if (!clickedInside) {
      setFlavorMenu(false);
    }
  });
}

if (quantityButtons.length) {
  quantityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const min = Number(quantityInput.min || 1);
      const max = Number(quantityInput.max || 20);
      const current = Number(quantityInput.value || min);
      const nextValue = action === "increase" ? current + 1 : current - 1;
      const safeValue = Math.min(max, Math.max(min, nextValue));
      quantityInput.value = String(safeValue);
    });
  });
}

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    window.open(whatsappLink(buildWhatsAppMessage()), "_blank", "noopener");
  });
}

renderTabs();
renderFlavorOptions();
renderQuickFlavorCards();
updateFlavor("morango");

flavorSelect?.addEventListener("change", () => updateFlavor(flavorSelect.value));
flavorChoiceButton?.setAttribute("aria-controls", "quick-flavor-grid");
setFlavorMenu(false);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && quickFlavorGrid?.classList.contains("open")) {
    setFlavorMenu(false);
    flavorChoiceButton?.focus();
  }
});
