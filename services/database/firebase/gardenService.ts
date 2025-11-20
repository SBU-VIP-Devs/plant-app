/**
 * Firebase Garden Service Implementation
 */

import { addDoc, collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseconfig';
import { IGardenService } from '../interface';
import { GardenData, CreateGardenInput } from '../types';

export class FirebaseGardenService implements IGardenService {
  private readonly collectionName = 'garden-post-info';

  async createGarden(gardenData: CreateGardenInput): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(FIRESTORE_DB, this.collectionName),
        gardenData
      );
      console.log('Garden created successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating garden:', error);
      throw error;
    }
  }

  async getAllGardens(): Promise<GardenData[]> {
    try {
      const querySnapshot = await getDocs(
        collection(FIRESTORE_DB, this.collectionName)
      );
      const gardens: GardenData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        gardens.push({
          id: doc.id,
          imageURL: data.imageURL,
          createdAt: data.createdAt,
          gardenName: data.gardenName,
          desc: data.desc,
          username: data.username,
          userId: data.userId,
          roles: data.roles,
          userImage: data.userImage,
        });
      });

      return gardens;
    } catch (error) {
      console.error('Error getting gardens:', error);
      throw error;
    }
  }

  async getGardenById(gardenId: string): Promise<GardenData | null> {
    try {
      const docRef = doc(FIRESTORE_DB, this.collectionName, gardenId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        imageURL: data.imageURL,
        createdAt: data.createdAt,
        gardenName: data.gardenName,
        desc: data.desc,
        username: data.username,
        userId: data.userId,
        roles: data.roles,
        userImage: data.userImage,
      };
    } catch (error) {
      console.error('Error getting garden by ID:', error);
      throw error;
    }
  }
}
