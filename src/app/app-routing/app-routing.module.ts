import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from '../app.component';
import {About4dvdComponent} from '../about4dvd/about4dvd.component';

const routes: Routes = [
  {
    path: 'about4dvd',
    component: About4dvdComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule {

}
