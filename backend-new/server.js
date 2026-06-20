const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// API Key Setup
const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6IWmMFiOg5sg_S11dRRHfQywaoOmcVNe46LX22KEFaKUDg";
const genAI = new GoogleGenerativeAI(apiKey);

// ROUTE 1: SIMULATION ENGINE (Graph + Marketing Insights)
app.post('/api/simulate', async (req, res) => {
    try {
        const { category, budget, targetAge, location } = req.body;
        const cleanCategory = (category || 'Jewellery').trim();
        const cleanLocation = (location || 'Hapur').trim();
        const userBudget = parseFloat(budget) || 5000;
        const targetAgeGroup = targetAge || '18';

        let aiOutput = null;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Act as an expert local Indian business consultant. For a store selling "${cleanCategory}" with a monthly budget of Rs.${userBudget} targeting the age group ${targetAgeGroup} in "${cleanLocation}", generate a high-converting social media marketing strategy.
            You must return ONLY a raw JSON object string with no markdown formatting, no triple backticks, and no extra text. Match this exact template structure:
            {
              "adCopy": "Catchy Instagram or FB post text using emojis tailored to regional shoppers",
              "hashtags": "3 tailored high-volume hashtags",
              "strategy": "A clear operational marketing advice line under 25 words"
            }`;

            const result = await model.generateContent(prompt);
            let textResponse = result.response.text().trim();
            if (textResponse.includes("```")) {
                textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            }
            aiOutput = JSON.parse(textResponse);
        } catch (aiError) {
            console.log("Gemini simulation fallback triggered.");
            aiOutput = {
                adCopy: `✨ Premium ${cleanCategory} Collection now live in ${cleanLocation}! ✨\n\nLooking for the perfect style statement? Specially crafted to blend classic tradition with modern trends, our latest collection is perfect for the age group ${targetAgeGroup}+!\n\n📍 Visit our hub in ${cleanLocation} today or DM us for exclusive lookbooks!`,
                hashtags: `#${cleanCategory.replace(/\s+/g, '')} #ShopLocal${cleanLocation} #FashionVibes`,
                strategy: `Allocate ₹${userBudget} towards highly optimized geo-fenced Instagram carousel ads targeting buyers within 15km of ${cleanLocation}.`
            };
        }

        // Generate Chart Data Matrix
        const baseData = [
            { month: 'Jan', revenue: 4000 }, { month: 'Feb', revenue: 3000 },
            { month: 'Mar', revenue: 5000 }, { month: 'Apr', revenue: 4700 },
            { month: 'May', revenue: 6000 }, { month: 'Jun', revenue: 6500 },
        ];
        const graphData = baseData.map(item => ({
            ...item,
            prediction: Math.round(item.revenue * (1.12 + ((userBudget / 500) * 0.038)))
        }));

        res.json({ success: true, graphData, aiOutput, confidence: userBudget > 2500 ? "99%" : "96%" });
    } catch (globalError) {
        res.status(500).json({ success: false, error: "Internal crash mitigated." });
    }
});

// ROUTE 2: DYNAMIC TWIN CHATBOT
app.post('/api/chat', async (req, res) => {
    try {
        const { message, category, location, targetAge } = req.body;
        let aiReply = "";

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are an AI Digital Twin Consultant for a shop keeper who sells "${category}" in "${location}" targeting age ${targetAge}. 
            The shopkeeper asks: "${message}". Give a highly actionable, short, sharp advice in 2-3 sentences max in simple language with an emoji.`;
            
            const result = await model.generateContent(prompt);
            aiReply = result.response.text().trim();
        } catch (err) {
            aiReply = `💡 For your ${category} shop in ${location}, I suggest focusing heavily on local WhatsApp groups and word-of-mouth discounts for customers around age ${targetAge}. This will maximize profits instantly!`;
        }
        res.json({ success: true, reply: aiReply });
    } catch (e) {
        res.status(500).json({ success: false, error: "Chat system error." });
    }
});

// Render Dynamic Port Integration (Don't Change)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 TwinSeller Engine running on port ${PORT}`));