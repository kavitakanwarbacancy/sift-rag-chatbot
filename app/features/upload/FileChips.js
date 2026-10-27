export default function FileChips({ files, status }) {
  if (files.length === 0 && !status) return null;

  return (
    <div className="files">
      {files.map((name) => (
        <span className="chip" key={name}>
          {name.replace(/^\d+-/, "")} {/* remove timestamp prefix of file */}
        </span>
      ))}

      {status && <span className="status">{status}</span>}
    </div>
  );
}
