// snackbar.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  open(message: string, action: string = 'OK', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  // You can also add more functions for different types of messages (success, error, etc.)
  openSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, '', {
      duration: duration,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  openError(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'OK', {
      duration: duration,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
