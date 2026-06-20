import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  ref: Subscription = new Subscription();
  errorMessage: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  showPassword = false;
  registerForm!: FormGroup;
  submitted: WritableSignal<boolean> = signal<boolean>(false);
  ngOnInit(): void {
    this.registerFormInitialization();
  }
  handleConfirmPassword(form: AbstractControl) {
    return form.get('password')?.value === form.get('rePassword')?.value
      ? null
      : { mismatch: true };
  }
  registerFormInitialization(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        username: [''],
        email: ['', [Validators.email, Validators.required]],
        dateOfBirth: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
            Validators.required,
          ],
        ],
        rePassword: ['', [Validators.required]],
      },
      { validators: this.handleConfirmPassword },
    );
  }
  onSubmitRegisterForm(): void {
    this.submitted.set(true);
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.ref.unsubscribe();
      this.ref = this.authService.sendRegisterData(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.success === true) {
            console.log(res);
            this.errorMessage.set('');
            this.registerForm.reset();
            this.isLoading.set(false);
            this.router.navigate(['/login']);
          }
          this.submitted.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error.message);
          this.submitted.set(false);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  toggle(): void {
    this.showPassword = !this.showPassword;
  }
}
