import test from "node:test";
import assert from "node:assert/strict";
import { flavors, PRODUCT, productMessage, orderMessage, whatsappLink } from "./catalog.js";

test("catalog has three unique flavors and the approved product", () => {
  assert.deepEqual(
    flavors.map((flavor) => flavor.id),
    ["morango", "amora", "abacaxi"],
  );
  assert.equal(PRODUCT.size, "500 ml");
  assert.equal(PRODUCT.price, "R$ 20");
});
test("product links use the centralized size and price", () => {
  for (const flavor of flavors) {
    assert.equal(
      productMessage(flavor),
      `Oi! Quero pedir um TykaYurt de ${flavor.name} de 500 ml (R$ 20).`,
    );
    assert.equal(
      new URL(whatsappLink(productMessage(flavor))).searchParams.get("text"),
      productMessage(flavor),
    );
  }
});
test("order message preserves quantity and trims optional notes", () => {
  assert.equal(
    orderMessage(flavors[1], 2, " sem açúcar "),
    "Oi! Quero pedir 2 Amora 500 ml por R$ 20. Observações: sem açúcar",
  );
  assert.equal(orderMessage(flavors[0], 1, "   "), "Oi! Quero pedir 1 Morango 500 ml por R$ 20.");
});
