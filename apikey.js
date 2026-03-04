const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function checkModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // Intentamos listar o probar directamente
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent("test");
        console.log("Conexión exitosa con: gemini-1.5-flash");
    } catch (error) {
        console.log("Error con 1.5-flash, intentando con pro...");
        try {
            const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            await modelPro.generateContent("test");
            console.log("Conexión exitosa con: gemini-1.5-pro");
        } catch (err) {
            console.error("No se pudo conectar con ningún modelo. Revisa tu API Key.");
        }
    }
}
checkModels();