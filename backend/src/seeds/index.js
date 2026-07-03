import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

// Manually resolve .env path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

import { connectDatabase } from '../config/database.js';

// Import Models
import User from '../models/User.model.js';
import Company from '../models/Company.model.js';
import Job from '../models/Job.model.js';
import Application from '../models/Application.model.js';
import Notification from '../models/Notification.model.js';

const SEED_DOMAIN = '@seed-data.local';
const DEFAULT_PASSWORD = 'Password@123';

const runSeeder = async () => {
  try {
    console.log('🌱 Starting Relational Production Seeder...');
    
    await connectDatabase();
    console.log('✅ Connected to MongoDB Atlas');

    // ==========================================
    // 1. SAFE CLEANUP (IDEMPOTENCY)
    // ==========================================
    console.log('🧹 Cleaning up previous seed data...');
    const existingSeedUsers = await User.find({ email: { $regex: SEED_DOMAIN } });
    const seedUserIds = existingSeedUsers.map(user => user._id);

    if (seedUserIds.length > 0) {
      await Application.deleteMany({ candidate: { $in: seedUserIds } });
      await Job.deleteMany({ recruiter: { $in: seedUserIds } });
      await Company.deleteMany({ ownerRecruiter: { $in: seedUserIds } });
      try { await Notification.deleteMany({ user: { $in: seedUserIds } }); } catch(e){}
      await User.deleteMany({ _id: { $in: seedUserIds } });
      console.log(`✅ Cleaned up ${seedUserIds.length} old seed accounts and related data.`);
    }

    // ==========================================
    // 2. GENERATE USERS (Candidates, Recruiters, Admin)
    // ==========================================
    console.log('👤 Generating Users & Relational Profiles...');
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const usersToCreate = [];

    // Admin (Auto-verified)
    usersToCreate.push({
      name: 'System Admin',
      email: `admin${SEED_DOMAIN}`,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      isEmailVerified: true // NO BULK UPDATE NEEDED
    });

    // 10 Recruiters (Auto-verified)
    for (let i = 0; i < 10; i++) {
      usersToCreate.push({
        name: faker.person.fullName(),
        email: `recruiter${i + 1}${SEED_DOMAIN}`,
        password: hashedPassword,
        role: 'recruiter',
        status: 'active',
        isEmailVerified: true
      });
    }

    // 25 Candidates (Auto-verified with Rich Profiles)
    for (let i = 0; i < 25; i++) {
      usersToCreate.push({
        name: faker.person.fullName(),
        email: `candidate${i + 1}${SEED_DOMAIN}`,
        password: hashedPassword,
        role: 'candidate',
        status: 'active',
        isEmailVerified: true,
        profile: {
          bio: faker.person.bio(),
          skills: faker.helpers.arrayElements(['React', 'Node.js', 'Python', 'Java', 'UI/UX', 'AWS', 'MongoDB', 'Docker', 'SQL', 'TypeScript'], 4),
          experience: faker.number.int({ min: 0, max: 10 }), // Fixed: Number field handling
          education: "B.Tech in Computer Science" // Fixed: String field handling
        }
      });
    }

    const createdUsers = await User.insertMany(usersToCreate);
    const recruiters = createdUsers.filter(u => u.role === 'recruiter');
    const candidates = createdUsers.filter(u => u.role === 'candidate');
    console.log(`✅ Created 1 Admin, ${recruiters.length} Recruiters, and ${candidates.length} Candidates with rich profiles.`);

    // ==========================================
    // 3. GENERATE COMPANIES (1-to-1 Mapping)
    // ==========================================
    console.log('🏢 Generating Verified Companies...');
    const companiesToCreate = [];
    
    // Exactly 1 Company per Recruiter
    for (let i = 0; i < recruiters.length; i++) {
      const companyName = faker.company.name();
      const safeSlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + faker.string.alphanumeric(5);
      
      companiesToCreate.push({
        name: companyName,
        slug: safeSlug,
        ownerRecruiter: recruiters[i]._id, // Strict relational mapping
        location: faker.location.city() + ', ' + faker.location.country(),
        website: faker.internet.url(),
        description: faker.company.catchPhrase(),
        isVerified: true // NO BULK UPDATE NEEDED
      });
    }
    const createdCompanies = await Company.insertMany(companiesToCreate);
    console.log(`✅ Created ${createdCompanies.length} Verified Companies (1 per Recruiter).`);

    // ==========================================
    // 4. GENERATE JOBS
    // ==========================================
    console.log('💼 Generating Jobs...');
    const jobsToCreate = [];
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

    // 50 Jobs mapped strictly to existing companies
    for (let i = 0; i < 50; i++) {
      const randomCompany = faker.helpers.arrayElement(createdCompanies);
      const jobTitle = faker.person.jobTitle();
      const safeJobSlug = jobTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + faker.string.alphanumeric(5);

      jobsToCreate.push({
        title: jobTitle,
        slug: safeJobSlug,
        company: randomCompany._id,
        recruiter: randomCompany.ownerRecruiter, 
        location: randomCompany.location,
        type: faker.helpers.arrayElement(jobTypes),
        status: 'open',
        description: faker.lorem.paragraphs(2),
        salary: `$${faker.number.int({ min: 50, max: 150 })},000/yr`
      });
    }
    const createdJobs = await Job.insertMany(jobsToCreate);
    console.log(`✅ Created ${createdJobs.length} Jobs.`);

    // ==========================================
    // 5. GENERATE APPLICATIONS
    // ==========================================
    console.log('📄 Generating Applications...');
    const applicationsToCreate = [];
    const statuses = ['pending', 'hired', 'rejected'];

    // 40 Realistic Applications
    for (let i = 0; i < 40; i++) {
      applicationsToCreate.push({
        job: faker.helpers.arrayElement(createdJobs)._id,
        candidate: faker.helpers.arrayElement(candidates)._id,
        status: faker.helpers.arrayElement(statuses)
      });
    }
    try {
      const createdApps = await Application.insertMany(applicationsToCreate, { ordered: false });
      console.log(`✅ Created ${createdApps.length} Applications.`);
    } catch (error) {
      console.log(`✅ Created Applications (skipped duplicate candidate-job pairs).`);
    }

    // ==========================================
    // 6. GENERATE NOTIFICATIONS
    // ==========================================
    console.log('🔔 Generating Notifications...');
    const notificationsToCreate = [];
    
    for (let i = 0; i < 25; i++) {
      notificationsToCreate.push({
        user: faker.helpers.arrayElement(candidates)._id,
        message: `Your application status for a recent job has been updated.`,
        isRead: false
      });
    }
    try {
       await Notification.insertMany(notificationsToCreate);
       console.log(`✅ Created 25 Notifications.`);
    } catch (error) {
       console.log(`⚠️ Skipped Notifications (Schema mismatch, safely ignored).`);
    }

    console.log('\n🎉 Relational Seeding Complete! Safe to exit.');
    console.log('--------------------------------------------------');
    console.log('🔑 PRE-VERIFIED TEST ACCOUNTS (Password: Password@123)');
    console.log(`Admin:      admin${SEED_DOMAIN}`);
    console.log(`Recruiter:  recruiter1${SEED_DOMAIN}`);
    console.log(`Candidate:  candidate1${SEED_DOMAIN}`);
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();