import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { HierarchySelectionComponent } from 'src/app/components/dialogs/hierarchy-selection/hierarchy-selection.component';
import { midHeirarchy } from 'src/app/services/login/body/body';
import { midEvent } from 'src/app/services/login/body/event';
import { midDevice } from 'src/app/services/login/body/event-data';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';
interface HierarchyLevel {
    name: string;
    values: any[];
    selectedValue: string;
  }
@Component({
  selector: 'app-hierarchy-level',
  templateUrl: './hierarchy-level.component.html',
  styleUrl: './hierarchy-level.component.scss'
})
export class HierarchyLevelComponent {
    hierarchyLevels: HierarchyLevel[] = [
        { name: 'Merchant', values: [], selectedValue: '' },
        { name: 'Level 0', values: [], selectedValue: '' },
        { name: 'Level 1', values: [], selectedValue: '' },
        { name: 'Level 2', values: [], selectedValue: '' },
      ];

      constructor(private dataService: TerminalService,public dialog: MatDialog){}
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
        if (index >= 2 && this.hierarchyLevels.length > 2) {
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

      openDialog(): void {
        const dialogRef = this.dialog.open(HierarchySelectionComponent,{
            data:{
                title:'Hierarchy Levels',
                list:this.hierarchyLevels
            },
            width:'30%'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Implement delete functionality here
            console.log('User deleted');
          }
        });
      }
}
