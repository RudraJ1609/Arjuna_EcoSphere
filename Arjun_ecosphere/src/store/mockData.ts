import {
  Department,
  Category,
  EmissionFactor,
  ProductESGProfile,
  EnvironmentalGoal,
  ESGPolicy,
  Badge,
  Reward,
  CarbonTransaction,
  CSRActivity,
  EmployeeParticipation,
  Challenge,
  ChallengeParticipation,
  PolicyAcknowledgement,
  Audit,
  ComplianceIssue,
  User,
  AppNotification
} from '../types';

export const initialUsers: User[] = [
  {
    id: 'u1',
    name: 'Sarah Jenkins',
    email: 'admin@ecosphere.com',
    role: 'admin',
    department: 'Corporate',
    xp: 2500,
    points: 1500,
    badges: ['b1', 'b2', 'b3'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'u2',
    name: 'Marcus Vance',
    email: 'manager@ecosphere.com',
    role: 'manager',
    department: 'Manufacturing',
    xp: 1200,
    points: 800,
    badges: ['b1', 'b4'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'u3',
    name: 'Aditi Rao',
    email: 'employee@ecosphere.com',
    role: 'user',
    department: 'Logistics',
    xp: 3910,
    points: 620,
    badges: ['b1', 'b2'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 'u4',
    name: 'Karan Shah',
    email: 'karan@ecosphere.com',
    role: 'user',
    department: 'Manufacturing',
    xp: 850,
    points: 310,
    badges: ['b1'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  }
];

export const initialDepartments: Department[] = [
  { id: 'd1', name: 'Manufacturing', code: 'MFG', head: 'Marcus Vance', parentDept: 'None', employeeCount: 134, status: 'Active' },
  { id: 'd2', name: 'Logistics', code: 'LOG', head: 'Elena Rostova', parentDept: 'Manufacturing', employeeCount: 58, status: 'Active' },
  { id: 'd3', name: 'Corporate', code: 'COR', head: 'Sarah Jenkins', parentDept: 'None', employeeCount: 41, status: 'Active' },
  { id: 'd4', name: 'Sales & Marketing', code: 'SLS', head: 'Diana Prince', parentDept: 'Corporate', employeeCount: 72, status: 'Active' },
  { id: 'd5', name: 'Research & Development', code: 'RND', head: 'Bruce Banner', parentDept: 'Corporate', employeeCount: 35, status: 'Active' }
];

export const initialCategories: Category[] = [
  { id: 'c1', name: 'Carbon Reduction', type: 'Challenge Category', status: 'Active' },
  { id: 'c2', name: 'Waste Management', type: 'Challenge Category', status: 'Active' },
  { id: 'c3', name: 'Community Outreach', type: 'CSR Activity', status: 'Active' },
  { id: 'c4', name: 'Employee Well-being', type: 'CSR Activity', status: 'Active' },
  { id: 'c5', name: 'Compliance & Auditing', type: 'CSR Activity', status: 'Active' }
];

export const initialEmissionFactors: EmissionFactor[] = [
  { id: 'ef1', activityType: 'Electricity Usage', unit: 'kWh', co2PerUnit: 0.45, source: 'EPA eGRID 2024' },
  { id: 'ef2', activityType: 'Natural Gas Combustion', unit: 'm3', co2PerUnit: 1.93, source: 'IPCC Guidelines Vol 2' },
  { id: 'ef3', activityType: 'Diesel Fleet Travel', unit: 'liters', co2PerUnit: 2.68, source: 'DEFRA Carbon Factors 2024' },
  { id: 'ef4', activityType: 'Waste Landfilling', unit: 'kg', co2PerUnit: 0.52, source: 'EPA WARM Model' },
  { id: 'ef5', activityType: 'Air Travel (Short Haul)', unit: 'passenger-km', co2PerUnit: 0.15, source: 'ICAO Carbon Calculator' },
  { id: 'ef6', activityType: 'Water Usage & Treatment', unit: 'm3', co2PerUnit: 0.34, source: 'Carbon Trust Standard' }
];

export const initialProductProfiles: ProductESGProfile[] = [
  { id: 'pp1', productName: 'EcoPack Shipping Box', category: 'Packaging', carbonFootprint: 0.24, recyclability: 100, esgRating: 'AAA' },
  { id: 'pp2', productName: 'GreenCap Container (Standard)', category: 'Containers', carbonFootprint: 1.15, recyclability: 85, esgRating: 'AA' },
  { id: 'pp3', productName: 'BioBottle 500ml', category: 'Beverage Bottles', carbonFootprint: 0.45, recyclability: 95, esgRating: 'AAA' },
  { id: 'pp4', productName: 'SustainaWrap Bubble Wrap', category: 'Packaging Material', carbonFootprint: 0.88, recyclability: 40, esgRating: 'BBB' },
  { id: 'pp5', productName: 'SolarCharge Power Bank v2', category: 'Electronics', carbonFootprint: 8.5, recyclability: 65, esgRating: 'A' },
  { id: 'pp6', productName: 'Recycled Fiber Cardboard Tube', category: 'Industrial Packaging', carbonFootprint: 0.32, recyclability: 98, esgRating: 'AA' }
];

export const initialGoals: EnvironmentalGoal[] = [
  { id: 'g1', name: 'Reduce Fleet Emissions', department: 'Logistics', targetCO2: 500, currentCO2: 390, deadline: '2026-12-31', status: 'Active' },
  { id: 'g2', name: 'Cut Packaging Waste', department: 'Manufacturing', targetCO2: 120, currentCO2: 98, deadline: '2026-09-30', status: 'On Track' },
  { id: 'g3', name: 'Office Energy Cut', department: 'Corporate', targetCO2: 80, currentCO2: 80, deadline: '2026-06-30', status: 'Completed' },
  { id: 'g4', name: 'R&D Lab Emissions Check', department: 'Research & Development', targetCO2: 150, currentCO2: 165, deadline: '2026-11-15', status: 'At Risk' },
  { id: 'g5', name: 'Reduce Water Footprint', department: 'Manufacturing', targetCO2: 300, currentCO2: 240, deadline: '2026-10-31', status: 'Active' }
];

export const initialPolicies: ESGPolicy[] = [
  { id: 'p1', title: 'Anti-Bribery & Corruption Policy', category: 'Governance Ethics', description: 'Rules governing zero-tolerance toward briberies, kickbacks, and inappropriate compliance gifts in corporate operations.', effectiveDate: '2024-01-15', status: 'Active' },
  { id: 'p2', title: 'Supplier Code of Conduct', category: 'Vendor Compliance', description: 'Requires all manufacturing and tier-1 materials suppliers to adhere strictly to human rights, safety standards, and ESG limits.', effectiveDate: '2024-06-01', status: 'Active' },
  { id: 'p3', title: 'Employee Equal Opportunity Directive', category: 'Social Inclusion', description: 'A strict policy ensuring fair hiring, equitable pay guidelines, non-discrimination, and balanced department diversity metrics.', effectiveDate: '2025-02-10', status: 'Active' },
  { id: 'p4', title: 'Zero-Waste Office Protocol', category: 'Environmental Ethics', description: 'Directives targeting 100% sorting of organic, plastic, and electronic office waste, alongside eliminating single-use materials.', effectiveDate: '2025-09-01', status: 'Draft' },
  { id: 'p5', title: 'Whistleblower Protection Policy', category: 'Internal Governance', description: 'Provides safe channels for employees to report financial or ESG-related violations anonymously without retribution fears.', effectiveDate: '2023-10-22', status: 'Active' }
];

export const initialBadges: Badge[] = [
  { id: 'b1', name: 'Green Beginner', description: 'Unlocked by logging into the platform and registering', unlockRule: 'XP >= 100', icon: 'Leaf' },
  { id: 'b2', name: 'Carbon Saver', description: 'Successfully join and complete a Carbon Reduction challenge', unlockRule: 'Completed Challenges >= 1', icon: 'ShieldCheck' },
  { id: 'b3', name: 'Sustainability Champion', description: 'Amass more than 2,000 XP points across multiple quarters', unlockRule: 'XP >= 2000', icon: 'Award' },
  { id: 'b4', name: 'Team Player', description: 'Participate and get approved in 2 corporate CSR activities', unlockRule: 'Approved CSR Activities >= 2', icon: 'Users' },
  { id: 'b5', name: 'Audit Master', description: 'Be named as an owner of a fully resolved Compliance Issue', unlockRule: 'Resolved Compliance Issues >= 1', icon: 'CheckSquare' }
];

export const initialRewards: Reward[] = [
  { id: 'r1', name: 'Eco Coffee Mug', description: 'Insulated bamboo fiber mug with an spill-proof wooden lid.', pointsRequired: 150, stock: 12, status: 'Active' },
  { id: 'r2', name: 'Solar Phone Charger', description: 'High-efficiency solar panel battery bank (10,000 mAh).', pointsRequired: 400, stock: 4, status: 'Active' },
  { id: 'r3', name: 'Plant-A-Tree Certificate', description: 'We will plant a native tree in your name in the regional reforestation drive.', pointsRequired: 100, stock: 999, status: 'Active' },
  { id: 'r4', name: 'Eco-friendly Canvas Backpack', description: 'Heavy-duty recycled organic cotton canvas with laptop compartment.', pointsRequired: 500, stock: 3, status: 'Active' },
  { id: 'r5', name: 'Organic Cotton Hoodie', description: 'Comfortable, carbon-neutral manufacturing hoodie with EcoSphere logo.', pointsRequired: 650, stock: 0, status: 'Out of Stock' }
];

export const initialCarbonTransactions: CarbonTransaction[] = [
  { id: 'ct1', department: 'Manufacturing', sourceType: 'Manufacturing', emissionFactorId: 'ef1', quantity: 24000, co2Calculated: 10800, date: '2026-07-01', autoGenerated: true },
  { id: 'ct2', department: 'Logistics', sourceType: 'Fleet', emissionFactorId: 'ef3', quantity: 8500, co2Calculated: 22780, date: '2026-07-02', autoGenerated: true },
  { id: 'ct3', department: 'Corporate', sourceType: 'Expense', emissionFactorId: 'ef1', quantity: 1500, co2Calculated: 675, date: '2026-07-03', autoGenerated: false },
  { id: 'ct4', department: 'Research & Development', sourceType: 'Purchase', emissionFactorId: 'ef4', quantity: 300, co2Calculated: 156, date: '2026-07-05', autoGenerated: false },
  { id: 'ct5', department: 'Manufacturing', sourceType: 'Purchase', emissionFactorId: 'ef2', quantity: 4500, co2Calculated: 8685, date: '2026-07-06', autoGenerated: true },
  { id: 'ct6', department: 'Logistics', sourceType: 'Fleet', emissionFactorId: 'ef3', quantity: 4100, co2Calculated: 10988, date: '2026-07-08', autoGenerated: true },
  { id: 'ct7', department: 'Sales & Marketing', sourceType: 'Expense', emissionFactorId: 'ef5', quantity: 12000, co2Calculated: 1800, date: '2026-07-10', autoGenerated: false }
];

export const initialCSRActivities: CSRActivity[] = [
  { id: 'csr1', title: 'Tree Plantation 2026', category: 'Community Outreach', description: 'Help plant 500 native saplings in the urban corridor to fight regional carbon emission spikes.', joinedCount: 24, evidenceRequired: true, status: 'Active', deadline: '2026-07-20' },
  { id: 'csr2', title: 'Corporate Blood Donation Drive', category: 'Employee Well-being', description: 'Partnering with Red Cross for our annual health and well-being community donation initiative.', joinedCount: 18, evidenceRequired: false, status: 'Active', deadline: '2026-07-25' },
  { id: 'csr3', title: 'Beach Clean-up Campaign', category: 'Community Outreach', description: 'Voluntary weekend marine waste sorting and beach plastic clean-up at Sunset Bay.', joinedCount: 31, evidenceRequired: true, status: 'Active', deadline: '2026-08-01' },
  { id: 'csr4', title: 'ESG Fundamentals Workshop', category: 'Compliance & Auditing', description: 'Learn ESG tracking systems, report generation tools, and corporate accountability policies.', joinedCount: 52, evidenceRequired: false, status: 'Active', deadline: '2026-07-15' },
  { id: 'csr5', title: 'E-Waste Recycling Initiative', category: 'Waste Management', description: 'Gathering old electronics from corporate and personal labs to safely extract metals and recycle plastic.', joinedCount: 12, evidenceRequired: true, status: 'Draft', deadline: '2026-08-15' }
];

export const initialEmployeeParticipations: EmployeeParticipation[] = [
  { id: 'ep1', employeeName: 'Aditi Rao', employeeEmail: 'employee@ecosphere.com', activityId: 'csr1', proofFile: 'photo.jpg', approvalStatus: 'Pending', pointsEarned: 50 },
  { id: 'ep2', employeeName: 'Karan Shah', employeeEmail: 'karan@ecosphere.com', activityId: 'csr4', proofFile: 'cert.pdf', approvalStatus: 'Approved', pointsEarned: 30, completionDate: '2026-07-10' },
  { id: 'ep3', employeeName: 'Aditi Rao', employeeEmail: 'employee@ecosphere.com', activityId: 'csr4', proofFile: 'cert.pdf', approvalStatus: 'Approved', pointsEarned: 30, completionDate: '2026-07-11' },
  { id: 'ep4', employeeName: 'Sarah Jenkins', employeeEmail: 'admin@ecosphere.com', activityId: 'csr2', approvalStatus: 'Approved', pointsEarned: 20, completionDate: '2026-07-09' }
];

export const initialChallenges: Challenge[] = [
  { id: 'ch1', title: 'Sustainability Sprint', category: 'Carbon Reduction', description: 'Ditch your personal car commute and log shared/transit travel for 10 straight business days.', xp: 200, difficulty: 'Hard', evidenceRequired: true, deadline: '2026-07-20', status: 'Active' },
  { id: 'ch2', title: 'Recycle Challenge', category: 'Waste Management', description: 'Commit to zero single-use plastic bottles this month. Carry your Eco mug and use filter points.', xp: 80, difficulty: 'Easy', evidenceRequired: false, deadline: '2026-07-22', status: 'Active' },
  { id: 'ch3', title: 'Commute Green Week', category: 'Carbon Reduction', description: 'Work from home or ride-share during the manufacturing peak grid load days.', xp: 120, difficulty: 'Medium', evidenceRequired: true, deadline: '2026-07-25', status: 'Draft' },
  { id: 'ch4', title: 'Paperless Office Month', category: 'Waste Management', description: 'Ensure all invoicing, custom orders, and reports are signed, filed, and processed digitally.', xp: 150, difficulty: 'Medium', evidenceRequired: false, deadline: '2026-07-31', status: 'Completed' },
  { id: 'ch5', title: 'LED Office Upgrade', category: 'Carbon Reduction', description: 'Submit diagnostic and support tickets to swap older incandescent bulbs with new custom LEDs.', xp: 100, difficulty: 'Easy', evidenceRequired: true, deadline: '2026-08-10', status: 'Under Review' }
];

export const initialChallengeParticipations: ChallengeParticipation[] = [
  { id: 'cp1', challengeId: 'ch1', employeeName: 'Aditi Rao', employeeEmail: 'employee@ecosphere.com', progress: 70, proofFile: 'transit_log.xlsx', approvalStatus: 'Pending', xpAwarded: 200 },
  { id: 'cp2', challengeId: 'ch2', employeeName: 'Karan Shah', employeeEmail: 'karan@ecosphere.com', progress: 100, approvalStatus: 'Approved', xpAwarded: 80 },
  { id: 'cp3', challengeId: 'ch4', employeeName: 'Aditi Rao', employeeEmail: 'employee@ecosphere.com', progress: 100, approvalStatus: 'Approved', xpAwarded: 150 }
];

export const initialPolicyAcknowledgements: PolicyAcknowledgement[] = [
  { id: 'pa1', policyId: 'p1', employeeName: 'Aditi Rao', employeeEmail: 'employee@ecosphere.com', acknowledgedDate: '2026-05-12', status: 'Acknowledged' },
  { id: 'pa2', policyId: 'p1', employeeName: 'Karan Shah', employeeEmail: 'karan@ecosphere.com', acknowledgedDate: '2026-06-01', status: 'Acknowledged' },
  { id: 'pa3', policyId: 'p2', employeeName: 'Aditi Rao', employeeEmail: 'employee@ecosphere.com', status: 'Pending' },
  { id: 'pa4', policyId: 'p2', employeeName: 'Karan Shah', employeeEmail: 'karan@ecosphere.com', acknowledgedDate: '2026-06-15', status: 'Acknowledged' },
  { id: 'pa5', policyId: 'p3', employeeName: 'Aditi Rao', employeeEmail: 'employee@ecosphere.com', status: 'Pending' }
];

export const initialAudits: Audit[] = [
  { id: 'au1', title: 'Q2 Waste Audit', department: 'Manufacturing', auditor: 'S. Nair', date: '2026-06-12', findings: '3 minor issues regarding non-labeled waste containers and recycling bins.', status: 'Completed' },
  { id: 'au2', title: 'Vendor Compliance Check', department: 'Logistics', auditor: 'R. Iyer', date: '2026-07-01', findings: '1 open issue regarding missing vendor proof for carbon neutral certificates.', status: 'Under Review' },
  { id: 'au3', title: 'Energy Efficiency Review', department: 'Corporate', auditor: 'A. Mehta', date: '2026-07-10', findings: 'Excellent compliance. Recommending solar panel expansion.', status: 'Pending' }
];

export const initialComplianceIssues: ComplianceIssue[] = [
  { id: 'ci1', auditId: 'au1', severity: 'High', description: 'Missing MSDS sheets in chemical sorting room.', owner: 'Marcus Vance', dueDate: '2026-07-01', status: 'Open' },
  { id: 'ci2', auditId: 'au2', severity: 'Medium', description: 'Late vendor disclosure of shipping emissions fuel data.', owner: 'Elena Rostova', dueDate: '2026-07-15', status: 'Open' },
  { id: 'ci3', auditId: 'au1', severity: 'Low', description: 'Scrap metal recycling bin placement is not marked.', owner: 'Marcus Vance', dueDate: '2026-06-30', status: 'Resolved' }
];

export const initialNotifications: AppNotification[] = [
  { id: 'n1', title: 'New Compliance Issue Raised', message: 'MSDS sheets are missing in Manufacturing. Action required by Marcus Vance.', type: 'compliance', read: false, date: '2026-07-01T10:30:00' },
  { id: 'n2', title: 'Policy Acknowledgement Required', message: 'You have been assigned to acknowledge the new Supplier Code of Conduct.', type: 'policy', read: false, date: '2026-07-02T11:00:00' },
  { id: 'n3', title: 'Challenge Approved!', message: 'Your participation in Recycle Challenge has been approved! +80 XP earned.', type: 'participation', read: true, date: '2026-07-05T14:22:00' },
  { id: 'n4', title: 'Badge Unlocked!', message: 'Congratulations! You unlocked the Carbon Saver badge.', type: 'badge', read: false, date: '2026-07-05T14:23:00' }
];
