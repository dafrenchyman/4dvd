/*
    This module handles routing.. Currently only used to track page views in google analytics.
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GoogleAnalyticsComponent } from "./google-analytics.component";

// Only route is to a component that has an empty template. This is so the website can technically do a route
// so that google analytics will count a new page view.
const routes: Routes = [{ path: "**", component: GoogleAnalyticsComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
