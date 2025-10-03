// src/utils/populateSkills.js
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const skillCategories = [
  {
    id: "frontend",
    title: "Frontend Development",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    description: "Build interactive user interfaces and web experiences",
    skills: [
      { id: 1, name: "HTML Fundamentals", difficulty: "Beginner", xp: 100, description: "Learn the basics of HTML structure and semantics" },
      { id: 2, name: "CSS Styling", difficulty: "Beginner", xp: 120, description: "Master CSS selectors, properties, and layouts" },
      { id: 3, name: "JavaScript Basics", difficulty: "Intermediate", xp: 150, description: "Understand variables, functions, and DOM manipulation" },
      { id: 4, name: "React Framework", difficulty: "Advanced", xp: 200, description: "Build interactive UIs with React components and hooks" },
      { id: 5, name: "Responsive Design", difficulty: "Intermediate", xp: 130, description: "Create mobile-friendly layouts with CSS Grid and Flexbox" },
      { id: 6, name: "Modern CSS", difficulty: "Advanced", xp: 180, description: "Master CSS animations, transforms, and advanced selectors" },
    ],
    assessments: [
      {
        id: 'frontend-assessment-1',
        name: 'HTML & CSS Fundamentals',
        description: 'Test your knowledge of HTML structure and CSS styling',
        xp: 80,
        prerequisites: [1, 2], // HTML and CSS
        difficulty: 'Beginner',
        questions: [
          {
            id: 1,
            question: "What does HTML stand for?",
            options: [
              "Hypertext Markup Language",
              "Home Tool Markup Language",
              "Hyperlinks and Text Markup Language",
              "Hypertext Machine Language"
            ],
            correctAnswer: 0
          },
          {
            id: 2,
            question: "Which CSS property is used to change the text color?",
            options: ["text-color", "font-color", "color", "text-style"],
            correctAnswer: 2
          },
          {
            id: 3,
            question: "What is the correct HTML element for the largest heading?",
            options: ["<heading>", "<h6>", "<h1>", "<head>"],
            correctAnswer: 2
          },
          {
            id: 4,
            question: "How do you create a comment in CSS?",
            options: [
              "// comment",
              "<!-- comment -->",
              "/* comment */",
              "# comment"
            ],
            correctAnswer: 2
          },
          {
            id: 5,
            question: "Which HTML attribute is used to define inline styles?",
            options: ["class", "style", "font", "styles"],
            correctAnswer: 1
          },
          {
            id: 6,
            question: "What does CSS stand for?",
            options: [
              "Colorful Style Sheets",
              "Computer Style Sheets",
              "Cascading Style Sheets",
              "Creative Style Sheets"
            ],
            correctAnswer: 2
          },
          {
            id: 7,
            question: "Which CSS property controls the text size?",
            options: ["font-style", "text-size", "font-size", "text-style"],
            correctAnswer: 2
          },
          {
            id: 8,
            question: "What is the correct HTML for creating a hyperlink?",
            options: [
              "<a url='http://www.example.com'>Example</a>",
              "<a href='http://www.example.com'>Example</a>",
              "<a>http://www.example.com</a>",
              "<link>http://www.example.com</link>"
            ],
            correctAnswer: 1
          },
          {
            id: 9,
            question: "Which property is used to change the background color?",
            options: ["color", "bgcolor", "background-color", "background"],
            correctAnswer: 2
          },
          {
            id: 10,
            question: "What is the correct CSS syntax for making all <p> elements bold?",
            options: [
              "p {font-weight: bold;}",
              "<p style='font-weight:bold'>",
              "p {text-size: bold;}",
              ".p {font-weight: bold;}"
            ],
            correctAnswer: 0
          }
        ]
      }
    ]
  },
  {
    id: "backend",
    title: "Backend Development",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    description: "Build server-side applications and APIs",
    skills: [
      { id: 7, name: "Node.js", difficulty: "Intermediate", xp: 160, description: "Build server-side applications with Node.js" },
      { id: 8, name: "Express.js", difficulty: "Intermediate", xp: 140, description: "Create RESTful APIs with Express framework" },
      { id: 9, name: "Database Design", difficulty: "Advanced", xp: 190, description: "Design efficient database schemas and relationships" },
      { id: 10, name: "MongoDB", difficulty: "Intermediate", xp: 150, description: "Work with NoSQL databases and document storage" },
      { id: 11, name: "Authentication", difficulty: "Advanced", xp: 170, description: "Implement secure user authentication and authorization" },
      { id: 12, name: "API Security", difficulty: "Advanced", xp: 200, description: "Secure APIs with JWT, rate limiting, and validation" },
    ],
    assessments: [
      {
        id: 'backend-assessment-1',
        name: 'Backend Fundamentals Assessment',
        description: 'Test your knowledge of Node.js and Express.js basics',
        xp: 100,
        prerequisites: [7, 8], // Node.js and Express.js
        difficulty: 'Intermediate',
        questions: [
          {
            id: 1,
            question: "What is Node.js primarily used for?",
            options: [
              "Frontend web development",
              "Server-side JavaScript runtime",
              "Database management",
              "Mobile app development"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Which method is used to create an Express.js application?",
            options: [
              "express.create()",
              "new Express()",
              "express()",
              "Express.init()"
            ],
            correctAnswer: 2
          },
          {
            id: 3,
            question: "What does npm stand for?",
            options: [
              "Node Package Manager",
              "New Programming Method",
              "Network Protocol Manager",
              "Node Process Monitor"
            ],
            correctAnswer: 0
          },
          {
            id: 4,
            question: "Which HTTP method is typically used to retrieve data?",
            options: [
              "POST",
              "PUT",
              "GET",
              "DELETE"
            ],
            correctAnswer: 2
          },
          {
            id: 5,
            question: "What is middleware in Express.js?",
            options: [
              "A database connection",
              "Functions that execute during request-response cycle",
              "A templating engine",
              "A testing framework"
            ],
            correctAnswer: 1
          },
          {
            id: 6,
            question: "Which module is used to handle file system operations in Node.js?",
            options: [
              "path",
              "fs",
              "os",
              "url"
            ],
            correctAnswer: 1
          },
          {
            id: 7,
            question: "What is the default port for HTTP?",
            options: [
              "8080",
              "3000",
              "80",
              "443"
            ],
            correctAnswer: 2
          },
          {
            id: 8,
            question: "Which method is used to parse JSON in Express.js?",
            options: [
              "express.json()",
              "JSON.parse()",
              "bodyParser.json()",
              "express.urlencoded()"
            ],
            correctAnswer: 0
          },
          {
            id: 9,
            question: "What does REST stand for in API design?",
            options: [
              "Representational State Transfer",
              "Reliable State Transfer",
              "Remote State Transfer",
              "Relational State Transfer"
            ],
            correctAnswer: 0
          },
          {
            id: 10,
            question: "Which status code indicates a successful HTTP request?",
            options: [
              "404",
              "500",
              "200",
              "301"
            ],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 'backend-assessment-2', 
        name: 'Database & Security Assessment',
        description: 'Advanced assessment covering databases, auth, and API security',
        xp: 150,
        prerequisites: [9, 10, 11, 12, 'backend-assessment-1'], // All skills + previous assessment
        difficulty: 'Advanced',
        questions: [
          {
            id: 1,
            question: "What is a primary key in database design?",
            options: [
              "A field that can be null",
              "A unique identifier for each record",
              "A foreign key reference",
              "An encrypted field"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "What does JWT stand for?",
            options: [
              "JavaScript Web Token",
              "JSON Web Token",
              "Java Web Token",
              "Just Web Token"
            ],
            correctAnswer: 1
          }
          // Add 8 more questions here for a complete 10-question assessment
        ]
      }
    ]
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    description: "Deploy and manage applications in production",
    skills: [
      { id: 13, name: "Git Version Control", difficulty: "Beginner", xp: 110, description: "Master Git workflows, branching, and collaboration" },
      { id: 14, name: "Docker Containers", difficulty: "Advanced", xp: 180, description: "Containerize applications with Docker" },
      { id: 15, name: "CI/CD Pipelines", difficulty: "Advanced", xp: 190, description: "Automate deployment with continuous integration" },
      { id: 16, name: "Cloud Platforms", difficulty: "Advanced", xp: 200, description: "Deploy applications on AWS, Azure, or Google Cloud" },
      { id: 17, name: "Monitoring & Logging", difficulty: "Intermediate", xp: 160, description: "Implement application monitoring and error tracking" },
      { id: 18, name: "Linux Administration", difficulty: "Intermediate", xp: 150, description: "Manage Linux servers and command-line tools" },
    ],
    assessments: [
      {
        id: 'devops-assessment-1',
        name: 'Git & Version Control Assessment',
        description: 'Test your knowledge of Git workflows and version control',
        xp: 90,
        prerequisites: [13], // Git Version Control
        difficulty: 'Beginner',
        questions: [
          {
            id: 1,
            question: "What command is used to initialize a new Git repository?",
            options: ["git start", "git init", "git create", "git new"],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Which command shows the current status of your Git repository?",
            options: ["git status", "git show", "git info", "git state"],
            correctAnswer: 0
          }
          // Add 8 more Git-related questions
        ]
      }
    ]
  },
  {
    id: "design",
    title: "UI/UX Design",
    color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    description: "Create beautiful and user-friendly interfaces",
    skills: [
      { id: 19, name: "Design Principles", difficulty: "Beginner", xp: 100, description: "Learn color theory, typography, and composition" },
      { id: 20, name: "Figma/Sketch", difficulty: "Intermediate", xp: 140, description: "Create wireframes and prototypes in design tools" },
      { id: 21, name: "User Research", difficulty: "Intermediate", xp: 150, description: "Conduct user interviews and usability testing" },
      { id: 22, name: "Prototyping", difficulty: "Advanced", xp: 170, description: "Build interactive prototypes and design systems" },
      { id: 23, name: "Accessibility", difficulty: "Advanced", xp: 180, description: "Design inclusive experiences for all users" },
      { id: 24, name: "Motion Design", difficulty: "Advanced", xp: 190, description: "Create engaging animations and micro-interactions" },
    ],
    assessments: [
      {
        id: 'design-assessment-1',
        name: 'Design Principles Assessment',
        description: 'Test your understanding of fundamental design principles',
        xp: 85,
        prerequisites: [19], // Design Principles
        difficulty: 'Beginner',
        questions: [
          {
            id: 1,
            question: "What are the three primary colors?",
            options: [
              "Red, Yellow, Blue",
              "Red, Green, Blue",
              "Cyan, Magenta, Yellow",
              "Red, Yellow, Green"
            ],
            correctAnswer: 0
          },
          {
            id: 2,
            question: "What is the rule of thirds in design?",
            options: [
              "Using three colors maximum",
              "Dividing layout into 9 equal sections",
              "Three font sizes only",
              "Three main elements per page"
            ],
            correctAnswer: 1
          }
          // Add 8 more design-related questions
        ]
      }
    ]
  }
];

export const populateSkills = async () => {
  try {
    console.log('Starting to populate skills...');
    
    for (const category of skillCategories) {
      const categoryRef = doc(db, 'skillCategories', category.id);
      await setDoc(categoryRef, category);
      console.log(`Added category: ${category.title}`);
    }
    
    console.log('Successfully populated all skills!');
    return true;
  } catch (error) {
    console.error('Error populating skills:', error);
    throw error;
  }
};