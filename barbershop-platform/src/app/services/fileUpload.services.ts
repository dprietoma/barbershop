import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class UploadfileService {
  private storage = inject(Storage);

  getFileNameWithExtension(filePath: string): string {
    const parts = filePath.split("/");
    return parts[parts.length - 1];
  }

  async uploadFile(file: File): Promise<string> {
    if (!file) {
      throw new Error('No file provided');
    }

    const filePath = `barberos/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error('Error al cargar el archivo:', error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(fileRef);
            resolve(url);
          } catch (error) {
            console.error('Error al obtener la URL de descarga:', error);
            reject(error);
          }
        }
      );
    });
  }
}
