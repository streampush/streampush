import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamKeyComponent } from './stream-key.component';

describe('StreamKeyComponent', () => {
  let component: StreamKeyComponent;
  let fixture: ComponentFixture<StreamKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
