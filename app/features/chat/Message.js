import { marked } from "marked";

export default function Message({ message }) {
  const isMine = message.role === "me";

  return (
    <div className={`msg ${isMine ? "me" : ""}`}>
      {isMine ? (
        <div className="bubble">{message.text}</div>
      ) : (
        // bot gives answers in markdown, convert into HTML
        <div
          className="bubble"
          dangerouslySetInnerHTML={{ __html: marked.parse(message.text || "") }}
        />
      )}

      {message.sources?.length > 0 && (
        <details className="src">
          <summary>{message.sources.length} source chunks</summary>
          {message.sources.map((chunk, i) => (
            <p key={i}>{chunk.slice(0, 300)}…</p>
          ))}
        </details>
      )}
    </div>
  );
}
