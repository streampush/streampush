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
    // The box you're typing into will never equal event, therefore if
    // event equals the value of the other box, the passwords are the
    // same.
    this.passwordsMatch = (this.password === event) || (this.passwordConfirm === event);
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
    });
  }
}
