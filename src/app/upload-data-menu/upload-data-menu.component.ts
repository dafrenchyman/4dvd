import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Dataset } from "../Dataset";
import { LatLonValCSV } from "./LatLonValCSV";
import { NameUnitsDateLevel } from "./NameUnitsDateLevel";

@Component({
  selector: "app-upload-data-menu",
  templateUrl: "./upload-data-menu.component.html",
  styleUrls: ["./upload-data-menu.component.css"]
})
export class UploadDataMenuComponent implements OnInit {
  userLatLonVal = [];
  userNameUnit = [];
  validCSV1 = false;
  validCSV2 = false;

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  constructor(private dialogRef: MatDialogRef<UploadDataMenuComponent>) {}

  ngOnInit() {}

  uploadCSV1($event: any): void {
    const files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

        const headersRow = this.getHeaderArray(csvRecordsArray);

        if (csvRecordsArray.length === 16382 && headersRow.length === 4) {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          this.validCSV1 = true;
        } else {
          this.validCSV1 = false;
        }
      };

      reader.onerror = () => {
        console.log('error has occurred while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  uploadCSV2($event: any): void {
    const files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

        const headersRow = this.getHeaderArray(csvRecordsArray);

        if (csvRecordsArray.length === 3 && headersRow.length === 5) {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          this.validCSV2 = true;
        } else {
          this.validCSV2 = false;
        }
      };

      reader.onerror = () => {
        console.log('error has occurred while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    const csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const currRecord = (csvRecordsArray[i] as string).split(',');
      if (currRecord.length === headerLength) {
        if (headerLength === 4) {
          const csvRecord: LatLonValCSV = new LatLonValCSV();
          csvRecord.GridBox_ID = currRecord[0].trim();
          csvRecord.Lat = currRecord[1].trim();
          csvRecord.Lon = currRecord[2].trim();
          csvRecord.Value = currRecord[3].trim();
          csvArr.push(csvRecord);
        } else {
          const csvRecord: NameUnitsDateLevel = new NameUnitsDateLevel();
          csvRecord.FullName = currRecord[0].trim();
          csvRecord.Units = currRecord[1].trim();
          csvRecord.DateStart = currRecord[2].trim();
          csvRecord.DateEnd = currRecord[3].trim();
          csvRecord.Level = currRecord[4].trim();
          csvArr.push(csvRecord);
        }
      }
    }
    if (headerLength === 4) {
      this.userLatLonVal = csvArr;
    } else {
      this.userNameUnit = csvArr;
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  bothFilesUploaded() {
    return this.userLatLonVal.length > 0 && this.userNameUnit.length > 0;
  }

  submitFiles() {
    const dataset = new Dataset({
      Name: this.userNameUnit[0].FullName,
      FullName: this.userNameUnit[0].FullName,
      Dataset_ID: 1000,
      DatabaseStore: "user",
      OriginalLocation: "user",
      StartDate: this.userNameUnit[0].DateStart,
      EndDate: this.userNameUnit[0].DateEnd,
      Units: this.userNameUnit[0].Units,
      DefaultLevel: this.userNameUnit[0].Level
    });

    const getLevelsDataset = new Object({Level_ID: ["1"], Name: ["Level 1"]});
    const getDatasetDataset = new Object({GridBox_ID: this.userLatLonVal.map((a) => parseInt(a.GridBox_ID, 10)), Lat: this.userLatLonVal.map((a) => parseInt(a.Lat, 10)), Lon: this.userLatLonVal.map((a) => parseInt(a.Lon, 10)), Value: this.userLatLonVal.map((a) => parseFloat(a.Value)), ValueFinal: this.userLatLonVal.map((a) => parseFloat(a.Value)), Date: dataset.StartDate });
    const usingUserData = true;

    // closes the dialog box
    this.dialogRef.close({usingUserData, dataset, getLevelsDataset, getDatasetDataset});
  }
}
