import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-restreams',
  templateUrl: './restreams.component.html',
  styleUrls: ['./restreams.component.css']
})
export class RestreamsComponent implements OnInit {
  restreams:any = []

  public newRestreamName:string;
  public newRestreamEndpoints:any = []

  constructor(private apiService: ApiService) { 
    // Subscribe to live messages and instantly pollRestreams for data
    this.apiService.on('publish', this.pollRestreams.bind(this));
    this.apiService.on('publish_done', this.pollRestreams.bind(this));
  }

  createRestream() {
    console.log(this.newRestreamName)
    console.log(this.newRestreamEndpoints)
  }

  cancel() {
    
  }

  pollRestreams() {
    this.apiService.getRestreams()
    .subscribe((data) => {
        this.restreams = data;
    });
  }

  ngOnInit() {
    setInterval(() => {
      this.pollRestreams();
    }, 10 * 1000);

    this.pollRestreams();
  }
}
