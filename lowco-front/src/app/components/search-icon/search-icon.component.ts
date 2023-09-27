import { Component, EventEmitter, Input, Output } from '@angular/core';
import Icons from 'ionicons/dist/ionicons.json';

@Component({
  selector: 'app-search-icon',
  templateUrl: './search-icon.component.html',
  styleUrls: ['./search-icon.component.scss'],
})
export class SearchIconComponent {
  items = Icons;
  segment = 'outline';
  @Input() selectedIcon: string;
  @Input() title: string;

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string>();

  filteredItems: { name: string; tags: string[] }[];
  // keysToValues = Object.create(ionicons)
  search = '';
  // ioniconsKeys = Object.keys(ionicons);

  ngOnInit() {
    this.filteredItems = this.items.icons.filter((icon) =>
      icon.name.toLowerCase().endsWith(this.segment)
    );
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.selectedIcon);
  }

  searchbarInput(event: any) {
    this.search = event.target.value.toLowerCase();
    this.filteredItems = this.searchFilter(
      this.getIconsToSegment(this.segment)
    );
  }

  searchFilter(toFilter: { name: string; tags: string[] }[]) {
    return toFilter.filter(
      (icon) =>
        icon.tags.filter((tag) => tag.toLowerCase().includes(this.search))
          .length >= 1
    );
  }

  getIconsToSegment(seg: string) {
    if (seg == 'filled') {
      return this.items.icons.filter(
        (icon) =>
          !icon.name.toLowerCase().endsWith('outline') &&
          !icon.name.toLowerCase().endsWith('sharp')
      );
    } else {
      return this.items.icons.filter(
        (icon) =>
          icon.name.toLowerCase().endsWith(seg) ||
          icon.tags.filter((tag) => tag.toLowerCase().includes('logo'))
            .length >= 1
      );
    }
  }

  selectIcon(selected: string) {
    this.selectedIcon = selected;
    this.confirmChanges();
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value;
    this.filteredItems = this.searchFilter(
      this.getIconsToSegment(this.segment)
    );    
  }
}
