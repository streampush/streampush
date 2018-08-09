import { Component, OnInit, Input } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-endpoint-selector',
  templateUrl: './endpoint-selector.component.html',
  styleUrls: ['./endpoint-selector.component.css'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: EndpointSelectorComponent, multi: true}
  ],
})
export class EndpointSelectorComponent implements OnInit, ControlValueAccessor {
  private changed = new Array<(value) => void>();
  private touched = new Array<() => void>();

  @Input('disabled') disabled: boolean;
  public endpoints:any[] = [];
  
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.pollEndpoints();
  }

  toggleEndpoint(endpoint) {
    if (this.disabled) return;

    var toToggle = this.endpoints.indexOf(endpoint);
    if (this.endpoints[toToggle]['selected'] == undefined) {
      this.endpoints[toToggle]['selected'] = true;
    } else {
      this.endpoints[toToggle]['selected'] = !this.endpoints[toToggle]['selected'];
    }
    this.fireChanged();
  }

  fireChanged() {
    this.changed.forEach((cb) => {
      cb(this.endpoints.filter((ep) => ep['selected'] == true));
    })
  }

  pollEndpoints() {
    this.apiService.getEndpoints()
    .subscribe((data:any[]) => {
      console.log('endpoints data')
      console.log(data);
      this.endpoints = data;
    });
  }

  touch() {
    this.touched.forEach(f => f());
  }

  writeValue(value:any[]) {
    this.endpoints.forEach((endpoint) => {
      endpoint.selected = (value.indexOf(endpoint) != -1);
    });
  }

  registerOnChange(fn: (value) => void) {
    this.changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }
}
