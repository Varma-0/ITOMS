import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';


@Component({
  selector: 'app-setting-dialog',
  templateUrl: './setting-dialog.component.html',
  styleUrl: './setting-dialog.component.scss'
})
export class SettingDialogComponent {
  searchQueryCurrent: string = '';
  searchQueryOptional: string = '';
  hoveredApp: any = null;
  addApps = [];
  icons: string[] = [
    // 'assets/img/linux-icon.png',
    'assets/img/android-logo.png'
  ];
  movedToCurrent = [];
  id = '';
  oldApps = [];
  constructor(public dialogRef: MatDialogRef<SettingDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any ,private shared:SharedServices,private dataService: TerminalService) {
    this.shared.setSidebarState(false);
    console.log(data)
    this.id = data.id;
  }

  ngOnInit() {
    this.getSettingsData();
    this.loadPackages();
  }

  moveToOptional(app: any) {
    // Remove app from currentApps and add it to optionalApps
    this.oldApps = this.oldApps.filter(a => a !== app);
    this.addApps.push(app);
    this.movedToCurrent = this.movedToCurrent.filter(a=> a.name != app.name);
    // this.movedToCurrent.pop(app);

  }

  moveToCurrent(app: any) {
    // Remove app from optionalApps and add it to currentApps
    this.addApps = this.addApps.filter(a => a !== app);
    this.oldApps.push(app);
    console.log("sssas",app)
    this.movedToCurrent.push(app);
  }

  loadPackages() {
    const payload = {
      "event": {
          "eventType": "PACKAGE",
          "eventSubType": "SEARCH"
        }
    }
    this.dataService.getPackageList(payload).subscribe(
      response => {
        console.log(response)
        this.addApps = response.event.eventData.map(data => ({
          id: data.id,
          name: data.name,
          type: data.type,
          version: data.version,
          icon: this.getRandomIcon(),
          fulldate: data.createdBy.ts.split('T')[0],
          deleted: data.deleted
        }));
      }
    )
  }

  getRandomIcon(): string {
    const randomIndex = Math.floor(Math.random() * this.icons.length);
    return this.icons[randomIndex];
  }
  


  getSettingsData() {
    const payload = {
      "event": {
        "eventData": this.id,
        "eventType": "DEPLOYMENT",
        "eventSubType": "CREATE"
      }
    }
    this.dataService.settingsInDeployment(payload).subscribe(
      response => {
        console.log("21821",response);
        this.oldApps = response.event.eventData.map(data => ({
          ...data, // Spread the existing data
          icon: this.getRandomIcon() // Assign a random icon
        }));
      }
    );
  }
  
  confirm() {
    this.dialogRef.close(this.movedToCurrent);
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }

}
