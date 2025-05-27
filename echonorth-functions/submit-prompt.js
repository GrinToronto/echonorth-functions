// submit-prompt.js

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body || '{}');
  const name = body.name || "friend";

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}! Your test prompt was received.`,
      received: body,
    }),
  };
};