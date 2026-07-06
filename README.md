# Socrates — My Digital Philosophy Sparring Partner

Hi! I'm a 19-year-old business administration (BWL) student who has an unhealthy passion for philosophy. During my semester break, I wanted to build something real that connects my interests —so I created **Socrates**.

Instead of being another boring AI assistant that blindly agrees with everything you say or writes your essays for you, this app does the exact opposite. It uses the strict **Socratic Method** to question your assumptions, poke holes in your logic, and drive you slightly crazy until you find the answers within yourself. 

Think of it as a conversational sparring partner for your brain.

---

## Live Demo

You can try out the live application here: **[Socrates AI Live Demo](https://socrates-ai-kyy7.onrender.com)**

> 💡 **Note on Free-Tier Hosting:** The live app is hosted on Render's free tier. If the app hasn't been used recently, the server will be in a "spin-down" sleep mode. **Please allow 30–50 seconds for the initial server wake-up** on your first message. Once awake, Socrates replies instantly!
> 
> *Also note: Since it runs on an ephemeral free instance, the local SQLite chat history resets whenever the server goes to sleep.*

---

## Features

- **The Socratic Roast Engine:** Powered by Google's Gemini API, fine-tuned to never give you direct advice, comfort you, or agree with you. It only asks painful, deep, contextual counter-questions.
- **The "I Don't Get It" Panic Button:** If Socrates goes full ancient-greek-nerd mode and you lose the plot, just tell him you don't understand. The backend prompt features an emergency exit where he briefly drops the act, explains his thought simply, and asks a lighter question.
- **Long-Term Memory:** Built with an SQLite database. It doesn't just remember your last sentence like a goldfish; it transforms the entire chat history so Gemini understands the whole philosophical arc.
- **No Ghosting:** Your conversations are permanently saved locally. You can close the browser, restart your laptop, or contemplate your existence overnight—your chats stay right there in the sidebar.
- **Mobile Friendly:** Optimized layouts and a slick dark-mode UI with gold accents. Perfect for having existential crises on your smartphone while lying on the couch.
- **Philosophical Export (Markdown):** Export your deep dialogues instantly into a beautifully formatted .md file with a single click—locally processed via client-side Blob architecture to keep your server lightweight and fast.

---

## Tech Stack

- **Frontend:** Semantic HTML5, Custom Modern CSS3 (Variables, Keyframe Animations), Vanilla JavaScript (Asynchronous Fetch API). No bloated frameworks, just raw performance.
- **Backend:** Node.js & Express.js.
- **Database:** SQLite via `better-sqlite3` because setting up a massive MongoDB server for my midnight thoughts felt like overkill.
- **AI Integration:** Google Gemini SDK `@google/genai`).

---

## Installation & Quickstart

Want to question your reality too? Here is how to run it locally:

1. Clone this repo.
2. Install the packages (the engine room):

```bash
npm install
```

3. Create a .env file in the root directory and drop your Gemini API key in there:

```bash
GEMINI_API_KEY="your_secret_api_key"
```

4. Fire up the server:

```bash
node server.js
```

5. Open [http://localhost:3000](http://localhost:3000) or use your local IP to run it on your phone via the same Wi-Fi.

