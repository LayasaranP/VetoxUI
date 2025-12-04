const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function fetchVetoxData(endpoint, method, data) {
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined.");

  const url = `${apiUrl}/${endpoint}`;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const message = await safeErrorMessage(res);
      throw new Error(`Request failed: ${message}`);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchUserChats(userId) {
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  const url = `${apiUrl}/chat/user/${userId}`; 
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch chat history");
    return res.json();
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
}

export async function fetchChatDetails(userId, blockIndex) {
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  const url = `${apiUrl}/chat/${userId}/block_index/${blockIndex}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch chat details");
    return res.json();
  } catch (error) {
    console.error("Error fetching chat details:", error);
    return null;
  }
}

async function safeErrorMessage(res) {
  try {
    const body = await res.json();
    return body?.message || "Failed to Login. Please check your credentials.";
  } catch {
    return res.statusText || "Unknown error";
  }
}
