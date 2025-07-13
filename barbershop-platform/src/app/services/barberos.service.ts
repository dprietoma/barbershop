import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, addDoc, doc, setDoc, collectionData, getDocs, query, where, deleteDoc } from '@angular/fire/firestore';
import { Barbero } from '../utils/interface/barbero-interface';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BarberosService {
    private firestore = inject(Firestore);
    private injector = inject(Injector);

    createBarber(barbero: Barbero & { id: string }) {
        const ref = doc(this.firestore, `barberos/${barbero.id}`);
        const { id, ...data } = barbero;
        return setDoc(ref, data);
    }

    GetBarbersByType(type: string): Observable<Barbero[]> {
        return from(
            runInInjectionContext(this.injector, async () => {
                const ref = collection(this.firestore, 'barberos');
                const q = type === 'all' ? ref : query(ref, where('type', '==', type));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barbero));
            })
        );
    }
    async deleteBarberById(id: string): Promise<void> {
        const barberRef = doc(this.firestore, `barberos/${id}`);
        await deleteDoc(barberRef);
    }
}
