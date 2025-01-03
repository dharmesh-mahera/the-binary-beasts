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
  displayedColumns: string[] = ['id', 'amount', 'date', 'category', 'description', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private appService: AppService,private router: Router) {}

  ngOnInit(): void {
    // Fetch expenses from the API
    this.appService.getExpenses().subscribe((data: ExpenseApiResponse) => {
      console.log(data);
      this.dataSource.data = data.expenses;
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
    // This function would delete an expense
  }
}
