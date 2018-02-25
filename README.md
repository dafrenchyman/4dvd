# climate2

This is the new Angular2 version of the 4D Visual Delivery (4DVD) Climate Visualization tool.  A working version of this web application can be found here: http://climate2.mrsharky.com

The database component is not included as part of this (and will be put in it's own repository when I've cleaned it up).

# Legal Information & Credits

Copyright (C) 2013-2018, San Diego State University Research Foundation.
Created by Julien Pierret and Dr. Samuel Shen, San Diego State University.

This software is being developed as part of my PhD dissertation work. It uses a lot of other open source libraries and files:
- http://c3js.org/: Timeseries charts
- https://d3js.org/: For the colorbar legend
- http://glmatrix.net/: For help with all the WebGL stuff
- http://jquery.com/: Makes this pure JavaScript project a little more managable
- http://jqueryui.com/: UI
- http://momentjs.com/: Time manipulation
- http://medialize.github.io/URI.js/: Used so the view information can be saved as part of the URL
- http://colorbrewer2.org/: Many different color schemes come from here
- http://www.naturalearthdata.com/: Shapefiles from there converted to .js files for this project
- ... I hopefully didn't leave anything out.... only open source libraries used

4DVD is free software. You can redistribute it and/or modify it under the terms of the GNU General Public License v3 as published by the Free Software Foundation. If not stated otherwise, this applies to all files contained in this package and its sub-directories (with the exception of the "node_modules" folder; the libraries I'm using as part of this may have different licenses invovled with them).

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
