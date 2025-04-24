import React, { useState } from 'react';

const ResourcesTab = ({ resources, setResources, uniqueSubjects }) => {
  // State for resource form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // State for comments
  const [commentInputs, setCommentInputs] = useState({});
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Filter resources based on search term and subject
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === '' || resource.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  // Handle form submission for uploading resources
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description && subject) {
      const newResource = {
        title,
        description,
        subject,
        fileURL,
        comments: [],
        studyProgress: 0,
        createdAt: new Date(),
      };
      setResources([...resources, newResource]);
      setTitle('');
      setDescription('');
      setSubject('');
      setFileURL('');
      setUploadedFile(null);
      setShowUploadForm(false);
    }
  };

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      
      // For a real implementation, you'd upload the file to a server
      // and get back a URL. For this demo, we'll create a fake URL.
      setFileURL(`file-${Date.now()}-${file.name}`);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      // Same as above, for a real implementation you'd upload the file
      setFileURL(`file-${Date.now()}-${file.name}`);
    }
  };

  // Handle comment input changes
  const handleCommentInput = (index, value) => {
    setCommentInputs({
      ...commentInputs,
      [index]: value
    });
  };

  // Add a comment to a resource
  const addComment = (index) => {
    if (commentInputs[index] && commentInputs[index].trim() !== '') {
      const updatedResources = [...resources];
      updatedResources[index].comments.push(commentInputs[index]);
      setResources(updatedResources);
      // Clear just this resource's comment
      setCommentInputs({
        ...commentInputs,
        [index]: ''
      });
    }
  };

  // Update study progress for a resource
  const updateProgress = (index, progress) => {
    const updatedResources = [...resources];
    updatedResources[index].studyProgress = progress;
    setResources(updatedResources);
  };

  return (
    <div className="resources-tab">
      <div className="tab-header">
        <h2>Study Resources</h2>
        <button 
          className="toggle-form-btn"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Hide Upload Form' : 'Upload New Resource'}
        </button>
      </div>

      {showUploadForm && (
        <div className="upload-form-container">
          <h3>Upload Study Resource</h3>
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
            
            <div 
              className={`drag-drop-zone ${isDragging ? 'active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p>Drag and drop your file here, or click to select</p>
              <input
                type="file"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                id="file-input"
              />
              <button 
                type="button" 
                onClick={() => document.getElementById('file-input').click()}
              >
                Select File
              </button>
              
              {uploadedFile && (
                <div className="file-info">
                  <p>Selected file: {uploadedFile.name}</p>
                  <small>{(uploadedFile.size / 1024).toFixed(2)} KB</small>
                </div>
              )}
            </div>
            
            <button type="submit">Upload Resource</button>
          </form>
        </div>
      )}

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterSubject} 
          onChange={(e) => setFilterSubject(e.target.value)}
          className="filter-select"
        >
          <option value="">All Subjects</option>
          {uniqueSubjects.map((subject, index) => (
            <option key={index} value={subject}>{subject}</option>
          ))}
        </select>
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="empty-state">
          <p>No resources available. Upload one to get started!</p>
        </div>
      ) : (
        <ul className="resources-list">
          {filteredResources.map((resource, index) => (
            <li key={index}>
              <strong>{resource.title}</strong>
              <p>{resource.description}</p>
              <em>{resource.subject}</em>
              {resource.fileURL && (
                <a href={resource.fileURL} target="_blank" rel="noopener noreferrer">
                  Download Resource
                </a>
              )}

              <div className="progress-container">
                <p>Study Progress: {resource.studyProgress}%</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={resource.studyProgress}
                  onChange={(e) => updateProgress(index, e.target.value)}
                />
              </div>

              <div className="comment-section">
                <h4>Add Comment</h4>
                <textarea
                  value={commentInputs[index] || ''}
                  onChange={(e) => handleCommentInput(index, e.target.value)}
                  placeholder="Add a comment"
                ></textarea>
                <button 
                  className="secondary"
                  onClick={() => addComment(index)}
                >
                  Post Comment
                </button>
              </div>

              {resource.comments.length > 0 && (
                <div className="comments-list">
                  <h4>Comments ({resource.comments.length})</h4>
                  {resource.comments.map((comment, i) => (
                    <div key={i} className="comment">
                      <p>{comment}</p>
                      <small>Posted on {new Date().toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResourcesTab;