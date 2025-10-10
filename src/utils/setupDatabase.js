// src/utils/setupDatabase.js
import { populateSkills } from './populateSkills';
import { populateCertifications } from './populateCertifications';

/**
 * Initialize Firebase database with skills and certifications
 * Run this once when setting up the application
 */
export const setupDatabase = async () => {
  try {
    console.log('='.repeat(50));
    console.log('Starting database setup...');
    console.log('='.repeat(50));
    
    // Step 1: Populate skill categories
    console.log('\n📚 Step 1: Populating skill categories...');
    await populateSkills();
    console.log('✅ Skill categories populated successfully!\n');
    
    // Step 2: Populate certifications
    console.log('🎓 Step 2: Populating certifications...');
    await populateCertifications();
    console.log('✅ Certifications populated successfully!\n');
    
    console.log('='.repeat(50));
    console.log('✨ Database setup complete!');
    console.log('='.repeat(50));
    
    return {
      success: true,
      message: 'Database initialized successfully'
    };
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default setupDatabase;