require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const Form = require('../models/Form');
const Submission = require('../models/Submission');

const FIRST_NAMES = ['Aarav', 'Diya', 'Zubair', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Priya', 'Karthik', 'Meera', 'Rahul', 'Pooja', 'Arjun', 'Divya', 'Siddharth', 'Nisha', 'Aditya', 'Tanvi', 'Varun', 'Rhea'];
const LAST_NAMES = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Iyer', 'Khan', 'Verma', 'Singh', 'Nair', 'Deshmukh', 'Chopra', 'Gupta', 'Menon', 'Joshi', 'Bose'];
const CITIES = ['Bangalore', 'Chennai', 'Mumbai', 'Hyderabad', 'Delhi', 'Pune', 'Kolkata', 'Coimbatore'];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const FORMS_DATA = [
  {
    name: 'Frontend Developer Hiring Application',
    description: 'Application form for Senior & Mid-level Frontend Engineers skilled in React, Redux, and modern web architectures.',
    fields: [
      { key: 'fullName', label: 'Candidate Full Name', type: 'text', required: true, order: 0 },
      { key: 'email', label: 'Email Address', type: 'email', required: true, order: 1 },
      { key: 'phone', label: 'Mobile Number', type: 'phone', required: true, order: 2 },
      { key: 'experience', label: 'Years of Experience', type: 'radio', required: true, options: ['0-1 Year', '2-4 Years', '5+ Years'], order: 3 },
      { key: 'skills', label: 'Core Technical Stack', type: 'checkbox', required: true, options: ['React.js', 'Redux Toolkit', 'TypeScript', 'Tailwind CSS', 'Next.js'], order: 4 },
      { key: 'portfolioUrl', label: 'GitHub or Portfolio Link', type: 'text', required: false, order: 5 },
      { key: 'noticePeriod', label: 'Notice Period (Days)', type: 'number', required: false, order: 6 },
    ],
  },
  {
    name: 'Customer Support Feedback Survey',
    description: 'Help us improve our service quality by rating your recent support interaction with our customer success team.',
    fields: [
      { key: 'customerName', label: 'Your Name', type: 'text', required: true, order: 0 },
      { key: 'email', label: 'Contact Email', type: 'email', required: true, order: 1 },
      { key: 'ticketNumber', label: 'Support Ticket ID', type: 'text', required: false, order: 2 },
      { key: 'rating', label: 'Satisfaction Rating', type: 'radio', required: true, options: ['5 - Outstanding', '4 - Good', '3 - Average', '2 - Poor', '1 - Unsatisfactory'], order: 3 },
      { key: 'category', label: 'Issue Category', type: 'select', required: true, options: ['Technical Glitch', 'Billing & Invoice', 'Account Access', 'Feature Request', 'Other'], order: 4 },
      { key: 'comments', label: 'Detailed Feedback / Suggestions', type: 'textarea', required: false, order: 5 },
    ],
  },
  {
    name: 'Product Feature Request Portal',
    description: 'Suggest improvements, missing features, and enhancements for our platform.',
    fields: [
      { key: 'requesterName', label: 'Full Name', type: 'text', required: true, order: 0 },
      { key: 'requesterEmail', label: 'Email', type: 'email', required: true, order: 1 },
      { key: 'featureTitle', label: 'Feature Title', type: 'text', required: true, order: 2 },
      { key: 'urgency', label: 'Priority / Impact', type: 'radio', required: true, options: ['Critical (Blocker)', 'High (Major Boost)', 'Medium (Nice to have)', 'Low (Cosmetic)'], order: 3 },
      { key: 'affectedModules', label: 'Modules Impacted', type: 'checkbox', required: false, options: ['Form Builder', 'Submissions Table', 'User Authentication', 'API Integrations', 'File Uploads'], order: 4 },
      { key: 'detailedDescription', label: 'Detailed Description & Use Case', type: 'textarea', required: true, order: 5 },
    ],
  },
  {
    name: 'Annual Tech Conference 2026 Registration',
    description: 'Reserve your pass for the premier full-stack developer summit. Limited seats available.',
    fields: [
      { key: 'attendeeName', label: 'Attendee Name', type: 'text', required: true, order: 0 },
      { key: 'attendeeEmail', label: 'Official Work Email', type: 'email', required: true, order: 1 },
      { key: 'contactPhone', label: 'Contact Mobile', type: 'phone', required: true, order: 2 },
      { key: 'passType', label: 'Ticket Pass Type', type: 'select', required: true, options: ['All-Access VIP', 'Standard Conference Pass', 'Virtual Stream Pass', 'Student Pass'], order: 3 },
      { key: 'dietary', label: 'Dietary Preference', type: 'radio', required: false, options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'], order: 4 },
      { key: 'workshopTracks', label: 'Interested Workshop Tracks', type: 'checkbox', required: false, options: ['React & Redux Deep Dive', 'Distributed Systems & Queues', 'Database Sharding & MongoDB', 'Cloud Native DevOps'], order: 5 },
    ],
  },
  {
    name: 'Employee Monthly Performance Evaluation',
    description: 'Internal evaluation review form for team leads and managerial assessment.',
    fields: [
      { key: 'employeeName', label: 'Employee Name', type: 'text', required: true, order: 0 },
      { key: 'employeeId', label: 'Employee ID', type: 'text', required: true, order: 1 },
      { key: 'department', label: 'Department', type: 'select', required: true, options: ['Engineering', 'Design', 'Product Management', 'Quality Assurance', 'Human Resources', 'Sales & Marketing'], order: 2 },
      { key: 'performanceGrade', label: 'Overall Performance Rating', type: 'radio', required: true, options: ['Exceeds Expectations (A+)', 'Meets All Expectations (A)', 'Needs Improvement (B)', 'Unsatisfactory (C)'], order: 3 },
      { key: 'keyAchievements', label: 'Key Milestones & Achievements', type: 'textarea', required: true, order: 4 },
      { key: 'goalsForNextQuarter', label: 'Goals & Targets for Next Quarter', type: 'textarea', required: false, order: 5 },
    ],
  },
  {
    name: 'Patient Health Consultation Intake',
    description: 'Confidential clinical intake form prior to physician video consultation or in-person checkup.',
    fields: [
      { key: 'patientName', label: 'Patient Full Name', type: 'text', required: true, order: 0 },
      { key: 'patientEmail', label: 'Email', type: 'email', required: true, order: 1 },
      { key: 'patientMobile', label: 'Mobile Number', type: 'phone', required: true, order: 2 },
      { key: 'dob', label: 'Date of Birth', type: 'date', required: true, order: 3 },
      { key: 'bloodGroup', label: 'Blood Group', type: 'select', required: true, options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], order: 4 },
      { key: 'preExistingConditions', label: 'Known Conditions', type: 'checkbox', required: false, options: ['Hypertension', 'Diabetes', 'Asthma', 'Allergies', 'None'], order: 5 },
      { key: 'symptoms', label: 'Primary Symptoms & Chief Complaint', type: 'textarea', required: true, order: 6 },
    ],
  },
  {
    name: 'Enterprise IT Asset Request Form',
    description: 'Request company hardware, software subscriptions, laptops, and peripheral development equipment.',
    fields: [
      { key: 'employeeName', label: 'Full Name', type: 'text', required: true, order: 0 },
      { key: 'workEmail', label: 'Work Email Address', type: 'email', required: true, order: 1 },
      { key: 'assetCategory', label: 'Primary Hardware Requested', type: 'radio', required: true, options: ['MacBook Pro 16" M3 Max', 'Dell XPS 15 (Linux/Windows)', 'Dual 4K Monitor Setup', 'Ergonomic Standing Desk Set'], order: 2 },
      { key: 'softwareLicenses', label: 'Software Licenses Needed', type: 'checkbox', required: false, options: ['JetBrains All-Products', 'GitHub Copilot Enterprise', 'Figma Pro License', 'Postman Enterprise', 'Docker Desktop Pro'], order: 3 },
      { key: 'shippingAddress', label: 'Home Delivery Address (Remote Work)', type: 'textarea', required: true, order: 4 },
    ],
  },
  {
    name: 'Real Estate Property Inquiry Form',
    description: 'Submit your requirements for commercial, residential, or land investment properties.',
    fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', required: true, order: 0 },
      { key: 'contactEmail', label: 'Email Address', type: 'email', required: true, order: 1 },
      { key: 'phone', label: 'Phone Number', type: 'phone', required: true, order: 2 },
      { key: 'propertyType', label: 'Property Type', type: 'select', required: true, options: ['Luxury High-Rise Apartment', 'Gated Community Villa', 'Commercial Office Space', 'Retail Storefront Plot'], order: 3 },
      { key: 'budgetRange', label: 'Expected Budget Range', type: 'radio', required: true, options: ['$100k - $250k', '$250k - $500k', '$500k - $1M', '$1M+ Luxury Tier'], order: 4 },
      { key: 'preferredLocations', label: 'Target City / Locations', type: 'checkbox', required: false, options: ['Downtown Metro', 'Tech Corridor Suburbs', 'Beachfront District', 'Airport Expressway'], order: 5 },
    ],
  },
  {
    name: 'Vendor Onboarding & KYC Registration',
    description: 'Official corporate vendor registration for supply chain partners, contractors, and agencies.',
    fields: [
      { key: 'companyName', label: 'Registered Business Name', type: 'text', required: true, order: 0 },
      { key: 'authorizedRepresentative', label: 'Authorized Signatory Name', type: 'text', required: true, order: 1 },
      { key: 'officialEmail', label: 'Corporate Billing Email', type: 'email', required: true, order: 2 },
      { key: 'contactNumber', label: 'Corporate Phone', type: 'phone', required: true, order: 3 },
      { key: 'vendorCategory', label: 'Vendor Category', type: 'select', required: true, options: ['Software & IT Services', 'Logistics & Transportation', 'Raw Materials Supplier', 'Facility Management', 'Legal & Financial Advisory'], order: 4 },
      { key: 'taxId', label: 'Federal Tax ID / GSTIN Number', type: 'text', required: true, order: 5 },
      { key: 'paymentTerms', label: 'Agreed Payment Terms', type: 'radio', required: true, options: ['Net 15 Days', 'Net 30 Days', 'Net 45 Days', 'Immediate Advance'], order: 6 },
    ],
  },
  {
    name: 'Campus Placement & Internship Registration 2026',
    description: 'Registration form for graduating college seniors applying for Summer 2026 engineering internships.',
    fields: [
      { key: 'studentName', label: 'Student Full Name', type: 'text', required: true, order: 0 },
      { key: 'collegeEmail', label: 'University Student Email', type: 'email', required: true, order: 1 },
      { key: 'mobile', label: 'Mobile Number', type: 'phone', required: true, order: 2 },
      { key: 'degree', label: 'Degree & Major', type: 'select', required: true, options: ['B.Tech Computer Science', 'B.Tech Information Technology', 'B.E. Electronics & Communication', 'M.Tech / M.S. Software Systems', 'BCA / MCA'], order: 3 },
      { key: 'gpa', label: 'Cumulative CGPA / Percentage', type: 'number', required: true, order: 4 },
      { key: 'preferredRole', label: 'Desired Internship Track', type: 'radio', required: true, options: ['Full Stack Web Development', 'Backend & Cloud Infrastructure', 'Data Engineering & ML', 'Mobile App Development (iOS/Android)'], order: 5 },
      { key: 'githubProfile', label: 'GitHub Profile or Projects URL', type: 'text', required: false, order: 6 },
    ],
  },
];

