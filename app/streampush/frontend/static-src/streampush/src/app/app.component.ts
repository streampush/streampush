import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = "streampush"
  loggedIn: boolean = false
  loading: boolean = true

  setup: boolean = false

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.checkLogin((loggedIn) => {
      this.loading = false;

      this.setup = loggedIn == "setup";
      if (this.setup) return;

      this.loggedIn = loggedIn;
      console.log(`Logged in: ${loggedIn}`)
    });
  }
}