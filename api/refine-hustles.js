// api/refine-hustles.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { age, time, interest, zipcode, city, region } = req.body;

  const prompt = `
You are a helpful assistant that generates unique, realistic side hustle ideas for teens.
The user is ${age} years old, has about ${time} hours/week, and is interested in ${interest}.
They live in ${city || zipcode}, ${region}.
Suggest 3 specific, creative, and localized side hustles. Be original.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
    });

    const text = completion.choices[0].message.content;
    const ideas = text.split('\n').filter(line => line.trim()).map(line => line.replace(/^\d+\.\s*/, ''));

    res.status(200).json({ ideas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ideas: ["⚠️ Something went wrong. Try again later."] });
  }
}
