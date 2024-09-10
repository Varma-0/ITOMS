import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
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
  hierarchyLevelsList= [];
    hierarchyLevels = [];
      title="";
    startLength;
    selectedPath: string;
    selectedItem: HierarchyItem;
    levelIndex: any;
    mId: any;
    pId: string;
    hlId: any;

      constructor(public dialogRef: MatDialogRef<HierarchySelectionComponent>,private dataService: TerminalService,@Inject(MAT_DIALOG_DATA) public data: any){
        this.title = data?.title
        this.hierarchyLevels = data?.list
        this.startLength = this.hierarchyLevels?.length;
      }
      ngOnInit() {
        this.getLevels();
      }

      getLevels() {
        this.hierarchyLevelsList = [];
        const event = new terminalEvent('MERCHANT', 'SEARCH');
        const payload = new terminalBody(event);
        this.dataService.hierarchyLevelData(payload).subscribe(
            response => {
                this.hierarchyLevelsList.push({
                    name: "MERCHANT",
                    pid: "",
                    items: [],
                    selectedItem: null
                });
                response.event.eventData.map(data => this.hierarchyLevelsList.push({
                    name: data.name,
                    pid: data.id,
                    items: [],
                    selectedItem: null
                }));
                this.loadMerchants();
            },
            error => {
                this.hierarchyLevelsList.push({
                    name: "MERCHANT",
                    pid: "",
                    items: [],
                    selectedItem: null
                });
                this.loadMerchants();
                console.error('Error:', error);
            }
        )
    }

    loadMerchants() {
        const event = new terminalEvent('MERCHANT', 'SEARCH');
        const merchantRequest = new terminalBody(event);
        this.dataService.merchantData(merchantRequest).subscribe(
            response => {
                response.event.eventData.map(data => this.hierarchyLevelsList[0].items.push({
                    name: data.name,
                    mid: data.id,
                }));
            },
            error => {
                console.error('Error:', error);
            }
        )
    }

    selectItem(levelIndex, level, item: HierarchyItem) {
        this.hierarchyLevelsList[levelIndex].selectedItem = item;
        this.hierarchyLevelsList[levelIndex+1] ? this.hierarchyLevelsList[levelIndex+1].items = [] : null;
        this.hierarchyLevelsList.map((data,i) => {
            if(i > levelIndex){
                data.items = []
            }
        })
        this.selectedItem = item;
        this.levelIndex = levelIndex;
        this.mId = item.mid;
        this.pId = level.name == "MERCHANT" ? null : item.id;
        this.hlId = this.hierarchyLevelsList[levelIndex+1]?.pid;
        if (level.name == "MERCHANT") {
            this.getSearchData(item.mid);
        } else {
            this.getChild(this.pId)
        }
        this.updateSelectedPath();
    }

    getChild(id){
        const payload = {
            "event": {
                "eventData": id,
                "eventType": "HIERARCHY_LEVEL",
                "eventSubType": "SEARCH"
            }
        }
        this.dataService.hierarchyChildData(payload).subscribe(
            response => {
                response.event.eventData.map(data =>this.hierarchyLevelsList[this.levelIndex + 1]?.items.push({
                    name: data.name,
                    pid: data.parentId,
                    hid: data.hlId,
                    mid: data.mid,
                    id: data.id
                }));
            },
            error => {
                console.error('Error:', error);
            }
        )
    }

    getSearchData(item){
        const payload = {
            "event": {
                "eventData": {
                    "mid": item
                },
                "eventType": "HIERARCHY",
                "eventSubType": "SEARCH"
            }
        }
        this.dataService.hierarchySearchData(payload).subscribe(
            response => {
                response.event.eventData.map(data => data.parentId == null ? this.hierarchyLevelsList[1].items.push({
                    name: data.name,
                    pid: data.parentId,
                    hid: data.hlId,
                    mid: data.mid,
                    id: data.id
                }) : null);
            },
            error => {
                console.error('Error:', error);
            }
        )
    }



      addLevel(level) {
          this.hierarchyLevels.push({
            name: `Level ${this.hierarchyLevels.length + 1}`
          });
      }

      removeLevel(index: number) {
        if (this.hierarchyLevels.length > 1) {
          this.hierarchyLevels.splice(index, 1);
        }
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
       const payload = {
            "event": {
                "eventData": {
                    "hierarchyLevels": this.hierarchyLevels.splice(this.startLength)
                },
                "eventType": "HIERARCHY_LEVEL",
                "eventSubType": "CREATE"
            }
        }
        this.dialogRef.close(payload);
    }
  }

}
