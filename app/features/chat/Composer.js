"use client";

import { useState } from "react";

export default function Composer({ onSend, busy }) {
  const [text, setText] = useState("");

  function send() {
    const question = text.trim();
    if (!question || busy) return;

    onSend(question);
    setText("");
  }

  function handleChange(e) {
    setText(e.target.value);

    // increase height of textarea with content
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  function handleKeyDown(e) {
    // Enter = send, Shift+Enter = new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="bar">
      <div className="box">
        <textarea
          rows={1}
          value={text}
          placeholder="Ask a question…"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button className="send" onClick={send} disabled={busy || !text.trim()}>
          ↑
        </button>
      </div>
    </div>
  );
}
