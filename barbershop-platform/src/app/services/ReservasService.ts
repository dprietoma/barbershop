import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Reserva } from '../utils/interface/reserva.interface';


@Injectable({ providedIn: 'root' })
export class ReservasService {
    constructor(private firestore: Firestore) { }

    async createReservation(reserva: Reserva): Promise<{ ok: boolean; mensaje: string }> {
        try {
            const reservasRef = collection(this.firestore, 'reservas');
            const q = query(
                reservasRef,
                where('docNumberCustomer', '==', reserva.docNumberCustomer),
                where('fecha', '==', reserva.fecha),
                where('estado', '==', 'Confirmada'),
                where('type', '==', reserva.type)
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                return {
                    ok: false,
                    mensaje: 'Ya tienes una reserva confirmada para esta fecha. Si necesitas servicios adicionales, por favor consulta con tu barbero.'
                };
            }

            await addDoc(reservasRef, {
                ...reserva,
                creadoEn: new Date()
            });

            return { ok: true, mensaje: 'Reserva creada exitosamente' };
        } catch (error) {
            console.error('Error al crear reserva:', error);
            return { ok: false, mensaje: 'Ocurrió un error al crear la reserva' };
        }
    }

    async GetReservationByCustomerDateStatus(
        docNumberCustomer: string,
        fecha: string,
        estado: string
    ): Promise<Reserva | null> {
        const reservasRef = collection(this.firestore, 'reservas');
        const q = query(
            reservasRef,
            where('docNumberCustomer', '==', docNumberCustomer),
            where('fecha', '==', fecha),
            where('estado', '==', estado)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const docSnap = snapshot.docs[0];
            const data = docSnap.data() as unknown as Reserva;
            return {
                ...data,
                barberoId: docSnap.id
            };
        }

        return null;
    }


}
