import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'hackaton-2025-app';
  step = 1;

  onStart() {
    this.step = 2;
  }

  onRole(role: 'offreur' | 'demandeur') {
    alert('Vous avez choisi : ' + role);
  }
}
