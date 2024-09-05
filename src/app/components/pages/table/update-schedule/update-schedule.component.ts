import { Component } from '@angular/core';

interface Schedule {
  id: number;
  name: string;
  description: string;
  beginTime: string;
  endTime: string;
}

@Component({
  selector: 'app-update-schedule',
  templateUrl: './update-schedule.component.html',
  styleUrl: './update-schedule.component.scss'
})
export class UpdateScheduleComponent {
  schedules: Schedule[] = [];
  selectedSchedules: Set<number> = new Set();
  searchText: string = '';

  get selectedCount(): number {
    return this.selectedSchedules.size;
  }

  isAllSelected(): boolean {
    return this.schedules.length > 0 && this.selectedSchedules.size === this.schedules.length;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selectedSchedules.clear();
    } else {
      this.schedules.forEach(schedule => this.selectedSchedules.add(schedule.id));
    }
  }

  toggleSelection(schedule: Schedule): void {
    if (this.selectedSchedules.has(schedule.id)) {
      this.selectedSchedules.delete(schedule.id);
    } else {
      this.selectedSchedules.add(schedule.id);
    }
  }

  isSelected(schedule: Schedule): boolean {
    return this.selectedSchedules.has(schedule.id);
  }
}
