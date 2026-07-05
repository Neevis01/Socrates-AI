require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const Database = require('better-sqlite3');

// SQLite Setup
const db = new Database('socrates.db');

// Tabelle erstellen, falls sie nicht existiert
db.prepare(`
  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    title TEXT,
    messages TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

const app = express();

// Zwingt den Server, das Paket IMMER zu öffnen, egal welcher Stempel drauf ist
app.use(express.json({ type: '*/*' }));
app.use(express.static(__dirname)); // Serviert index.html und style.css

// Sicherheits-Check im Terminal
console.log("-----------------------------------------");
console.log("Überprüfe API-Schlüssel...");
if (process.env.GEMINI_API_KEY) {
    console.log("STATUS: Schlüssel erfolgreich aus .env geladen!");
    console.log("STARTET MIT:", process.env.GEMINI_API_KEY.substring(0, 7) + "...");
} else {
    console.log("STATUS: FEHLER! Kein GEMINI_API_KEY in der .env gefunden!");
}
console.log("-----------------------------------------");

// Gemini Client initialisieren
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });

// --- API ENDPUNKTE ---

// 1. Chat-Nachricht an KI senden
app.post('/api/chat', async (req, res) => {
  console.log("ANGEKOMMENES PAKET:", req.body);

  try {
    const frontendMessages = req.body.messages;

    if (!frontendMessages || frontendMessages.length === 0) {
      return res.status(400).json({ error: "Keine Nachricht empfangen." });
    }

    const geminiHistory = frontendMessages.map(msg => {
      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      };
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash', 
      contents: geminiHistory,
      config: {
        systemInstruction: "Du bist Sokrates. Antworte streng nach der Sokratischen Methode. Gib keine Ratschläge, tröste nicht und stimme dem Nutzer nicht einfach zu, sondern rege durch gezielte Fragen zum Nachdenken an. WICHTIGE AUSNAHME: Wenn der Nutzer explizit sagt, dass er eine deiner Fragen nicht versteht oder dir nicht folgen kann, verlasse kurz diese strenge Rolle. Erkläre deinen letzten Gedanken in einfachen, klaren Worten und schließe dann mit einer neuen, verständlicheren Frage ab. SPRACHREGEL: Antworte immer dynamisch in der Sprache, die der Nutzer verwendet (z.B. Englisch, Deutsch, Französisch). Wenn der Nutzer auf Englisch schreibt, wechselst du komplett ins Englische und nimmst die Rolle von 'Socrates' auf Englisch an. Nutze Deutsch als Standard-Basissprache, wenn ein Chat neu beginnt. FORMVORGABE: Fasse dich immer so kurz wie möglich. Schreibe im natürlichen Chat-Stil, verzichte komplett auf Aufzählungszeichen (Bulletpoints) oder Listen und stelle idealerweise immer nur eine einzige, präzise Gegenfrage am Ende deiner Nachricht."
      }
    });

    res.json({ 
        reply: response.text, 
        text: response.text, 
        response: response.text 
    });

  } catch (error) {
    console.error("Gemini API Fehler details:", error);
    res.status(500).json({ error: "Die Reflexion konnte nicht fortgesetzt werden." });
  }
});

// 2. Alle Chats laden (für die Seitenleiste)
app.get('/api/history', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM chats ORDER BY updated_at DESC');
    const rows = stmt.all();
    
    // Die Nachrichten kommen als String aus der DB und müssen wieder zu Arrays werden
    const formattedChats = rows.map(row => ({
      id: row.id,
      title: row.title,
      date: row.updated_at,
      messages: JSON.parse(row.messages)
    }));
    
    res.json(formattedChats);
  } catch (error) {
    console.error("DB Lade-Fehler:", error);
    res.status(500).json({ error: "Fehler beim Laden der Chats" });
  }
});

// 3. Chat speichern
app.post('/api/save-chat', (req, res) => {
  try {
    const { id, title, messages } = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO chats (id, title, messages, updated_at) 
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `);
    stmt.run(id, title, JSON.stringify(messages));
    res.json({ success: true });
  } catch (error) {
    console.error("DB Speicher-Fehler:", error);
    res.status(500).json({ error: "Fehler beim Speichern" });
  }
});

// 4. Chat löschen
app.delete('/api/delete-chat/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM chats WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("DB Lösch-Fehler:", error);
    res.status(500).json({ error: "Fehler beim Löschen" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Socrates läuft live auf http://localhost:3000`);
});