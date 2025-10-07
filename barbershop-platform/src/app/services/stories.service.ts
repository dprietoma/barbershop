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
  getReservationsTodayByStatus(status: string,assistant: string): Observable<any[]> {
    const today = this.todayBogota();
    const reservasRef = collection(this.firestore, 'reservas');
    const q = query(
      reservasRef,
      where('fecha', '==', today),
      where('estado', '==', status),
      where('phoneNumber', '==', assistant)
    );
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
  getReservationsByStateAndDate(status: string, date: string): Observable<any[]> {
    const q = query(
      collection(this.firestore, 'reservas'),
      where('estado', '==', status),
      where('fecha', '==', date)
    );

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
}
