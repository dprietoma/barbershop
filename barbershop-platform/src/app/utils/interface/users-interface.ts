import { Timestamp } from '@angular/fire/firestore';

export interface Users {
    uid: string,
    phoneNumber: string,
    role: 'admin' | 'barber',
    type?: 'AMATE' | 'CRISTIANBARBER';
    createdAt: Timestamp
}