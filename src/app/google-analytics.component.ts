import { Component } from "@angular/core";

// allows for use of gtag function declared in index.html
declare let gtag: any;

@Component({
  selector: "app-google-analytics",
  template: ""
})
export class GoogleAnalyticsComponent {
  // Will allow for more analytics tracking (i.e. track button presses) if we want to do that
  // some time in the future.
  // All of the events can be found here: https://developers.google.com/analytics/devguides/collection/gtagjs/events
  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel?: string,
    eventValue?: number
  ) {
    gtag("event", eventName, {
      eventCategory,
      eventLabel,
      eventAction,
      eventValue
    });
  }

  constructor() {}
}
