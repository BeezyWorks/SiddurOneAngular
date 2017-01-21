/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditTextComponent } from './edit-text.component';

describe('EditTextComponent', () => {
  let component: EditTextComponent;
  let fixture: ComponentFixture<EditTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
