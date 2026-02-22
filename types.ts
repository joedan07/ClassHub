
export enum UserRole {
  STUDENT = 'STUDENT',
  CR = 'CR',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pendingRole?: UserRole;
  classCode: string;
  isApproved: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  assignedDate: string;
  deadlineDate: string;
  professor: string;
  fileUrl?: string;
  submissionLink?: string;
  completed: boolean;
  tags: string[];
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  fileUrl: string;
  uploadDate: string;
  tags: string[];
}

export interface Update {
  id: string;
  author: string;
  authorRole: UserRole;
  content: string;
  timestamp: string;
  importance: 'LOW' | 'MEDIUM' | 'URGENT';
}

export interface SyllabusItem {
  id: string;
  subject: string;
  topics: { name: string; completed: boolean }[];
}
