const flavors = [
  {
    id: 'morango',
    name: 'Morango',
    label: 'Fruta real',
    tagline: 'A assinatura da casa',
    description:
      'Morango natural, equilibrado e intenso, com fruta real em cada colherada. Uma base cremosa e um sabor limpo, doce sem exagero — o clássico que perde o medo de ser lembrado.',
    accent: '#c21863',
    image: './images/morango-sabor.svg',
    price: 'R$ 20',
    size: '500 ml',
    note: 'pequeno lote • sabor premium',
    whatsapp: 'Oi! Quero pedir um TykaYurt de Morango de 500 ml (R$ 20).',
  },
  {
    id: 'amora',
    name: 'Amora',
    label: 'Mais sofisticado',
    tagline: 'Elegância em cada colherada',
    description:
      'Amora de sabor marcante, com acidez elegante e textura intensa. Um perfil mais refinado, pensado para quem gosta de fruta mais séria, com personalidade e profundidade.',
    accent: '#8f2f8b',
    image: './images/amora-sabor.svg',
    price: 'R$ 20',
    size: '500 ml',
    note: 'pequeno lote • sabor premium',
    whatsapp: 'Oi! Quero pedir um TykaYurt de Amora de 500 ml (R$ 20).',
  },
  {
    id: 'abacaxi',
    name: 'Abacaxi',
    label: 'Refrescante',
    tagline: 'Tropical e irresistível',
    description:
      'Abacaxi tropical, fresco e vibrante, com um toque cítrico que abre o paladar. Leve, perfumado e perfeito para quem quer sentir uma experiência mais revigorante.',
    accent: '#dca016',
    image: './images/abacaxi-sabor.svg',
    price: 'R$ 20',
    size: '500 ml',
    note: 'pequeno lote • sabor premium',
    whatsapp: 'Oi! Quero pedir um TykaYurt de Abacaxi de 500 ml (R$ 20).',
  },
];

const tabs = document.querySelector('.flavor-tabs');
const quickFlavorGrid = document.querySelector('#quick-flavor-grid');
const flavorChoiceButton = document.querySelector('.flavor-choice-button');
const choiceLabel = document.querySelector('.choice-label');
const flavorSelect = document.querySelector('#flavor-select');
const quantityInput = document.querySelector('#quantity-input');
const quantityButtons = document.querySelectorAll('.quantity-button');
const notesInput = document.querySelector('#notes-input');
const orderForm = document.querySelector('#order-form');
const image = document.querySelector('#product-image');
const tag = document.querySelector('#product-tag');
const name = document.querySelector('#product-name');
const description = document.querySelector('#product-description');
const price = document.querySelector('#product-price');
const size = document.querySelector('#product-size');
const note = document.querySelector('#product-note');
const orderLink = document.querySelector('#order-link');

function whatsappLink(message) {
  return `https://wa.me/554191731323?text=${encodeURIComponent(message)}`;
}

function renderFlavorOptions(activeId = 'morango') {
  if (!flavorSelect) return;

  flavorSelect.innerHTML = flavors
    .map(
      (flavor) =>
        `<option value="${flavor.id}" ${flavor.id === activeId ? 'selected' : ''}>${flavor.name}</option>`,
    )
    .join('');
}

function renderQuickFlavorCards(activeId = 'morango') {
  if (!quickFlavorGrid) return;

  quickFlavorGrid.innerHTML = flavors
    .map(
      (flavor) => `
        <button
          type="button"
          data-flavor-id="${flavor.id}"
          class="quick-flavor-card ${flavor.id === activeId ? 'active' : ''}"
          style="--accent:${flavor.accent};"
          aria-pressed="${flavor.id === activeId}"
        >
          <span class="quick-flavor-name">${flavor.name}</span>
          <small>${flavor.label}</small>
        </button>
      `,
    )
    .join('');

  quickFlavorGrid.querySelectorAll('.quick-flavor-card').forEach((button) => {
    button.addEventListener('click', () => {
      const nextFlavor = button.dataset.flavorId;
      updateFlavor(nextFlavor);
      quickFlavorGrid.classList.remove('open');
    });
  });

  if (flavorChoiceButton && choiceLabel) {
    const selected = flavors.find((item) => item.id === activeId) ?? flavors[0];
    choiceLabel.textContent = selected.name;
  }
}

function renderTabs(activeId = 'morango') {
  tabs.innerHTML = '';

  flavors.forEach((flavor) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tab ${flavor.id === activeId ? 'active' : ''}`;
    button.style.setProperty('--accent', flavor.accent);
    button.setAttribute('aria-pressed', String(flavor.id === activeId));
    button.innerHTML = `
      <span class="tab-name">${flavor.name}</span>
      <small>${flavor.label}</small>
    `;
    button.addEventListener('click', () => updateFlavor(flavor.id));
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
  price.textContent = flavor.price;
  size.textContent = flavor.size;
  note.textContent = flavor.note;
  orderLink.href = whatsappLink(flavor.whatsapp);
  orderLink.textContent = `Pedir ${flavor.name}`;
  document.documentElement.style.setProperty('--brand-accent', flavor.accent);

  if (flavorSelect) flavorSelect.value = flavor.id;
  renderTabs(flavor.id);
  renderFlavorOptions(flavor.id);
  renderQuickFlavorCards(flavor.id);
}

function buildWhatsAppMessage() {
  const selectedFlavor = flavors.find((item) => item.id === flavorSelect.value) ?? flavors[0];
  const quantity = Number(quantityInput.value || 1);
  const cleanNotes = (notesInput.value || '').trim();

  const base = `Oi! Quero pedir ${quantity} ${selectedFlavor.name} ${selectedFlavor.size} por ${selectedFlavor.price}.`;
  return cleanNotes ? `${base} Observações: ${cleanNotes}` : base;
}

if (flavorChoiceButton) {
  flavorChoiceButton.addEventListener('click', () => {
    quickFlavorGrid?.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    const clickedInside = flavorChoiceButton.contains(event.target) || quickFlavorGrid?.contains(event.target);
    if (!clickedInside) {
      quickFlavorGrid?.classList.remove('open');
    }
  });
}

if (quantityButtons.length) {
  quantityButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const min = Number(quantityInput.min || 1);
      const max = Number(quantityInput.max || 20);
      const current = Number(quantityInput.value || min);
      const nextValue = action === 'increase' ? current + 1 : current - 1;
      const safeValue = Math.min(max, Math.max(min, nextValue));
      quantityInput.value = String(safeValue);
    });
  });
}

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    window.open(whatsappLink(buildWhatsAppMessage()), '_blank', 'noopener');
  });
}

renderTabs();
renderFlavorOptions();
renderQuickFlavorCards();
updateFlavor('morango');
