/**
 * Firebase Database Service Implementation
 *
 * Concrete implementation of the database service using Firebase.
 */

import { IDatabaseService } from '../interface';
import { FirebaseGardenService } from './gardenService';
import { FirebaseTaskService } from './taskService';
import { FirebaseUserService } from './userService';
import { FirebaseStorageService } from './storageService';
import { FirebaseAuthService } from './authService';

class FirebaseDatabaseService implements IDatabaseService {
  gardens = new FirebaseGardenService();
  tasks = new FirebaseTaskService();
  users = new FirebaseUserService();
  storage = new FirebaseStorageService();
  auth = new FirebaseAuthService();
}

// Export singleton instance
export const firebaseDatabaseService = new FirebaseDatabaseService();
