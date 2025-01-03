import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Expense } from 'src/app/app.types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListExpensesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'amount', 'date', 'category', 'description', 'actions'];
  dataSource = new MatTableDataSource<Expense>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    // Fetch expenses from the API
    this.appService.getExpenses().subscribe((data: Expense[]) => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  addExpense(): void {
    // This function would add an expense
  }

  editExpense(expense: Expense): void {
    // This function would edit an expense
  }

  deleteExpense(expense: Expense): void {
    // This function would delete an expense
  }
}
