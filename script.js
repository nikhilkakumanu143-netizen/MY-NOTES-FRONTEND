const API_URL = "https://my-notes-backend-qlt8.onrender.com/api/notes";


// Fetch Notes
async function getNotes() {
  const res = await fetch(API_URL);
  const notes = await res.json();

  const list = document.getElementById("notesList");
  const emptyState = document.getElementById("emptyState");
  const notesCount = document.getElementById("notesCount");
  list.innerHTML = "";
  notesCount.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
  emptyState.classList.toggle("is-visible", notes.length === 0);

  notes.forEach(note => {
    const li = document.createElement("li");
    const text = document.createElement("span");
    const actions = document.createElement("div");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    li.className = "note-item";
    text.className = "note-text";
    text.textContent = note.text || "";
    actions.className = "note-actions";

    deleteButton.textContent = "Delete";
    deleteButton.className = "action-button delete-button";
    deleteButton.onclick = () => deleteNote(note._id);

    editButton.textContent = "Edit";
    editButton.className = "action-button";
    editButton.onclick = () => editNote(note._id, note.text || "");

    actions.append(editButton, deleteButton);
    li.append(text, actions);
    list.appendChild(li);
  });
}

// Add Note
async function addNote() {
  const input = document.getElementById("noteInput");
  const text = input.value.trim();

  if (!text) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  input.value = "";
  getNotes();
}

// Delete Note
async function deleteNote(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  getNotes();
}

// Edit Note
async function editNote(id, oldText) {
  const text = prompt("Edit note:", oldText);
  if (!text) return;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text.trim() })
  });

  getNotes();
}

// Load notes on start
getNotes();

document.getElementById("noteInput").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    addNote();
  }
});
