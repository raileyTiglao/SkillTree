// src/utils/populateCertifications.js
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const certifications = [
  {
    id: 'cert-javascript-basic',
    name: 'JavaScript Basic Certification',
    provider: 'HackerRank',
    url: 'https://www.hackerrank.com/skills-verification/javascript_basic',
    image: 'https://hrcdn.net/fcore/assets/badges/javascript-basic-6e6ee03b0f.svg',
    description: 'This certification validates your knowledge of JavaScript basics including variables, data types, operators, functions, and basic DOM manipulation.',
    prerequisites: [3], // JavaScript Basics skill
    difficulty: 'Beginner',
    category: 'frontend',
    estimatedTime: '90 minutes',
    passingScore: 70,
    active: true,
    createdAt: Date.now()
  },
  {
    id: 'cert-nodejs-intermediate',
    name: 'Node.js Intermediate Certification',
    provider: 'HackerRank',
    url: 'https://www.hackerrank.com/skills-verification/nodejs_intermediate',
    image: 'https://hrcdn.net/fcore/assets/badges/node-intermediate-c6b77d3042.svg',
    description: 'Test your intermediate Node.js skills including asynchronous programming, streams, event emitters, and building RESTful APIs.',
    prerequisites: [7, 8], // Node.js and Express.js
    difficulty: 'Intermediate',
    category: 'backend',
    estimatedTime: '120 minutes',
    passingScore: 70,
    active: true,
    createdAt: Date.now()
  },
  {
    id: 'cert-angular-basic',
    name: 'Angular Basic Certification',
    provider: 'HackerRank',
    url: 'https://www.hackerrank.com/skills-verification/angular_basic',
    image: 'https://hrcdn.net/fcore/assets/badges/angular-basic-ea79adb94c.svg',
    description: 'Validate your understanding of Angular fundamentals including components, directives, services, and dependency injection.',
    prerequisites: [3, 4], // JavaScript Basics and React Framework
    difficulty: 'Intermediate',
    category: 'frontend',
    estimatedTime: '90 minutes',
    passingScore: 70,
    active: true,
    createdAt: Date.now()
  },
  {
    id: 'cert-selenium-101',
    name: 'Selenium 101 Certification',
    provider: 'LambdaTest',
    url: 'https://www.lambdatest.com/certifications/selenium-101',
    image: 'https://www.lambdatest.com/resources/images/certifications/selenium-101.svg',
    description: 'Learn Selenium automation testing fundamentals, including setting up test environments, writing test scripts, and implementing best practices.',
    prerequisites: [13, 15], // Git Version Control and CI/CD Pipelines
    difficulty: 'Intermediate',
    category: 'devops',
    estimatedTime: '60 minutes',
    passingScore: 70,
    active: true,
    createdAt: Date.now()
  },
  {
    id: 'cert-react-advanced',
    name: 'React Advanced Certification',
    provider: 'HackerRank',
    url: 'https://www.hackerrank.com/skills-verification/react',
    image: 'https://hrcdn.net/fcore/assets/badges/react-6e6ee03b0f.svg',
    description: 'Advanced React certification covering hooks, context, performance optimization, and advanced patterns.',
    prerequisites: [4], // React Framework
    difficulty: 'Advanced',
    category: 'frontend',
    estimatedTime: '120 minutes',
    passingScore: 75,
    active: true,
    createdAt: Date.now()
  },
  {
    id: 'cert-aws-cloud-practitioner',
    name: 'AWS Certified Cloud Practitioner',
    provider: 'Amazon Web Services',
    url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    image: 'https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Cloud-Practitioner_badge.634f8a21af2e0e956ed8905a72366146ba22b74c.png',
    description: 'Foundational AWS certification demonstrating cloud knowledge and skills.',
    prerequisites: [16], // Cloud Platforms
    difficulty: 'Beginner',
    category: 'devops',
    estimatedTime: '90 minutes',
    passingScore: 70,
    active: true,
    createdAt: Date.now()
  }
];

/**
 * Populate certifications collection in Firebase
 * Run this once to initialize certification data
 */
export const populateCertifications = async () => {
  try {
    console.log('Starting to populate certifications...');
    
    for (const cert of certifications) {
      const certRef = doc(db, 'certifications', cert.id);
      await setDoc(certRef, cert);
      console.log(`Added certification: ${cert.name}`);
    }
    
    console.log('Successfully populated all certifications!');
    return true;
  } catch (error) {
    console.error('Error populating certifications:', error);
    throw error;
  }
};

export default populateCertifications;