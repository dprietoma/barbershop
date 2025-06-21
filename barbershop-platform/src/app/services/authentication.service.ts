import { Injectable } from '@angular/core';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, User, getAuth, signOut } from 'firebase/auth';
import { Firestore, doc, getDoc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { Users } from '../utils/interface/users-interface';
import { SessionStorageService } from '../utils/global/StorageService ';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private auth = getAuth();
    private confirmationResult!: ConfirmationResult;
    private recaptchaVerifier: RecaptchaVerifier | null = null;

    constructor(private firestore: Firestore,
        private sessionStorage: SessionStorageService
    ) {
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
    async getOrCreateUser(user: User): Promise<Users> {
        const userRef = doc(this.firestore, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
            return snap.data() as Users;
        } else {
            const newUser: Users = {
                uid: user.uid,
                phoneNumber: user.phoneNumber || '',
                role: 'barber',
                createdAt: serverTimestamp() as any
            };

            await setDoc(userRef, newUser);
            return newUser;
        }
    }
    async logout(): Promise<void> {
        const auth = getAuth();
        return signOut(auth).then(() => {
            this.sessionStorage.clearAll();
        });
    }
}
