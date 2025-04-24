import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [fileURL, setFileURL] = useState('');

  // Load resources from local storage when the component mounts
  useEffect(() => {
    const storedResources = JSON.parse(localStorage.getItem('resources')) || [];
    setResources(storedResources);
  }, []);

  // Save resources to local storage whenever the resources state changes
  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description && subject) {
      const newResource = { title, description, subject, fileURL };
      setResources([...resources, newResource]);
      setTitle('');
      setDescription('');
      setSubject('');
      setFileURL('');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>StudyMate</h1>
        <p>Share and discover helpful study resources!</p>
      </header>

      <section>
        <h2>Upload Study Resource</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Resource Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Resource Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="File URL (optional)"
            value={fileURL}
            onChange={(e) => setFileURL(e.target.value)}
          />
          <button type="submit">Upload Resource</button>
        </form>
      </section>

      <section>
        <h2>Available Resources</h2>
        {resources.length === 0 ? (
          <div className="empty-state">
            <p>No resources available. Upload one to get started!</p>
          </div>
        ) : (
          <ul>
            {resources.map((resource, index) => (
              <li key={index}>
                <strong>{resource.title}</strong>
                <p>{resource.description}</p>
                <em>{resource.subject}</em>
                {resource.fileURL && (
                  <a href={resource.fileURL} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default App;
