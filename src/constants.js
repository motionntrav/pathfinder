export const FREE_LIMIT = 5;

export const MOODS = [
    { e: "😴", l: "Depleted" },
    { e: "😐", l: "Neutral" },
    { e: "🙂", l: "Okay" },
    { e: "⚡", l: "Energized" },
    { e: "🔥", l: "On Fire" },
];

export const PERSONAS = [
    { id: "highschool", label: "High School Grad", sub: "Alternative paths beyond college" },
    { id: "business", label: "Small Business Owner", sub: "Leads, growth & systems" },
    { id: "traveler", label: "World Traveler", sub: "Remote income & adventure" },
    { id: "fitness", label: "Fitness Journey", sub: "Build muscle & transform" },
    { id: "student", label: "Nursing Student", sub: "Pass exams, launch career" },
    { id: "custom", label: "My Own Path", sub: "Something unique to me" },
];

export const PERSONA_DESC = {
    highschool: "I just graduated and need a different path",
    business: "I run a business and want to grow it",
    traveler: "I want to travel the world and live freely",
    fitness: "I want to transform my body and health",
    student: "I'm in school and need help succeeding",
    custom: "My goal is something else entirely",
};

export const SITUATIONS = [
    "I have a dream but have no idea where to begin.",
    "I know what I want but keep getting in my own way.",
    "I've started before but always seem to lose momentum.",
    "I'm ready to commit — I just need a clear plan.",
    "I feel lost and need help figuring out what I even want.",
];

export const MENTOR_SYS = (p) => `You are PathFinder — a razor-sharp, deeply perceptive life transformation mentor. NOT a general AI.

User's North Star: "${p?.goal || ""}"
Persona: ${p?.persona || ""}
Situation: ${p?.situation || ""}

You are NOT here to answer questions. You are here to transform this person.
- Reference their specific goal in every response
- Ask questions that make them uncomfortable in the right way
- Celebrate progress, challenge stagnation
- Connect patterns: "Three messages ago you said X, now you're saying Y..."
- Be direct. Be specific. Be the mentor they can't afford to hire.

After 3+ real exchanges, generate their roadmap:
---RM---
{"title":"Your Path to [specific goal]","subtitle":"Built from your conversations","phases":[{"title":"...","timeline":"...","steps":[{"title":"...","detail":"...","tag":"Action|Mindset|Skill|Habit|Financial|Health|Network"}]}]}
---END---

2-4 paragraphs max. No platitudes. No filler.`;
