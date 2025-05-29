// submit-prompt.js

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://echo-north.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: 'OK',
    };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    console.log("Request origin:", event.headers.origin);
    const { description, palette, aesthetic } = body;
    const prompt = `Create 5 unique AI prompt suggestions for a mood board.
Project Description: ${description}
Design Palette: ${palette}
Aesthetic Style: ${aesthetic}`;

    // Replace with your actual OpenAI API key or use a secure method in production
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("Using API key starts with:", apiKey?.slice(0, 5));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant generating content for a mood board." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("OpenAI response data:", data);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://echo-north.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        originDebug: event.headers.origin,
        output: data.choices?.[0]?.message?.content || "No response generated.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://echo-north.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        error: error.message,
        originDebug: event.headers.origin,
      }),
    };
  }
};