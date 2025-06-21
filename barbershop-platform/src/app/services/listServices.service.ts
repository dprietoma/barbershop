import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class ListService {
    constructor(private firestore: Firestore) { }

    getAllServices():Observable<any[]> {
        const serviciosRed = collection(this.firestore,'servicios');
        return collectionData(serviciosRed,{idField:'id'}) as Observable<any[]>;
    }

    create() {

    }

    update() {

    }
    
    delete() {

    }

}
