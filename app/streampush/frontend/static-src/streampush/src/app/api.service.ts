import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from './event';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends EventEmitter {
  basePath:string = `//${window.location.host}/api/v1/`
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

  getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }

  get(endpoint) {
    return this.http.get(this.basePath + endpoint)
  }

  post(endpoint, data) {
    return this.http.post(this.basePath + endpoint, data, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.getCookie("csrftoken")
      }
    })
  }

  createRestream(data) {
    return this.post('restreams/create', data);
  }

  createEndpoint(name, url) {
    return this.post('endpoints/create', {
      url,
      name
    });
  }

  getRestreams() {
    return this.get('restreams/me/');
  }

  getEndpoints() {
    return this.get('endpoints/me/');
  }

  getBitrates(restreams) {
    return this.post('bitrate/', restreams);
  }

  getBrand(string) {
    var brand = "none"
    if (string.indexOf("twitch.tv") != -1)
      brand = "twitch"
    else if (string.indexOf("facebook.com") != -1)
      brand = "facebook"
    else if (string.indexOf("youtube.com")  != -1)
      brand = "youtube"
    return brand
  }
}
