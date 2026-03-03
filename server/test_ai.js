require('dotenv').config();
const aiService = require('./services/aiService');

async function run() {
    try {
        console.log("Testing AI Service...");
        const res = await aiService.chatTutor([], "Hello, what are you?", "");
        console.log("SUCCESS:", res);
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
run();
