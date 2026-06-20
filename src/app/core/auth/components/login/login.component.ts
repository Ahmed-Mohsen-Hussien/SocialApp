import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  ref: Subscription = new Subscription();
  errorMessage: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  showPassword: boolean = false;
  loginForm!: FormGroup;
  submitted: WritableSignal<boolean> = signal<boolean>(false);
  ngOnInit(): void {
    this.loginFormInitialization();
  }
  loginFormInitialization(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: [
        '',
        [
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
          Validators.required,
        ],
      ],
    });
  }
  onSubmitLoginForm(): void {
    this.submitted.set(true);
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.ref.unsubscribe();
      this.ref = this.authService.sendLoginData(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.success === true) {
            this.errorMessage.set('');
            this.loginForm.reset();
            this.isLoading.set(false);
            localStorage.setItem('userToken', res.data.token);
            this.router.navigate(['/feed']);
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
      this.loginForm.markAllAsTouched();
    }
  }
  toggle(): void {
    this.showPassword = !this.showPassword;
  }
}
