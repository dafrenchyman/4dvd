import {Component, Inject, Input, ViewChild} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import { DatasetMenu } from 'dataset-menu.component.ts';

declare var d3: any;

/**
 * Created by dafre on 6/1/2017.
 */


@Component({
  selector: 'nav-item',
  templateUrl: './datasetMenu.component.html'
})
export class DatasetMenuComponents {

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

  @Input() private navItems: NavItem[];


}
