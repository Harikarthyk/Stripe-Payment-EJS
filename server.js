require("dotenv").config()

const express = require("express");
const app = express();
const cors = require("cors");
const engines = require("consolidate");


app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const stripe = require("stripe")('sk_test_51HPvdfLIsRCbc3VeW9A6sIeURsE47HU1Q5AImDJDiUnfgcKR5X6q1jYbUUwDSFzOC6bMBfuFnvHls8XT3vgsZA3s00Wyq8b5G9');

app.get('/', (req, res) => {
  res.render('index')
})

/**
 * @description Stripe Payment route
 * @returns redirects to session.url
 * @body pass items (type array)
 */
app.post("/create-checkout-session", async (req, res) => {
  try {
    // let items = [
    //   { id: 1, quantity: 3, name: "Product 01", price: 20 },
    //   { id: 2, quantity: 1, name: "Product 02", price: 10 },
    // ];
    // const {data , stripeData} = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      
      // line_items: items.map(item => {
      //   return {
      //     price_data: {
      //       currency: "inr",
      //       product_data: {
      //         name: item.name,
      //       },
      //       unit_amount: item.price * 100,
           
      //     },
      //     quantity: item.quantity,
      //   }
      // }),
      line_items : [
        {
          price_data: { 
            currency: 'inr', 
            product_data: {name : "Organize Me"}, 
            unit_amount: 10 * 100 
          },
          quantity : 1
        }
      ],
      // line_items : [
      //     {
      //       price_data: stripeData,
      //       quantity : 1
      //     }
      //   ],
      success_url: `http://localhost:5050/success`,
      cancel_url: `http://localhost:5050/cancel`,
    });
    // Sample Session data https://stripe.com/docs/api/checkout/sessions/create?lang=node
    // {
    //   id: 'cs_test_b1GCcTaACLH6iR3SkaLKys0KiiNJlvIER2wOQvCPI3HWqjYjUmdEaibeDT',
    //   object: 'checkout.session',
    //   after_expiration: null,
    //   allow_promotion_codes: null,
    //   amount_subtotal: 7000,
    //   amount_total: 7000,
    //   automatic_tax: { enabled: false, status: null },
    //   billing_address_collection: null,
    //   cancel_url: 'http://localhost:5050/cancel',
    //   client_reference_id: null,
    //   consent: null,
    //   consent_collection: null,
    //   currency: 'inr',
    //   customer: null,
    //   customer_details: null,
    //   customer_email: null,
    //   expires_at: 1631602357,
    //   livemode: false,
    //   locale: null,
    //   metadata: {},
    //   mode: 'payment',
    //   payment_intent: 'pi_1JZ91tLIsRCbc3VepBGld2YS',
    //   payment_method_options: {},
    //   payment_method_types: [ 'card' ],
    //   payment_status: 'unpaid',
    //   recovered_from: null,
    //   setup_intent: null,
    //   shipping: null,
    //   shipping_address_collection: null,
    //   submit_type: null,
    //   subscription: null,
    //   success_url: 'http://localhost:5050/success',
    //   total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
    //   url: 'https://checkout.stripe.com/pay/cs_test_b1GCcTaACLH6iR3SkaLKys0KiiNJlvIER2wOQvCPI3HWqjYjUmdEaibeDT#fidkdWxOYHwnPyd1blpxYHZxWjA0TVVzYWNJTHZXRmdmNlNgUF9MSHY1fHRLTFB1SjBfV31jNGo2YTBsQGtrdE1mUWMzQHBRaWNTM1NHZkQ8YTNtVDJNQ2swMlJUV19pfHF2RmZgb3F2XX10NTVhb3w0R3ZsYScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl'
    // }

    res.redirect(session.url);
  } catch (error) {
    console.log('------Line 54------', error);
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.get('/success', (req, res) => {
  console.log(req.headers,req.body,'----');
  return res.render('success');
})

app.get('/cancel', (req, res) => {
  return res.render('cancel');
});

let PORT = 5050;

app.listen(PORT, () => console.log(`Server is up and running ${PORT}`))
