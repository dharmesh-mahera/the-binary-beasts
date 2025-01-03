import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    // Call login method from AuthService
    this.authService.login(email, password).subscribe({
      next: (response) => {
        // Store the received token if login is successful
        this.authService.storeToken(response.token);
        this.router.navigate(['/expenses']); // Navigate to dashboard or another page
      },
      error: (err) => {
        console.error('Login failed', err);
        // Handle login failure (e.g., show error message to user)
      }
    });
  }
}
