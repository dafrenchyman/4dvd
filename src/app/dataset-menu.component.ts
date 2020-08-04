import { Component, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";

declare var d3: any;

/**
 * Created by dafre on 6/1/2017.
 */

@Component({
  templateUrl: "./dataset-menu.component.html"
})
export class DatasetMenuComponent {
  private list;

  private _MenuDataFull: Array<{
    Name: string;
    FullName: string;
    Dataset_ID: number;
    DatabaseStore: string;
    OriginalLocation: string;
    StartDate: string;
    EndDate: string;
    Units: string;
    DefaultLevel: string;
  }>;

  OpenDatasetDialog(menu_location) {
    const curr_menu = menu_location;

    const dialogRef = this.dialog.open(DatasetMenuComponent, {
      data: menu_location
    });
    let selected_dataset: string;
    dialogRef.afterClosed().subscribe(result => {
      selected_dataset = result;
      if (result !== undefined) {
        this.dialogRef.close(result);
      }
      return result;
    });
    return selected_dataset;
  }

  SelectDataset(dataset) {
    // const dialogRef = this.dialog.open(DatasetMenuComponent, {data: dataset});
    this.dialogRef.close(dataset);
    // this.dialog.closeAll();
    return dataset.fullPath;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DatasetMenuComponent>
  ) {
    this._MenuDataFull = data;
    this.list = data;
    this.dialogRef = dialogRef;
  }
}
