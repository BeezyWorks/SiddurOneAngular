/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SiddurComponent } from './siddur.component';

describe('SiddurComponent', () => {
  let component: SiddurComponent;
  let fixture: ComponentFixture<SiddurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiddurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiddurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
