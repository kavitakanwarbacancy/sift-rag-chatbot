"use client";

import { useEffect, useRef } from "react";
import Message from "./Message";

export default function MessageList({ messages, busy }) {
  const threadRef = useRef(null);

  // on new message arrival, scroll to bottom
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const empty = messages.length === 0 && !busy;

  return (
    <div className="thread" ref={threadRef}>
      {empty ? (
        <div className="hero">
          <h2>Ask your documents anything</h2>
          <p>Upload a PDF, then ask a question about it.</p>
        </div>
      ) : (
        <div className="inner">
          {messages.map((message, i) => (
            <Message key={i} message={message} />
          ))}

          {busy && <TypingDots />}
        </div>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="msg">
      <div className="bubble">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
