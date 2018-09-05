import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestreamEditComponent } from './restream-edit.component';

describe('RestreamEditComponent', () => {
  let component: RestreamEditComponent;
  let fixture: ComponentFixture<RestreamEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestreamEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestreamEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
