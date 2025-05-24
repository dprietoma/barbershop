import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
    constructor(private firestore: Firestore) { }

    getHorasDisponibles(barberoId: string, fecha: string): Observable<any> {
        const ref = doc(this.firestore, `barberos/${barberoId}/disponibilidad/${fecha}`);
        return docData(ref);
    }
}
