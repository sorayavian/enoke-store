import "server-only";
import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Webhook do Mercado Pago — Fase 7 (ESQUELETO)
 *
 * Em produção (Fase 9), este handler:
 * 1. Valida assinatura x-signature com MERCADOPAGO_WEBHOOK_SECRET.
 * 2. Lê payment_id do payload, chama MP API para detalhes.
 * 3. Pega external_reference (= order_id).
 * 4. Idempotência via orders.mp_payment_id.
 * 5. Chama RPC confirm_order_payment(order_id, payment_id) — transação atômica.
 *
 * Hoje retorna 200 e loga o evento.
 */

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader || !secret) return false;
  // x-signature: "ts=...,v1=..."
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((kv) => kv.split("=") as [string, string])
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;
  const manifest = `id:${parts.id ?? ""};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest + rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (secret) {
    const signature = request.headers.get("x-signature");
    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }
  }

  try {
    const payload = JSON.parse(rawBody);
    console.info("[mp-webhook]", {
      type: payload?.type,
      action: payload?.action,
      data_id: payload?.data?.id,
    });
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Fase 9: persistência + RPC confirm_order_payment()
  return NextResponse.json({ received: true });
}
