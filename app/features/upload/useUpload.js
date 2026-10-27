"use client";

import { useEffect, useState } from "react";
import { fetchFiles, uploadPdf } from "../../lib/api";

// Upload se juda saara data aur kaam yahan hai — kaunsi files hain,
// status kya hai, aur nayi PDF bhejne pe kya karna hai.

export default function useUpload() {
  const [files, setFiles] = useState([]); // uploads folder ki PDFs
  const [status, setStatus] = useState(""); // chhota sa progress message

  // page khulte hi list le aao
  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    setFiles(await fetchFiles());
  }

  async function upload(file) {
    if (!file) return;

    setStatus(`Uploading ${file.name}…`);
    const data = await uploadPdf(file);

    setStatus(data ? `${data.totalChunks} chunks indexed` : "Upload failed");
    loadFiles(); // nayi file chip me dikhe
  }

  return { files, status, upload };
}
