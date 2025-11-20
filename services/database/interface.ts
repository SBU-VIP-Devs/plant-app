/**
 * Database Service Interface
 *
 * Defines the contract for all database operations.
 * Any database implementation (Firebase, MongoDB, PostgreSQL, etc.) must implement this interface.
 */

import {
  GardenData,
  TaskData,
  UserProfile,
  UserTaskRecord,
  CreateGardenInput,
  CreateTaskInput,
  UploadProgressCallback,
} from './types';

export interface IGardenService {
  // Create
  createGarden(gardenData: CreateGardenInput): Promise<string>; // Returns garden ID

  // Read
  getAllGardens(): Promise<GardenData[]>;
  getGardenById(gardenId: string): Promise<GardenData | null>;
}

export interface ITaskService {
  // Create
  createTask(gardenId: string, taskData: CreateTaskInput): Promise<string>; // Returns task ID

  // Read
  getTasksByGarden(gardenId: string): Promise<TaskData[]>;
  getTasksByStatus(gardenId: string, status: string[]): Promise<TaskData[]>;
  getTaskById(gardenId: string, taskId: string): Promise<TaskData | null>;

  // Update - Task Status
  updateTaskStatus(
    gardenId: string,
    taskId: string,
    status: 'open' | 'assigned' | 'approval' | 'completed'
  ): Promise<void>;

  // Update - User Arrays
  addUserToRequests(gardenId: string, taskId: string, uid: string): Promise<void>;
  removeUserFromRequests(gardenId: string, taskId: string, uid: string): Promise<void>;
  addUserToAssigned(gardenId: string, taskId: string, uid: string): Promise<void>;
  removeUserFromAssigned(gardenId: string, taskId: string, uid: string): Promise<void>;
  addUserToPending(gardenId: string, taskId: string, uid: string): Promise<void>;
  removeUserFromPending(gardenId: string, taskId: string, uid: string): Promise<void>;
  addUserToCompleted(gardenId: string, taskId: string, uid: string): Promise<void>;
  removeUserFromCompleted(gardenId: string, taskId: string, uid: string): Promise<void>;
}

export interface IUserService {
  // Read
  getUsernameById(uid: string): Promise<string>;
  getUsernamesByIds(uids: string[]): Promise<string[]>;
  getUserProfile(uid: string): Promise<UserProfile | null>;
  getAllProfiles(): Promise<UserProfile[]>;

  // Update
  updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void>;

  // User Task List
  addTaskToUserList(
    uid: string,
    taskId: string,
    taskData: UserTaskRecord
  ): Promise<void>;
}

export interface IStorageService {
  // Upload
  uploadImage(
    path: string,
    imageUri: string,
    onProgress?: UploadProgressCallback
  ): Promise<string>; // Returns download URL

  // Read
  getDownloadURL(path: string): Promise<string>;
}

export interface IAuthService {
  // Sign In/Out
  signIn(email: string, password: string): Promise<any>;
  signUp(email: string, password: string): Promise<any>;
  signOut(): Promise<void>;

  // Google Auth
  signInWithGoogleCredential(idToken: string): Promise<any>;

  // Current User
  getCurrentUser(): any;
  onAuthStateChanged(callback: (user: any) => void): () => void;
}

// Combined Database Service Interface
export interface IDatabaseService {
  gardens: IGardenService;
  tasks: ITaskService;
  users: IUserService;
  storage: IStorageService;
  auth: IAuthService;
}
