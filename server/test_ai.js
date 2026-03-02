const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

async function test() {
    try {
        console.log("Testing Groq API...");
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "user", content: "Hello, are you working?" }
            ],
        });
        console.log("Response:", response.choices[0].message.content);
        console.log("SUCCESS");
    } catch (error) {
        console.error("FAILURE:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

test();
