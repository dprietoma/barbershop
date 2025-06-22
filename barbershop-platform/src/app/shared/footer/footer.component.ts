import { Component, inject, OnInit } from '@angular/core';
import { SessionStorageService } from '../../utils/global/StorageService ';
import { effect } from '@angular/core';
import { AppSignalService } from '../../services/signals.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  data: any
  urlFooter: string;

  constructor(private appSignal: AppSignalService, private sessionStorage: SessionStorageService,) {
    effect(() => {
      this.data = this.appSignal.data();
      if (this.data?.valor === 'dark') {
        this.urlFooter = 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/poweredByWhite.svg?alt=media&token=d6e977a1-3f49-48b6-a21c-879d5a3dd7ae'
      } else if (this.data?.valor === 'light') {
        this.urlFooter = 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/poweredBy.svg?alt=media&token=d021b561-1089-43fb-bb53-c4d2a66dfe0d';
      }
    });
  }

  ngOnInit() {
    this.urlFooter = 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/poweredByWhite.svg?alt=media&  oken=d6e977a1-3f49-48b6-a21c-879d5a3dd7ae';
  }



}
