// --- index.js ---
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./system_prompt.js";
import { getNews, postTweet } from "./tools.js";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.9
    },
});

const tools = { getNews, postTweet };
const messages = [];

async function runAgent() {
    const userMessage = {
        type: "user",
        user: "Post a tweet about something relevant to any of these topics: startup funding, AI product launch, deeptech India, AI regulation, VC funding news, open source AI, Series A startup, business model innovation, global tech policy."
    };

    messages.push(JSON.stringify(userMessage));

    while (true) {
        const chat = await model.generateContent(messages);
        const result = chat.response.text().trim();
        console.log("===== AI RESPONSE =====\n", result);
        messages.push(result);

        let action;
        try {
            action = JSON.parse(result);
        } catch (err) {
            console.error("⚠️ Could not parse JSON:", err.message);
            break;
        }

        // ✅ Break loop if AI returns malformed or unexpected structure
        if (!action || typeof action !== "object" || Array.isArray(action) || !action.type) {
            console.error("❌ Unexpected AI response format. Breaking loop.");
            console.error("🧪 Raw AI output:", result);
            break;
        }

        if (action.type === "output") {
            console.log(`🤖 ${action.output}`);

            let tweetText = action.output;
            // let linkToInsert = null;

            for (let i = messages.length - 1; i >= 0; i--) {
                try {
                    const msg = JSON.parse(messages[i]);
                    // if (msg.type === "observation" && msg.observation?.link) {
                    //     linkToInsert = msg.observation.link;
                    //     break;
                    // }
                } catch (e) { continue; }
            }

            // if (linkToInsert) {
            //     tweetText = tweetText.replace(/\[?<?link>?]?/gi, "").trim();
            //     if (!tweetText.includes(linkToInsert)) {
            //         tweetText = `${tweetText} ${linkToInsert}`;
            //     }
            // }

            if (tweetText.startsWith("Nothing tweet-worthy")) return;

            const tweetStatus = await postTweet(tweetText);
            console.log(tweetStatus);
            break;
        } else if (action.type === "action") {
            const fn = tools[action.function];
            if (!fn) {
                console.error("Unknown function:", action.function);
                break;
            }
            const observation = await fn(action.input);
            messages.push(JSON.stringify({ type: "observation", observation }));
        }
    }
}

runAgent();
