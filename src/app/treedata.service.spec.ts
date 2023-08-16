import { TestBed } from '@angular/core/testing';

import { TreedataService } from './treedata.service';

describe('TreedataService', () => {
  let service: TreedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
