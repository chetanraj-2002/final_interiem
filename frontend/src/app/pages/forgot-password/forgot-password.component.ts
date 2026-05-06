import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  sent = false;
  demoToken = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snack: MatSnackBar,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.auth.sendResetLink(this.form.value.email).subscribe({
      next: response => {
        this.loading = false;
        this.sent = true;
        this.demoToken = '';
        this.snack.open(response.message, 'Close', { duration: 4000 });
      },
      error: err => {
        this.loading = false;
        this.snack.open(err?.error?.message ?? 'Unable to request password reset.', 'Close', { duration: 4000, panelClass: ['snack-error'] });
      }
    });
  }

  goToReset() { this.router.navigate(['/reset-password'], { queryParams: { token: this.demoToken } }); }
  goToLogin() { this.router.navigate(['/login']); }
  get email() { return this.form.get('email')!; }
}
