/**
 * Firebase User Service Implementation
 */

import { getDocs, getDoc, collection, doc, updateDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseconfig';
import { IUserService } from '../interface';
import { UserProfile, UserTaskRecord } from '../types';

export class FirebaseUserService implements IUserService {
  private readonly usersCollection = 'users';
  private readonly profilesCollection = 'profiles';
  private readonly userTasksCollection = 'user-task-info';

  // Cache for usernames to avoid repeated lookups
  private usernameCache: Map<string, string> = new Map();

  async getUsernameById(uid: string): Promise<string> {
    // Check cache first
    if (this.usernameCache.has(uid)) {
      return this.usernameCache.get(uid)!;
    }

    try {
      const docRef = doc(FIRESTORE_DB, this.usersCollection, uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return 'No Name';
      }

      const username = docSnap.data()?.username || 'No Name';
      this.usernameCache.set(uid, username);
      return username;
    } catch (error) {
      console.error('Error getting username:', error);
      return 'No Name';
    }
  }

  async getUsernamesByIds(uids: string[]): Promise<string[]> {
    try {
      const promises = uids.map((uid) => this.getUsernameById(uid));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error getting usernames:', error);
      throw error;
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(FIRESTORE_DB, this.profilesCollection, uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        username: data.username,
        bio: data.bio,
        role: data.role,
        vHours: data.vHours,
        actvDate: data.actvDate,
        actvDet: data.actvDet,
        actvLoc: data.actvLoc,
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    try {
      const querySnapshot = await getDocs(
        collection(FIRESTORE_DB, this.profilesCollection)
      );
      const profiles: UserProfile[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        profiles.push({
          id: doc.id,
          username: data.username,
          bio: data.bio,
          role: data.role,
          vHours: data.vHours,
          actvDate: data.actvDate,
          actvDet: data.actvDet,
          actvLoc: data.actvLoc,
        });
      });

      return profiles;
    } catch (error) {
      console.error('Error getting all profiles:', error);
      throw error;
    }
  }

  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(FIRESTORE_DB, this.profilesCollection, uid);
      await updateDoc(docRef, data as any);
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async addTaskToUserList(
    uid: string,
    taskId: string,
    taskData: UserTaskRecord
  ): Promise<void> {
    try {
      // Create or update parent document
      const userDocRef = doc(FIRESTORE_DB, this.userTasksCollection, uid);
      await setDoc(
        userDocRef,
        {
          userId: uid,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // Add task to subcollection
      const taskDocRef = doc(
        FIRESTORE_DB,
        `${this.userTasksCollection}/${uid}/user-tasks`,
        taskId
      );
      await setDoc(taskDocRef, taskData);

      console.log('Task added to user list successfully');
    } catch (error) {
      console.error('Error adding task to user list:', error);
      throw error;
    }
  }

  // Clear username cache (useful for testing or when data changes)
  clearCache(): void {
    this.usernameCache.clear();
  }
}
