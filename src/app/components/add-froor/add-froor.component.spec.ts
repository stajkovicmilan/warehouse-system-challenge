import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFroorComponent } from './add-froor.component';

describe('AddFroorComponent', () => {
  let component: AddFroorComponent;
  let fixture: ComponentFixture<AddFroorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFroorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFroorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
