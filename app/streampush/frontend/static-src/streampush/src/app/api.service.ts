import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from './event';
import ReconnectingWebSocket from 'reconnectingwebsocket'
import {ApiSimulatorService} from "./api-simulator.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService extends EventEmitter {
  basePath:string = `//${window.location.host}/api/v1/`;
  notifySocket:WebSocket;
  loggedIn:boolean = false;

  constructor(private http: HttpClient, private apiSim: ApiSimulatorService) {
    super();
    this._initWebSocket();
  }

  _initWebSocket() {
    const prefix = (window.location.protocol == 'https:' ? "wss" : "ws");
    this.notifySocket = new ReconnectingWebSocket(`${prefix}://${window.location.host}/ws/notify`);
    
    this.notifySocket.onmessage = (msg) => {
      const data = JSON.parse(msg['data']);
      if (!data) {
        console.log('Invalid message received');
        console.log(msg);
        return;
      }
      this.emit(data.type, data);
    };
    
    this.notifySocket.onopen = (msg) => {
      this.emit('connected');
    };

    this.notifySocket.onclose = (msg) => {
      this.emit('disconnected');
    };
  }

  wsConnected() {
    return this.notifySocket.readyState == 1;
  }

  getCookie(name) {
    var match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) return match[2];
  }

  get(endpoint) {
    return this.http.get(this.basePath + endpoint)
  }

  delete(endpoint) {
    return this.http.delete(this.basePath + endpoint)
  }

  post(endpoint, data) {
    return this.http.post(this.basePath + endpoint, data, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.getCookie("csrftoken")
      }
    });
  }

  put(endpoint, data) {
    return this.http.put(this.basePath + endpoint, data, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.getCookie("csrftoken")
      }
    });
  }

  createRestream(data) {
    if (isDevMode()) return this.apiSim.createRestream(data);
    return this.post('restreams/create', data);
  }

  deleteRestream(restream) {
    if (isDevMode()) return this.apiSim.deleteRestream(restream);
    return this.delete(`restreams/${restream.id}/`);
  }

  createEndpoint(name, url) {
    if (isDevMode()) return this.apiSim.createEndpoint(name, url);
    return this.post('endpoints/create', {
      url,
      name
    });
  }

  updateRestream(restream) {
    if (isDevMode()) return this.apiSim.updateRestream(restream);
    return this.put(`restreams/${restream.id}/`, restream);
  }

  setup(username, email, password) {
    if (isDevMode()) return this.apiSim.setup(username, email, password);
    return this.post('setup', {
      username,
      email,
      password
    });
  }

  checkLogin(cb) {
    if (isDevMode()) return this.apiSim.checkLogin(cb);
    this.getBackendStatus().subscribe((data) => {
      this.loggedIn = true;
      cb(this.loggedIn);
    }, (err) => {
      if (err.status == 404) {
        cb("setup");
        return;
      }

      this.loggedIn = false;
      cb(this.loggedIn);
    });
  }

  login(username, password) {
    if (isDevMode()) return this.apiSim.login(username, password);
    return this.post('auth', {
      username,
      password
    });
  }

  logout() {
    this.notifySocket.close();
    return this.delete('auth');
  }

  getRestreams() {
    if (isDevMode()) return this.apiSim.getRestreams();
    return this.get('restreams/me/');
  }

  getEndpoints() {
    if (isDevMode()) return this.apiSim.getEndpoints();
    return this.get('endpoints/me/');
  }

  getBitrates(restreams) {
    return this.post('bitrate/', restreams);
  }

  getBrand(string) {
    var brand = "none";
    if (string.indexOf("twitch.tv") != -1)
      brand = "twitch";
    else if (string.indexOf("facebook.com") != -1)
      brand = "facebook";
    else if (string.indexOf("youtube.com")  != -1)
      brand = "youtube";
    return brand
  }

  getBackendStatus() {
    return this.get('status');
  }
}
