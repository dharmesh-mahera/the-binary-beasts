import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExpensesComponent } from './expenses/list/list.component';
import { AddEditExpenseComponent } from './expenses/add-edit/add-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'expenses', pathMatch: 'full' },
  { path: 'expenses', component: ListExpensesComponent },
  { path: 'expenses/add', component: AddEditExpenseComponent },
  { path: 'expenses/edit/:id', component: AddEditExpenseComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
