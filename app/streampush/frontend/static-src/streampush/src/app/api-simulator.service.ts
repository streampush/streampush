import {Injectable} from '@angular/core';
import {Restream} from "./restream";
import {Endpoint} from "./endpoint";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ApiSimulatorService {
  myRestreams: Restream[] = [];
  myEndpoints: Endpoint[] = [];

  constructor() { }

  private makeResp(status, data) {
    return of<Object>(data);
  }

  private success(data) {
    return this.makeResp(200, data);
  }

  createRestream(data) {
    this.myRestreams.push(data);
    return this.success(data);
  }

  deleteRestream(restream) {
    for (var i = 0; i < this.myRestreams.length; i++) {
      if (this.myRestreams[i].id == restream.id) {
        this.myRestreams = this.myRestreams.slice(i, 1);
        break;
      }
    }
    return this.makeResp(204, undefined);
  }

  createEndpoint(name, url) {
    var fakeEndpoint: Endpoint = {
      name,
      url,
      id: Math.random().toString(36).substring(7).repeat(4),
      brand: "hooli"
    };

    this.myEndpoints.push(fakeEndpoint);
    return this.success(fakeEndpoint);
  }

  updateRestream(restream) {
    for (var i = 0; i < this.myRestreams.length; i++) {
      if (this.myRestreams[i].id == restream.id) {
        this.myRestreams[i] = restream;
        break;
      }
    }
    return this.success(restream);
  }

  setup(username, email, password) {
    return this.success(undefined);
  }

  checkLogin(cb) {
    cb(true);
  }

  login(username, password) {
    return this.success(undefined);
  }

  getRestreams() {
    return this.success(this.myRestreams);
  }

  getEndpoints() {
    return this.success(this.myEndpoints);
  }
}
