import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ExpenseApiResponse } from 'src/app/app.types';
import { SnackbarService } from 'src/app/snackbar.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditExpenseComponent implements OnInit {

  expenseForm!: FormGroup;
  maxDate = new Date();  // Get today's date
  isSubmitting: boolean = false; // Flag to show loading spinner
  expenseId: any;
  isUpdate: boolean = false;
  expenseData: any

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private expenseService: AppService,private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: ['']
    });

    if(this.route.snapshot.paramMap.get('id')) {
      this.isUpdate = true;
      this.expenseId = this.route.snapshot.paramMap.get('id');
       this.expenseService.getExpenses().subscribe((data: ExpenseApiResponse) => {
            if(data && data.expenses.length > 0) {
              this.expenseData = data.expenses.find((f: any) => f.id === Number(this.expenseId));
              console.log(this.expenseData);
              // this.expenseForm.setValue(this.expenseData)
              
              this.expenseForm.patchValue({
                amount: this.expenseData.amount,
                date: this.expenseData.date,
                category: this.expenseData.category,
                description: this.expenseData.description
              })
            }
          });
        }
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.isSubmitting = true;  // Show the loading spinner
      if(this.isUpdate) {
        this.updateExpenseData();
      } else {
        this.addExpenseData();
      }
    
    }
  }

  updateExpenseData() {
    this.expenseService.updateExpense(this.expenseId, this.expenseForm.value).subscribe({
      next: (response) => {
        this.snackbarService.openSuccess('Expense Updated Successfully!');
        this.isSubmitting = false;  // Hide the loading spinner after submission
        this.router.navigate(['/expenses']);
        this.expenseForm.reset();
      },
      error: (err) => {
        this.snackbarService.openError('something went wrong');
        this.isSubmitting = false;  // Hide the loading spinner after submission fails
      }
    });
  }



  addExpenseData() {
    this.expenseService.addExpense(this.expenseForm.value).subscribe({
      next: (response) => {
        this.snackbarService.openSuccess('Expense Added Successfully!');
        this.isSubmitting = false;  // Hide the loading spinner after submission
        this.router.navigate(['/expenses']);
        this.expenseForm.reset();
      },
      error: (err) => {
        this.snackbarService.openError('something went wrong');
        this.isSubmitting = false;  // Hide the loading spinner after submission fails
      }
    });
  }
}
