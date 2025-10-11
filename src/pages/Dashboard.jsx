// src/pages/Dashboard.jsx (With Firebase Certifications)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import "../styles/dashboard.css";

// Import custom hooks
import useTimer from "../hooks/useTimer";
import useUserProgress from "../hooks/useUserProgress";
import useCertifications from "../hooks/useCertifications"; // NEW!

// Import components
import DashboardNav from "../components/dashboard/DashboardNav";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import SkillCategories from "../components/dashboard/SkillCategories";
import CategorySelectorModal from "../components/dashboard/CategorySelectorModal";
import SkillDetailModal from "../components/dashboard/SkillDetailModal";
import QuizModal from "../components/dashboard/QuizModal";
import CertificationsModal from "../components/dashboard/CertificationsModal";
import CertificationDetailModal from "../components/dashboard/CertificationDetailModal";

// Import utilities
import { getDifficultyColor } from "../utils/difficultyUtils";
import { arePrerequisitesMet, areCertPrerequisitesMet } from "../utils/prerequisitesUtils";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Custom hooks
  const { timer, startTimer, formatTime } = useTimer();
  const {
    userProgress,
    completedSkills,
    completedAssessments,
    loading: progressLoading,
    error,
    setError,
    completeSkill,
    completeAssessment,
    updateTotalSkills
  } = useUserProgress(user);

  // NEW: Load certifications from Firebase
  const {
    certifications,
    loading: certificationsLoading,
    error: certificationsError,
    getEligibleCertifications
  } = useCertifications();
  
  // Local state
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [allSkillCategories, setAllSkillCategories] = useState([]);
  const [userSelectedCategories, setUserSelectedCategories] = useState([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  
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
      } catch (err) {
        console.error("Error loading skill categories:", err);
        setError("Failed to load skill categories");
      }
    };

    loadSkillCategories();
  }, [setError]);

  // Update total skills when categories change
  useEffect(() => {
    const totalSkills = userSelectedCategories.reduce((total, categoryId) => {
      const category = allSkillCategories.find(cat => cat.id === categoryId);
      return total + (category?.skills?.length || 0);
    }, 0);
    
    updateTotalSkills(totalSkills);
  }, [userSelectedCategories, allSkillCategories, updateTotalSkills]);

  // Category management
  const handleCategoryToggle = async (categoryId) => {
    try {
      let updatedCategories;
      if (userSelectedCategories.includes(categoryId)) {
        updatedCategories = userSelectedCategories.filter(id => id !== categoryId);
      } else {
        updatedCategories = [...userSelectedCategories, categoryId];
      }

      setUserSelectedCategories(updatedCategories);

      const totalSkills = updatedCategories.reduce((total, catId) => {
        const category = allSkillCategories.find(cat => cat.id === catId);
        return total + (category?.skills?.length || 0);
      }, 0);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        selectedCategories: updatedCategories,
        totalSkills,
        updatedAt: Date.now()
      });

    } catch (err) {
      console.error("Error updating categories:", err);
      setError("Failed to update categories. Please try again.");
    }
  };

  // Skill completion handler
  const handleSkillComplete = async (skillId) => {
    const allSkills = userSelectedCategories
      .map(catId => allSkillCategories.find(cat => cat.id === catId))
      .filter(Boolean)
      .flatMap(cat => cat.skills);
    
    await completeSkill(skillId, allSkills);
    setSelectedSkill(null);
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

  const submitQuiz = async () => {
    let score = 0;
    activeQuiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    
    const percentage = (score / activeQuiz.questions.length) * 100;
    setQuizScore(percentage);
    setQuizCompleted(true);
    
    if (percentage >= 70) {
      await completeAssessment(activeQuiz.id, activeQuiz.xp);
    }
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
  };

  const handleStartTimer = () => {
    startTimer(1); // for the timer of complete button
  };

  const getUserCategories = () => {
    return userSelectedCategories
      .map(catId => allSkillCategories.find(cat => cat.id === catId))
      .filter(Boolean);
  };

  // Get only eligible certifications
  const eligibleCertifications = getEligibleCertifications(completedSkills);

  // Combined loading state
  const loading = progressLoading || certificationsLoading;

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
  
  if (!user || !user.emailVerified) {
    return <p>Checking verification...</p>;
  }
  
  return (
    <div className="dashboard-container">
      {/* Error message */}
      {(error || certificationsError) && (
        <div style={{
          background: '#f44336',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          {error || certificationsError}
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

      {/* Navigation */}
      <DashboardNav 
        user={user}
        userProgress={userProgress}
        onLogout={logout}
      />

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Progress Overview */}
        <ProgressOverview 
          userProgress={userProgress}
          onAddCategory={() => setShowCategorySelector(true)}
          onShowCertifications={() => setShowCertifications(true)}
          categories={getUserCategories()} // Pass currently selected categories
          completedSkills={completedSkills} // Pass completed skills set
        />

        {/* Skill Categories */}
        <SkillCategories 
          categories={getUserCategories()}
          completedSkills={completedSkills}
          completedAssessments={completedAssessments}
          onSkillClick={setSelectedSkill}
          onStartQuiz={startQuiz}
          arePrerequisitesMet={(prereqs) => arePrerequisitesMet(prereqs, completedSkills, completedAssessments)}
          getDifficultyColor={getDifficultyColor}
          onShowCategorySelector={() => setShowCategorySelector(true)}
        />
      </main>

      {/* Modals */}
      <CategorySelectorModal 
        show={showCategorySelector}
        onClose={() => setShowCategorySelector(false)}
        allCategories={allSkillCategories}
        selectedCategories={userSelectedCategories}
        onCategoryToggle={handleCategoryToggle}
      />

      <SkillDetailModal 
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        completedSkills={completedSkills}
        onComplete={handleSkillComplete}
        getDifficultyColor={getDifficultyColor}
        timer={timer}
        onStartTimer={handleStartTimer}
      />

      <QuizModal 
        quiz={activeQuiz}
        currentQuestionIndex={currentQuestionIndex}
        selectedAnswers={selectedAnswers}
        quizCompleted={quizCompleted}
        quizScore={quizScore}
        onClose={closeQuiz}
        onAnswerSelect={handleAnswerSelect}
        onNext={goToNextQuestion}
        onPrevious={goToPreviousQuestion}
        onSubmit={submitQuiz}
      />

      <CertificationsModal 
        show={showCertifications}
        onClose={() => setShowCertifications(false)}
        certifications={certifications} // All certifications from Firebase
        areCertPrerequisitesMet={(prereqs) => areCertPrerequisitesMet(prereqs, completedSkills)}
        onSelectCertification={setSelectedCertification}
        getDifficultyColor={getDifficultyColor}
      />

      <CertificationDetailModal 
        certification={selectedCertification}
        onClose={() => setSelectedCertification(null)}
        getDifficultyColor={getDifficultyColor}
      />
    </div>
  );
};

export default Dashboard;