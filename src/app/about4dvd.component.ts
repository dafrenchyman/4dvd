import { HttpClient } from "@angular/common/http";
import { Component, OnInit} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  templateUrl: "./about4dvd.component.html",
  styleUrls: ["./about4dvd.component.css"]
})
export class About4dvdComponent implements OnInit {
  safeURL;
  videoURL = "https://www.youtube.com/watch?v=VFvWAFo4Lp8&t=1s";
  constructor(private _sanitizer: DomSanitizer, private http: HttpClient) {
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(
      this.videoURL
    );
  }

  ngOnInit() {}

  // TODO: This is a temporary location for the tutorials.
  //  When the interactive tutorial gets made, these tutorials will be offered alongside it and permanently moved there.
  // gets the PDF version of the Basic Functions of 4DVD Tutorial
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
