import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointSelectorComponent } from './endpoint-selector.component';

describe('EndpointSelectorComponent', () => {
  let component: EndpointSelectorComponent;
  let fixture: ComponentFixture<EndpointSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndpointSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
