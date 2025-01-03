import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExpensesComponent } from './expenses/list/list.component';
import { AddEditExpenseComponent } from './expenses/add-edit/add-edit.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'expenses', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'expenses', component: ListExpensesComponent, canActivate: [AuthGuard] },
  { path: 'expenses/add', component: AddEditExpenseComponent, canActivate: [AuthGuard] },
  { path: 'expenses/edit/:id', component: AddEditExpenseComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
