import "server-only";
import { NextResponse } from "next/server";
import { checkoutPayloadSchema } from "@/lib/validation/checkout";
import { MOCK_PRODUCTS } from "@/lib/mock/products";

/**
 * Checkout — Fase 7 (STUB)
 *
 * Comportamento atual: valida payload, recalcula total a partir do banco
 * (regra inegociável: NUNCA confiar em preço vindo do client), simula
 * criação de uma "preference" e retorna URL falsa.
 *
 * Fase 9: substituir o trecho marcado por chamada real ao MP SDK,
 * persistir order via service client, retornar preference.init_point.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = checkoutPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { items } = parsed.data;

  // Recálculo de preço autoritativo a partir do "banco" (mock por enquanto)
  let total_cents = 0;
  const resolved: Array<{ id: string; quantity: number; unit_price_cents: number }> = [];
  for (const it of items) {
    const product = MOCK_PRODUCTS.find((p) => p.id === it.id);
    if (!product || !product.is_active) {
      return NextResponse.json(
        { error: "product_unavailable", id: it.id },
        { status: 409 }
      );
    }
    if (product.stock < it.quantity) {
      return NextResponse.json(
        { error: "insufficient_stock", id: it.id, available: product.stock },
        { status: 409 }
      );
    }
    total_cents += product.price_cents * it.quantity;
    resolved.push({
      id: it.id,
      quantity: it.quantity,
      unit_price_cents: product.price_cents,
    });
  }

  // ── BEGIN STUB ── (Fase 9 substitui por integração MP real)
  const fakeOrderId = `stub-${Date.now()}`;
  const fakePreferenceId = `pref-${fakeOrderId}`;
  const init_point = `/checkout/sucesso?order_id=${fakeOrderId}&stub=1`;
  // ── END STUB ──

  return NextResponse.json({
    order_id: fakeOrderId,
    preference_id: fakePreferenceId,
    init_point,
    total_cents,
    items: resolved,
  });
}
