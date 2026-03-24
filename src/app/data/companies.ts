import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export interface CompanyJob {
  id: string;
  title: string;
  location: string;
  type: string;
  postedAt: string;
  salary?: string;
}

export interface CompanyProject {
  id: string;
  title: string;
  status: 'Active' | 'Completed';
  postedAt: string;
  role?: string;
}

export type UpdateType = 'JOB_POST' | 'PROJECT_POST' | 'EVENT_POST' | 'COURSE_POST' | 'ANNOUNCEMENT';

export interface CompanyUpdate {
  id: string;
  type: UpdateType;
  title: string;
  content: string;
  timestamp: string;
  metadata?: {
    location?: string;
    salary?: string;
    date?: string;
  };
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  isVerified: boolean;
  isFollowed: boolean;
  size: string; // e.g. "50-200 employees"
  rating: number; // e.g. 4.5
  reviews: number; // e.g. 120
  stats: {
    activeJobs: number;
    activeProjects: number;
    followers: number;
  };
  jobs: CompanyJob[];
  projects: CompanyProject[];
  updates: CompanyUpdate[];
}

export const MOCK_COMPANIES: Company[] = [
  {
    id: "co1",
    name: "MindCare Clinic",
    logoUrl: "https://images.unsplash.com/photo-1704121112762-86661f0ae5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZW50YWwlMjBoZWFsdGglMjBjbGluaWMlMjBsb2dvJTIwYWJzdHJhY3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    industry: "Clinical Psychology",
    location: "Mumbai, MH",
    description: "MindCare Clinic is a premier mental health facility dedicated to providing evidence-based psychological services to children, adolescents, and adults. Our multidisciplinary team ensures holistic care.",
    website: "www.mindcare.com",
    isVerified: true,
    isFollowed: true,
    size: "50-100 employees",
    rating: 4.8,
    reviews: 124,
    stats: {
      activeJobs: 3,
      activeProjects: 1,
      followers: 1250
    },
    jobs: [
        { id: "j1", title: "Junior Child Psychologist", location: "Mumbai, MH", type: "Full-time", postedAt: "2 days ago", salary: "₹40k - ₹60k/mo" },
        { id: "j2", title: "Clinical Intern", location: "Mumbai, MH", type: "Internship", postedAt: "1 week ago", salary: "Unpaid" }
    ],
    projects: [
        { id: "pr1", title: "Adolescent Anxiety Research Study", status: "Active", postedAt: "1 month ago", role: "Research Assistant" }
    ],
    updates: [
        { 
          id: "u1", 
          type: "JOB_POST",
          title: "We are hiring: Junior Child Psychologist",
          content: "Join our expanding pediatric wing! We are looking for passionate child psychologists to work with our multidisciplinary team.", 
          timestamp: "2 days ago", 
          metadata: { location: "Mumbai, MH", salary: "₹40k - ₹60k/mo" }
        },
        { 
          id: "u2", 
          type: "EVENT_POST",
          title: "Mental Health Awareness Workshop",
          content: "Our annual mental health awareness workshop was a huge success. Thank you to all who participated. Next event coming soon!", 
          timestamp: "2 weeks ago"
        },
        {
          id: "u3",
          type: "ANNOUNCEMENT",
          title: "New Therapy Center Opening",
          content: "We are thrilled to announce the opening of our new therapy center in Bandra West.",
          timestamp: "1 month ago"
        }
    ]
  },
  {
    id: "co2",
    name: "Hope Foundation",
    logoUrl: "https://images.unsplash.com/photo-1723401697762-2909ec2b377d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub24lMjBwcm9maXQlMjBvcmdhbml6YXRpb24lMjBsb2dvJTIwaGVhcnR8ZW58MXx8fHwxNzY5NTgwODY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    industry: "NGO / Social Work",
    location: "Pune, MH",
    description: "Hope Foundation works towards bridging the gap in mental health accessibility in rural India. We focus on community-based interventions and awareness programs.",
    website: "www.hopefoundation.org",
    isVerified: true,
    isFollowed: true,
    size: "200-500 employees",
    rating: 4.6,
    reviews: 89,
    stats: {
      activeJobs: 5,
      activeProjects: 3,
      followers: 890
    },
    jobs: [
        { id: "j3", title: "Community Outreach Counselor", location: "Pune, MH", type: "Full-time", postedAt: "3 days ago", salary: "₹35k - ₹50k/mo" }
    ],
    projects: [
        { id: "pr2", title: "Rural Mental Health Survey", status: "Active", postedAt: "2 weeks ago", role: "Field Investigator" },
        { id: "pr3", title: "School Awareness Campaign", status: "Active", postedAt: "1 week ago", role: "Volunteer" }
    ],
    updates: [
       {
         id: "u4",
         type: "PROJECT_POST",
         title: "New Project: Rural Mental Health Survey",
         content: "We are launching a comprehensive survey to understand mental health needs in rural Maharashtra. Volunteers needed!",
         timestamp: "1 week ago",
         metadata: { location: "Rural Maharashtra" }
       },
       {
         id: "u5",
         type: "COURSE_POST",
         title: "Free Course: Community Counseling Basics",
         content: "Enroll in our free introductory course on community counseling techniques. Open to all psychology students.",
         timestamp: "3 days ago"
       }
    ]
  },
  {
    id: "co3",
    name: "Corporate Wellness Co",
    logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBsb2dvfGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    industry: "I/O Psychology",
    location: "Hyderabad, TS",
    description: "We help organizations build healthier, happier, and more productive workplaces through data-driven psychology solutions.",
    website: "www.corpwellness.io",
    isVerified: false,
    isFollowed: false,
    size: "10-50 employees",
    rating: 4.2,
    reviews: 45,
    stats: {
      activeJobs: 1,
      activeProjects: 0,
      followers: 450
    },
    jobs: [
        { id: "j4", title: "Industrial Psychologist", location: "Hyderabad, TS", type: "Full-time", postedAt: "5 days ago", salary: "₹60k - ₹90k/mo" }
    ],
    projects: [],
    updates: [
        { 
          id: "u6", 
          type: "ANNOUNCEMENT",
          title: "New Leadership",
          content: "Welcoming our new Chief People Officer, Dr. Rajesh Kumar!", 
          timestamp: "1 month ago" 
        }
    ]
  },
  {
    id: "co4",
    name: "NeuroCare Institute",
    logoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXVyb2xvZ3klMjBsb2dofGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    industry: "Neuropsychology",
    location: "Chennai, TN",
    description: "A leading research and treatment center for neurological and cognitive disorders.",
    website: "www.neurocare.in",
    isVerified: true,
    isFollowed: false,
    size: "500-1000 employees",
    rating: 4.9,
    reviews: 210,
    stats: {
      activeJobs: 2,
      activeProjects: 4,
      followers: 2100
    },
    jobs: [
         { id: "j5", title: "Neuropsychology Intern", location: "Chennai, TN", type: "Internship", postedAt: "1 day ago", salary: "₹15k - ₹25k/mo" }
    ],
    projects: [
        { id: "pr4", title: "Brain Mapping Study", status: "Active", postedAt: "3 weeks ago", role: "Data Analyst" }
    ],
    updates: []
  },
  {
      id: "co5",
      name: "EduSupport",
      logoUrl: "https://images.unsplash.com/photo-1541462608143-0af7558dc1e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsb2dvJTIwYWJzdHJhY3Q8ZW58MXx8fHwxNzY5NTgwODY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      industry: "School Psychology",
      location: "Delhi, NCR",
      description: "Partnering with schools to provide comprehensive student support services.",
      website: "www.edusupport.in",
      isVerified: false,
      isFollowed: false,
      size: "100-200 employees",
      rating: 4.4,
      reviews: 67,
      stats: {
          activeJobs: 4,
          activeProjects: 0,
          followers: 320
      },
      jobs: [
           { id: "j6", title: "School Counselor", location: "Delhi, NCR", type: "Full-time", postedAt: "1 week ago", salary: "₹50k - ₹70k/mo" }
      ],
      projects: [],
      updates: []
  }
];

export function getCompanyById(id: string): Company | undefined {
  return MOCK_COMPANIES.find(c => c.id === id);
}

/* ── Derived filter option lists ── */
export const COMPANY_INDUSTRIES = Array.from(
  new Set(MOCK_COMPANIES.map(c => c.industry))
).sort();

export const COMPANY_LOCATIONS = Array.from(
  new Set(MOCK_COMPANIES.map(c => c.location))
).sort();

export const COMPANY_SIZES = Array.from(
  new Set(MOCK_COMPANIES.map(c => c.size).filter(Boolean))
).sort();