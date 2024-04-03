import { TestBed } from '@angular/core/testing';

import { ExtractdataService } from './extractdata.service';

describe('ExtractdataService', () => {
  let service: ExtractdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtractdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
