import { Injectable } from '@angular/core';
import { Story } from '../utils/interface/story-interface';
import { Observable } from 'rxjs';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  constructor(private firestore: Firestore) { }
  getStories(useBy: string): Observable<Story[]> {
    const storiesRef = collection(this.firestore, 'stories');
    const q = query(storiesRef, where('useBy', '==', useBy));
    return collectionData(q, { idField: 'id' }) as Observable<Story[]>;
  }
}
