import { Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TableInvestiment } from '../table-investiment/table-investiment';
import { CalcNewMember } from '../calc-new-member/calc-new-member';

@Component({
  selector: 'app-xuex',
  standalone: true,
  imports: [
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    TableInvestiment,
    CalcNewMember
  ],
  templateUrl: './xuex.html',
  styleUrls: ['./xuex.scss']
})
export class Xuex {
  active = signal<'ativo' | 'novo'>('ativo');

  setAtivo() {
    this.active.set('ativo');
  }

  setNovo() {
    this.active.set('novo');
  }
}
