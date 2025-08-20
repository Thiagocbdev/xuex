import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type Row = {
  day: number;
  times: number;      // aplicações no dia (4 ou 2)
  bonus: number;      // bônus aplicado (apenas no dia 1)
  value: number;      // saldo no começo do dia
  profit: number;     // ganhos do dia
  cumProfit: number;  // ganhos acumulados
  final: number;      // saldo ao fim do dia
};

@Component({
  selector: 'app-calc-new-member',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,           // para o pipe | number
    ReactiveFormsModule,   // para [formGroup]
    CdkTableModule,        // garante as diretivas estruturais da tabela
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './calc-new-member.html',
  styleUrls: ['./calc-new-member.scss']
})
export class CalcNewMember {
  displayedColumns: string[] = ['day', 'times', 'bonus', 'value', 'profit', 'cumProfit', 'final'];
  dataSource: Row[] = [];

  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    initial: [1000, [Validators.required, Validators.min(0)]],
    days: [30, [Validators.required, Validators.min(1), Validators.max(365)]],
  });

  /** taxa por aplicação (0,6% = 0.006) */
  private readonly RATE = 0.006;

  /** nº de aplicações por dia (1–4: 4x; >=5: 2x) */
  private dayTimes(day: number): number {
    return day <= 4 ? 4 : 2;
  }
  /** fator diário com composição */
  private dayFactor(day: number): number {
    return Math.pow(1 + this.RATE, this.dayTimes(day));
  }
  /** bônus inicial conforme faixa */
  private initialBonus(initial: number): number {
    if (initial >= 1000 && initial < 2000) return 40;
    if (initial >= 2000 && initial < 3000) return 120;
    if (initial >= 3000 && initial <= 5000) return 210;
    return 0;
  }

  calcular(): void {
    if (this.form.invalid) return;

    const initialInput = Number(this.form.value['initial']);
    const days = Number(this.form.value['days']);

    const bonus = this.initialBonus(initialInput);
    let saldoInicio = initialInput + bonus; // bônus entra antes do dia 1

    const rows: Row[] = [];
    let acumulado = 0;

    for (let d = 1; d <= days; d++) {
      const times = this.dayTimes(d);
      const fator = this.dayFactor(d);
      const lucro = saldoInicio * (fator - 1);
      const saldoFim = saldoInicio + lucro;

      acumulado += lucro;

      rows.push({
        day: d,
        times,
        bonus: d === 1 ? bonus : 0,
        value: saldoInicio,
        profit: lucro,
        cumProfit: acumulado,
        final: saldoFim
      });

      saldoInicio = saldoFim;
    }

    this.dataSource = rows;
  }

  limpar(): void {
    this.form.patchValue({ initial: null, days: 30 });
    this.dataSource = [];
  }

  // Implementado para não quebrar o template; ajuste depois se quiser
  exportarPdf(): void {
    // opcional: implemente com jsPDF como no seu outro componente
    console.log('exportarPdf() – implemente se desejar');
  }

  get totalBonus(): number {
    return this.dataSource.reduce((acc, r) => acc + (r.bonus || 0), 0);
  }
  get totalInvestido(): number {
    return this.dataSource.length ? this.dataSource[0].value : 0;
  }
  get totalLucro(): number {
    return this.dataSource.reduce((acc, r) => acc + r.profit, 0);
  }
  get saldoFinal(): number {
    return this.dataSource.length ? this.dataSource[this.dataSource.length - 1].final : 0;
  }
}
