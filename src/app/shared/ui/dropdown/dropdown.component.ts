import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';

export interface DropdownItem {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgClass, OverlayModule],
  template: `
    <button
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      (click)="toggle($event)"
      class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-400 bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      @if (label) {
        <span>{{ label }}</span>
      } @else {
        <i class="ri-more-2-fill"></i>
      }
      <i class="ri-arrow-down-s-line text-sm" [ngClass]="{ 'rotate-180': open }"></i>
    </button>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open"
      [cdkConnectedOverlayPositions]="positions"
      cdkConnectedOverlayHasBackdrop
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      (backdropClick)="close()"
      (detach)="close()"
    >
      <div class="min-w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-500 py-1">
        @for (item of items; track item.label) {
          <button
            (click)="select(item)"
            [disabled]="item.disabled"
            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            [ngClass]="item.disabled
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            @if (item.icon) {
              <i [class]="item.icon + ' text-base'"></i>
            }
            {{ item.label }}
          </button>
        }
      </div>
    </ng-template>
  `,
})
export class DropdownComponent {
  @Input({ required: true }) items: DropdownItem[] = [];
  @Input() label = '';

  open = false;

  readonly positions: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
  ];

  toggle(event: Event): void {
    event.stopPropagation();
    this.open = !this.open;
  }

  close(): void {
    this.open = false;
  }

  select(item: DropdownItem): void {
    if (item.disabled) return;
    item.action();
    this.close();
  }
}
