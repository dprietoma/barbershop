import { Injectable } from '@angular/core';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, User } from 'firebase/auth';
import { auth } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private auth = auth;
    private confirmationResult!: ConfirmationResult;
    private recaptchaVerifier: RecaptchaVerifier | null = null;

    constructor() {
        this.auth.useDeviceLanguage();
    }

    initializeRecaptcha(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
        if (!this.recaptchaVerifier) {
            const container = document.getElementById(containerId) as HTMLElement;

            this.recaptchaVerifier = new RecaptchaVerifier(this.auth, container, {
                size: 'invisible',
                callback: (response: any) => {
                    console.log('reCAPTCHA verificado:', response);
                }
            });

            this.recaptchaVerifier.render()
                .then(widgetId => {
                    console.log('reCAPTCHA renderizado con ID:', widgetId);
                })
                .catch(err => console.error('Error al renderizar reCAPTCHA:', err));
        }

        return this.recaptchaVerifier;
    }

    async sendCode(phone: string, verifier: RecaptchaVerifier): Promise<void> {
        this.confirmationResult = await signInWithPhoneNumber(this.auth, phone, verifier);
    }

    async verifyCode(code: string): Promise<User> {
        if (!this.confirmationResult) throw new Error('No se ha enviado código aún');
        const result = await this.confirmationResult.confirm(code);
        return result.user;
    }
}
