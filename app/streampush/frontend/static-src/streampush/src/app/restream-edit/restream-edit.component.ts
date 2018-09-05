import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-restream-edit',
  templateUrl: './restream-edit.component.html',
  styleUrls: ['./restream-edit.component.css']
})
export class RestreamEditComponent implements OnInit {
  deleteTitle = "Are you sure?"
  deleteMessage = "This restream will be deleted permanently."

  @Input('restream') restream: object;

  @Output() onModify: EventEmitter<any> = new EventEmitter();

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  delete() {
    this.apiService.deleteRestream(this.restream).subscribe((success) => {
      this.onModify.emit();
    }, (err) => {

    });
  }
}
