// gemini-agent.js

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runAgent(userPrompt) {
    // Asegúrate de que el nombre del archivo sea correcto (¿AGENTS.md o AGENT.md?)
    const agentContext = fs.readFileSync('./AGENTS.md', 'utf8');

    // Cambié el modelo a gemini-1.5-flash ya que 2.5 no es una versión estable/pública aún
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        systemInstruction: agentContext
    });

    const fullPrompt = `${userPrompt}. 
    IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido. 
    No agregues texto explicativo ni antes ni después.
    Estructura: {"filePath": "ruta/al/archivo.js", "code": "contenido del script"}`;

    try {
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        // 1. Limpieza robusta de JSON (Busca desde el primer '{' hasta el último '}')
        const firstBracket = responseText.indexOf('{');
        const lastBracket = responseText.lastIndexOf('}');

        if (firstBracket === -1 || lastBracket === -1) {
            throw new Error("No se encontró un bloque JSON válido en la respuesta.");
        }

        const cleanJson = responseText.substring(firstBracket, lastBracket + 1);
        const { filePath, code } = JSON.parse(cleanJson);

        console.log(`\n--- PROPUESTA DE CAMBIO ---`);
        console.log(`Archivo: ${filePath}`);
        console.log(`Contenido:\n${code.substring(0, 300)}...\n`);

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // 2. Manejo de escritura UNIFICADO dentro de la confirmación
        readline.question('¿Deseas aplicar este cambio? (s/n): ', (answer) => {
            if (answer.toLowerCase() === 's') {
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                fs.writeFileSync(filePath, code, 'utf8');
                console.log(`✅ Archivo ${filePath} creado/actualizado con éxito.`);
            } else {
                console.log('❌ Operación cancelada por el usuario.');
            }
            readline.close();
        });

    } catch (error) {
        console.error("❌ Error al procesar la respuesta del agente:");
        console.error(error.message);
        // Si quieres ver qué rompió el JSON, descomenta la siguiente línea:
        // console.log("Respuesta cruda:", responseText);
    }
}

const userPrompt = process.argv.slice(2).join(" ");
if (!userPrompt) {
    console.log("Por favor ingresa una instrucción para el agente.");
} else {
    runAgent(userPrompt);
}