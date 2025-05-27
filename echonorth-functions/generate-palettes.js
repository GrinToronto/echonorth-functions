const fetch = require('node-fetch');

exports.handler = async function (event) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const { description } = JSON.parse(event.body || '{}');

  if (!description) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing description' })
    };
  }

  const prompt = `
You are a creative brand assistant. Based on the product or service below, generate:

1. Eight themed color palettes. Each should have:
  - A short name
  - 3 hex color values

2. Eight relevant visual design aesthetics.

Product/Service: ${description}

Respond as JSON like:
{
  "palettes": [
    { "name": "Palette Name", "colors": ["#xxxxxx", "#xxxxxx", "#xxxxxx"] },
    ...
  ],
  "aesthetics": [
    "Aesthetic One", "Aesthetic Two", ...
  ]
}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You return JSON with palettes and aesthetics.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return {
      statusCode: 200,
      body: content,
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate palettes', detail: error.message })
    };
  }
};