import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';
import { collection } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Reserva } from '../utils/interface/reserva.interface';

@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
    private firestore = inject(Firestore);

    getHorasDisponibles(barberoId: string, fecha: string): Observable<any> {
        const ref = doc(this.firestore, `disponibilidadBarberos/${barberoId}/fechas/${fecha}`);
        return docData(ref);
    }
    async crearDisponibilidadSiNoExiste(barberoId: string, fecha: string, horas: string[]) {
        const ref = doc(this.firestore, `disponibilidadBarberos/${barberoId}/fechas/${fecha}`);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            return setDoc(ref, { horas, disponible: true });
        } else {
            console.log(`Ya existe disponibilidad para ${fecha}`);
            return Promise.resolve();
        }
    }

    getReservasPorDia(barberoId: string, fecha: string): Observable<Reserva[]> {
        const ref = collection(this.firestore, 'reservas')
        const q = query(ref,
            where('barberoId', '==', barberoId),
            where('fecha', '==', fecha)
        );

        return from(getDocs(q)).pipe(
            map(snapshot => snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Reserva)
            })))
        );
    }
}
