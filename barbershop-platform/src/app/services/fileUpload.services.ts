import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
@Injectable({
    providedIn: 'root'
})
export class UploadfileService {

    constructor(private storage: AngularFireStorage) { }

    getFileNameWithExtension(filePath: any) {
        const parts = filePath.split("/");
        const lastPart = parts[parts.length - 1];
        return lastPart;
    }
    async uploadFile(file: File): Promise<string | null> {
        if (!file) {
            return Promise.reject('No file provided');
        }
        return new Promise((resolve, reject) => {
            const fileName = file.name;
            const filePath = `images/${fileName}`;
            const fileRef = ref(this.storage.storage, filePath);
            const metadata = {
                contentType: file.type,
                size: file.size
            };
            const uploadTask = uploadBytesResumable(fileRef, file, metadata);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    console.error('Error al cargar el archivo:', error);
                    reject(error);
                },
                async () => {
                    try {
                        ("El archivo se subió exitosamente!");
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
