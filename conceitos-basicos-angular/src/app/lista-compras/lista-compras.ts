import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemLista } from './itemlista';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-compras',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './lista-compras.html',
  styleUrl: './lista-compras.scss'
})
export class ListaCompras {

  item: string = '';
  lista: ItemLista[] = [];


  adicionarItem() {

  let itemLista = new ItemLista();
  itemLista.nome = this.item;
  itemLista.id = this.lista.length + 1;
  itemLista.comprado = false;

  this.lista.push(itemLista);
  console.log('Item recebido', this.item);
  console.table(this.lista);
  this.item = '';
  }

  riscarItem(item: ItemLista) {
    item.comprado = !item.comprado;
  }

  limparLista() {
    this.lista = [];
  }

}
