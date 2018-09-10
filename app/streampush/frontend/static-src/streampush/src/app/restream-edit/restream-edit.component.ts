import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { ApiService } from '../api.service';
import {BaseChartDirective} from "ng2-charts";
import {EndpointSelectorComponent} from "../endpoint-selector/endpoint-selector.component";

@Component({
  selector: 'app-restream-edit',
  templateUrl: './restream-edit.component.html',
  styleUrls: ['./restream-edit.component.css']
})
export class RestreamEditComponent implements OnInit {
  @ViewChild(EndpointSelectorComponent)
  public endpointSelector: EndpointSelectorComponent;

  @ViewChild('closeBtn')
  closeBtn:ElementRef;

  deleteTitle = "Are you sure?"
  deleteMessage = "This restream will be deleted permanently."

  loading = false

  @Input('restream') originalRestream: object;
  restream: object;
  @Output() onModify: EventEmitter<any> = new EventEmitter();

  newEndpoints:any[]

  constructor(private apiService: ApiService) { }

  refreshData() {
    this.restream = JSON.parse(JSON.stringify(this.originalRestream));
    this.restream['endpoints'].forEach((endpoint) => endpoint['selected'] = true);
    this.endpointSelector.pollEndpoints();
  }

  updateRestream() {
    this.loading = true;
    this.apiService.updateRestream(this.restream).subscribe((success) => {
      this.onModify.emit();
      this.closeBtn.nativeElement.click();
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
    console.log('update the restream with the api :)');
    console.log(this.restream);
  }

  ngOnInit() {
    this.refreshData();
  }

  delete() {
    this.apiService.deleteRestream(this.restream).subscribe((success) => {
      this.onModify.emit();
    }, (err) => {

    });
  }
}
