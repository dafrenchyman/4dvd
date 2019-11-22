import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { About4dvdComponent } from './about4dvd.component';

describe('About4dvdComponent', () => {
  let component: About4dvdComponent;
  let fixture: ComponentFixture<About4dvdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ About4dvdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(About4dvdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
