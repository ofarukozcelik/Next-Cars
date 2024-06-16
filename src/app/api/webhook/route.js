import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Order from "../(models)/Order";

const stripe = require("stripe")(process.env.STRIPE_KEY);

// Nextjs Body işleme özelliğini kapat.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Eğer ödeme başarılı ise stripe post isteği atacak
export async function POST(req) {
  //1) İsteğin body kısmını texte çevir
  const body = await req.text();

  //2) Gerekli headera ulaş
  const signature = headers().get("stripe-signature");

  let event;

  //3) Gerçekleşen ödeme ile alakalı verilere eriş
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.WEBHOOK_KEY
    );
  } catch (err) {
    return NextResponse.json({ message: "Webhook başarısız" }, { status: 500 });
  }

  // 4) Ödeme başarılı olduysa satın alınan ürünün verilerine eriş
  if (event.type === "checkout.session.completed") {
    // Ödeme verileri
    const session = event.data.object;

    // Bu ödeme oturumunda satın alınan ürünlere eriş
    const line_items = await stripe.checkout.sessions.listLineItems(session.id);

    // Ürünün katalog verisine eriş
    const item = await stripe.products.retrieve(
      line_items.data[0].price.product
    );

    // Kendi veritabanımıza eklenecek sipariş verisi oluştur
    const orderItem = {
      product: item.metadata.product_id,
      money_spend: line_items.data[0].amount_total,
      currency: line_items.data[0].price.currency,
      type: line_items.data[0].price.type,
    };

    // Satın alınan ürünü siparişler kolleksiyonuna ekle
    await Order.create(orderItem);

    // Clienta olumlu cevap gönder
    return NextResponse.json(
      {
        status: "success",
      },
      { status: 200 }
    );
  }

  // Clienta olumsuz cevap gönder
  return NextResponse.json(
    {
      status: "fail",
    },
    { status: 500 }
  );
}
