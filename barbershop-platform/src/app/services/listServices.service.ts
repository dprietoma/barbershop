import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class ListService {
    constructor(
        private firestore: Firestore,
    ) { }


    getAllServices(): Observable<any[]> {
        const serviciosRef = collection(this.firestore, 'servicios');
        return collectionData(serviciosRef, { idField: 'id' }) as Observable<any[]>;
    }

    async create(servicio: any): Promise<{ ok: boolean; mensaje: string; id?: string }> {
        try {
            const serviciosRef = collection(this.firestore, 'servicios');
            const q = query(
                serviciosRef,
                where('nombre', '==', servicio.nombre),
                where('tipo', '==', servicio.tipo),
                where('duracion', '==', servicio.duracion),
                where('valor', '==', servicio.valor),
                where('detalle', '==', servicio.detalle),
                where('avatar', '==', servicio.avatar),
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                return {
                    ok: false,
                    mensaje: 'Ya tienes un servicio creado con este mismo nombre. Si necesitas servicios adicionales, por favor créalos con diferente nombre o edítalos.'
                };
            }

            const docRef = await addDoc(serviciosRef, {
                ...servicio,
                createdAt: new Date()
            });

            return {
                ok: true,
                mensaje: 'Servicio creado exitosamente',
                id: docRef.id
            };
        } catch (error) {
            console.error('Error al crear servicio:', error);
            return {
                ok: false,
                mensaje: 'Ocurrió un error al crear el servicio'
            };
        }
    }

    update(id: string, servicio: any): Promise<void> {
        const docRef = doc(this.firestore, `servicios/${id}`);
        return updateDoc(docRef, { ...servicio }).then(() => {
            console.log('✏️ Servicio actualizado');
        });
    }

    delete(id: string): Promise<void> {
        const docRef = doc(this.firestore, `servicios/${id}`);
        return deleteDoc(docRef).then(() => {
            console.log('🗑️ Servicio eliminado');
        });
    }

}
