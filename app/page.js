"use client";

import Composer from "./features/chat/Composer";
import MessageList from "./features/chat/MessageList";
import useChat from "./features/chat/useChat";
import FileChips from "./features/upload/FileChips";
import UploadButton from "./features/upload/UploadButton";
import useUpload from "./features/upload/useUpload";

export default function Home() {
  const { files, status, upload } = useUpload();
  const { messages, busy, send } = useChat();

  return (
    <div className="page">
      <header className="top">
        <span className="logo">Sift</span>
        <UploadButton onPick={upload} />
      </header>

      <FileChips files={files} status={status} />
      <MessageList messages={messages} busy={busy} />
      <Composer onSend={send} busy={busy} />
    </div>
  );
}
