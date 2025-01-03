import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditExpenseComponent implements OnInit {

  expenseForm!: FormGroup;
  maxDate = new Date();  // Get today's date
  isSubmitting: boolean = false; // Flag to show loading spinner

  constructor(private fb: FormBuilder, private expenseService: AppService,private router: Router) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.isSubmitting = true;  // Show the loading spinner
      const expenseData: any = this.expenseForm.value;
      this.expenseService.addExpense(expenseData).subscribe({
        next: (response) => {
          console.log('Expense added successfully', response);
          this.isSubmitting = false;  // Hide the loading spinner after submission
          this.router.navigate(['/expenses']);
          this.expenseForm.reset();
        },
        error: (err) => {
          console.error('Error adding expense', err);
          this.isSubmitting = false;  // Hide the loading spinner after submission fails
        }
      });
    }
  }
}
