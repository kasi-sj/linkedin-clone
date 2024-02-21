const skills = [
  "Programming",
  "Web Development",
  "Mobile App Development",
  "Data Analysis",
  "Machine Learning",
  "Artificial Intelligence",
  "Database Management",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Copywriting",
  "SEO (Search Engine Optimization)",
  "SEM (Search Engine Marketing)",
  "Social Media Management",
  "Leadership",
  "Problem Solving",
  "Critical Thinking",
  "Communication",
  "Teamwork",
  "Time Management",
  "Customer Service",
  "Sales",
  "Public Speaking",
  "Negotiation",
  "Financial Analysis",
  "Budgeting",
  "Market Research",
  "Product Management",
  "Quality Assurance",
  "Network Administration",
  "System Administration",
  "Troubleshooting",
  "Event Planning",
  "Foreign Languages",
  "Photography",
  "Videography",
  "Creative Writing",
  "Data Entry",
  "Statistical Analysis",
  "Mathematical Modeling",
  "E-commerce Management",
  "Business Development",
  "Risk Management",
  "Interpersonal Skills",
  "Emotional Intelligence",
  "Decision Making",
  "Adaptability",
  "Resilience",
  "Conflict Resolution",
  "Crisis Management",
  "Customer Relationship Management",
  "Supply Chain Management",
  "Logistics",
  "Presentation Skills",
  "Technical Writing",
  "Research",
  "Teaching",
  "Mentoring",
  "Coaching",
  "Healthcare",
  "Legal Knowledge",
  "Human Resources Management",
  "Event Management",
  "Facilitation",
  "Data Visualization",
  "Blockchain Technology",
  "Cryptocurrency",
  "AR/VR Development",
  "Game Development",
  "Robotics",
  "Bioinformatics",
  "Environmental Conservation",
  "Sustainability",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Materials Science",
  "Agricultural Science",
  "Forestry",
  "Meteorology",
  "Geology",
  "Astronomy",
  "Psychology",
  "Sociology",
  "Anthropology",
  "Philosophy",
  "History",
  "Literature",
  "Art History",
  "Music Theory",
  "Film Studies",
  "Theater Arts",
  "Dance",
  "Cooking",
  "Baking",
  "Mixology",
  "Fashion Design",
  "Interior Design",
  "Gardening",
  "DIY Crafts",
  "Yoga",
  "Meditation",
  "Fitness Training",
  "Nutrition",
  "First Aid",
  "CPR (Cardiopulmonary Resuscitation)",
  "Emergency Response",
  "Wilderness Survival",
  "Self-Defense",
  "Mindfulness",
  "Stress Management",
  "Personal Finance",
  "Investing",
  "Retirement Planning",
  "Tax Preparation",
  "Real Estate Investing",
  "Trading",
  "Entrepreneurship",
  "Innovation",
  "Startups",
  "Venture Capital",
  "Angel Investing",
  "Crowdfunding",
  "Nonprofit Management",
  "Volunteer Coordination",
  "Fundraising",
  "Grant Writing",
  "Philanthropy",
  "Social Entrepreneurship",
  "Corporate Social Responsibility",
  "Community Development",
  "Political Science",
  "Government Policy Analysis",
  "International Relations",
  "Diplomacy",
  "Conflict Resolution",
  "Human Rights Advocacy",
  "Environmental Policy",
  "Urban Planning",
  "Public Health",
  "Epidemiology",
  "Health Policy",
  "Medical Research",
  "Biomedical Engineering",
  "Nursing",
  "Medical Coding",
  "Pharmacy",
  "Physical Therapy",
  "Occupational Therapy",
  "Speech Therapy",
  "Radiology",
  "Surgery",
  "Anesthesiology",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Hematology",
  "Infectious Diseases",
  "Neurology",
  "Oncology",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Rheumatology",
  "Urology",
  "Veterinary Medicine",
  "Animal Behavior",
  "Animal Nutrition",
  "Zoology",
  "Marine Biology",
  "Ecology",
  "Botany",
  "Entomology",
  "Microbiology",
  "Genetics",
  "Biotechnology",
  "Immunology",
  "Virology",
  "Biochemistry",
  "Cell Biology",
  "Molecular Biology",
  "Organic Chemistry",
  "Inorganic Chemistry",
  "Physical Chemistry",
  "Analytical Chemistry",
  "Theoretical Physics",
  "Quantum Mechanics",
  "Astrophysics",
  "Particle Physics",
  "Nuclear Physics",
  "Condensed Matter Physics",
  "Optics",
  "Acoustics",
  "Fluid Dynamics",
  "Thermodynamics",
  "Engineering Physics",
  "Computer Science",
  "Information Technology",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Robotics",
  "Software Engineering",
  "Frontend Development",
  "Backend Development",
  "Full-Stack Development",
  "Mobile Development",
  "iOS Development",
  "Android Development",
  "Game Development",
  "Web Design",
  "User Interface Design",
  "User Experience Design",
  "Graphic Design",
  "Animation",
  "Video Editing",
  "3D Modeling",
  "Virtual Reality",
  "Augmented Reality",
  "Digital Marketing",
  "Search Engine Optimization (SEO)",
  "Search Engine Marketing (SEM)",
  "Social Media Marketing",
  "Email Marketing",
  "Content Marketing",
  "Affiliate Marketing",
  "Influencer Marketing",
  "Analytics",
  "Marketing Automation",
  "Customer Relationship Management (CRM)",
  "E-commerce",
  "Dropshipping",
  "Supply Chain Management",
  "Inventory Management",
  "Logistics",
  "Quality Control",
  "Procurement",
  "Operations Management",
  "Financial Analysis",
  "Financial Planning",
  "Accounting",
  "Bookkeeping",
  "Auditing",
  "Tax Preparation",
  "Investment Management",
  "Financial Modeling",
  "Risk Management",
  "Corporate Finance",
  "Venture Capital",
  "Private Equity",
  "Mergers & Acquisitions",
  "Initial Public Offerings (IPOs)",
  "Business Strategy",
  "Strategic Planning",
  "Market Research",
  "Competitive Analysis",
  "Product Development",
  "Product Management",
  "Agile Methodologies",
  "Lean Methodologies",
  "Scrum",
  "Six Sigma",
  "Change Management",
  "Performance Management",
  "Emotional Intelligence",
  "Interpersonal Communication",
  "Cross-Cultural Communication",
  "Conflict Resolution",
  "Active Listening",
  "Empathy",
  "Leadership",
  "Team Building",
  "Collaboration",
  "Delegation",
  "Decision Making",
  "Problem Solving",
  "Creativity",
  "Innovation",
  "Adaptability",
  "Resilience",
  "Time Management",
  "Organization",
  "Prioritization",
  "Goal Setting",
  "Attention to Detail",
  "Critical Thinking",
  "Analytical Thinking",
  "Strategic Thinking",
  "Negotiation",
  "Influence",
  "Persuasion",
  "Presentation Skills",
  "Public Speaking",
  "Written Communication",
  "Technical Writing",
  "Copywriting",
  "Content Writing",
  "Editing",
  "Proofreading",
  "Research",
  "Data Analysis",
  "Statistical Analysis",
  "Data Visualization",
  "Database Management",
  "SQL",
  "NoSQL",
  "Big Data",
  "Data Mining",
  "Data Warehousing",
  "Business Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Predictive Analytics",
  "Data Modeling",
  "Data Engineering",
  "Software Development",
  "Programming Languages (Java, Python, JavaScript, C++, etc.)",
  "Version Control (Git, SVN)",
  "Agile Methodologies",
  "DevOps",
  "Continuous Integration/Continuous Deployment (CI/CD)",
  "Test-Driven Development (TDD)",
  "Behavior-Driven Development (BDD)",
  "Web Development",
  "Frontend Development (HTML, CSS, JavaScript)",
  "Backend Development (Node.js, Ruby on Rails, Django, etc.)",
  "Full-Stack Development",
  "Responsive Web Design",
  "Mobile Development",
  "iOS Development (Swift)",
  "Android Development (Kotlin, Java)",
  "Cross-Platform Development (React Native, Flutter)",
  "Cloud Computing",
  "Amazon Web Services (AWS)",
  "Microsoft Azure",
  "Google Cloud Platform (GCP)",
  "Infrastructure as Code (IaC)",
  "Containerization (Docker, Kubernetes)",
  "Serverless Computing",
  "Cybersecurity",
  "Network Security",
  "Information Security",
  "Ethical Hacking",
  "Penetration Testing",
  "Security Auditing",
  "Firewall Configuration",
  "Vulnerability Management",
  "Risk Assessment",
  "Compliance Management",
  "Incident Response",
  "Forensics",
  "Blockchain Technology",
  "Cryptocurrency",
  "Smart Contracts",
  "Decentralized Applications (DApps)",
  "Consensus Algorithms",
  "Digital Marketing",
  "Search Engine Optimization (SEO)",
  "Search Engine Marketing (SEM)",
  "Social Media Marketing (SMM)",
  "Email Marketing",
  "Content Marketing",
  "Influencer Marketing",
  "Affiliate Marketing",
  "Video Marketing",
  "Analytics",
  "Google Analytics",
  "Social Media Analytics",
  "Marketing Automation",
  "Customer Relationship Management (CRM)",
  "Conversion Rate Optimization (CRO)",
  "E-commerce",
  "Inventory Management",
  "Order Processing",
  "Payment Gateways",
  "Supply Chain Management",
  "Customer Service",
  "Customer Support",
  "Technical Support",
  "Troubleshooting",
  "Client Management",
  "Sales",
  "Prospecting",
  "Lead Generation",
  "Client Acquisition",
  "Account Management",
  "Sales Presentations",
  "Closing Deals",
  "Financial Management",
  "Budgeting",
  "Forecasting",
  "Financial Reporting",
  "Financial Modeling",
  "Risk Management",
  "Investment Analysis",
  "Portfolio Management",
  "Asset Allocation",
  "Tax Planning",
  "Auditing",
  "Compliance",
  "Regulatory Affairs",
  "Legal Knowledge",
  "Contract Negotiation",
  "Intellectual Property Law",
  "Corporate Law",
  "Employment Law",
  "Privacy Law",
  "International Law",
  "Legal Writing",
  "Human Resources Management",
  "Recruitment",
  "Onboarding",
  "Performance Management",
  "Employee Relations",
  "Training and Development",
  "Compensation and Benefits",
  "Organizational Development",
  "Change Management",
  "Workforce Planning",
  "Employee Engagement",
  "Talent Management",
  "Learning Management Systems (LMS)",
  "Healthcare",
  "Medical Terminology",
  "Health Information Management (HIM)",
  "Electronic Health Records (EHR)",
  "Medical Billing and Coding",
  "Patient Care",
  "Clinical Procedures",
  "Healthcare Administration",
  "Healthcare Compliance",
  "Health Insurance",
  "Public Health",
  "Epidemiology",
  "Health Education",
  "Health Promotion",
  "Health Policy",
  "Community Health",
  "Nutrition",
  "Exercise Physiology",
  "Dietetics",
  "Nutritional Counseling",
  "Fitness Training",
  "Exercise Programming",
  "Sports Medicine",
  "Rehabilitation",
  "Kinesiology",
  "Personal Training",
  "Group Fitness Instruction",
  "Strength and Conditioning",
  "Cardiovascular Training",
  "Flexibility Training",
  "Mind-Body Practices (Yoga, Pilates, Tai Chi)",
  "Nutrition Coaching",
  "First Aid",
  "CPR (Cardiopulmonary Resuscitation)",
  "Emergency Response",
  "Disaster Preparedness",
  "Search and Rescue",
  "Fire Safety",
  "Life Support Techniques",
  "Self-Defense",
  "Martial Arts",
  "Firearms Training",
  "Emergency Medical Technician (EMT) Skills",
  "Wilderness First Aid",
  "Leadership in Crisis Situations",
  "Environmental Conservation",
  "Sustainability",
  "Natural Resource Management",
  "Environmental Policy",
  "Ecological Restoration",
  "Wildlife Conservation",
  "Climate Change Adaptation",
  "Renewable Energy",
  "Waste Management",
  "Water Conservation",
  "Air Quality Management",
  "Environmental Education",
  "Sustainable Agriculture",
  "Organic Farming",
  "Permaculture",
  "Agroforestry",
  "Urban Agriculture",
  "Soil Conservation",
  "Energy Efficiency",
  "Environmental Law",
  "Environmental Advocacy",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Structural Engineering",
  "Chemical Engineering",
  "Biomedical Engineering",
  "Materials Science",
  "Aerospace Engineering",
  "Automotive Engineering",
  "Industrial Engineering",
  "Manufacturing Engineering",
  "Process Engineering",
  "Quality Engineering",
  "Robotics Engineering",
  "Systems Engineering",
  "Environmental Engineering",
  "Nuclear Engineering",
  "Computer Engineering",
  "Software Engineering",
  "Human-Computer Interaction (HCI)",
  "Usability Engineering",
  "Information Architecture",
  "User Experience (UX) Design",
  "User Interface (UI) Design",
  "Interaction Design",
  "Visual Design",
  "Motion Graphics",
  "3D Animation",
  "Character Animation",
  "Visual Effects (VFX)",
  "Storyboarding",
  "Cinematography",
  "Video Editing",
  "Sound Design",
  "Music Production",
  "Voice Acting",
  "Scriptwriting",
  "Documentary Filmmaking",
  "Screenwriting",
  "Film Directing",
  "Film Editing",
  "Production Management",
  "Set Design",
  "Costume Design",
  "Makeup Artistry",
  "Special Effects Makeup",
  "Hair Styling",
  "Fashion Design",
  "Fashion Illustration",
  "Pattern Making",
  "Textile Design",
  "Fashion Styling",
  "Fashion Photography",
  "Fashion Merchandising",
  "Retail Buying",
  "Brand Management",
  "Luxury Brand Management",
  "Visual Merchandising",
  "Fashion Marketing",
  "Retail Management",
  "E-commerce Management",
  "Supply Chain Management",
  "Logistics",
  "Inventory Management",
  "Customer Relationship Management (CRM)",
  "Store Operations",
  "Product Development",
  "Quality Assurance",
  "Market Research",
  "Trend Analysis",
  "Public Relations (PR)",
  "Event Planning",
  "Social Media Management",
  "Influencer Collaboration",
  "Customer Service",
  "Salesmanship",
  "Networking",
  "Relationship Building",
  "Presentation Skills",
  "Financial Analysis",
  "Accounting",
  "Budgeting",
  "Financial Planning",
  "Taxation",
  "Auditing",
  "Investment Management",
  "Risk Management",
  "Business Development",
  "Strategic Planning",
  "Market Analysis",
  "Negotiation",
  "Contract Management",
  "Client Relationship Management",
  "Project Management",
  "Resource Allocation",
  "Time Management",
  "Leadership",
  "Team Management",
  "Problem-Solving",
  "Decision Making",
  "Risk Assessment",
  "Quality Control",
  "Supply Chain Management",
  "Logistics",
  "Operations Management",
  "Six Sigma",
  "Lean Management",
  "Process Improvement",
  "Continuous Improvement",
  "Change Management",
  "Conflict Resolution",
  "Emotional Intelligence",
  "Interpersonal Skills",
  "Cultural Competence",
  "Communication Skills",
  "Active Listening",
  "Public Speaking",
  "Written Communication",
  "Presentation Skills",
  "Conflict Management",
  "Teamwork",
  "Adaptability",
  "Creativity",
  "Innovation",
  "Critical Thinking",
  "Analytical Skills",
  "Problem-Solving",
  "Decision-Making",
  "Strategic Thinking",
  "Attention to Detail",
  "Organizational Skills",
  "Time Management",
  "Prioritization",
  "Multitasking",
  "Self-Motivation",
  "Leadership",
  "Management",
  "Team Building",
  "Empathy",
  "Stress Management",
  "Resilience",
  "Networking",
  "Business Etiquette",
  "Digital Literacy",
  "Adaptability",
  "Learning Agility",
  "Problem-Solving",
  "Critical Thinking",
  "Emotional Intelligence",
  "Cultural Competence",
  "Resilience",
  "Teamwork",
  "Communication",
  "Creativity",
  "Leadership",
  "Time Management",
  "Decision-Making",
  "Adaptability",
  "Flexibility",
  "Entrepreneurship",
  "Sales",
  "Marketing",
  "Customer Service",
  "Finance",
  "Accounting",
  "Operations Management",
  "Supply Chain Management",
  "Human Resources Management",
  "Information Technology Management",
  "Risk Management",
  "Data Analysis",
  "Business Intelligence",
  "Strategy Development",
  "Change Management",
  "Innovation",
  "Stakeholder Management",
  "Public Speaking",
  "Negotiation",
  "Conflict Resolution",
  "Team Building",
  "Presentation Skills",
  "Decision-Making",
  "Problem-Solving",
  "Analytical Skills",
  "Attention to Detail",
  "Leadership",
  "Creativity",
  "Interpersonal Skills",
  "Time Management",
  "Organizational Skills",
  "Adaptability",
  "Collaboration",
  "Communication Skills",
  "Emotional Intelligence",
  "Technical Skills",
  "Agile Methodologies",
  "Scrum",
  "Kanban",
  "Waterfall Methodology",
  "Lean Six Sigma",
  "PRINCE2",
  "PMBOK",
  "Risk Management",
  "Quality Management",
  "Change Management",
  "Stakeholder Management",
  "Budget Management",
  "Schedule Management",
  "Scope Management",
  "Resource Management",
  "Communication Management",
  "Procurement Management",
  "Integration Management",
  "Leadership",
  "Team Management",
  "Conflict Resolution",
  "Decision-Making",
  "Problem-Solving",
  "Motivation",
  "Delegation",
  "Coaching and Mentoring",
  "Performance Management",
  "Empowerment",
  "Influence",
  "Change Management",
  "Strategic Planning",
  "Visionary Leadership",
  "Servant Leadership",
  "Authentic Leadership",
  "Transformational Leadership",
  "Transactional Leadership",
  "Situational Leadership",
  "Charismatic Leadership",
  "Cross-Cultural Leadership",
  "Adaptive Leadership",
  "Systems Leadership",
  "Community Leadership",
  "Environmental Leadership",
  "Educational Leadership",
  "Ethical Leadership",
  "Inclusive Leadership",
  "Agile Leadership",
  "Remote Leadership",
  "Digital Leadership",
  "Virtual Leadership",
  "Hybrid Leadership",
  "Distributed Leadership",
  "Dynamic Leadership",
  "Responsive Leadership",
  "Resilient Leadership",
  "Strategic Leadership",
  "Team Leadership",
  "Technical Leadership",
  "Creative Leadership",
  "Emotional Leadership",
  "Empathetic Leadership",
  "Global Leadership",
  "Innovative Leadership",
  "Transformational Leadership",
  "Visionary Leadership",
  "Inspirational Leadership",
  "Servant Leadership",
  "Ethical Leadership",
  "Collaborative Leadership",
  "Authentic Leadership",
  "Democratic Leadership",
  "Transactional Leadership",
  "Charismatic Leadership",
  "Situational Leadership",
  "Cultural Leadership",
  "Adaptive Leadership",
  "Change Leadership",
  "Resilient Leadership",
  "Thought Leadership",
  "Strategic Thinking",
  "Decision Making",
  "Problem Solving",
  "Analytical Thinking",
  "Creative Thinking",
  "Innovative Thinking",
  "Critical Thinking",
  "Systems Thinking",
  "Design Thinking",
  "Lateral Thinking",
  "Holistic Thinking",
  "Futuristic Thinking",
  "Risk Management",
  "Opportunity Identification",
  "Scenario Planning",
  "Change Management",
  "Strategic Planning",
  "Vision Development",
  "Goal Setting",
  "Performance Measurement",
  "Continuous Improvement",
  "Resource Allocation",
  "Adaptability",
  "Flexibility",
  "Resilience",
];