const generateSampleValue = (field, index) => {
  const firstName = rand(FIRST_NAMES);
  const lastName = rand(LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  const emailName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(10, 99)}`;

  switch (field.type) {
    case 'text':
      if (field.key.toLowerCase().includes('name')) return fullName;
      if (field.key.toLowerCase().includes('id') || field.key.toLowerCase().includes('ticket')) return `TICKET-${randInt(1000, 9999)}`;
      if (field.key.toLowerCase().includes('tax')) return `GSTIN-${randInt(100000, 999999)}`;
      if (field.key.toLowerCase().includes('url') || field.key.toLowerCase().includes('github')) return `https://github.com/${emailName}`;
      return `Sample ${field.label} entry #${index + 1}`;

    case 'email':
      return `${emailName}@example.com`;

    case 'phone':
      return `+91 9${randInt(100000000, 999999999)}`;

    case 'number':
      if (field.key.toLowerCase().includes('gpa')) return Number((Math.random() * 2 + 7.5).toFixed(2));
      if (field.key.toLowerCase().includes('notice')) return rand([15, 30, 60, 90]);
      return randInt(1, 100);

    case 'date':
      const year = randInt(1985, 2004);
      const month = String(randInt(1, 12)).padStart(2, '0');
      const day = String(randInt(1, 28)).padStart(2, '0');
      return `${year}-${month}-${day}`;

    case 'radio':
    case 'select':
      return field.options && field.options.length > 0 ? rand(field.options) : 'Option 1';

    case 'checkbox':
      if (field.options && field.options.length > 0) {
        const count = randInt(1, Math.min(3, field.options.length));
        const shuffled = [...field.options].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      }
      return ['General'];

    case 'textarea':
      return `Detailed response submitted for ${field.label}. High priority request covering operational requirements and technical workflows.`;

    case 'file':
      return `uploads/sample-document-${randInt(1000, 9999)}.pdf`;

    default:
      return `Entry ${index + 1}`;
  }
};

