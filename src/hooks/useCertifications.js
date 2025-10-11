// src/hooks/useCertifications.js
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Custom hook for loading certifications from Firebase
 * @param {string} categoryFilter - Optional category to filter by
 * @returns {object} Certifications state and loading status
 */
export function useCertifications(categoryFilter = null) {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setLoading(true);
        setError(null);

        let q = collection(db, 'certifications');
        
        // Filter by category if provided
        if (categoryFilter) {
          q = query(q, where('category', '==', categoryFilter));
        }

        // Only show active certifications
        q = query(q, where('active', '==', true));

        const snapshot = await getDocs(q);
        const certs = [];
        
        snapshot.forEach((doc) => {
          certs.push({ id: doc.id, ...doc.data() });
        });

        // Sort by difficulty (Beginner -> Intermediate -> Advanced)
        const difficultyOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        certs.sort((a, b) => {
          return (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99);
        });

        setCertifications(certs);
      } catch (err) {
        console.error('Error loading certifications:', err);
        setError('Failed to load certifications');
      } finally {
        setLoading(false);
      }
    };

    loadCertifications();
  }, [categoryFilter]);

  /**
   * Filter certifications by prerequisites met
   */
  const getEligibleCertifications = (completedSkills) => {
    return certifications.filter(cert => {
      return cert.prerequisites.every(skillId => completedSkills.has(skillId));
    });
  };

  /**
   * Get certifications by difficulty level
   */
  const getCertificationsByDifficulty = (difficulty) => {
    return certifications.filter(cert => cert.difficulty === difficulty);
  };

  /**
   * Get recommended certifications based on user progress
   */
  const getRecommendedCertifications = (completedSkills) => {
    return certifications.filter(cert => {
      const prerequisitesMet = cert.prerequisites.every(skillId => 
        completedSkills.has(skillId)
      );
      // Recommend if prerequisites are met but not too many extra skills completed
      const relevantSkillsCount = Array.from(completedSkills).filter(skillId => 
        cert.prerequisites.includes(skillId)
      ).length;
      
      return prerequisitesMet && relevantSkillsCount >= cert.prerequisites.length - 1;
    }).slice(0, 3); // Return top 3 recommendations
  };

  return {
    certifications,
    loading,
    error,
    getEligibleCertifications,
    getCertificationsByDifficulty,
    getRecommendedCertifications
  };
}

export default useCertifications;