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

@Component({
  selector: 'app-hierarchy-selection',
  templateUrl: './hierarchy-selection.component.html',
  styleUrls: ['./hierarchy-selection.component.scss'],
})
export class HierarchySelectionComponent {
    hierarchyLevels = [];
      title="";

      constructor(public dialogRef: MatDialogRef<HierarchySelectionComponent>,private dataService: TerminalService,@Inject(MAT_DIALOG_DATA) public data: any){
        this.title = data.title
        this.hierarchyLevels = data.list
      }
      ngOnInit() {
        this.getData();
      }

      getData(){
          const event = new terminalEvent('MERCHANT', 'SEARCH');
          const merchantRequest = new terminalBody(event);
          this.dataService.merchantData(merchantRequest).subscribe(
              response => {
                response.event.eventData.forEach(element => {
                    this.hierarchyLevels[0].values.push({
                        name:element.name,
                        id:element.id
                    })
                });
              },
              error => {
                  console.error('Error:', error);
              }
          )
      }

      getSelectedList(){

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

      selectItem(levelIndex: number, item) {
        this.hierarchyLevels[levelIndex].selectedValue = item;
        const merchantId = new midDevice(item.id);
        const merchantEvent = new midEvent(merchantId,'HIERARCHY','SEARCH');
        const mrHierarchy = new midHeirarchy(merchantEvent);
        this.dataService.getHierarchyFromMerchant(mrHierarchy).subscribe(
          response =>  {
            console.log(response.event.eventData);
            response.event.eventData.forEach(res => {
                this.hierarchyLevels[levelIndex + 1].values.push({
                    name: res.name,
                    id: res.id
                })
            });;
          }
        )

        // Reset all subsequent levels
        for (let i = levelIndex + 1; i < this.hierarchyLevels.length; i++) {
          this.hierarchyLevels[i].selectedValue = '';
          this.hierarchyLevels[i].values = [];
        }
      }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(this.hierarchyLevels);
  }

}
