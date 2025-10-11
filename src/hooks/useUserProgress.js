// src/hooks/useUserProgress.js
import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Custom hook for managing user progress data
 * @param {object} user - Current authenticated user
 * @returns {object} Progress state and update functions
 */
export function useUserProgress(user) {
  const [userProgress, setUserProgress] = useState({
    totalSkills: 0,
    completed: 0,
    level: 1,
    experience: 0,
    streak: 0,
    lastActivityDate: null,
  });
  const [completedSkills, setCompletedSkills] = useState(new Set());
  const [completedAssessments, setCompletedAssessments] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Calculate streak based on last activity date
   * Returns updated streak count
   */
  const calculateStreak = (lastActivityDate, currentStreak) => {
    if (!lastActivityDate) {
      return 1; // First activity ever
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = new Date(lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    // If last activity was today, keep the streak
    if (daysDifference === 0) {
      return currentStreak || 1;
    }

    // If last activity was yesterday, increment streak
    if (daysDifference === 1) {
      return (currentStreak || 0) + 1;
    }

    // If more than one day has passed, reset streak to 1 (starting fresh today)
    return 1;
  };

  // Load user progress from Firestore
  useEffect(() => {
    if (!user?.emailVerified) {
      setLoading(false);
      return;
    }

    const loadUserProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        
        if (snap.exists()) {
          const data = snap.data();
          
          // Recalculate streak on load to account for date changes
          const currentStreak = calculateStreak(
            data.lastActivityDate,
            data.streak || 0
          );

          setUserProgress({
            totalSkills: data.totalSkills || 0,
            completed: data.completed || 0,
            level: data.level || 1,
            experience: data.experience || 0,
            streak: currentStreak,
            lastActivityDate: data.lastActivityDate || null,
          });
          setCompletedSkills(new Set(data.completedSkills || []));
          setCompletedAssessments(new Set(data.completedAssessments || []));
        } else {
          // Initialize new user
          const initialData = {
            level: 1,
            experience: 0,
            streak: 0,
            completed: 0,
            totalSkills: 0,
            completedSkills: [],
            completedAssessments: [],
            selectedCategories: [],
            lastActivityDate: null,
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
            lastActivityDate: null,
          });
          setCompletedSkills(new Set());
          setCompletedAssessments(new Set());
        }
      } catch (err) {
        console.error("Error loading user progress:", err);
        setError("Failed to load user progress. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, [user]);

  // Complete a skill
  const completeSkill = async (skillId, allSkills) => {
    if (!user?.emailVerified || completedSkills.has(skillId)) return;

    try {
      const updatedSkills = new Set([...completedSkills, skillId]);
      const skill = allSkills.find(s => s.id === skillId);
      const xpGain = skill?.xp || 0;
      
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISOString = today.toISOString();

      // Check if this is the first completion today
      const lastActivityDate = userProgress.lastActivityDate
        ? new Date(userProgress.lastActivityDate)
        : null;
      
      if (lastActivityDate) {
        lastActivityDate.setHours(0, 0, 0, 0);
      }

      const isFirstCompletionToday = !lastActivityDate || 
        lastActivityDate.getTime() !== today.getTime();

      // Calculate new streak (only increment if first completion of the day)
      let newStreak = userProgress.streak;
      if (isFirstCompletionToday) {
        newStreak = calculateStreak(userProgress.lastActivityDate, userProgress.streak);
      }

      const newExperience = userProgress.experience + xpGain;
      const newLevel = Math.floor(newExperience / 500) + 1;

      const newProgress = {
        completed: updatedSkills.size,
        experience: newExperience,
        level: newLevel,
        streak: newStreak,
        lastActivityDate: todayISOString,
        completedSkills: Array.from(updatedSkills),
        updatedAt: Date.now()
      };

      // Update local state
      setCompletedSkills(updatedSkills);
      setUserProgress(prev => ({ 
        ...prev, 
        ...newProgress
      }));

      // Save to Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, newProgress);
      
    } catch (err) {
      console.error("Error completing skill:", err);
      setError("Failed to save progress. Please try again.");
      
      // Revert on error
      setCompletedSkills(prev => {
        const reverted = new Set(prev);
        reverted.delete(skillId);
        return reverted;
      });
    }
  };

  // Complete an assessment
  const completeAssessment = async (assessmentId, xpReward) => {
    if (!user?.emailVerified || completedAssessments.has(assessmentId)) return;

    try {
      const updatedAssessments = new Set([...completedAssessments, assessmentId]);
      const newExperience = userProgress.experience + xpReward;
      const newLevel = Math.floor(newExperience / 500) + 1;

      const newProgress = {
        completedAssessments: Array.from(updatedAssessments),
        experience: newExperience,
        level: newLevel,
        updatedAt: Date.now()
      };

      // Update local state
      setCompletedAssessments(updatedAssessments);
      setUserProgress(prev => ({ 
        ...prev, 
        experience: newExperience,
        level: newLevel
      }));

      // Save to Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, newProgress);

    } catch (err) {
      console.error("Error completing assessment:", err);
      setError("Failed to save assessment progress.");
    }
  };

  // Update total skills count
  const updateTotalSkills = async (count) => {
    try {
      setUserProgress(prev => ({ ...prev, totalSkills: count }));
      
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { totalSkills: count });
    } catch (err) {
      console.error("Error updating total skills:", err);
      setError("Failed to update skills count.");
    }
  };

  return {
    userProgress,
    completedSkills,
    completedAssessments,
    loading,
    error,
    setError,
    completeSkill,
    completeAssessment,
    updateTotalSkills
  };
}

export default useUserProgress;