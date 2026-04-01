const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'jobportal.db'))

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company_logo_url TEXT,
    employment_type TEXT,
    job_description TEXT,
    location TEXT,
    package_per_annum TEXT,
    salary_value INTEGER DEFAULT 0,
    rating REAL,
    company_url TEXT
  );

  CREATE TABLE IF NOT EXISTS similar_jobs (
    id TEXT PRIMARY KEY,
    job_id TEXT,
    title TEXT,
    company_logo_url TEXT,
    employment_type TEXT,
    job_description TEXT,
    location TEXT,
    rating REAL,
    FOREIGN KEY(job_id) REFERENCES jobs(id)
  );
`)

// Add salary_value column if it doesn't exist (migration for existing DBs)
try {
  db.exec(`ALTER TABLE jobs ADD COLUMN salary_value INTEGER DEFAULT 0`)
  console.log('✅ Added salary_value column to jobs table')
} catch (e) {
  // Column already exists — that's fine
}

// Seed jobs data if not already seeded
const jobCount = db.prepare('SELECT COUNT(*) as count FROM jobs').get()

if (jobCount.count === 0) {
  const insertJob = db.prepare(`
    INSERT INTO jobs (id, title, company_logo_url, employment_type, job_description, location, package_per_annum, salary_value, rating, company_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertSimilar = db.prepare(`
    INSERT INTO similar_jobs (id, job_id, title, company_logo_url, employment_type, job_description, location, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  // salary_value = minimum LPA * 100000 (in rupees)
  const jobs = [
    {
      id: 'bb95e51b-b1b2-4d97-bee4-1d5ec2b96751',
      title: 'React JS Developer',
      company_logo_url: 'https://assets.ccbp.in/frontend/react-js/jobber-company-logo-img.png',
      employment_type: 'Full Time',
      job_description: 'We are looking for an experienced React.js developer to join our team. You will be responsible for building scalable and high-performance applications.',
      location: 'Bangalore',
      package_per_annum: '10 LPA - 15 LPA',
      salary_value: 1000000, // 10 LPA
      rating: 4,
      company_url: 'https://www.jobber.com/',
    },
    {
      id: '74314819-9c69-4b1a-b855-80f555dc5a13',
      title: 'Backend Developer',
      company_logo_url: 'https://assets.ccbp.in/frontend/react-js/netflix-img.png',
      employment_type: 'Full Time',
      job_description: 'Looking for a Node.js backend developer with solid experience in REST API development, database design (PostgreSQL or MongoDB), and cloud deployments.',
      location: 'Hyderabad',
      package_per_annum: '15 LPA - 20 LPA',
      salary_value: 1500000, // 15 LPA
      rating: 4.5,
      company_url: 'https://www.netflix.com/',
    },
    {
      id: 'a9c10a45-7b8c-47d2-9185-8d9e59c2e70a',
      title: 'Full Stack Developer',
      company_logo_url: 'https://assets.ccbp.in/frontend/react-js/insta-commerce-img.png',
      employment_type: 'Part Time',
      job_description: 'We need a full-stack developer who is comfortable working on both the frontend (React) and backend (Node/Express). Experience with SQL databases is a big plus.',
      location: 'Chennai',
      package_per_annum: '8 LPA - 12 LPA',
      salary_value: 800000, // 8 LPA
      rating: 3.8,
      company_url: 'https://www.instagram.com/',
    },
    {
      id: 'b41ea9dc-4b5f-4ee1-b025-012f07a04d37',
      title: 'UI/UX Designer',
      company_logo_url: 'https://assets.ccbp.in/frontend/react-js/jobber-company-logo-img.png',
      employment_type: 'Freelance',
      job_description: 'We are looking for a creative UI/UX designer who can design world-class interfaces. You should have experience with Figma, Adobe XD, and basic knowledge of HTML/CSS.',
      location: 'Remote',
      package_per_annum: '6 LPA - 10 LPA',
      salary_value: 600000, // 6 LPA
      rating: 4.2,
      company_url: 'https://www.dribbble.com/',
    },
    {
      id: 'c44d55e2-5fe3-4b8a-a9b7-1d4c28d0d9f2',
      title: 'DevOps Engineer',
      company_logo_url: 'https://assets.ccbp.in/frontend/react-js/netflix-img.png',
      employment_type: 'Full Time',
      job_description: 'We are seeking a DevOps engineer to manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure. AWS and Docker experience required.',
      location: 'Pune',
      package_per_annum: '18 LPA - 25 LPA',
      salary_value: 1800000, // 18 LPA
      rating: 4.7,
      company_url: 'https://www.aws.amazon.com/',
    },
    {
      id: 'd55f66c3-6ef4-4c9b-b0b8-2e5d39e1e0a3',
      title: 'Data Scientist Intern',
      company_logo_url: 'https://assets.ccbp.in/frontend/react-js/insta-commerce-img.png',
      employment_type: 'Internship',
      job_description: 'Exciting internship opportunity for a data science student. You will work on real machine learning models, data processing pipelines, and visualization dashboards.',
      location: 'Mumbai',
      package_per_annum: '4 LPA - 6 LPA',
      salary_value: 400000, // 4 LPA
      rating: 3.5,
      company_url: 'https://www.kaggle.com/',
    },
  ]

  for (const job of jobs) {
    insertJob.run(
      job.id, job.title, job.company_logo_url, job.employment_type,
      job.job_description, job.location, job.package_per_annum,
      job.salary_value, job.rating, job.company_url,
    )
  }

  // Seed similar jobs
  const similarJobs = [
    {id: 'sim1', job_id: 'bb95e51b-b1b2-4d97-bee4-1d5ec2b96751', title: 'Frontend Developer', logo: 'https://assets.ccbp.in/frontend/react-js/netflix-img.png', type: 'Full Time', desc: 'Work on building modern frontend applications using React.', location: 'Delhi', rating: 3.5},
    {id: 'sim2', job_id: 'bb95e51b-b1b2-4d97-bee4-1d5ec2b96751', title: 'Vue.js Developer', logo: 'https://assets.ccbp.in/frontend/react-js/insta-commerce-img.png', type: 'Part Time', desc: 'Build and maintain Vue.js applications.', location: 'Bangalore', rating: 4},
    {id: 'sim3', job_id: '74314819-9c69-4b1a-b855-80f555dc5a13', title: 'Node.js Engineer', logo: 'https://assets.ccbp.in/frontend/react-js/jobber-company-logo-img.png', type: 'Full Time', desc: 'Design and implement backend services.', location: 'Hyderabad', rating: 4},
    {id: 'sim4', job_id: 'a9c10a45-7b8c-47d2-9185-8d9e59c2e70a', title: 'React Native Developer', logo: 'https://assets.ccbp.in/frontend/react-js/netflix-img.png', type: 'Full Time', desc: 'Develop mobile apps using React Native.', location: 'Pune', rating: 3.9},
  ]

  for (const s of similarJobs) {
    insertSimilar.run(s.id, s.job_id, s.title, s.logo, s.type, s.desc, s.location, s.rating)
  }

  console.log('✅ Database seeded with 6 jobs and similar jobs!')
} else {
  // Update salary_value for existing jobs (fix existing data)
  const updates = [
    {id: 'bb95e51b-b1b2-4d97-bee4-1d5ec2b96751', salary_value: 1000000},
    {id: '74314819-9c69-4b1a-b855-80f555dc5a13', salary_value: 1500000},
    {id: 'a9c10a45-7b8c-47d2-9185-8d9e59c2e70a', salary_value: 800000},
    {id: 'b41ea9dc-4b5f-4ee1-b025-012f07a04d37', salary_value: 600000},
    {id: 'c44d55e2-5fe3-4b8a-a9b7-1d4c28d0d9f2', salary_value: 1800000},
    {id: 'd55f66c3-6ef4-4c9b-b0b8-2e5d39e1e0a3', salary_value: 400000},
  ]
  const updateStmt = db.prepare('UPDATE jobs SET salary_value = ? WHERE id = ?')
  for (const u of updates) {
    updateStmt.run(u.salary_value, u.id)
  }
  console.log('✅ Updated salary_value for all existing jobs!')
}

module.exports = db
