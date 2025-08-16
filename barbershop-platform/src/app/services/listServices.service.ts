import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Servicios } from '../utils/interface/servicios-interface';
import { Custom } from '../utils/interface/custom-interface';



@Injectable({ providedIn: 'root' })
export class ListService {
    constructor(
        private firestore: Firestore,
    ) { }


    getAllServices(): Observable<any[]> {
        const serviciosRef = collection(this.firestore, 'servicios');
        return collectionData(serviciosRef, { idField: 'id' }) as Observable<any[]>;
    }

    createServicio(servicio: Servicios & { id: string }) {
        const ref = doc(this.firestore, `servicios/${servicio.id}`);
        const { id, ...data } = servicio;
        return setDoc(ref, data);
    }

    updateServices(id: string, partialData: Partial<Servicios>) {
        const ref = doc(this.firestore, `servicios/${id}`);
        return updateDoc(ref, partialData);
    }

    async deleteServById(id: string): Promise<void> {
        const servRef = doc(this.firestore, `servicios/${id}`);
        await deleteDoc(servRef);
    }
   createCustom(item: Custom & { id: string }) {
        const ref = doc(this.firestore, `customize/${item.id}`);
        const { id, ...data } = item;
        return setDoc(ref, data);
    } 
    
    getCustom(): Observable<any[]> {
        const serviciosRef = collection(this.firestore, 'customize');
        return collectionData(serviciosRef, { idField: 'id' }) as Observable<any[]>;
    }
      async deleteCustomById(id: string): Promise<void> {
        const servRef = doc(this.firestore, `customize/${id}`);
        await deleteDoc(servRef);
    }

}
