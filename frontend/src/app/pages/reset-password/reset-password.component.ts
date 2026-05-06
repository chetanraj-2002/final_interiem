import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const v: string = control.value ?? '';
  const errors: Record<string, boolean> = {};
  if (v.length < 8) errors['minLength'] = true;
  if (!/[A-Z]/.test(v)) errors['uppercase'] = true;
  if (!/[0-9]/.test(v)) errors['number'] = true;
  if (!/[^A-Za-z0-9]/.test(v)) errors['special'] = true;
  return Object.keys(errors).length ? errors : null;
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const p = control.get('password')?.value;
  const c = control.get('confirmPassword')?.value;
  return p === c ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  showPass = false;
  showConfirm = false;
  token = '';
  invalidToken = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) this.invalidToken = true;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.auth.resetPassword(this.token, this.form.value.password).subscribe({
      next: result => {
        this.loading = false;
        this.snack.open(result.message, 'Close', { duration: 4000 });
      },
      error: err => {
        this.loading = false;
        this.snack.open(err?.error?.message ?? 'Unable to reset password.', 'Close', { duration: 4000, panelClass: ['snack-error'] });
        this.invalidToken = true;
      }
    });
  }

  goToLogin() { this.router.navigate(['/login']); }

  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }
  hasMinLength() { return !this.password.hasError('minLength'); }
  hasUppercase() { return !this.password.hasError('uppercase'); }
  hasNumber() { return !this.password.hasError('number'); }
  hasSpecial() { return !this.password.hasError('special'); }
}
