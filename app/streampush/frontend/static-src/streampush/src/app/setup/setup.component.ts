import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  constructor(private apiService: ApiService) { }

  loading:boolean = false

  username:string
  email:string
  password:string
  passwordConfirm:string
  passwordsMatch:boolean = true

  ngOnInit() {
  }

  checkPasswords(event) {
    this.passwordsMatch = this.password === this.passwordConfirm;
  }

  trySetup() {
    if (this.password !== this.passwordConfirm) {
      this.passwordsMatch = false;
      return;
    }

    this.loading = true;
    this.apiService.setup(this.username, this.email, this.password).subscribe((succ) => {
      window.location.reload();
    }, (err) => {
      this.loading = false;
    })
  }
}
