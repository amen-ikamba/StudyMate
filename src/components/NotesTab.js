import React, { useState } from 'react';

const NotesTab = ({ notes, setNotes }) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle note submission (create or update)
  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (noteTitle && noteContent) {
      if (editingNoteIndex !== null) {
        // Update existing note
        const updatedNotes = [...notes];
        updatedNotes[editingNoteIndex] = {
          ...updatedNotes[editingNoteIndex],
          title: noteTitle,
          content: noteContent,
          lastEdited: new Date()
        };
        setNotes(updatedNotes);
        setEditingNoteIndex(null);
      } else {
        // Create new note
        const newNote = {
          title: noteTitle,
          content: noteContent,
          createdAt: new Date(),
          lastEdited: new Date(),
          collaborators: ['You'] // In a real app, this would include actual user IDs
        };
        setNotes([...notes, newNote]);
      }
      setNoteTitle('');
      setNoteContent('');
      setShowForm(false);
    }
  };

  // Edit note
  const editNote = (index) => {
    setNoteTitle(notes[index].title);
    setNoteContent(notes[index].content);
    setEditingNoteIndex(index);
    setShowForm(true);
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Delete note
  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="notes-tab">
      <div className="tab-header">
        <h2>Collaborative Notes</h2>
        <button 
          className="toggle-form-btn"
          onClick={() => {
            setShowForm(!showForm);
            if (showForm && editingNoteIndex !== null) {
              // If closing form while editing, reset the form
              setEditingNoteIndex(null);
              setNoteTitle('');
              setNoteContent('');
            }
          }}
        >
          {showForm ? 'Hide Form' : 'Create New Note'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingNoteIndex !== null ? 'Edit Note' : 'Create New Note'}</h3>
          <form onSubmit={handleNoteSubmit}>
            <input
              type="text"
              placeholder="Note Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Note Content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              required
              rows="8"
            />
            <div className="form-buttons">
              <button type="submit">
                {editingNoteIndex !== null ? 'Update Note' : 'Create Note'}
              </button>
              {editingNoteIndex !== null && (
                <button 
                  type="button" 
                  className="secondary"
                  onClick={() => {
                    setEditingNoteIndex(null);
                    setNoteTitle('');
                    setNoteContent('');
                  }}
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="empty-state">
          <p>No notes available. Create one to get started!</p>
        </div>
      ) : (
        <ul className="notes-list">
          {filteredNotes.map((note, index) => {
            const originalIndex = notes.indexOf(note);
            return (
              <li key={originalIndex} className="note-item">
                <div className="note-header">
                  <strong>{note.title}</strong>
                  <div className="note-actions">
                    <button className="edit-btn" onClick={() => editNote(originalIndex)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteNote(originalIndex)}>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="note-content">{note.content}</div>
                <div className="note-footer">
                  <em>Last edited: {new Date(note.lastEdited).toLocaleString()}</em>
                  <div className="collaborators">
                    <small>Collaborators: {note.collaborators.join(', ')}</small>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NotesTab;