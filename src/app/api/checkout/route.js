import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const getActiveProducts = async () => {
  // Katalogdaki bütün ürünleri alır
  let stripeProducts = await stripe.products.list();

  // Aktif ürünleri filtreler
  return stripeProducts.data.filter((i) => i.active);
};

export const POST = async (req) => {
  try {
    //1) İsteğin body kısmında gelen satın alınacak araç verisine erişim
    const product = await req.json();

    //2) Stripe kataloguna kaydedilmiş ürünleri al
    const stripeProducts = await getActiveProducts();
    console.log("ürünler:", stripeProducts.data);

    //3) Satın alınacak ürün katalogta var mı kontrol et
    let foundProduct = stripeProducts.find(
      (i) => i.metadata.product_id === product._id
    );

    //4) Katalogta yok ise ürünü kataloga ekle
    if (!foundProduct) {
      foundProduct = await stripe.products.create({
        name: product.make + " " + product.model,
        images: [product.imageUrl],
        default_price_data: {
          unit_amount: product.price * 100,
          currency: "USD",
        },
        metadata: {
          product_id: product._id,
        },
      });
    }

    //5) Ürünün stripe tarafından oluşturulan id'sini ve satın alım miktarını bir nesneye koy
    const product_info = {
      price: foundProduct.default_price,
      quantity: 1,
    };

    //6) Ödeme oturumu (url) oluştur
    const session = await stripe.checkout.sessions.create({
      line_items: [product_info],
      mode: "payment",
      success_url: "http://localhost:3000" + "/success",
      cancel_url: "http://localhost:3000" + "/cancel",
    });

    //7) Satın alım url'ini client'a döndür
    return NextResponse.json({
      url: session.url,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Ödeme oturumu oluşturulurken bir hata oluştu!",
      },
      { status: 500 }
    );
  }
};
