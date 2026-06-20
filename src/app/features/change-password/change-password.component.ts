import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  changePasswordForm!: FormGroup;
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  message: WritableSignal<string> = signal<string>('');
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  ngOnInit(): void {
    this.changePasswordFormInitialization();
  }
  changePasswordFormInitialization(): void {
    this.changePasswordForm = this.fb.group({
      password: [null, [Validators.required]],
      newPassword: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
        ],
      ],
    });
  }
  onSubmitChangePasswordForm(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading.set(true);
      this.authService.changePassword(this.changePasswordForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          console.log(res);
          if (res.success) {
            this.message.set(res.message);
            localStorage.setItem('userToken', res.data.token);
          }
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }
}
