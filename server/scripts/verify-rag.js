const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const aiService = require('../services/aiService');


async function verifyRAG() {
    console.log('--- RAG Fallback Verification ---');

    const mockDocumentContent = "Lanka AI is a study assistant built for Sri Lankan students. It helps with PDF analysis.";
    const outOfContextQuestion = "Who won the FIFA World Cup in 2022?";

    console.log(`Document: "${mockDocumentContent}"`);
    console.log(`Question: "${outOfContextQuestion}"`);

    try {
        const response = await aiService.chatTutor([], outOfContextQuestion, mockDocumentContent);
        console.log(`\nAI Response: "${response}"`);

        if (response.includes("information is not found in the uploaded document")) {
            console.log('\n✅ SUCCESS: AI correctly refused to answer out-of-context question.');
        } else {
            console.log('\n❌ FAILURE: AI answered an out-of-context question or returned unexpected response.');
        }
    } catch (error) {
        console.error('Error during verification:', error.message);
    }
}

async function verifyQuiz() {
    console.log('\n--- Quiz Diversity Verification ---');
    const mockContent = "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.";

    try {
        const quiz = await aiService.generateQuiz(mockContent);
        console.log('Quiz Result Keys:', Object.keys(quiz));
        console.log('Question 1 Type:', quiz.questions[0].type);

        const types = new Set(quiz.questions.map(q => q.type));
        console.log('Generated Question Types:', Array.from(types));

        if (types.has('mcq') || types.has('true_false') || types.has('short_answer')) {
            console.log('\n✅ SUCCESS: Quiz generator supports multiple types.');
        }
    } catch (error) {
        console.error('Error during quiz verification:', error.message);
    }
}

async function run() {
    await verifyRAG();
    // await verifyQuiz(); // Optional - costs tokens
}

run();
