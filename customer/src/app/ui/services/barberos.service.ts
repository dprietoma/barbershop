import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, addDoc, doc, setDoc, collectionData, getDocs } from '@angular/fire/firestore';
import { Barbero } from '../utils/interface/barbero-interface';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BarberosService {
    private firestore = inject(Firestore);
     private injector = inject(Injector); 

    crearBarbero(barbero: Barbero & { numDoc: string }) {
        const ref = doc(this.firestore, `barberos/${barbero.numDoc}`);
        const { numDoc, ...data } = barbero;
        return setDoc(ref, data);
    }

    obtenerBarberos(): Observable<Barbero[]> {
        return from(
            runInInjectionContext(this.injector, async () => {
                const ref = collection(this.firestore, 'barberos');
                const snapshot = await getDocs(ref);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barbero));
            })
        );
    }
}
