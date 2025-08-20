import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type Row = {
  day: number;
  value: number;          // saldo no começo do dia
  profit: number;         // ganhos do dia
  cumProfit: number;      // ganhos acumulados
  final: number;          // saldo no fim do dia
};

@Component({
  selector: 'app-table-investiment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './table-investiment.html',
  styleUrls: ['./table-investiment.scss']
})
export class TableInvestiment {

  displayedColumns: string[] = ['day', 'value', 'profit', 'cumProfit', 'final'];
  dataSource: Row[] = [];

  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    initial: [1000, [Validators.required, Validators.min(0)]],
    days: [30, [Validators.required, Validators.min(1), Validators.max(365)]],
  });

  /** Juros fixos: 0,6% aplicados 2x ao dia */
  private readonly RATE_PERCENT = 0.6;
  private readonly TIMES_PER_DAY = 2;

  /** Fator diário composto com 2 aplicações de 0,6% */
  private dayFactor(): number {
    const r = this.RATE_PERCENT / 100;    // 0.006
    return Math.pow(1 + r, this.TIMES_PER_DAY); // (1+0.006)^2
  }

  calcular(): void {
    if (this.form.invalid) return;

    const initial = Number(this.form.value['initial']);
    const days = Number(this.form.value['days']);
    const fator = this.dayFactor();

    const rows: Row[] = [];
    let saldoInicio = initial;
    let acumulado = 0;

    for (let d = 1; d <= days; d++) {
      const lucro = saldoInicio * (fator - 1);
      const saldoFim = saldoInicio + lucro;
      acumulado += lucro;

      rows.push({
        day: d,
        value: saldoInicio,
        profit: lucro,
        cumProfit: acumulado,
        final: saldoFim
      });

      saldoInicio = saldoFim; // próximo dia começa com o saldo final do dia
    }

    this.dataSource = rows;
  }

  limpar(): void {
    this.form.patchValue({ initial: null, days: 30 });
    this.dataSource = [];
  }

  /** Exporta para PDF com jsPDF + autoTable */
  async exportarPdf(): Promise<void> {
    if (!this.dataSource.length) return;

    const [{ default: jsPDF }, autoTable] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable') as unknown as Promise<any>
    ]);

    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

    // Título
    doc.setFontSize(14);
    doc.text('Tabela de Investimentos', 40, 40);
    doc.setFontSize(10);
    doc.text(`Juros: 0,6% x 2 ao dia | Dias: ${this.dataSource.length}`, 40, 58);

    // Tabela
    (autoTable as any).default(doc, {
      startY: 70,
      head: [['Dia', 'Valor', 'Ganhos do dia', 'Ganhos acumulados', 'Valor final']],
      body: this.dataSource.map(r => ([
        r.day,
        r.value.toFixed(2),
        r.profit.toFixed(2),
        r.cumProfit.toFixed(2),
        r.final.toFixed(2)
      ])),
      styles: { halign: 'right' },
      headStyles: { halign: 'center' },
      columnStyles: {
        0: { halign: 'center' }, // Dia
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
      },
      foot: [[
        'Totais',
        this.totalInvestido.toFixed(2),
        this.totalLucro.toFixed(2),
        this.totalLucro.toFixed(2),
        this.saldoFinal.toFixed(2),
      ]],
      footStyles: { fontStyle: 'bold' }
    });

    doc.save('tabela-investimentos.pdf');
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
