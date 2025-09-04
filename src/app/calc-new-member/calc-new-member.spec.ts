import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcNewMember } from './calc-new-member';

describe('CalcNewMember', () => {
  let component: CalcNewMember;
  let fixture: ComponentFixture<CalcNewMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalcNewMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcNewMember);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
