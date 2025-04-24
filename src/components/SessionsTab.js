import React, { useState, useEffect } from 'react';

const SessionsTab = ({ sessions, setSessions, uniqueSubjects }) => {
  const [isStudying, setIsStudying] = useState(false);
  const [sessionSubject, setSessionSubject] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [otherSubject, setOtherSubject] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  // Start study session
  const startStudySession = () => {
    let subjectToUse = sessionSubject;
    
    if (sessionSubject === 'other' && otherSubject.trim()) {
      subjectToUse = otherSubject.trim();
    }
    
    if (subjectToUse && subjectToUse !== 'other') {
      setIsStudying(true);
      const startTime = new Date();
      setSessionStartTime(startTime);
      setElapsedTime(0);
      
      // Start timer to update elapsed time every second
      const interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
      
      setTimerInterval(interval);
    }
  };

  // End study session
  const endStudySession = () => {
    if (isStudying) {
      setIsStudying(false);
      clearInterval(timerInterval);
      
      const endTime = new Date();
      const duration = Math.floor((endTime - sessionStartTime) / 1000); // in seconds
      
      let subjectToUse = sessionSubject;
      if (sessionSubject === 'other') {
        subjectToUse = otherSubject;
      }
      
      const newSession = {
        subject: subjectToUse,
        startTime: sessionStartTime,
        endTime: endTime,
        duration: duration,
      };
      
      setSessions([...sessions, newSession]);
      setSessionSubject('');
      setOtherSubject('');
    }
  };

  // Format time for display (convert seconds to HH:MM:SS)
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  // Calculate total study time
  const getTotalStudyTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  // Filter sessions based on subject
  const filteredSessions = filterSubject 
    ? sessions.filter(session => session.subject === filterSubject)
    : sessions;

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Group sessions by date for better display
  const groupSessionsByDate = () => {
    const groupedSessions = {};
    
    filteredSessions.forEach(session => {
      const date = new Date(session.startTime).toLocaleDateString();
      if (!groupedSessions[date]) {
        groupedSessions[date] = [];
      }
      groupedSessions[date].push(session);
    });
    
    return groupedSessions;
  };

  const groupedSessions = groupSessionsByDate();
  const dates = Object.keys(groupedSessions).sort((a, b) => new Date(b) - new Date(a)); // Sort by newest first

  return (
    <div className="sessions-tab">
      <div className="tab-header">
        <h2>Study Sessions</h2>
      </div>
      
      <div className="session-container">
        {isStudying ? (
          <div className="active-session">
            <h3>Current Study Session</h3>
            <p className="session-subject">Studying: {sessionSubject === 'other' ? otherSubject : sessionSubject}</p>
            <div className="timer">{formatTime(elapsedTime)}</div>
            <button className="end-btn" onClick={endStudySession}>End Session</button>
          </div>
        ) : (
          <div className="start-session">
            <h3>Start a Study Session</h3>
            <select
              value={sessionSubject}
              onChange={(e) => setSessionSubject(e.target.value)}
              required
            >
              <option value="">Select Subject</option>
              {uniqueSubjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
              <option value="other">Other</option>
            </select>
            
            {sessionSubject === 'other' && (
              <input
                type="text"
                placeholder="Enter subject name"
                value={otherSubject}
                onChange={(e) => setOtherSubject(e.target.value)}
                required
              />
            )}
            
            <button 
              className="start-btn"
              onClick={startStudySession}
              disabled={!sessionSubject || (sessionSubject === 'other' && !otherSubject.trim())}
            >
              Start Studying
            </button>
          </div>
        )}
        
        <div className="session-history">
          <h3>Session History</h3>
          
          <div className="filter-container">
            <select 
              value={filterSubject} 
              onChange={(e) => setFilterSubject(e.target.value)}
              className="filter-select"
            >
              <option value="">All Subjects</option>
              {[...new Set(sessions.map(session => session.subject))].map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          {sessions.length === 0 ? (
            <div className="empty-state">
              <p>No study sessions recorded yet. Start one to track your progress!</p>
            </div>
          ) : (
            <>
              <div className="session-stats">
                <div className="stat">
                  <strong>Total Sessions</strong>
                  <span>{filteredSessions.length}</span>
                </div>
                <div className="stat">
                  <strong>Total Time</strong>
                  <span>{formatTime(filteredSessions.reduce((total, session) => total + session.duration, 0))}</span>
                </div>
              </div>
              
              {dates.length === 0 ? (
                <div className="empty-state">
                  <p>No sessions match your filter criteria.</p>
                </div>
              ) : (
                dates.map(date => (
                  <div key={date} className="session-day">
                    <h4>{date}</h4>
                    <ul className="sessions-list">
                      {groupedSessions[date].map((session, index) => (
                        <li key={index} className="session-item">
                          <div className="session-info">
                            <strong>{session.subject}</strong>
                            <span className="duration">{formatTime(session.duration)}</span>
                          </div>
                          <div className="session-time">
                            <span>{new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsTab;