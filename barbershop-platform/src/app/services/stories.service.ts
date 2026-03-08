import { inject, Injectable } from '@angular/core';
import { Story } from '../utils/interface/story-interface';
import { Observable } from 'rxjs';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  private firestore = inject(Firestore);
  getStories(useBy: string): Observable<Story[]> {
    const storiesRef = collection(this.firestore, 'stories');
    const q = query(storiesRef, where('useBy', '==', useBy));
    return collectionData(q, { idField: 'id' }) as Observable<Story[]>;
  }
  getReservations(): Observable<any[]> {
    const reservationsRef = collection(this.firestore, 'reservas');
    return collectionData(reservationsRef, { idField: 'id' }) as Observable<any[]>;
  }
  private todayBogota(): string {

    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' })
      .format(new Date());
  }
  getReservationsTodayByStatus(
    status: string,
    assistantPhone?: string | null,
    role: string = '',
    type: string = ''
  ): Observable<any[]> {

    const today = this.todayBogota();
    const reservasRef = collection(this.firestore, 'reservas');

    const constraints: any[] = [
      where('estado', '==', status),
    ];

    const roleNormalized = role?.toLowerCase();

    if (roleNormalized === 'barber' && assistantPhone) {
      constraints.push(where('phoneNumber', '==', assistantPhone));
    }

    if (roleNormalized !== 'barber' && type) {
      constraints.push(where('type', '==', type));
    }

    const q = query(reservasRef, ...constraints);

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  getReservationsByStateAndDate(
    status: string,
    date: string,
    assistantPhone: string | null,
    role: string = '',
    type: string = ''
  ): Observable<any[]> {
    const reservasRef = collection(this.firestore, 'reservas');

    const constraints = [
      where('estado', '==', status),
      where('fecha', '==', date),
      where('type', '==', type)
    ];
    if (role.toLowerCase() === 'barber') {
      constraints.push(where('barberPhone', '==', assistantPhone));
    }

    const q = query(reservasRef, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

}
