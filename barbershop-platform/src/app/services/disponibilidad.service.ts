import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';
import { collection } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Reserva } from '../utils/interface/reserva.interface';

@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
    private firestore = inject(Firestore);

    getAvailableHours(barberoId: string, fecha: string): Observable<any> {
        const ref = doc(this.firestore, `disponibilidadBarberos/${barberoId}/fechas/${fecha}`);
        return docData(ref);
    }
    async createAvailabilityIfNotExists(
        barberoId: string,
        fecha: string,
        horas: any[],
        avatar: string,
        numCelular: string,
        nombre: string
    ) {
        const ref = doc(this.firestore, `disponibilidadBarberos/${barberoId}/fechas/${fecha}`);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            const horasConEstado = horas.map(hora => ({
                hora,
                disponible: true
            }));

            return setDoc(ref, {
                barberoId,
                disponible: true,
                nombre,
                numCelular,
                avatar: avatar,
                horas: horasConEstado
            });
        } else {
            console.log(`Ya existe disponibilidad para ${fecha}`);
            return Promise.resolve();
        }
    }



    getReservationsPerDay(barberoId: string, fecha: string): Observable<Reserva[]> {
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


    async getAvailabilityByDate(fecha: string, type: string): Promise<any[]> {
        const barberosRef = collection(this.firestore, 'barberos');
        const barberosSnapshot = await getDocs(query(barberosRef, where('type', '==', type)));
        const barberosDisponibilidad: any[] = [];

        for (const barberoDoc of barberosSnapshot.docs) {
            const barberoId = barberoDoc.id;
            const refFecha = doc(this.firestore, `disponibilidadBarberos/${barberoId}/fechas/${fecha}`);
            const snapFecha = await getDoc(refFecha);

            if (snapFecha.exists()) {
                const disponibilidadData = snapFecha.data();
                barberosDisponibilidad.push({
                    id: barberoId,
                    nombre: disponibilidadData['nombre'],
                    avatar: disponibilidadData['avatar'],
                    telefono: disponibilidadData['numCelular'],
                    disponible: disponibilidadData['disponible'],
                    horas: disponibilidadData['horas']
                });
            }
        }
        return barberosDisponibilidad;
    }


    async updateAvailability(barberoId: string, fecha: string, hora: string, disponible: boolean): Promise<void> {
        const docRef = doc(this.firestore, `disponibilidadBarberos/${barberoId}/fechas/${fecha}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const horas = data['horas'].map((h: any) => {
                if (h.hora === hora) {
                    return { ...h, disponible };
                }
                return h;
            });

            await updateDoc(docRef, { horas });
        } else {
            throw new Error('Documento no encontrado para ese barbero y fecha.');
        }
    }
    async updateAvailabilityAllDay(barberoId: string, fecha: string, disponible: boolean): Promise<void> {
        const docRef = doc(this.firestore, `disponibilidadBarberos/${barberoId}/fechas/${fecha}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const horasActualizadas = data['horas'].map((h: any) => ({ ...h, disponible }));

            await updateDoc(docRef, {
                horas: horasActualizadas,
                disponible
            });
        } else {
            throw new Error('Documento no encontrado para ese barbero y fecha.');
        }
    }


}

