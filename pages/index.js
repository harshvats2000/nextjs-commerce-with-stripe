import Head from "next/head";
import styles from "../styles/Home.module.css";
// import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useEffect } from "react";
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// destroyCookie(null, "cart");
export default function Home({ prices }) {
  // const products = PRODUCTS.map((prod) => ({ ...prod, quantity: 0 }));

  useEffect(() => {
    console.log(prices);
  }, []);

  // const addToCart = (prod) => {
  //   let cart = parseCookies().cart || "";

  //   if (cart === "") {
  //     setCookie(null, "cart", JSON.stringify({ [prod.id]: { ...prod, quantity: 1 } }));
  //   } else {
  //     cart = JSON.parse(cart);
  //     let indexOfProd = null;

  //     for (const id in cart) {
  //       if (id == prod.id) indexOfProd = id;
  //     }

  //     if (indexOfProd !== null) {
  //       cart[indexOfProd].quantity += 1;
  //     } else {
  //       cart = Object.assign({}, cart, { [prod.id]: { ...prod, quantity: 1 } });
  //     }
  //     setCookie(null, "cart", JSON.stringify(cart));
  //   }

  //   console.log(JSON.parse(parseCookies().cart));
  //   // alert(`successfully added "${prod.name} to cart."`);
  // };

  const handleCheckout = async (id) => {
    const { sessionId } = await fetch("api/checkout/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quantity: 2,
        price_id: id
      })
    }).then((res) => res.json());

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const { errror } = await stripe.redirectToCheckout({
      sessionId
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Stripe E-commerce</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Shop</h1>

        <div className={styles.products}>
          {prices.map(({ id, product: prod, unit_amount }) => (
            <div key={prod.id} className={styles.product}>
              <img style={{ width: 350, height: 350 }} src={prod.images[0]} alt={prod.name} />
              <h1>{prod.name}</h1>
              <p>${unit_amount / 100}</p>
              {/* <button onClick={() => addToCart(prod)}>Add to Cart</button> */}
              <button onClick={() => handleCheckout(id)}>BUY NOW</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const prices = await stripe.prices.list({
    active: true,
    limit: 10,
    expand: ["data.product"]
  });

  return {
    props: { prices: prices.data }
  };
};
