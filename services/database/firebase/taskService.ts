/**
 * Firebase Task Service Implementation
 */

import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseconfig';
import { ITaskService } from '../interface';
import { TaskData, CreateTaskInput } from '../types';

export class FirebaseTaskService implements ITaskService {
  private readonly collectionName = 'garden-post-info';

  private getTasksCollection(gardenId: string) {
    return collection(
      FIRESTORE_DB,
      `${this.collectionName}/${gardenId}/garden-tasks`
    );
  }

  private getTaskDoc(gardenId: string, taskId: string) {
    return doc(
      FIRESTORE_DB,
      `${this.collectionName}/${gardenId}/garden-tasks/${taskId}`
    );
  }

  async createTask(gardenId: string, taskData: CreateTaskInput): Promise<string> {
    try {
      const docRef = await addDoc(this.getTasksCollection(gardenId), taskData);
      console.log('Task created successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async getTasksByGarden(gardenId: string): Promise<TaskData[]> {
    try {
      const querySnapshot = await getDocs(this.getTasksCollection(gardenId));
      const tasks: TaskData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          taskName: data.taskName,
          taskTime: data.taskTime,
          desc: data.desc,
          location: data.location,
          gardenId: data.gardenId,
          username: data.username,
          uidAssigned: data.uidAssigned || [],
          uidRequests: data.uidRequests || [],
          uidPendingApproval: data.uidPendingApproval || [],
          uidCompleted: data.uidCompleted || [],
          taskStatus: data.taskStatus || 'open',
        });
      });

      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  async getTasksByStatus(gardenId: string, statuses: string[]): Promise<TaskData[]> {
    try {
      const allTasks = await this.getTasksByGarden(gardenId);
      return allTasks.filter((task) => statuses.includes(task.taskStatus || 'open'));
    } catch (error) {
      console.error('Error getting tasks by status:', error);
      throw error;
    }
  }

  async getTaskById(gardenId: string, taskId: string): Promise<TaskData | null> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        taskName: data.taskName,
        taskTime: data.taskTime,
        desc: data.desc,
        location: data.location,
        gardenId: data.gardenId,
        username: data.username,
        uidAssigned: data.uidAssigned || [],
        uidRequests: data.uidRequests || [],
        uidPendingApproval: data.uidPendingApproval || [],
        uidCompleted: data.uidCompleted || [],
        taskStatus: data.taskStatus || 'open',
      };
    } catch (error) {
      console.error('Error getting task by ID:', error);
      throw error;
    }
  }

  async updateTaskStatus(
    gardenId: string,
    taskId: string,
    status: 'open' | 'assigned' | 'approval' | 'completed'
  ): Promise<void> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      await updateDoc(docRef, { taskStatus: status });
      console.log('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  async addUserToRequests(gardenId: string, taskId: string, uid: string): Promise<void> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      // Handle special case of ["\0"] initialization
      if (data?.uidRequests?.[0] === '\0') {
        await updateDoc(docRef, { uidRequests: [uid] });
      } else {
        await updateDoc(docRef, { uidRequests: arrayUnion(uid) });
      }
      console.log('User added to requests successfully');
    } catch (error) {
      console.error('Error adding user to requests:', error);
      throw error;
    }
  }

  async removeUserFromRequests(gardenId: string, taskId: string, uid: string): Promise<void> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      await updateDoc(docRef, { uidRequests: arrayRemove(uid) });
      console.log('User removed from requests successfully');
    } catch (error) {
      console.error('Error removing user from requests:', error);
      throw error;
    }
  }

  async addUserToAssigned(gardenId: string, taskId: string, uid: string): Promise<void> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      if (data?.uidAssigned?.[0] === '\0') {
        await updateDoc(docRef, { uidAssigned: [uid] });
      } else {
        await updateDoc(docRef, { uidAssigned: arrayUnion(uid) });
      }
      console.log('User added to assigned successfully');
    } catch (error) {
      console.error('Error adding user to assigned:', error);
      throw error;
    }
  }

  async removeUserFromAssigned(gardenId: string, taskId: string, uid: string): Promise<void> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      await updateDoc(docRef, { uidAssigned: arrayRemove(uid) });
      console.log('User removed from assigned successfully');
    } catch (error) {
      console.error('Error removing user from assigned:', error);
      throw error;
    }
  }

  async addUserToPending(gardenId: string, taskId: string, uid: string): Promise<void> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      if (data?.uidPendingApproval?.[0] === '\0') {
        await updateDoc(docRef, { uidPendingApproval: [uid] });
      } else {
        await updateDoc(docRef, { uidPendingApproval: arrayUnion(uid) });
      }
      console.log('User added to pending approval successfully');
    } catch (error) {
      console.error('Error adding user to pending:', error);
      throw error;
    }
  }

  async removeUserFromPending(gardenId: string, taskId: string, uid: string): Promise<void> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      await updateDoc(docRef, { uidPendingApproval: arrayRemove(uid) });
      console.log('User removed from pending approval successfully');
    } catch (error) {
      console.error('Error removing user from pending:', error);
      throw error;
    }
  }

  async addUserToCompleted(gardenId: string, taskId: string, uid: string): Promise<void> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      if (data?.uidCompleted?.[0] === '\0') {
        await updateDoc(docRef, { uidCompleted: [uid] });
      } else {
        await updateDoc(docRef, { uidCompleted: arrayUnion(uid) });
      }
      console.log('User added to completed successfully');
    } catch (error) {
      console.error('Error adding user to completed:', error);
      throw error;
    }
  }

  async removeUserFromCompleted(gardenId: string, taskId: string, uid: string): Promise<void> {
    try {
      const docRef = this.getTaskDoc(gardenId, taskId);
      await updateDoc(docRef, { uidCompleted: arrayRemove(uid) });
      console.log('User removed from completed successfully');
    } catch (error) {
      console.error('Error removing user from completed:', error);
      throw error;
    }
  }
}
