// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State declarations
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [completedSkills, setCompletedSkills] = useState(new Set());
  const [completedAssessments, setCompletedAssessments] = useState(new Set());
  const [timer, setTimer] = useState(null); // seconds left
  const [hasClickedLink, setHasClickedLink] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [userProgress, setUserProgress] = useState({
    totalSkills: 0,
    completed: 0,
    level: 1,
    experience: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allSkillCategories, setAllSkillCategories] = useState([]);
  const [userSelectedCategories, setUserSelectedCategories] = useState([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  

  
  // Quiz states
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);


  // Redirect if not logged in or verified
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.emailVerified) {
      navigate("/verify-email");
    }
  }, [user, navigate]);

  // Load skill categories from Firebase
  useEffect(() => {
    const loadSkillCategories = async () => {
      try {
        const categoriesRef = collection(db, "skillCategories");
        const snapshot = await getDocs(categoriesRef);
        const categories = [];
        
        snapshot.forEach((doc) => {
          categories.push({ id: doc.id, ...doc.data() });
        });
        
        setAllSkillCategories(categories);
      } catch (error) {
        console.error("Error loading skill categories:", error);
        setError("Failed to load skill categories");
      }
    };

    loadSkillCategories();
  }, []);

  // Load user progress and selected categories from Firestore
  useEffect(() => {
    if (!user?.emailVerified) return;

    const loadUserProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        
        if (snap.exists()) {
          const data = snap.data();
          setUserProgress({
            totalSkills: data.totalSkills || 0,
            completed: data.completed || 0,
            level: data.level || 1,
            experience: data.experience || 0,
            streak: data.streak || 0,
          });
          setCompletedSkills(new Set(data.completedSkills || []));
          setCompletedAssessments(new Set(data.completedAssessments || []));
          setUserSelectedCategories(data.selectedCategories || []);
        } else {
          // Initialize new user document
          const initialData = {
            level: 1,
            experience: 0,
            streak: 0,
            completed: 0,
            totalSkills: 0,
            completedSkills: [],
            completedAssessments: [],
            selectedCategories: [],
            createdAt: Date.now(),
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0]
          };
          
          await setDoc(userRef, initialData);
          setUserProgress({
            totalSkills: 0,
            completed: 0,
            level: 1,
            experience: 0,
            streak: 0,
          });
          setCompletedSkills(new Set());
          setCompletedAssessments(new Set());
          setUserSelectedCategories([]);
        }
      } catch (error) {
        console.error("Error loading user progress:", error);
        setError("Failed to load user progress. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, [user]);

  // Update total skills when categories change
  useEffect(() => {
    const totalSkills = userSelectedCategories.reduce((total, categoryId) => {
      const category = allSkillCategories.find(cat => cat.id === categoryId);
      return total + (category?.skills?.length || 0);
    }, 0);
    
    setUserProgress(prev => ({ ...prev, totalSkills }));
  }, [userSelectedCategories, allSkillCategories]);

  useEffect(() => {
  let interval;
  if (isTimerActive && timer > 0) {
    interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
  } else if (timer === 0) {
    setIsTimerActive(false);
  }
  return () => clearInterval(interval);
}, [isTimerActive, timer]);

  // Helper Functions
  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setHasClickedLink(false); // Reset when opening a new skill modal
    setTimer(0); // Reset timer
    setIsTimerActive(false);
  };

  const handleSkillComplete = async (skillId) => {
    if (!user?.emailVerified || completedSkills.has(skillId)) return;

    try {
      const updatedSkills = new Set([...completedSkills, skillId]);
      const completed = updatedSkills.size;
      
      // Calculate total XP from all selected categories
      const totalXP = Array.from(updatedSkills).reduce((sum, id) => {
        const skill = userSelectedCategories
          .map(catId => allSkillCategories.find(cat => cat.id === catId))
          .filter(Boolean)
          .flatMap(cat => cat.skills)
          .find(s => s.id === id);
        return sum + (skill?.xp || 0);
      }, 0);

      const newProgress = {
        completed,
        experience: totalXP,
        level: Math.floor(totalXP / 500) + 1,
        streak: Math.min(completed * 2, 30),
        completedSkills: Array.from(updatedSkills),
        updatedAt: Date.now()
      };

      // Update local state first for immediate UI response
      setCompletedSkills(updatedSkills);
      setUserProgress(prev => ({ ...prev, ...newProgress }));

      // Save to Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, newProgress);

      setSelectedSkill(null); // Close modal after completion
      
    } catch (error) {
      console.error("Error completing skill:", error);
      setError("Failed to save progress. Please try again.");
      
      // Revert local state on error
      setCompletedSkills(prev => {
        const reverted = new Set(prev);
        reverted.delete(skillId);
        return reverted;
      });
    }
  };

  const handleAssessmentComplete = async (assessmentId) => {
    if (!user?.emailVerified || completedAssessments.has(assessmentId)) return;

    try {
      const updatedAssessments = new Set([...completedAssessments, assessmentId]);
      
      // Find the assessment to get XP
      const assessment = userSelectedCategories
        .map(catId => allSkillCategories.find(cat => cat.id === catId))
        .filter(Boolean)
        .flatMap(cat => cat.assessments || [])
        .find(a => a.id === assessmentId);

      if (!assessment) return;

      const newProgress = {
        completedAssessments: Array.from(updatedAssessments),
        experience: userProgress.experience + assessment.xp,
        updatedAt: Date.now()
      };

      // Update local state
      setCompletedAssessments(updatedAssessments);
      setUserProgress(prev => ({ ...prev, experience: prev.experience + assessment.xp }));

      // Save to Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, newProgress);

    } catch (error) {
      console.error("Error completing assessment:", error);
      setError("Failed to save assessment progress.");
    }
  };

  const handleCategoryToggle = async (categoryId) => {
    try {
      let updatedCategories;
      if (userSelectedCategories.includes(categoryId)) {
        updatedCategories = userSelectedCategories.filter(id => id !== categoryId);
      } else {
        updatedCategories = [...userSelectedCategories, categoryId];
      }

      setUserSelectedCategories(updatedCategories);

      // Update total skills count
      const totalSkills = updatedCategories.reduce((total, catId) => {
        const category = allSkillCategories.find(cat => cat.id === catId);
        return total + (category?.skills?.length || 0);
      }, 0);

      // Save to Firebase
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        selectedCategories: updatedCategories,
        totalSkills,
        updatedAt: Date.now()
      });

    } catch (error) {
      console.error("Error updating categories:", error);
      setError("Failed to update categories. Please try again.");
    }
  };

  // Check if assessment prerequisites are met
  const arePrerequisitesMet = (prerequisites) => {
    return prerequisites.every(prereq => {
      if (typeof prereq === 'string') {
        // It's an assessment prerequisite
        return completedAssessments.has(prereq);
      } else {
        // It's a skill prerequisite
        return completedSkills.has(prereq);
      }
    });
  };

  // Quiz handlers
  const startQuiz = (assessment) => {
    setActiveQuiz(assessment);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    let score = 0;
    activeQuiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    
    const percentage = (score / activeQuiz.questions.length) * 100;
    setQuizScore(percentage);
    setQuizCompleted(true);
    
    // If passed (70% or higher), mark assessment as completed
    if (percentage >= 70) {
      handleAssessmentComplete(activeQuiz.id);
    }
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setSelectedAssessment(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#4caf50";
      case "Intermediate":
        return "#ff9800";
      case "Advanced":
        return "#f44336";
      default:
        return "#64ffda";
    }
  };

  const getProgressPercentage = () => {
    if (userProgress.totalSkills === 0) return 0;
    return (userProgress.completed / userProgress.totalSkills) * 100;
  };

  // Get user's selected categories data
 const getDifficultyOrder = (difficulty) => {
  const order = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3
  };
  return order[difficulty] || 999; // Unknown difficulties go last
};

