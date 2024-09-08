import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-hierarchy-form',
  templateUrl: './hierarchy-form.component.html',
  styleUrls: ['./hierarchy-form.component.scss'],
})
export class HierarchyFormComponent {
    itemForm: FormGroup;
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<HierarchyFormComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices,private dataService: TerminalService) {
    this.itemForm = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        ipStartAddress: [''],
        ipEndAddress: [''],
        locationIdentifier: [''],
        timeZone: ['']
      });
    this.shared.setSidebarState(false);
  }

  ngOnInit(){
     }


  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.itemForm.valid) {
        this.dialogRef.close(this.itemForm.value);
      }
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
