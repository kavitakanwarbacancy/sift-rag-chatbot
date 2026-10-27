export default function UploadButton({ onPick }) {
  return (
    <label className="upload">
      <input
        type="file"
        accept=".pdf"
        hidden
        onChange={(e) => {
          onPick(e.target.files[0]);
          e.target.value = "";
        }}
      />
      + Upload PDF
    </label>
  );
}
