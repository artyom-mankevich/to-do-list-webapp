import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindersContainerComponent } from './reminders-container.component';

describe('RemindersContainerComponent', () => {
  let component: RemindersContainerComponent;
  let fixture: ComponentFixture<RemindersContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemindersContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
