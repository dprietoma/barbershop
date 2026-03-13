import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthStateService {

    private logoutSubject = new Subject<void>();
    logout$ = this.logoutSubject.asObservable();

    notifyLogout() {
        this.logoutSubject.next();
    }
}