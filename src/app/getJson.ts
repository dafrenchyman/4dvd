/**
 * Created by dafre on 5/11/2017.
 */

import { Component, Injectable, Input } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Rx";

@Injectable()
export class GetJson {
  constructor(private http: Http) {}

  public getAll(jsonFile: string): Promise<object> {
    return this.http
      .get(jsonFile)
      .toPromise()
      .then(response => {
        return response.json();
      })
      .catch(err => {
        console.log(err);
      });
  }
}
