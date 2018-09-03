import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private apiService: ApiService) { }

  loading:boolean = false

  username:string
  password:string

  ngOnInit() {
  }

  tryLogin() {
    this.loading = true;
    this.apiService.login(this.username, this.password).subscribe((success) => {
      window.location.reload();
    }, (error) => {
      this.loading = false;
      this.username = "";
      this.password = "";
    })
  }
}
