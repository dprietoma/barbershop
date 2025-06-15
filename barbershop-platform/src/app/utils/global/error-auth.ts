export class ErrorAuth {
    AuthError(error: any): { message: string, type: 'danger' | 'warning' | 'info' } {
        if (!error || typeof error !== 'object') {
            return { message: 'Error desconocido.', type: 'danger' };
        }

        const code = error.code || error.message;

        switch (code) {
            case 'auth/invalid-phone-number':
                return { message: 'El número de teléfono ingresado no es válido.', type: 'danger' };

            case 'auth/too-many-requests':
                return { message: 'Demasiados intentos. Espera un momento antes de volver a intentarlo.', type: 'warning' };

            case 'auth/quota-exceeded':
                return { message: 'Se ha excedido la cuota de envío de códigos. Intenta más tarde.', type: 'warning' };

            case 'auth/user-disabled':
                return { message: 'Este número ha sido inhabilitado.', type: 'danger' };

            case 'auth/network-request-failed':
                return { message: 'Error de red. Verifica tu conexión a internet.', type: 'info' };

            case 'auth/app-not-authorized':
                return { message: 'La aplicación no está autorizada para usar Firebase Auth.', type: 'danger' };

            case 'auth/missing-verification-code':
                return { message: 'Falta ingresar el código de verificación.', type: 'warning' };

            case 'auth/invalid-verification-code':
                return { message: 'El código ingresado no es válido. Revisa e intenta de nuevo.', type: 'danger' };

            case 'auth/code-expired':
                return { message: 'El código ha expirado. Solicita uno nuevo.', type: 'warning' };

            default:
                return { message: 'Ocurrió un error inesperado: ' + code, type: 'danger' };
        }
    }

    notFoundCAPTCHA(): { message: string, type: 'danger' } {
        return {
            message: 'Error interno: no se encontró el contenedor de reCAPTCHA.',
            type: 'danger'
        };
    }

    unexpectedError(): { message: string, type: 'danger' } {
        return {
            message: 'Ocurrió un error inesperado al preparar la verificación.',
            type: 'danger'
        };
    }
}
