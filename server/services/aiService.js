const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = "You are the 'Lanka AI Campus Assistant', a sophisticated tutor for Sri Lankan University/Campus students. Provide advanced academic insights, critical analysis, and technical explanations suitable for degree-level study. While maintaining a professional tone, stay friendly and include Sinhala terms for difficult concepts when helpful for local context.";


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

exports.generateQuiz = async (content, count = 5) => {
    const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `${SYSTEM_PROMPT} Generate a quiz based ONLY on the provided document content. 
                Include a mix of: 
                1. Multiple Choice Questions (MCQ) - with 4 options.
                2. True/False Questions.
                3. Short Answer Questions.
                
                Return the response strictly as a JSON object in this format:
                {
                  "questions": [
                    {
                      "type": "mcq",
                      "question": "question text",
                      "options": ["option1", "option2", "option3", "option4"],
                      "answer": "correct option text"
                    },
                    {
                      "type": "true_false",
                      "question": "statement text",
                      "answer": "True or False"
                    },
                    {
                      "type": "short_answer",
                      "question": "question text",
                      "answer": "brief correct answer"
                    }
                  ]
                }`
            },
            { role: "user", content: `Generate a quiz with exactly ${count} questions from this document: \n\n${content}` }
        ],
        response_format: { type: "json_object" }
    });

    try {
        const result = JSON.parse(response.choices[0].message.content);
        if (!result.questions || !Array.isArray(result.questions)) {
            throw new Error("Invalid quiz structure returned by AI");
        }
        return result;
    } catch (e) {
        console.error("Quiz Generation Error:", e.message);
        console.error("Raw AI Response:", response.choices[0].message.content);
        throw new Error("AI failed to generate a valid quiz format. Please try again.");
    }
};


exports.chatTutor = async (history, message, documentContent) => {
    const messages = [
        {
            role: "system",
            content: `${SYSTEM_PROMPT} 
            IMPORTANT: You are helping the student study from a specific document. 
            The document content is provided below. 
            Answer the student's questions ONLY using the information in this document. 
            If the answer is NOT in the document, you MUST say: 'This information is not found in the uploaded document.'
            
            DOCUMENT CONTENT:
            ${documentContent}`
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

exports.generateQuizTopic = async (subject, topic, count) => {
    const response = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: `${SYSTEM_PROMPT} You are a quiz generator. Return strictly valid JSON using double quotes for all keys and string values.`
            },
            {
                role: "user",
                content: `Generate ${count} multiple choice questions for the subject "${subject}" on the topic "${topic}". 
                
                Format the response exactly like this JSON structure:
                { 
                  "questions": [ 
                    { 
                      "question": "question text", 
                      "options": ["option1", "option2", "option3", "option4"], 
                      "answer": "correct option text" 
                    } 
                  ] 
                }`
            }
        ],
        response_format: { type: "json_object" }
    });
    try {
        const result = JSON.parse(response.choices[0].message.content);
        if (!result.questions || !Array.isArray(result.questions)) {
            throw new Error("Invalid quiz structure");
        }
        return result;
    } catch (e) {
        console.error("Topic Quiz Generation Error:", e.message);
        throw new Error("AI failed to generate a valid quiz. Please try a more specific topic.");
    }
};


exports.generateStudyPlanTopic = async (examDate, subjects) => {
    const response = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: `${SYSTEM_PROMPT} Create a daily study plan leading up to the exam date: ${examDate}. The student is studying these subjects: ${subjects.join(', ')}. Break it down into daily tasks.` },
        ],
    });
    return response.choices[0].message.content;
};

