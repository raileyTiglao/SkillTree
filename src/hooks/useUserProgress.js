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
  });
  const [completedSkills, setCompletedSkills] = useState(new Set());
  const [completedAssessments, setCompletedAssessments] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setUserProgress({
            totalSkills: data.totalSkills || 0,
            completed: data.completed || 0,
            level: data.level || 1,
            experience: data.experience || 0,
            streak: data.streak || 0,
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
      const completed = updatedSkills.size;
      
      // Calculate total XP
      const totalXP = Array.from(updatedSkills).reduce((sum, id) => {
        const skill = allSkills.find(s => s.id === id);
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

      // Update local state
      setCompletedSkills(updatedSkills);
      setUserProgress(prev => ({ ...prev, ...newProgress }));

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

      const newProgress = {
        completedAssessments: Array.from(updatedAssessments),
        experience: userProgress.experience + xpReward,
        updatedAt: Date.now()
      };

      // Update local state
      setCompletedAssessments(updatedAssessments);
      setUserProgress(prev => ({ ...prev, experience: prev.experience + xpReward }));

      // Save to Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, newProgress);

    } catch (err) {
      console.error("Error completing assessment:", err);
      setError("Failed to save assessment progress.");
    }
  };

  // Update total skills count
  const updateTotalSkills = (count) => {
    setUserProgress(prev => ({ ...prev, totalSkills: count }));
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