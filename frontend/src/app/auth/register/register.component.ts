import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../../toast.service';

// Custom validator to check if password and confirmPassword match
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastSvc: ToastService
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['patient'] // default role
    }, { validators: passwordMatchValidator });
  }

  // Easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    // We send register payload without confirmPassword
    const { name, email, password, role } = this.registerForm.value;
    
    this.authService.register({ name, email, password, role })
      .subscribe({
        next: (response) => {
          this.toastSvc.showSuccess(`Welcome, ${response.user.name}! Your account has been registered.`);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
          const errorMsg = err.error?.message || 'Registration failed. Please try again.';
          this.toastSvc.showError(errorMsg);
          this.loading = false;
        }
      });
  }
}
