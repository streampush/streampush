import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendStatsComponent } from './backend-stats.component';

describe('BackendStatsComponent', () => {
  let component: BackendStatsComponent;
  let fixture: ComponentFixture<BackendStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
