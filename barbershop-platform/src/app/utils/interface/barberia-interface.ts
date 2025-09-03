import { AMATE, CRISTIANJBARBER } from "../constants/General-Constants";

export interface ModeConfig {
    tittle: string;
    description: string;
    instagram: string;
    celular: number;
    comentario: string;
    usuario: string,

}
export const MODE_CONFIGS: { [key: string]: ModeConfig } = {
    [AMATE.TYPE]: {
        tittle: AMATE.TITTLE_NAV,
        description: AMATE.DESCRIPTION,
        celular: AMATE.CELULAR,
        instagram: AMATE.INSTAGRAM,
        comentario: AMATE.COMENTARIO,
        usuario: AMATE.USUARIO
    },
    [CRISTIANJBARBER.TYPE]: {
        tittle: CRISTIANJBARBER.TITTLE_NAV,
        description: CRISTIANJBARBER.DESCRIPTION,
        celular: CRISTIANJBARBER.CELULAR,
        instagram: CRISTIANJBARBER.INSTAGRAM,
        comentario: CRISTIANJBARBER.COMENTARIO,
        usuario: CRISTIANJBARBER.USUARIO
    }
};