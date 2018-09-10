import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestreamsComponent } from './restreams.component';

describe('RestreamsComponent', () => {
  let component: RestreamsComponent;
  let fixture: ComponentFixture<RestreamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestreamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
