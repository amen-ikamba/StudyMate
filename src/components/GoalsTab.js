import React, { useState } from 'react';

const GoalsTab = ({ goals, setGoals }) => {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Handle goal submission
  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (goalTitle && goalDeadline) {
      const newGoal = {
        title: goalTitle,
        description: goalDescription,
        deadline: goalDeadline,
        completed: false,
        createdAt: new Date(),
      };
      setGoals([...goals, newGoal]);
      setGoalTitle('');
      setGoalDescription('');
      setGoalDeadline('');
      setShowForm(false);
    }
  };

  // Toggle goal completion
  const toggleGoalCompletion = (index) => {
    const updatedGoals = [...goals];
    updatedGoals[index].completed = !updatedGoals[index].completed;
    setGoals(updatedGoals);
  };
  
  // Delete goal
  const deleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };

  // Filter for active and completed goals
  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div className="goals-tab">
      <div className="tab-header">
        <h2>Study Goals</h2>
        <button 
          className="toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide Form' : 'Set New Goal'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>Set a New Study Goal</h3>
          <form onSubmit={handleGoalSubmit}>
            <input
              type="text"
              placeholder="Goal Title"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Goal Description (optional)"
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
            />
            <input
              type="date"
              placeholder="Deadline"
              value={goalDeadline}
              onChange={(e) => setGoalDeadline(e.target.value)}
              required
            />
            <button type="submit">Add Goal</button>
          </form>
        </div>
      )}

      <div className="goals-container">
        <div className="active-goals">
          <h3>Active Goals ({activeGoals.length})</h3>
          {activeGoals.length === 0 ? (
            <div className="empty-state">
              <p>No active goals. Set one to get started!</p>
            </div>
          ) : (
            <ul className="goals-list">
              {activeGoals.map((goal, index) => {
                const originalIndex = goals.indexOf(goal);
                const today = new Date();
                const deadline = new Date(goal.deadline);
                const isOverdue = deadline < today && !goal.completed;
                
                return (
                  <li key={originalIndex} className={isOverdue ? 'overdue-goal' : ''}>
                    <div className="goal-header">
                      <strong>{goal.title}</strong>
                      <div className="goal-actions">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => toggleGoalCompletion(originalIndex)}
                        />
                        <button 
                          className="delete-btn" 
                          onClick={() => deleteGoal(originalIndex)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {goal.description && <p>{goal.description}</p>}
                    <div className="goal-footer">
                      <em>Deadline: {new Date(goal.deadline).toLocaleDateString()}</em>
                      {isOverdue && <span className="overdue-badge">Overdue</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {completedGoals.length > 0 && (
          <div className="completed-goals">
            <h3>Completed Goals ({completedGoals.length})</h3>
            <ul className="goals-list">
              {completedGoals.map((goal, index) => {
                const originalIndex = goals.indexOf(goal);
                return (
                  <li key={originalIndex} className="completed-goal">
                    <div className="goal-header">
                      <strong>{goal.title}</strong>
                      <div className="goal-actions">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => toggleGoalCompletion(originalIndex)}
                        />
                        <button 
                          className="delete-btn" 
                          onClick={() => deleteGoal(originalIndex)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {goal.description && <p>{goal.description}</p>}
                    <em>Completed on {new Date().toLocaleDateString()}</em>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsTab;