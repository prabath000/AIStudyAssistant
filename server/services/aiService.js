const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = "You are the 'Lanka AI Campus Assistant', a sophisticated tutor for Sri Lankan University/Campus students. Provide advanced academic insights, critical analysis, and technical explanations suitable for degree-level study. Maintain a professional yet friendly and supportive tone.";


exports.generateSummary = async (content) => {
    const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `${SYSTEM_PROMPT} Analyze the following document content. Generate a response with three clearly labeled sections: 1. Short Summary, 2. Key Points, 3. Important Concepts.`
            },
            { role: "user", content: content }
        ],
    });
    return response.choices[0].message.content;
};


exports.chatTutor = async (history, message, documentContent) => {
    const systemContent = documentContent
        ? `${SYSTEM_PROMPT} 
            IMPORTANT: You are helping the student study from a specific document. 
            The document content is provided below. 
            Answer the student's questions ONLY using the information in this document. 
            If the answer is NOT in the document, you MUST say: 'This information is not found in the uploaded document.'
            
            DOCUMENT CONTENT:
            ${documentContent}`
        : SYSTEM_PROMPT;

    const messages = [
        {
            role: "system",
            content: systemContent
        },
        ...history,
        { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages,
    });
    return response.choices[0].message.content;
};

exports.generateNotesTopic = async (topic) => {
    const response = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: `${SYSTEM_PROMPT} Generate comprehensive study notes for the given lesson topic. Include a Summary, Key Points, and Short Exam Notes.` },
            { role: "user", content: `Topic: ${topic}` }
        ],
    });
    return response.choices[0].message.content;
};

exports.processWritingTask = async (taskType, content) => {
    let systemPromptText = "";

    switch (taskType) {
        case 'ai-detector':
            systemPromptText = "You are an AI detection system. Analyze the text and provide a result in this EXACT format:\nAI PERCENTAGE: [X]%\nANALYSIS: [Brief analysis of markers]\n\nBe very critical. If it sounds like Llama, GPT, or Claude, give a high percentage.";
            break;
        case 'humanize':
            systemPromptText = "You are a professional editor. Rewrite the following AI-generated text to sound more natural and human-like. Use varied sentence structures and a warm tone.";
            break;
        case 'grammar':
            systemPromptText = "You are a precise grammar checker. Return the result in this EXACT format:\nCORRECTED TEXT: [The full corrected text]\n\nCHANGES:\n- [Original Word/Phrase] -> [Corrected Word/Phrase]: [Brief Reason]";
            break;
        case 'improve':
            systemPromptText = "You are an expert writing coach. Enhance the vocabulary and flow of the text while maintaining the original message.";
            break;
        case 'translate':
            systemPromptText = "You are a professional translator specializing in English and Sinhala. Detect the source language. If it is English, translate it to clear, natural Sinhala. If it is Sinhala, translate it to professional, fluent English. Return ONLY the translated text.";
            break;
        default:
            throw new Error('Invalid task type');
    }

    const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: `${SYSTEM_PROMPT} ${systemPromptText}` },
            { role: "user", content: content }
        ],
    });
    return response.choices[0].message.content;
};

exports.generateQuizTopic = async (subject, topic, count) => {
    const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `${SYSTEM_PROMPT} Generate a multiple-choice quiz about the following topic. 
                Return the response in this EXACT JSON format:
                {
                    "questions": [
                        {
                            "question": "Question text here?",
                            "options": ["Option A", "Option B", "Option C", "Option D"],
                            "correctAnswer": 0
                        }
                    ]
                }
                The 'correctAnswer' should be the index (0-3) of the correct option in the 'options' array.`
            },
            { role: "user", content: `Subject: ${subject}, Topic: ${topic}, Number of questions: ${count}` }
        ],
        response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content).questions;
};

exports.generateStudyPlanTopic = async (examDate, subjects) => {
    const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `${SYSTEM_PROMPT} Create a professional and structured study plan for a student. 
                Return the response in this EXACT JSON format:
                {
                    "plan": [
                        {
                            "week": "Week 1",
                            "focus": "Focus of the week",
                            "tasks": ["Task 1", "Task 2"]
                        }
                    ]
                }`
            },
            { role: "user", content: `Exam Date: ${examDate}, Subjects: ${subjects}` }
        ],
        response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content).plan;
};

exports.generateQuizDocument = async (content) => {
    const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `${SYSTEM_PROMPT} Generate a comprehensive quiz based on the provided document content. 
                Include a mix of 5 questions (MCQs).
                Return the response in this EXACT JSON format:
                {
                    "questions": [
                        {
                            "question": "Question text here?",
                            "options": ["Option A", "Option B", "Option C", "Option D"],
                            "answer": "Exact correct option text",
                            "type": "mcq"
                        }
                    ]
                }`
            },
            { role: "user", content: content }
        ],
        response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
};