const gender = ["Please select", "He/Him", "She/Her", "They/Them", "Others"];

const industries = [
  "Please select",
  "IT Services and IT Consulting",
  "Hospital & Health Care",
  "Education Administration Programs",
  "Government Administration",
  "Advertising Services",
  "Accounting",
  "Oil & Gas",
  "Wellness & Fitness Services",
  "Food & Beverages Services",
  "Technology, Information and Internet",
  "Appliances, Electrical, and Electronics Manufacturing",
  "Business Consulting Services",
  "Primary and Secondary Education",
  "Transportation , Logistics , Supply Chain and Storage",
  "Retail Apparel and Fashion",
  "Food & Beverages Manufacturing",
  "Staffing and Recruiting",
  "Architecture & Planning",
  "Travel & Arrangement Services",
  "Armed Forces",
];

const allComments = [
  "Congratulations!",
  "Impressive achievement!",
  "Well deserved!",
  "Keep it up!",
  "Great job!",
  "Inspiring work!",
  "Bravo!",
  "Fantastic news!",
  "Well done!",
  "You rock!",
  "Kudos to you!",
  "Amazing accomplishment!",
  "Way to go!",
  "Outstanding work!",
  "Incredible job!",
  "Superb achievement!",
  "Proud of you!",
  "You're unstoppable!",
  "Keep shining!",
  "You're an inspiration!",
  "Top-notch work!",
  "Well earned!",
  "Terrific job!",
  "Exceptional work!",
  "Great work ethic!",
  "Keep succeeding!",
  "Phenomenal job!",
  "Fantastic effort!",
  "You're on fire!",
  "Well deserved recognition!",
];

