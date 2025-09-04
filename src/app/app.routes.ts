import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Calculadora } from './calculadora/calculadora';
import { ListaCompras } from './lista-compras/lista-compras';
import { TableInvestiment } from './table-investiment/table-investiment';
import { Xuex } from './xuex/xuex';

export const routes: Routes = [
  {
    path: '',
    component: Xuex,
    children: [
      { path: 'calculadora', component: Calculadora },
      { path: 'lista-compras', component: ListaCompras },
      { path: 'table-insvesitment', component: TableInvestiment },

     // { path: 'menu3', component: GenericPageComponent, data: { title: 'Menu 3' } },
     // { path: 'menu4', component: GenericPageComponent, data: { title: 'Menu 4' } },
     // { path: '', pathMatch: 'full', redirectTo: 'calculadora' } // ou 'home' se preferir
    ]
  },
  { path: '**', redirectTo: '' }
];
