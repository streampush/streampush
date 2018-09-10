import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-backend-stats',
  templateUrl: './backend-stats.component.html',
  styleUrls: ['./backend-stats.component.css']
})

export class BackendStatsComponent implements OnInit {

  status = {
    web: 'secondary',
    redis: 'secondary',
    relay: 'secondary'
  };

  constructor(public apiService: ApiService) { 
    
  }

  ngOnInit() {
    this.apiService.on("connected", () => {
      this.status.web = this.apiService.wsConnected() ? 'success' : 'danger';
    });

    this.apiService.on("disconnected", () => {
      this.status.web = this.apiService.wsConnected() ? 'success' : 'danger';
    });

    setInterval(() => {
      this.status.web = this.apiService.wsConnected() ? 'success' : 'danger';
      if (!this.apiService.wsConnected()) {
        this.status.redis = 'warning';
        this.status.relay = 'warning';
      } else {
        this.apiService.getBackendStatus().subscribe((data) => {
          this.status.redis = data["redis"];
          this.status.relay = data["relay"];
        });
      }
    }, 1000);
  }

  tryLogout() {
    this.apiService.logout().subscribe((success) => {
      window.location.reload()
    }, (error) => {
      alert("Error logging out. This shouldn't happen.");
    })
  }
}