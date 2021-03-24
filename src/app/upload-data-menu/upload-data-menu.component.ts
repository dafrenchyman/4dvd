import {Component, OnInit, ViewChild} from "@angular/core";
import {Dataset} from "../Dataset";
import {LatLonValCSV} from "./LatLonValCSV";
import {NameUnitsDateLevel} from "./NameUnitsDateLevel";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: "app-upload-data-menu",
  templateUrl: "./upload-data-menu.component.html",
  styleUrls: ["./upload-data-menu.component.css"]
})
export class UploadDataMenuComponent implements OnInit {

  user_level_id = [];
  user_name_and_level_id = [];

  userLatLonVal = [];
  userNameUnit = [];

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  constructor(private dialogRef: MatDialogRef<UploadDataMenuComponent>) {}

  ngOnInit() {}

  uploadListener($event: any): void {

    const text = [];
    const files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

        const headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = () => {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    const csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length === headerLength) {
        if (headerLength === 4) {
          const csvRecord: LatLonValCSV = new LatLonValCSV();
          csvRecord.GridBox_ID = curruntRecord[0].trim();
          csvRecord.Lat = curruntRecord[1].trim();
          csvRecord.Lon = curruntRecord[2].trim();
          csvRecord.Value = curruntRecord[3].trim();
          csvArr.push(csvRecord);
        } else {
          const csvRecord: NameUnitsDateLevel = new NameUnitsDateLevel();
          csvRecord.FullName = curruntRecord[0].trim();
          csvRecord.Units = curruntRecord[1].trim();
          csvRecord.DateStart = curruntRecord[2].trim();
          csvRecord.DateEnd = curruntRecord[3].trim();
          csvRecord.Level = curruntRecord[4].trim();
          console.log("csvRecord: ", csvRecord);
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
    console.log("my dataset: ", dataset);
    console.log("my get levels dataset: ", getLevelsDataset);
    console.log("my dataset dataset: ", getDatasetDataset);

    // closes the dialog box
    this.dialogRef.close({dataset, getLevelsDataset, getDatasetDataset});
  }

  // DATASET OBJ
  // public Name: string;
  // public FullName: string;
  // public Dataset_ID: number;
  // public DatabaseStore: string;
  // public OriginalLocation: string;
  // public StartDate: string;
  // public EndDate: string;
  // public Units: string;
  // public DefaultLevel: string;

  // const selectedDataset = this._model.settings.Datasets.find(myObj =>
  //   myObj.FullName.includes("Non-Gaussian|Air Temperature|Monthly Mean")
  // );

  // this._controller.loadLevels(selectedDataset);
  //   this._controller.loadDataset(selectedDataset, selectedDataset.StartDate, 1);
  //   setTimeout(() => {
  //     this.setSlider();
  //   }, 700);
}
