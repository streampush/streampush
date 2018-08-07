import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = "streampush"
  loggedIn: boolean = true

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // We should store auth token stuff locally or something
  }
}