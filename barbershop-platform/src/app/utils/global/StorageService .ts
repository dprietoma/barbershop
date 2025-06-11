import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    private isBrowser: boolean;
    private modeSubject: BehaviorSubject<string | null>;
    public mode$;

    constructor() {
        this.isBrowser = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
        const initialMode = this.isBrowser ? sessionStorage.getItem('mode') : null;
        this.modeSubject = new BehaviorSubject<string | null>(initialMode);
        this.mode$ = this.modeSubject.asObservable();
    }

    saveType(key: string, value: string): void {
        if (this.isBrowser) {
            sessionStorage.setItem(key, value);
            if (key === 'mode') {
                this.modeSubject.next(value);
            }
        }
    }

    getType(key: string): string | null {
        if (this.isBrowser) {
            return sessionStorage.getItem(key);
        }
        return null;
    }

    clearType(key: string): void {
        if (this.isBrowser) {
            sessionStorage.removeItem(key);
            if (key === 'mode') {
                this.modeSubject.next(null);
            }
        }
    }
}
