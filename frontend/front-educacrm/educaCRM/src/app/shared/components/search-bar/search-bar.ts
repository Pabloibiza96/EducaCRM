import { Component, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="input-group" style="max-width: 320px;">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
      <input 
        class="form-control" 
        [placeholder]="placeholder()" 
        [(ngModel)]="query">
    </div>
  `
})
export class SearchBarComponent {
  query = model<string>('');
  placeholder = model<string>('Buscar...');
}
