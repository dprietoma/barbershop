import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Reserva } from '../utils/interface/reserva.interface';
import { DURACION_FRANJA_MIN } from '../utils/constants/horasDefault';


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
    async updateReservation(reservaId: string, reserva: Reserva): Promise<{ ok: boolean; mensaje: string }> {
        try {
            const reservaRef = doc(this.firestore, 'reservas', reservaId);
            await setDoc(reservaRef, {
                ...reserva,
                actualizadoEn: new Date()
            }, { merge: true });
            return { ok: true, mensaje: 'Reserva actualizada exitosamente' };
        } catch (error) {
            console.error('Error al actualizar reserva:', error);
            return { ok: false, mensaje: 'Ocurrió un error al actualizar la reserva' };
        }
    }
    async deleteReservation(reservaId: string): Promise<{ ok: boolean; mensaje: string }> {
        try {
            const reservaRef = doc(this.firestore, 'reservas', reservaId);
            await deleteDoc(reservaRef);

            return { ok: true, mensaje: 'Reserva eliminada exitosamente' };
        } catch (error) {
            console.error('Error al eliminar reserva:', error);
            return { ok: false, mensaje: 'Ocurrió un error al eliminar la reserva' };
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

    async marcarHoraComoNoDisponible(
        barberoId: string,
        fecha: string,
        horaObjetivo: string,
        duracion: number
    ) {
        const ref = doc(this.firestore, `disponibilidadBarberos/${barberoId}/fechas/${fecha}`);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            console.error('No se encontró la fecha');
            return;
        }
        const data = snap.data();
        const horasOriginal = data['horas'] as { hora: string; disponible: boolean }[];
        const bloquesNecesarios = Math.ceil(duracion / DURACION_FRANJA_MIN);
        const horaInicio = this.convertirHoraATime(horaObjetivo);
        const horasOrdenadas = [...horasOriginal].sort((a, b) =>
            this.convertirHoraATime(a.hora).getTime() - this.convertirHoraATime(b.hora).getTime()
        );
        let minutosConsumidos = 0;
        const nuevasHoras = horasOrdenadas.map(item => {
            const horaActual = this.convertirHoraATime(item.hora);

            if (horaActual >= horaInicio && minutosConsumidos < duracion) {
                minutosConsumidos += 30;
                return { ...item, disponible: false };
            }
            return item;
        });

        await updateDoc(ref, { horas: nuevasHoras });
    }
    private convertirHoraATime(hora: string): Date {
        const [horaMin, meridiano] = hora.split(' ');
        let [h, m] = horaMin.split(':').map(Number);
        if (meridiano === 'PM' && h !== 12) h += 12;
        if (meridiano === 'AM' && h === 12) h = 0;
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
    }

}
