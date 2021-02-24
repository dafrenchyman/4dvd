import {HttpClient} from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-tutorial-menu',
  templateUrl: './tutorial-menu.component.html',
  styleUrls: ['./tutorial-menu.component.css']
})
export class TutorialMenuComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<TutorialMenuComponent>, private _sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit() {
  }

  private closeTutorialMenu() {
    // closes the dialog box
    this.dialogRef.close();
  }

  private async getPDF() {
    try {
      const res = await this.http
        .get(`/assets/BasicFunctions4DVDTutorial.pdf`, { responseType: "blob" })
        .toPromise();
      window.open(window.URL.createObjectURL(res));
    } catch (e) {
      console.log(e);
    }
  }

}
