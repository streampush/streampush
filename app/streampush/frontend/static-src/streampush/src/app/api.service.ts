import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from './event';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends EventEmitter {
  basePath:string = "http://localhost:8000/api/v1/"
  chatSocket:WebSocket

  constructor(private http: HttpClient) {
    super();
    this._initWebSocket();
  }

  _initWebSocket() {
    this.chatSocket = new WebSocket(`ws://${window.location.host}/ws/notify`);
    
    this.chatSocket.onmessage = (msg) => {
      var data = JSON.parse(msg['data']);
      if (!data) {
        console.log('Invalid message received');
        console.log(msg);
        return;
      }
      this.emit(data.type, data);
    }
    
    this.chatSocket.onopen = (msg) => {
      this.emit('connected');
    }

    this.chatSocket.onclose = (msg) => {
      this.emit('disconnected');
    }
  }

  get(endpoint) {
    return this.http.get(this.basePath + endpoint)
  }

  getRestreams() {
    return this.get('restreams/me/');
  }

  getEndpoints() {
    return this.get('endpoints/me/');
  }
}
