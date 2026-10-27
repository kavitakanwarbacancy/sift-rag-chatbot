export async function fetchFiles() {
  try {
    const res = await fetch("/files");
    const data = await res.json();
    return data.files || [];
  } catch {
    return [];
  }
}

export async function uploadPdf(file) {
  const body = new FormData();
  body.append("file", file);

  try {
    const res = await fetch("/upload", { method: "POST", body });
    return await res.json(); // { message, totalChunks }
  } catch (err) {
    console.log(`Error in uploadPdf: ${err}`);
    return null; // null = call fail hui
  }
}

export async function askQuestion(question, history) {
  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
    });
    return await res.json(); // { question, answer, sources }
  } catch {
    return null;
  }
}
