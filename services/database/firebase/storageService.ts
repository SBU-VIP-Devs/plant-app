/**
 * Firebase Storage Service Implementation
 */

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../../../firebaseconfig';
import { Platform } from 'react-native';
import { IStorageService } from '../interface';
import { UploadProgressCallback } from '../types';

export class FirebaseStorageService implements IStorageService {
  async uploadImage(
    path: string,
    imageUri: string,
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    try {
      // Fetch and convert image to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Create storage reference
      const storageRef = ref(FIREBASE_STORAGE, path);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Progress callback
            const progress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              percentage: Math.floor(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              ),
            };

            console.log(`Upload is ${progress.percentage}% done`);

            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            // Error callback
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            // Success callback
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('File available at:', downloadURL);
              resolve(downloadURL);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(FIREBASE_STORAGE, path);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  // Helper method to generate unique image paths
  generateImagePath(folder: string, prefix: string = 'IMG'): string {
    const timestamp = new Date().getTime();
    return `${folder}/${prefix}_${timestamp}`;
  }
}
