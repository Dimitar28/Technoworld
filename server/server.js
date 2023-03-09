import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello World!'
  })
})
app.post("/create-checkout-session", async (req, res) => {
  const { lineItems } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
  });
  res.status(200).send({ sessionId: session.id });
});
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", content: "You are a customer support chatbot.You help and assist people by answering their questions.If a user's prompt/query is not related to this specific e-commerce website,say that you only answer query's related to the website and don't repeat it after every prompt.If a user's prompt is empty, say that they need to enter a query."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    res.status(200).send({
      bot: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('Server started on http://localhost:5000'))