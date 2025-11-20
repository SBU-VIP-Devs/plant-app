/**
 * Database Types
 *
 * Defines all data structures used throughout the application.
 * These types are database-agnostic and represent the domain models.
 */

export interface GardenData {
  id: string;
  imageURL: string | null;
  createdAt: string; // ISO string
  gardenName: string;
  desc: string;
  username: string;
  userId: string | null;
  roles: { [userId: string]: string }; // e.g., { "uid": "admin" }
  userImage?: string;
}

export interface TaskData {
  id: string;
  taskName: string;
  taskTime: string; // "ISO_DATE ISO_DATE" format
  desc: string;
  location: string;
  gardenId: string;
  username: string;
  uidAssigned: string[];
  uidRequests: string[];
  uidPendingApproval: string[];
  uidCompleted: string[];
  taskStatus?: 'open' | 'assigned' | 'approval' | 'completed';
}

export interface UserProfile {
  id: string;
  username?: string;
  bio?: string;
  role?: string[];
  vHours?: number;
  actvDate?: string;
  actvDet?: string;
  actvLoc?: string;
}

export interface UserTaskRecord {
  taskId: string;
  gardenId: string;
  taskCreator: string;
  taskDesc: string;
  taskEndTime: string;
  taskIsDone: boolean;
  taskLocation: string;
  taskName: string;
  taskStartTime: string;
  uidAssigned: string[];
}

export interface CreateGardenInput {
  imageURL: string | null;
  createdAt: string;
  gardenName: string;
  desc: string;
  username: string;
  userId: string | null;
  roles: { [userId: string]: string } | null;
}

export interface CreateTaskInput {
  taskName: string;
  taskTime: string;
  desc: string;
  location: string;
  gardenId: string;
  username: string;
  uidAssigned: string[];
  uidRequests: string[];
  uidPendingApproval: string[];
  uidCompleted: string[];
  taskStatus: 'open' | 'assigned' | 'approval' | 'completed';
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

export type UploadProgressCallback = (progress: UploadProgress) => void;
