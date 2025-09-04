import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [   MatToolbarModule, MatButtonModule, MatMenuModule,RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

}
