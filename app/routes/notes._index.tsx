import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p style={{ color: "#885544", fontWeight: "bold" }}>
      <em>No note selected. Select a note on the left, or </em>
      <Link to="new" className="text-blue-500 underline">
        create a new note.
      </Link>
    </p>
  );
}
