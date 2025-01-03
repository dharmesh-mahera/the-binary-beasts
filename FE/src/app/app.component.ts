import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userData: any;
  status: string = '';
  title = 'the-binary-beasts-fe';

  constructor(private _appService: AppService) { }

  ngOnInit() {
  
  }
}
