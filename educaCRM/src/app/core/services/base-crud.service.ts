import { signal } from '@angular/core';

export class BaseCrudService<T extends { id: number }> {
  readonly items = signal<T[]>([]);

  setAll(list: T[]) { this.items.set(list); }
  add(item: T) {
    const arr = this.items();
    item.id = arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;
    this.items.set([...arr, item]);
  }
  update(id: number, changes: Partial<T>) {
    this.items.set(this.items().map(i => i.id === id ? { ...i, ...changes } : i));
  }
  delete(id: number) { this.items.set(this.items().filter(i => i.id !== id)); }
  findById(id: number) { return this.items().find(i => i.id === id) || null; }
}