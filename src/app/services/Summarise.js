"use client";

export default async function summarise(messages) {
    console.log("summarise input: ", messages);

    let apiurl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiurl) {
        console.error("NEXT_PUBLIC_API_URL is not defined.");
        return null;
    }

    if (!messages || messages.length === 0) return null;

    // Convert messages to a string format suitable for summarization
    // Assuming messages is an array of { role, content }
    const conversationText = "Please summarize the following conversation:\n\n" + messages.map(m => `${m.role}: ${m.content}`).join("\n");

    try {
        const res = await fetch(`${apiurl}/summarise`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: conversationText }),  
        });

        if (!res.ok) {
            console.error("API error:", res.status);
            return null;
        }

        return await res.json();

    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}
