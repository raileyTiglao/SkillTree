// src/components/dashboard/QuizModal.jsx
import React from 'react';

const QuizModal = ({ 
  quiz, 
  currentQuestionIndex,
  selectedAnswers,
  quizCompleted,
  quizScore,
  onClose,
  onAnswerSelect,
  onNext,
  onPrevious,
  onSubmit
}) => {
  if (!quiz) return null;

  return (
    <div className="modal-overlay">
      <div className="quiz-modal">
        {!quizCompleted ? (
          <>
            {/* Quiz Header */}
            <div className="quiz-header">
              <h3>{quiz.name}</h3>
              <div className="quiz-progress">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <button className="modal-close" onClick={onClose}>✕</button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="quiz-progress-bar">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Current Question */}
            {quiz.questions[currentQuestionIndex] && (
              <div className="quiz-content">
                <h4 className="quiz-question">
                  {quiz.questions[currentQuestionIndex].question}
                </h4>
                
                <div className="quiz-options">
                  {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                    <label key={index} className="quiz-option">
                      <input
                        type="radio"
                        name={`question-${quiz.questions[currentQuestionIndex].id}`}
                        checked={selectedAnswers[quiz.questions[currentQuestionIndex].id] === index}
                        onChange={() => onAnswerSelect(quiz.questions[currentQuestionIndex].id, index)}
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
                onClick={onPrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button 
                  className="quiz-btn quiz-btn-primary"
                  onClick={onSubmit}
                  disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                >
                  Submit Quiz
                </button>
              ) : (
                <button 
                  className="quiz-btn quiz-btn-primary"
                  onClick={onNext}
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
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            
            <div className="quiz-score">
              <div className="score-circle">
                <span className="score-percentage">{Math.round(quizScore)}%</span>
              </div>
              
              <h4 className={quizScore >= 70 ? 'pass' : 'fail'}>
                {quizScore >= 70 ? 'Congratulations! You passed!' : 'Keep studying and try again!'}
              </h4>
              
              <p>
                You got {quiz.questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} out of {quiz.questions.length} questions correct.
              </p>
              
              {quizScore >= 70 && (
                <div className="xp-reward">
                  <span>🎉 +{quiz.xp} XP Earned!</span>
                </div>
              )}
            </div>
            
            <button className="quiz-btn quiz-btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;