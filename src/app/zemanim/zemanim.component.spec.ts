/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ZemanimComponent } from './zemanim.component';

describe('ZemanimComponent', () => {
  let component: ZemanimComponent;
  let fixture: ComponentFixture<ZemanimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZemanimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZemanimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
