import { TestBed, inject } from '@angular/core/testing';

import { ApiSimulatorService } from './api-simulator.service';

describe('ApiSimulatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiSimulatorService]
    });
  });

  it('should be created', inject([ApiSimulatorService], (service: ApiSimulatorService) => {
    expect(service).toBeTruthy();
  }));
});