const isSkillUnlocked = (skill, categorySkills, completedSkills) => {
  const skillDifficulty = getDifficultyOrder(skill.difficulty);
  
  // Beginner skills are always unlocked
  if (skillDifficulty === 1) {
    return true;
  }
  
  // For Intermediate skills, check if all Beginner skills are completed
  if (skillDifficulty === 2) {
    const beginnerSkills = categorySkills.filter(s => getDifficultyOrder(s.difficulty) === 1);
    return beginnerSkills.every(s => completedSkills.has(s.id));
  }
  
  // For Advanced skills, check if all Beginner AND Intermediate skills are completed
  if (skillDifficulty === 3) {
    const beginnerSkills = categorySkills.filter(s => getDifficultyOrder(s.difficulty) === 1);
    const intermediateSkills = categorySkills.filter(s => getDifficultyOrder(s.difficulty) === 2);
    
    const allBeginnerCompleted = beginnerSkills.every(s => completedSkills.has(s.id));
    const allIntermediateCompleted = intermediateSkills.every(s => completedSkills.has(s.id));
    
    return allBeginnerCompleted && allIntermediateCompleted;
  }
  return false;
};

const getUserCategories = () => {
  return userSelectedCategories
    .map(catId => allSkillCategories.find(cat => cat.id === catId))
    .filter(Boolean)
    .map(category => ({
      ...category,
      // Sort skills by difficulty
      skills: [...category.skills].sort((a, b) => 
        getDifficultyOrder(a.difficulty) - getDifficultyOrder(b.difficulty)
      ),
      // Sort assessments by difficulty if they exist
      assessments: category.assessments ? [...category.assessments].sort((a, b) => 
        getDifficultyOrder(a.difficulty) - getDifficultyOrder(b.difficulty)
      ) : []
    }));
};

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Don't render if user not verified
  if (!user || !user.emailVerified) {
    return <p>Checking verification...</p>;
  }

  return (
    <div className="dashboard-container">
      {/* Error message */}
      {error && (
        <div style={{
          background: '#f44336',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: '1rem', background: 'transparent', border: '1px solid white', color: 'white', padding: '0.5rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Background orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Navigation Header */}
      <nav className="dashboard-navbar">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <span className="logo-text">SkillTree</span>
        </div>
        <div className="nav-center">
          <span className="welcome-text">
            Welcome back, {user.displayName || user.email.split('@')[0]}!
          </span>
        </div>
        <div className="nav-actions">
          <div className="user-level">Level {userProgress.level}</div>
          <button className="logout-btn" onClick={() => logout()}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Progress Overview Section */}
        <section className="progress-overview">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="section-title">Your Progress</h2>
            <button 
              className="add-category-btn"
              onClick={() => setShowCategorySelector(true)}
            >
              + Add Skill Categories
            </button>
          </div>

          <div className="progress-cards">
            {/* Overall Progress Card */}
            <div className="progress-card main-progress">
              <div className="progress-header">
                <h3>Overall Progress</h3>
                <span className="progress-percentage">{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${getProgressPercentage()}%` }}></div>
              </div>
              <p className="progress-text">
                {userProgress.completed} of {userProgress.totalSkills} skills completed
              </p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <h4>Level {userProgress.level}</h4>
                  <p>Current Level</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h4>{userProgress.experience} XP</h4>
                  <p>Total Experience</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <h4>{userProgress.streak} days</h4>
                  <p>Learning Streak</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skill Categories Section */}
        <section className="skills-section">
          <h2 className="section-title">Your Skill Categories</h2>
          
          {userSelectedCategories.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              marginTop: '2rem'
            }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                No skill categories selected yet.
              </p>
              <button 
                onClick={() => setShowCategorySelector(true)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}
              >
                Choose Your First Category
              </button>
            </div>
          ) : (
            <div className="categories-grid">
              {getUserCategories().map(category => (
                <div
                  key={category.id}
                  className="category-card"
                  style={{ '--category-gradient': category.color }}
                >
                  <div className="category-header">
                    <h3 className="category-title">{category.title}</h3>
                    <span className="category-progress">
                      {category.skills.filter(skill => completedSkills.has(skill.id)).length}/{category.skills.length}
                    </span>
                  </div>
                  <div className="skills-grid">
              {category.skills.map(skill => {
              // Determine if the skill is unlocked using the existing helper function
                const unlocked = isSkillUnlocked(skill, category.skills, completedSkills);
                const completed = completedSkills.has(skill.id);
                  return (
            <div
              key={skill.id}
              // Conditionally apply 'locked' class and only allow clicks if unlocked
              className={`skill-item ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => unlocked ? handleSkillClick(skill) : null}
            >
          <div className="skill-header">
            <h4 className="skill-name">{skill.name}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Show a lock icon if the skill is not unlocked */}
                {!unlocked && !completed && <span className="skill-lock-icon">🔒</span>}
                <span
                  className="skill-difficulty"
                  style={{ color: getDifficultyColor(skill.difficulty) }}
                >
                  {skill.difficulty}
                </span>
              </div>
            </div>
              <p className="skill-description">{skill.description}</p>
            <div className="skill-footer">
              <span className="skill-xp">{skill.xp} XP</span>
                {completed && (
              <span className="skill-completed-badge">✅</span>
            )}
               </div>
            </div>
             );
              })}
              </div>

                  {/* Add Assessments Section */}
                  {category.assessments && category.assessments.length > 0 && (
                    <div className="assessments-section">
                      <h4 className="assessments-title">Assessments</h4>
                      <div className="assessments-grid">
                        {category.assessments.map(assessment => {
                          const isUnlocked = arePrerequisitesMet(assessment.prerequisites);
                          const isCompleted = completedAssessments.has(assessment.id);
                          
                          return (
                            <div
                              key={assessment.id}
                              className={`assessment-item ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                              onClick={() => isUnlocked && !isCompleted ? startQuiz(assessment) : null}
                            >
                              <div className="assessment-header">
                                <h5 className="assessment-name">{assessment.name}</h5>
                                <div className="assessment-status">
                                  {!isUnlocked && <span className="lock-icon">🔒</span>}
                                  {isCompleted && <span className="completed-badge">✅</span>}
                                  {isUnlocked && !isCompleted && <span className="available-badge">📝</span>}
                                </div>
                              </div>
                              <p className="assessment-description">{assessment.description}</p>
                              <div className="assessment-footer">
                                <span className="assessment-xp">{assessment.xp} XP</span>
                                <span 
                                  className="assessment-difficulty"
                                  style={{ color: getDifficultyColor(assessment.difficulty) }}
                                >
                                  {assessment.difficulty}
                                </span>
                              </div>
                              {!isUnlocked && (
                                <div className="prerequisites-info">
                                  <small>Complete required skills first</small>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Category Selector Modal */}
      {showCategorySelector && (
        <div className="modal-overlay" onClick={() => setShowCategorySelector(false)}>
          <div className="category-selector-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose Skill Categories</h3>
              <button
                className="modal-close"
                onClick={() => setShowCategorySelector(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <p style={{ marginBottom: '1.5rem', color: '#cbd5e1' }}>
                Select the skill categories you want to focus on:
              </p>
              <div className="category-options">
                {allSkillCategories.map(category => (
                  <div
                    key={category.id}
                    className={`category-option ${userSelectedCategories.includes(category.id) ? 'selected' : ''}`}
                    data-category={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <div className="category-option-header">
                      <h4>{category.title}</h4>
                      <div className="category-skills-count">
                        {category.skills?.length || 0} skills
                      </div>
                    </div>
                    <p className="category-description">{category.description}</p>
                    <div className="selection-indicator">
                      {userSelectedCategories.includes(category.id) ? '✅' : '⭕'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

{/* Skill Detail Modal */}
{selectedSkill && (
  <div className="modal-overlay" onClick={() => {
    setSelectedSkill(null);
    setHasClickedLink(false); // Reset on close
    setTimer(0);
    setIsTimerActive(false);
  }}>
    <div className="skill-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{selectedSkill.name}</h3>
        <button
          className="modal-close"
          onClick={() => {
            setSelectedSkill(null);
            setHasClickedLink(false); // Reset on close
            setTimer(0);
            setIsTimerActive(false);
          }}
        >
          ✕
        </button>
      </div>
      <div className="modal-content">
        <div className="modal-difficulty">
          <strong>Difficulty: </strong>
          <span style={{ color: getDifficultyColor(selectedSkill.difficulty) }}>
            {selectedSkill.difficulty}
          </span>
        </div>
        <p className="modal-description">{selectedSkill.description}</p>
        <p className="modal-xp">Reward: {selectedSkill.xp} XP</p>

        {/* Reference Link */}
        {selectedSkill.Reference && (
          <a
            href={selectedSkill.Reference}
            target="_blank"
            rel="noopener noreferrer"
            className="module-link-btn"
            onClick={() => {
             // Start timer only if not already clicked
              if (!hasClickedLink) {
                setTimer(10); //temporary for testing only (default is 300)
                setIsTimerActive(true);
                setHasClickedLink(true); // Mark that user clicked the link
              }
            }}
          >
            📚 Check out this Module!
          </a>
        )}

        {!completedSkills.has(selectedSkill.id) && (
          <button
            className="complete-skill-btn"
            onClick={() => handleSkillComplete(selectedSkill.id)}
            disabled={!hasClickedLink || timer > 0} 
          >
            {!hasClickedLink 
              ? "Click the module link first"
              : timer > 0 
                ? `Please wait ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`
                : "Mark as Complete"
            }
          </button>
        )}
        
        {completedSkills.has(selectedSkill.id) && (
          <div className="skill-completed-message">
            🎉 Skill Completed!
          </div>
        )}
      </div>
    </div>
  </div>
)}


      {/* Quiz Modal */}
      {activeQuiz && (
        <div className="modal-overlay">
          <div className="quiz-modal">
            {!quizCompleted ? (
              <>
                {/* Quiz Header */}
                <div className="quiz-header">
                  <h3>{activeQuiz.name}</h3>
                  <div className="quiz-progress">
                    <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                    <button className="modal-close" onClick={closeQuiz}>✕</button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="quiz-progress-bar">
                  <div 
                    className="quiz-progress-fill" 
                    style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                  ></div>
                </div>
                
                {/* Current Question */}
                {activeQuiz.questions[currentQuestionIndex] && (
                  <div className="quiz-content">
                    <h4 className="quiz-question">
                      {activeQuiz.questions[currentQuestionIndex].question}
                    </h4>
                    
                    <div className="quiz-options">
                      {activeQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                        <label key={index} className="quiz-option">
                          <input
                            type="radio"
                            name={`question-${activeQuiz.questions[currentQuestionIndex].id}`}
                            checked={selectedAnswers[activeQuiz.questions[currentQuestionIndex].id] === index}
                            onChange={() => handleAnswerSelect(activeQuiz.questions[currentQuestionIndex].id, index)}
                          />
                          <span className="quiz-option-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="quiz-navigation">
                  <button 
                    className="quiz-btn quiz-btn-secondary"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  
                  {currentQuestionIndex === activeQuiz.questions.length - 1 ? (
                    <button 
                      className="quiz-btn quiz-btn-primary"
                      onClick={submitQuiz}
                      disabled={Object.keys(selectedAnswers).length < activeQuiz.questions.length}
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button 
                      className="quiz-btn quiz-btn-primary"
                      onClick={goToNextQuestion}
                    >
                      Next
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Quiz Results */
              <div className="quiz-results">
                <div className="quiz-header">
                  <h3>Quiz Results</h3>
                  <button className="modal-close" onClick={closeQuiz}>✕</button>
                </div>
                
                <div className="quiz-score">
                  <div className="score-circle">
                    <span className="score-percentage">{Math.round(quizScore)}%</span>
                  </div>
                  
                  <h4 className={quizScore >= 70 ? 'pass' : 'fail'}>
                    {quizScore >= 70 ? 'Congratulations! You passed!' : 'Keep studying and try again!'}
                  </h4>
                  
                  <p>
                    You got {activeQuiz.questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} out of {activeQuiz.questions.length} questions correct.
                  </p>
                  
                  {quizScore >= 70 && (
                    <div className="xp-reward">
                      <span>🎉 +{activeQuiz.xp} XP Earned!</span>
                    </div>
                  )}
                </div>
                
                <button className="quiz-btn quiz-btn-primary" onClick={closeQuiz}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;