import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFroorAndSectionComponent } from './add-froor-and-section.component';

describe('AddFroorAndSectionComponent', () => {
  let component: AddFroorAndSectionComponent;
  let fixture: ComponentFixture<AddFroorAndSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFroorAndSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFroorAndSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
