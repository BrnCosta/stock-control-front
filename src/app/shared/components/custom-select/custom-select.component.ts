import { Component, Input, Output, EventEmitter, computed, viewChild, viewChildren, effect, afterRenderEffect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxPopupContainer,
} from '@angular/aria/combobox';
import {Listbox, Option} from '@angular/aria/listbox';
import {OverlayModule} from '@angular/cdk/overlay';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer, Listbox, Option, OverlayModule],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.css'
})
export class CustomSelectComponent {
  @Input() label: string = '';
  @Input() id: string = `select-${Math.random().toString(36).substr(2, 9)}`;
  @Input() placeholder: string = 'Select';
  @Input() options: any[] = [];
  @Input() value: any;
  @Input() allowCustomValue: boolean = false;
  @Output() valueChange = new EventEmitter<any>();

  searchString = signal('');

  listbox = viewChild<Listbox<any>>(Listbox);
  optionElements = viewChildren<Option<any>>(Option);
  combobox = viewChild<Combobox<any>>(Combobox);

  displayValue = computed(() => {
    const values = this.listbox()?.values() || [];
    return values.length ? values[0] : (this.value || this.placeholder);
  });

  get filteredOptions(): any[] {
    const search = this.searchString().toLowerCase();
    if (!search || !this.allowCustomValue) return this.options;
    return this.options.filter(o => o?.toString().toLowerCase().includes(search));
  }

  onInputChange(event: Event) {
    if (this.allowCustomValue) {
      const val = (event.target as HTMLInputElement).value;
      if (val !== this.value) {
        this.value = val;
        this.valueChange.emit(val);
      }
    }
  }

  constructor() {
    afterRenderEffect(() => {
      const option = this.optionElements().find((opt) => opt.active());
      setTimeout(() => option?.element.scrollIntoView({block: 'nearest'}), 50);
    });

    afterRenderEffect(() => {
      if (this.combobox() && !this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
      }
    });

    effect(() => {
      const values = this.listbox()?.values();
      if (values && values.length > 0) {
        const selected = values[0];
        if (selected !== this.value) {
           this.value = selected;
           if (this.allowCustomValue) {
             this.searchString.set(selected.toString());
           }
           setTimeout(() => this.valueChange.emit(selected));
        }
      }
    });
  }
}
