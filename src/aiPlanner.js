
const { GoogleGenAI } = require("@google/genai");

class NacrtIzleta {
  constructor(podatki) {
    if (
      typeof podatki.naslov !== "string" ||
      typeof podatki.opis !== "string" ||
      !Array.isArray(podatki.aktivnosti) ||
      !podatki.aktivnosti.every(a =>
        typeof a.ura === "string" &&
        typeof a.naziv === "string" &&
        typeof a.opis === "string"
      )
    ) {
      throw new Error("Neveljavna struktura AI odgovora.");
    }

    this.naslov = podatki.naslov;
    this.opis = podatki.opis;
    this.aktivnosti = podatki.aktivnosti;
  }

  static izJSON(json) {
    return new NacrtIzleta(JSON.parse(json));
  }
}

async function ustvariNacrt(kraj, datum, vrsta, trajanje) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Manjka GEMINI_API_KEY v .env.");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const prompt = `
    Pripravi turistični načrt izleta v Sloveniji.

    Kraj: ${kraj}
    Datum: ${datum}
    Vrsta aktivnosti: ${vrsta}
    Trajanje: ${trajanje}

    Predlagaj 3 do 5 aktivnosti s približnimi urami.
    Odgovori v slovenščini.
    Ne izmišljaj si preverjenih odpiralnih časov
    ali vremenskih napovedi.
  `;

let odgovor;

for (let poskus = 1; poskus <= 3; poskus++) {
  try {
    odgovor = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          properties: {
            naslov: { type: "string" },
            opis: { type: "string" },
            aktivnosti: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ura: { type: "string" },
                  naziv: { type: "string" },
                  opis: { type: "string" }
                },
                required: ["ura", "naziv", "opis"]
              }
            }
          },
          required: ["naslov", "opis", "aktivnosti"]
        }
      }
    });

    break;
  } catch (napaka) {
    const sporocilo = String(napaka.message || napaka);
    const zacasnaNapaka =
      napaka.status === 503 ||
      sporocilo.includes('"code":503') ||
      sporocilo.includes('"code":429');

    if (!zacasnaNapaka || poskus === 3) {
      throw napaka;
    }

    console.log(`Gemini je zaseden. Poskus ${poskus}/3 ...`);

    await new Promise(resolve =>
      setTimeout(resolve, 2000 * poskus)
    );
  }
}

  if (!odgovor.text) {
    throw new Error("Gemini ni vrnil odgovora.");
  }

  return NacrtIzleta.izJSON(odgovor.text);
}

module.exports = { ustvariNacrt, NacrtIzleta };
