import { Component, QueryList, ViewChildren, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../../services/authentication.services';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { LoadingService } from '../../../../utils/global/LoadingService';

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
  @ViewChildren('inputRef') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService
  ) { }
  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10), Validators.pattern(/^3\d{9}$/),]]
    })
  }
  sendCode() {
    this.loadingService.show();
    const containerId = 'recaptcha-container';
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`No se encontró el contenedor con id #${containerId}`);
      this.loadingService.hide();
      return;
    }

    try {
      const verifier = this.authService.initializeRecaptcha(containerId);
      this.phoneNumber = `+57${this.formLogin.controls['phone'].value}`;

      this.authService.sendCode(this.phoneNumber, verifier)
        .then(() => {
          this.codeSent = true;
          setTimeout(() => this.inputs.get(0)?.nativeElement.focus(), 100);
        })
        .catch(err => {
          console.error('Error al enviar código:', err);
          alert('Error: ' + err.message);
        })
        .finally(() => {
          this.loadingService.hide();
        });

    } catch (err) {
      console.error('Error al inicializar reCAPTCHA:', err);
      this.loadingService.hide();
    }
  }



  verifyCode() {
    const fullCode = this.code.join('');
    this.authService.verifyCode(fullCode)
      .then(user => alert('Login exitoso: ' + user.phoneNumber))
      .catch(err => alert('Código incorrecto'));
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
}
