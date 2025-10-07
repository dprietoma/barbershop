import { AMATE, CRISTIANJBARBER } from "../constants/General-Constants";

export interface ModeConfig {
    tittle: string;
    description: string;
    instagram: string;
    celular: number;
    face: string;
    tiktok: string;
    comentario: string;
    usuario: string,
    logo: string;

}
export const MODE_CONFIGS: { [key: string]: ModeConfig } = {
    [AMATE.TYPE]: {
        tittle: AMATE.TITTLE_NAV,
        description: AMATE.DESCRIPTION,
        celular: AMATE.CELULAR,
        instagram: AMATE.INSTAGRAM,
        face: AMATE.FACE,
        tiktok: AMATE.TIKTOK,
        comentario: AMATE.COMENTARIO,
        usuario: AMATE.USUARIO,
        logo: AMATE.LOGO
    },
    [CRISTIANJBARBER.TYPE]: {
        tittle: CRISTIANJBARBER.TITTLE_NAV,
        description: CRISTIANJBARBER.DESCRIPTION,
        celular: CRISTIANJBARBER.CELULAR,
        instagram: CRISTIANJBARBER.INSTAGRAM,
        face: CRISTIANJBARBER.FACE,
        tiktok: CRISTIANJBARBER.TIKTOK,
        comentario: CRISTIANJBARBER.COMENTARIO,
        usuario: CRISTIANJBARBER.USUARIO,
        logo: CRISTIANJBARBER.LOGO
    }
};