export interface Reserva {
    barberoId: string;
    barberNombre: string,
    clienteNombre: string;
    fecha: string;
    hora: string;
    servicio: any[];
    phoneCustomer: string,
    emailCustomer: string,
    docNumberCustomer: string;
    total: string;
    estado: string;
    duracion: string;
    type: string;
    id?: string
}