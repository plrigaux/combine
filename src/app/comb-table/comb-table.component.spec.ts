import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombTableComponent } from './comb-table.component';

describe('CombTableComponent', () => {
  let component: CombTableComponent;
  let fixture: ComponentFixture<CombTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
