import { Component, QueryList, ViewChildren, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FooterComponent } from '../../../../shared/footer/footer.component';
import { LoadingService } from '../../../../utils/global/LoadingService';
import { ErrorAuth } from '../../../../utils/global/error-auth';
import { Router } from '@angular/router';
import { Users } from '../../../../utils/interface/users-interface';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import { AuthenticationService } from '../../../../services/authentication.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  codeSent = false;
  phoneNumber: string = '';
  code: string[] = ['', '', '', '', '', ''];
  otpDigits = Array(6).fill(0);
  formLogin: FormGroup;
  errorMessage: string = '';
  private errorHandler = new ErrorAuth();
  alertType: 'success' | 'danger' | 'warning' | 'info' | '' = '';
  @ViewChildren('inputRef') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private router: Router,
    private sessionStorage: SessionStorageService
  ) { }
  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10), Validators.pattern(/^3\d{9}$/),]]
    })
  }
  sendCode(fromOtp: boolean = false) {
    this.errorMessage = '';
    this.loadingService.show();
    const containerId = 'recaptcha-container';
    const container = document.getElementById(containerId);

    if (!container) {
      const friendly = this.errorHandler.notFoundCAPTCHA();
      this.showAlert(friendly.message, friendly.type);
      this.loadingService.hide();
      return;
    }

    try {
      const verifier = this.authService.initializeRecaptcha(containerId);
      this.phoneNumber = `+57${this.formLogin.controls['phone'].value}`;
      this.authService.sendCode(this.phoneNumber, verifier)
        .then(() => {
          if (!fromOtp) this.codeSent = true;
          setTimeout(() => this.inputs.get(0)?.nativeElement.focus(), 100);
        })
        .catch((err: any) => {
          const friendly = this.errorHandler.AuthError(err);
          this.showAlert(friendly.message, friendly.type);
        })
        .finally(() => {
          this.loadingService.hide();
        });

    } catch (err: any) {
      const friendly = this.errorHandler.unexpectedError();
      this.showAlert(friendly.message, friendly.type);
      this.loadingService.hide();
    }
  }


  verifyCode() {
    this.loadingService.show();
    this.errorMessage = '';
    const fullCode = this.code.join('');
    this.authService.verifyCode(fullCode)
      .then(user => {
        if (user) {
          this.authService.getOrCreateUser(user).then((userData: Users) => {
            this.sessionStorage.saveType('user', JSON.stringify(userData));
            if(userData?.role === "admin"){
              this.router.navigate(['/admin/dashboard']);
            } else {

            }
            

          });
        }
      })
      .catch(err => {
        const friendly = this.errorHandler.AuthError(err);
        this.showAlert(friendly.message, friendly.type);
      }).finally(() => {
        this.loadingService.hide();
      })
  }


  isInputEnabled(index: number): boolean {
    if (index === 0) return true;
    return this.code[index - 1] !== '';
  }
  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (/^\d$/.test(value)) {
      this.code[index] = value;
      const nextInput = this.inputs.get(index + 1);
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    } else {
      input.value = '';
      this.code[index] = '';
    }
  }


  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const prevInput = this.inputs.get(index - 1);
    if (!this.isInputEnabled(index) && event.key !== 'Backspace' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
      return;
    }
    if (event.key === 'Backspace') {
      if (this.code[index] === '') {
        this.code[index - 1] = '';
        if (prevInput) prevInput.nativeElement.focus();
      } else {
        this.code[index] = '';
      }
    }
  }
  showAlert(message: string, type: 'success' | 'danger' | 'warning' | 'info') {
    this.errorMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.errorMessage = '';
      this.alertType = '';
    }, 5000);
  }
}
