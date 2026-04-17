import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../services/home.service';

@Component({
  selector: 'app-home-categories',
  templateUrl: './home-categories.component.html',
  styleUrls: ['./home-categories.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeCategoriesComponent {
  @Input() categories: Category[] = [];
  @Input() activeCategory = 'hot';
  @Output() categoryChange = new EventEmitter<string>();

  selectCategory(id: string) {
    this.categoryChange.emit(id);
  }
}
