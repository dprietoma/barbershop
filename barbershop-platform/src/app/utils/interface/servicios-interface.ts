import { Timestamp } from "firebase/firestore";

export interface Servicios {
    id: string;
    nombre: string;
    foto: any;
    detalle: string;
    duracion: any;
    valor: number;
    fecha: Timestamp;
    type: string;
}