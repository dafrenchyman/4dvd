import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TutorialMenuComponent } from "./tutorial-menu/tutorial-menu.component";

@Component({
  templateUrl: "./about4dvd.component.html",
  styleUrls: ["./about4dvd.component.css"]
})
export class About4dvdComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  private openTutorialDialog() {
    const dialogRef = this.dialog.open(TutorialMenuComponent);
  }
}
