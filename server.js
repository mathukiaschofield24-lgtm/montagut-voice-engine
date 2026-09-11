import express from 'express';
import dotenv from 'dotenv';
import twilio from 'twilio';
import OpenAI from 'openai';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const CEO_NUMBER = "+254748885061";

// Tool that AI MUST call
async function send_text_tool({ business_name, full_name, phone, email, package_name }) {
  const message = `NEW LEAD - ${package_name}\nBusiness: ${business_name}\nContact: ${full_name}\nPhone: ${phone}\nEmail: ${email}\nTime: ${new Date().toLocaleString()}\nAction: Call them to start setup`;
  
  await client.messages.create({
    to: CEO_NUMBER,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: message
  });
  console.log("SMS sent to CEO:", message);
  return { success: true };
}

// Twilio Voice Webhook
app.post('/voice', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.connect().stream({ url: `wss://${process.env.DOMAIN}/media` });
  res.type('text/xml').send(twiml.toString());
});

app.listen(process.env.PORT || 3000, () => console.log("Montagut Engine Live"));
