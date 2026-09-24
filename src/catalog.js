export const flavors = [
  {
    id: "morango",
    name: "Morango",
    label: "Fruta real",
    tagline: "A assinatura da casa",
    description:
      "Morango natural, equilibrado e intenso, com fruta real em cada colherada. Uma base cremosa e um sabor limpo, doce sem exagero — o clássico que perde o medo de ser lembrado.",
    image: new URL('../images/morango-sabor.svg', import.meta.url).href,
  },
  {
    id: "amora",
    name: "Amora",
    label: "Mais sofisticado",
    tagline: "Elegância em cada colherada",
    description:
      "Amora de sabor marcante, com acidez elegante e textura intensa. Um perfil mais refinado, pensado para quem gosta de fruta mais séria, com personalidade e profundidade.",
    image: new URL('../images/amora-sabor.svg', import.meta.url).href,
  },
  {
    id: "abacaxi",
    name: "Abacaxi",
    label: "Refrescante",
    tagline: "Tropical e irresistível",
    description:
      "Abacaxi tropical, fresco e vibrante, com um toque cítrico que abre o paladar. Leve, perfumado e perfeito para quem quer sentir uma experiência mais revigorante.",
    image: new URL('../images/abacaxi-sabor.svg', import.meta.url).href,
  },
];

export const PRODUCT = { price: "R$ 20", size: "500 ml", note: "pequeno lote • sabor premium" };
export function whatsappLink(message) {
  return `https://wa.me/554191731323?text=${encodeURIComponent(message)}`;
}
export function productMessage(flavor) {
  return `Oi! Quero pedir um TykaYurt de ${flavor.name} de ${PRODUCT.size} (${PRODUCT.price}).`;
}
export function orderMessage(flavor, quantity, notes = "") {
  const base = `Oi! Quero pedir ${quantity} ${flavor.name} ${PRODUCT.size} por ${PRODUCT.price}.`;
  const cleanNotes = notes.trim();
  return cleanNotes ? `${base} Observações: ${cleanNotes}` : base;
}