const data = {
  qualifications: [
    "Bachelor's degree in Computer Science or related field",
    "5+ years of experience in software development",
    "Experience in building highly scalable, distributed systems",
    "Experience in building and operating microservices",
  ],
  responsibilities: [
    "Design, develop, test, deploy, maintain and improve software",
    "Manage individual project priorities, deadlines and deliverables",
    "Collaborate with other engineers and product managers to solve challenging problems",
    "Mentor junior engineers",
  ],
  benefits: [
    "Health insurance",
    "Paid time off",
    "Flexible schedule",
    "Work from home",
    "Parental leave",
  ],
};

const recommendedSearch = [
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Ethical Hacking",
  "Network Security",
  "Biomedical Engineering",
  "Medical Innovation",
  "Healthcare Technology",
  "Environmental Science",
  "Climate Change Research",
  "Robotics",
  "Automation",
  "Space Exploration",
  "Astrophysics",
  "Software Engineering",
  "Web Development",
  "Electrical Engineering",
  "Circuit Design",
  "Power Systems",
  "Blockchain Development",
  "Cryptocurrency",
  "Decentralization",
  "UX Design",
  "UI Design",
  "User Experience",
  "Quantum Physics",
  "Particle Physics",
  "Quantum Computing",
  "Neuroscience",
  "Genetics",
  "DNA Editing",
  "Renewable Energy",
  "Sustainability",
  "Software Development",
  "Marketing Manager",
  "San Francisco Bay Area",
  "Google",
  "Project Management",
  "Harvard University alumni",
  "Project Management Institute",
  "PMP certified",
  "Sustainable Energy",
  "Spanish language speakers",
  "Biotechnology",
  "Financial Analyst",
  "New York City",
  "Apple",
  "Data Analysis",
  "Stanford University graduates",
  "American Marketing Association",
  "CFA charterholder",
  "Blockchain Technology Enthusiasts",
  "French Translators",
  "Financial Services",
  "Software Engineer",
  "Los Angeles",
  "Microsoft",
  "Social Media Marketing",
  "MIT alumni",
  "Association of Chartered Certified Accountants",
  "AWS certified",
  "Artificial Intelligence",
  "Graphic Design",
  "London",
  "Facebook",
  "Product Management",
  "Yale University alumni",
  "Association for Computing Machinery",
  "CISSP certified",
  "Renewable Energy",
  "German language speakers",
  "Healthcare industry",
  "Chicago",
  "Amazon",
  "Content Writing",
  "Princeton University graduates",
  "Public Relations",
  "IEEE",
  "MBA graduates",
  "CEH certified",
  "Clean Technology",
  "Italian language speakers",
  "Telecommunications",
  "Boston",
  "Netflix",
  "Digital Marketing",
  "Columbia University alumni",
  "Society for Human Resource Management",
  "CCNA certified",
  "Green Technology",
  "Japanese language speakers",
  "E-commerce",
  "Philadelphia",
  "Tesla",
  "Search Engine Optimization",
  "Duke University alumni",
  "National Society of Professional Engineers",
  "CompTIA Security+ certified",
  "Smart Cities",
  "Chinese language speakers",
  "Startup Founders",
  "Austin",
  "Twitter",
  "Brand Management",
  "Cornell University alumni",
  "American Institute of Architects",
  "ITIL certified",
  "Renewable Resources",
  "Russian language speakers",
  "Venture Capitalists",
  "Seattle",
  "Uber",
  "Content Strategy",
  "Brown University alumni",
  "American Nurses Association",
  "Six Sigma certified",
  "Sustainable Development",
  "Portuguese language speakers",
  "Angel Investors",
  "Denver",
  "Airbnb",
  "Influencer Marketing",
  "University of California alumni",
  "American Bar Association",
  "Agile certified",
  "Clean Energy",
  "Korean language speakers",
  "Entrepreneurs",
  "Houston",
  "Snapchat",
  "Email Marketing",
  "University of Michigan alumni",
  "American Psychological Association",
  "Scrum certified",
  "Environmental Conservation",
  "Diversity and Inclusion",
  "Financial Planning",
  "Customer Relationship Management",
  "Harvard Business School alumni",
  "American Medical Association",
  "Digital Transformation",
  ...industries,
  ...skills
]


export { skills, industries, gender ,allComments , recommendedSearch};
