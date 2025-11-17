export default function ImportantNotesSection({
  importantNotes,
}: {
  importantNotes: string[];
}) {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
      <h3 className="text-md mb-2 font-semibold text-yellow-800 md:text-lg">
        Important Notes
      </h3>
      <ul className="space-y-1 text-sm text-yellow-700">
        {importantNotes.map((note, idx) => (
          <li key={idx}>• {note}</li>
        ))}
      </ul>
    </div>
  );
}
