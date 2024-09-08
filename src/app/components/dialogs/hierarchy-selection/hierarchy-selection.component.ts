import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { midHeirarchy } from 'src/app/services/login/body/body';
import { midEvent } from 'src/app/services/login/body/event';
import { midDevice } from 'src/app/services/login/body/event-data';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

interface HierarchyItem {
    id: string;
    name: string;
    [key: string]: any;
  }

  interface HierarchyLevel {
    name: string;
    items: HierarchyItem[];
    selectedItem: HierarchyItem | null;
  }
@Component({
  selector: 'app-hierarchy-selection',
  templateUrl: './hierarchy-selection.component.html',
  styleUrls: ['./hierarchy-selection.component.scss'],
})
export class HierarchySelectionComponent {
  hierarchyLevelsList: HierarchyLevel[] = [
    { name: 'Merchant', items: [], selectedItem: null },
    { name: 'Country', items: [], selectedItem: null },
    { name: 'State', items: [], selectedItem: null },
    { name: 'City', items: [], selectedItem: null },
  ];
    hierarchyLevels = [];
      title="";
    selectedPath: string;

      constructor(public dialogRef: MatDialogRef<HierarchySelectionComponent>,private dataService: TerminalService,@Inject(MAT_DIALOG_DATA) public data: any){
        this.title = data.title
        this.hierarchyLevels = data.list
        this.hierarchyLevelsList[0].items = data.list.merchants;
      }
      ngOnInit() {
      }


      addLevel() {
          this.hierarchyLevels.push({
            name: `Level ${this.hierarchyLevels.length + 1}`,
            values: [{
                name:'ye',
                id:'ejn'
            },{
                name:'dfi',
                id:'j'
            }],
            selectedValue: ''
          });
      }

      removeLevel(index: number) {
        if (this.hierarchyLevels.length > 1) {
          this.hierarchyLevels.splice(index, 1);
        }
      }

      selectItem(levelIndex: number, item: HierarchyItem) {
        this.hierarchyLevelsList[levelIndex].selectedItem = item;
        // this.selectedItem = item;

        // Reset all subsequent levels
        for (let i = levelIndex + 1; i < this.hierarchyLevelsList.length; i++) {
          this.hierarchyLevelsList[i].selectedItem = null;
          this.hierarchyLevelsList[i].items = [];
        }

        // Load children for the next level
        if (levelIndex < this.hierarchyLevelsList.length - 1) {
          this.loadChildrenForLevel(levelIndex + 1, item);
        }

        this.updateSelectedPath(); // New method call
      }

      updateSelectedPath() {
        this.selectedPath = this.hierarchyLevelsList
          .filter(level => level.selectedItem)
          .map(level => level.selectedItem!.name)
          .join(' >> ');
      }


      loadChildrenForLevel(levelIndex: number, parentItem: HierarchyItem) {
        const childrenKeys = ['countries', 'states', 'cities'];
        const childKey = childrenKeys[levelIndex - 1];

        if (parentItem[childKey]) {
          this.hierarchyLevelsList[levelIndex].items = parentItem[childKey];
        } else {
          this.hierarchyLevelsList[levelIndex].items = [];
        }
      }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if(this.title == 'Select Hierarchy'){
        this.dialogRef.close(this.selectedPath);
    }else{
        this.dialogRef.close(this.hierarchyLevels);
    }
  }

}
