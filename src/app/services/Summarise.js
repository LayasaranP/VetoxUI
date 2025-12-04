"use client";

export default async function summarise(messages) {

    let apiurl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiurl) {
        return null;
    }

    if (!messages || messages.length === 0) return null;

    const conversationText = "Please summarize the following conversation:\n\n" + messages.map(m => `${m.role}: ${m.content}`).join("\n");

    try {
        const res = await fetch(`${apiurl}/summarise`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: conversationText }),  
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();

    } catch (err) {
        return null;
    }
}
