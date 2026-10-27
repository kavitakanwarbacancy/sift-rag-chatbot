"use client";

import { useState } from "react";
import { askQuestion } from "../../lib/api";

export default function useChat() {
  const [messages, setMessages] = useState([]); // { role: "me" | "bot", text, sources }
  const [busy, setBusy] = useState(false); //waiting for response

  const add = (message) => setMessages((old) => [...old, message]);

  async function send(question) {
    add({ role: "me", text: question });
    setBusy(true);

    const history = messages?.slice(-6).map(({ role, text }) => ({ role, text }));
    const data = await askQuestion(question, history);

    add(
      data
        ? { role: "bot", text: data.answer, sources: data.sources }
        : { role: "bot", text: "Something went wrong." },
    );
    setBusy(false);
  }

  return { messages, busy, send };
}
