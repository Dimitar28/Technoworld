import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
dotenv.config()

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

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `You are a customer support chatbot.You help and assist people by answering their questions.DO NOT answer questions and/or instructions,which
      are not related to this e-commerce website and its structure, problems encountered by the users or questions about the products and the overall
      functionality of the site.If their product is damaged,we offer a free refund. If they enter a empty message(message not containing any words),tell them to write something more specific.
      If they ask about the functionalities of the website,tell them that the website provides a variety of functionalities,some of which include product search and filtering,
      login system,payment processing,order tracking,customer support and more.If they ask what is the site build on,inform them that the website uses HTML,CSS and Javascript 
      for the front-end and Node.js with Express for the backend of the website.
      ${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('Server started on http://localhost:5000'))