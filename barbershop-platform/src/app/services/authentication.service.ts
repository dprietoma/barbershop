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
    cerradura: string = '';
    constructor(private firestore: Firestore,
        private sessionStorage: SessionStorageService
    ) {
        this.auth.useDeviceLanguage();
        this.sessionStorage.key$.subscribe(key => {
            if (key) {
                this.cerradura = key;
            }
        });
    }

    initializeRecaptcha(containerId: string) {
        if ((window as any).recaptchaVerifier) {
            return (window as any).recaptchaVerifier;
        }
        (window as any).recaptchaVerifier = new RecaptchaVerifier(
            this.auth,
            containerId,
            {
                size: 'invisible'
            }
        );

        return (window as any).recaptchaVerifier;
    }

    async sendCode(phone: string, verifier: RecaptchaVerifier): Promise<void> {
        this.confirmationResult = await signInWithPhoneNumber(this.auth, phone, verifier);
    }

    async verifyCode(code: string): Promise<User> {
        if (!this.confirmationResult) throw new Error('No se ha enviado código aún');
        const result = await this.confirmationResult.confirm(code);
        return result.user;
    }
    async getOrCreateUser(user: User, type: string): Promise<Users> {

        const userRef = doc(this.firestore, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
            return snap.data() as Users;
        } else {
            const newUser: Users = {
                uid: user.uid,
                phoneNumber: user.phoneNumber || '',
                role: this.cerradura as 'admin' | 'barber',
                createdAt: serverTimestamp() as any,
                type: type as 'AMATE' | 'CRISTIANBARBER'
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
