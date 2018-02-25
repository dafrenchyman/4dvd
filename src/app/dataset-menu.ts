import {Component, Inject, ViewChild} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {ColorMap} from "./ColorMap";
import {createElement} from "@angular/core/src/view/element";

declare var d3: any;

/**
 * Created by dafre on 6/1/2017.
 */


@Component({
  templateUrl: './dataset-menu.html'
})
export class DatasetMenu {

  private _MenuDataFull : {
    Name: string,
    FullName: string,
    Dataset_ID: number,
    DatabaseStore: string,
    OriginalLocation: string,
    StartDate: string,
    EndDate: string,
    Units: string,
    DefaultLevel: string
  }[];


  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
    this._MenuDataFull = data;
  }


}
