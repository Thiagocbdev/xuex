import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xuex } from './xuex';

describe('Xuex', () => {
  let component: Xuex;
  let fixture: ComponentFixture<Xuex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Xuex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Xuex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
