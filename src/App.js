import React, { useState, useEffect } from 'react';
import './App.css';

// Tab Components
import ResourcesTab from './components/ResourcesTab.js';
import GoalsTab from './components/GoalsTab';
import NotesTab from './components/NotesTab';
import SessionsTab from './components/SessionsTab';

const App = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [resources, setResources] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);

  // Load data from local storage
  useEffect(() => {
    const storedResources = JSON.parse(localStorage.getItem('resources')) || [];
    const storedGoals = JSON.parse(localStorage.getItem('studyGoals')) || [];
    const storedNotes = JSON.parse(localStorage.getItem('collaborativeNotes')) || [];
    const storedSessions = JSON.parse(localStorage.getItem('studySessions')) || [];
    
    setResources(storedResources);
    setGoals(storedGoals);
    setNotes(storedNotes);
    setSessions(storedSessions);
  }, []);

  // Save data to local storage
  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
    localStorage.setItem('studyGoals', JSON.stringify(goals));
    localStorage.setItem('collaborativeNotes', JSON.stringify(notes));
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [resources, goals, notes, sessions]);

  // Extract unique subjects for filtering
  useEffect(() => {
    const subjects = [...new Set(resources.map(resource => resource.subject))];
    setUniqueSubjects(subjects);
  }, [resources]);

  return (
    <div className="App">
      <header>
        <h1>StudyMate</h1>
        <p>Your study companion for sharing resources and learning together!</p>
      </header>

      <nav className="tab-navigation">
        <button 
          className={activeTab === 'resources' ? 'active' : ''}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </button>
        <button 
          className={activeTab === 'goals' ? 'active' : ''}
          onClick={() => setActiveTab('goals')}
        >
          Study Goals
        </button>
        <button 
          className={activeTab === 'notes' ? 'active' : ''}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button 
          className={activeTab === 'sessions' ? 'active' : ''}
          onClick={() => setActiveTab('sessions')}
        >
          Study Sessions
        </button>
      </nav>

      <div className="tab-content">
        {activeTab === 'resources' && (
          <ResourcesTab 
            resources={resources} 
            setResources={setResources}
            uniqueSubjects={uniqueSubjects}
          />
        )}
        
        {activeTab === 'goals' && (
          <GoalsTab 
            goals={goals}
            setGoals={setGoals}
          />
        )}
        
        {activeTab === 'notes' && (
          <NotesTab 
            notes={notes}
            setNotes={setNotes} 
          />
        )}
        
        {activeTab === 'sessions' && (
          <SessionsTab 
            sessions={sessions}
            setSessions={setSessions}
            uniqueSubjects={uniqueSubjects}
          />
        )}
      </div>
    </div>
  );
};

export default App;