import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userData: any;
  status: string = '';
  title = 'the-binary-beasts-fe';

  constructor(private router: Router, private _appService: AppService, public authService: AuthService) { }

  ngOnInit() {

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to dashboard or another page)
  }
}