const seedTenFormsAndFiftySubmissions = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('[Seeder] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
    console.log('[Seeder] Connected to MongoDB Atlas successfully.');

    let totalFormsCreated = 0;
    let totalSubmissionsCreated = 0;

    for (let fIdx = 0; fIdx < FORMS_DATA.length; fIdx++) {
      const formData = FORMS_DATA[fIdx];
      
      // Check if form with this name already exists
      let form = await Form.findOne({ name: formData.name });
      if (!form) {
        form = await Form.create({
          name: formData.name,
          description: formData.description,
          status: 'published',
          fields: formData.fields,
          submissionsCount: 0,
        });
        console.log(`[Seeder] Created Form #${fIdx + 1}: "${form.name}" (Slug: ${form.slug})`);
        totalFormsCreated++;
      } else {
        console.log(`[Seeder] Form #${fIdx + 1} already exists: "${form.name}" (Slug: ${form.slug})`);
      }

      // Check current submissions count for this form
      const existingCount = await Submission.countDocuments({ formId: form._id });
      const neededSubmissions = Math.max(0, 50 - existingCount);

      if (neededSubmissions > 0) {
        console.log(`[Seeder] Generating ${neededSubmissions} submissions for "${form.name}"...`);
        const submissionsBatch = [];

        for (let sIdx = 0; sIdx < neededSubmissions; sIdx++) {
          const submissionPayload = {};
          form.fields.forEach((field) => {
            submissionPayload[field.key] = generateSampleValue(field, sIdx);
          });

          const createdDaysAgo = randInt(0, 30);
          const submittedAtDate = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000 - randInt(100, 50000) * 1000);

          submissionsBatch.push({
            formId: form._id,
            data: submissionPayload,
            metadata: {
              ipAddress: `${randInt(100, 220)}.${randInt(10, 200)}.${randInt(1, 250)}.${randInt(1, 250)}`,
              userAgent: rand([
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              ]),
              submittedAt: submittedAtDate,
            },
            createdAt: submittedAtDate,
            updatedAt: submittedAtDate,
          });
        }

        await Submission.insertMany(submissionsBatch);
        totalSubmissionsCreated += neededSubmissions;

        const updatedCount = await Submission.countDocuments({ formId: form._id });
        await Form.findByIdAndUpdate(form._id, { submissionsCount: updatedCount });
        console.log(`[Seeder] Form "${form.name}" now has ${updatedCount} submissions.`);
      } else {
        console.log(`[Seeder] Form "${form.name}" already has ${existingCount} submissions. Skipping.`);
      }
    }

    console.log('\n=============================================');
    console.log(`🎉 COMPLETED SUCCESSFULLY!`);
    console.log(`Total 10 Forms Ready in MongoDB Atlas.`);
    console.log(`Each Form has 50 Real Submissions (Total 500 Submissions).`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

seedTenFormsAndFiftySubmissions();
