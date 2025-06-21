export interface HoraIndividual {
    hora: string;
    disponible: boolean;
}

export interface HorasDisponibles {
    manana: HoraIndividual[];
    tarde: HoraIndividual[];
    noche: HoraIndividual[];
}