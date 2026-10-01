import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const app = express();
app.use(express.json());
app.use(express.static('public'));
const conversations = new Map();

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body ?? {};
    if (!message?.trim() || !sessionId) return res.status(400).json({error:'Mensagem inválida.'});
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({error:'Configure OPENAI_API_KEY no arquivo .env.'});
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let conversation = conversations.get(sessionId);
    if (!conversation) {
      conversation = await client.conversations.create();
      conversations.set(sessionId, conversation.id);
    }
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-6-luna',
      conversation,
      instructions: 'Você é E-Zip, um assistente geral útil, claro, amigável e seguro. Responda no idioma do usuário.',
      input: [{ role: 'user', content: message }]
    });
    res.json({ reply: response.output_text });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Erro ao falar com a IA.' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log(`E-Zip em http://localhost:${process.env.PORT || 3000}`));
