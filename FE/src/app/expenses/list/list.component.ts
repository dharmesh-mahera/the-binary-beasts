import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Expense, ExpenseApiResponse } from 'src/app/app.types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListExpensesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['amount', 'category', 'description', 'date', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private appService: AppService,private router: Router) {}

  ngOnInit(): void {
    // Fetch expenses from the API
  this.getExpenses();
    
  }


  getExpenses() {
    this.appService.getExpenses().subscribe((data: ExpenseApiResponse) => {
      this.dataSource.data = data.expenses;
      this.appService.expenses = data.expenses;
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  addExpense(): void {
    this.router.navigate(['/expenses/add']);
    // This function would add an expense
  }

  editExpense(expense: Expense): void {
    const url  = `/expenses/edit/${expense.id}`
    this.router.navigate([url]);
    // This function would edit an expense
  }

  deleteExpense(expense: Expense): void {
    this.appService.deleteExpenses(expense.id).subscribe((res) => {
      this.getExpenses();
    })
    // This function would delete an expense
  }
}
