import { Component, ElementRef, QueryList, Renderer2, ViewChildren, AfterViewInit, OnInit, Input, ChangeDetectorRef, AfterViewChecked, EventEmitter, Output, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TerminalProfileComponent } from "src/app/components/dialogs/terminal-profile/terminal-profile.component";
import { TerminalService } from "src/app/services/terminal/devicelist";

@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.component.html',
  styleUrls: ['./group-profile.component.scss']
})
export class GroupProfileComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Output() dataChange = new EventEmitter<any>();
  formsArray!: FormArray;
  @ViewChildren('textarea') textareas!: QueryList<ElementRef<HTMLTextAreaElement>>;
  private nextIndex = 0;
  activeForm!: FormGroup;
  types = ['STRING','NUMBER','HEX','REFERENCE','BOOLEAN','TIME','DATE','DATETIME','STRING TEXT','HEX TEXT']
  ifDate = ['TIME','DATE','DATETIME']
  maxVal = ['STRING','NUMBER','HEX']
  showProfile = true;
  activeTab: string = 'Design';
  isEditing = false;
  extractedData: any;
    @Input() params;
    @Input() profile;
    @Input() packageId;
    error: string;
    update: boolean;
    deletedArray: any = [];
    @Output() back = new EventEmitter<string>();
    leftTabs: string[] = [];
    isModalOpen;
    nameInput;
    activeLeftTab: string = 'group';
    activeGroup;
    setActiveLeftTab(tab: string) {
    this.activeLeftTab = tab;
    this.activeGroup = this.getDetailsArrayByTitle(tab);
    }

  constructor(public dialog: MatDialog,private fb: FormBuilder, private renderer: Renderer2, private cdr: ChangeDetectorRef,private dataService: TerminalService) {}

  ngOnInit() {
    this.formsArray = this.fb.array([]);
    if(this.profile){
        this.prepopulate();
    }else{
        this.addGroupWithTitle('profile');
    }
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  // Closes the modal without saving data
  closeModal(): void {
    this.isModalOpen = false;
    this.nameInput = ''; // Reset the input field
  }

  // Closes the modal and logs the inputted name
  submitName(): void {
    if(!this.nameInput){
        alert("please enter name")
        return;
    }
    if(this.getDetailsArrayByTitle(this.nameInput)) {
        alert("Entered Sub Profile already exists")
        return;
    }
    this.addGroupWithTitle(this.nameInput);
    this.isModalOpen = false;
    this.nameInput = ''; // Clear input after submission
  }
  // Function to add a new group with a title and its FormArray
  addGroupWithTitle(title: string): void {
    // Create a new FormGroup containing the title and an empty FormArray
    const newGroup = this.fb.group({
      name: new FormControl(title), // Group name
      details: this.fb.array([])    // Empty FormArray for group details
    });

    // Push the new group into the main formsArray
    this.formsArray.push(newGroup);
  }

  deleteGroupByTitle(title: string): void {
    // Find the index of the group with the matching title
    const index = this.formsArray.controls.findIndex(
      (group) => (group as FormGroup).get('name')?.value === title
    );

    // If the group is found, remove it from the FormArray
    if (index !== -1) {
      this.formsArray.removeAt(index);
    }
  }

  // Function to add an item to a specific group's FormArray
  addItemToGroup(index: number, item: string): void {
    const group = this.formsArray.at(index) as FormGroup;
    const detailsArray = group.get('details') as FormArray;
    detailsArray.push(this.fb.control(item)); // Add new item to the FormArray
  }

  viewProfile(title:any){
    if(!this.leftTabs.includes(title))
        this.leftTabs.push(title);
    this.activeLeftTab = title;
    this.activeGroup = this.getDetailsArrayByTitle(title);
  }

  getDetailsArrayByTitle(title: string): FormArray | null {
    // Find the index of the group with the matching title
    const index = this.formsArray.controls.findIndex(
      (group) => (group as FormGroup).get('name')?.value === title
    );

    // If the group is found, return the 'details' FormArray
    if (index !== -1) {
      const group = this.formsArray.at(index) as FormGroup;
      return group.get('details') as FormArray;
    }

    return null; // Return null if the group is not found
  }

  // Function to get the details of a group based on its name
  getGroupDetailsByName(name: string): any | null {
    for (let i = 0; i < this.formsArray.length; i++) {
      const group = this.formsArray.at(i) as FormGroup;
      const currentName = group.get('name')?.value; // Get the group name

      if (currentName === name) {
        return group.get('details')?.value; // Return the details of the group
      }
    }
    return null; // Return null if no match is found
  }
  removeTab(tab) {
    // Logic to remove a tab from the list
    this.leftTabs = this.leftTabs.filter((t) => t !== tab);
  }
  performView(){
    this.activeForm?.updateValueAndValidity();
    const index = this.formsArray.controls.indexOf(this.activeForm);
    if (index !== -1) {
      this.formsArray.setControl(index, this.activeForm);
    }
    const data = [];
    this.formsArray.value.forEach(element => {
        data.push({
            title:element.label,
            defaultValue: element.default
        })
    });
    const dialogRef = this.dialog.open(TerminalProfileComponent, {
        data: {
          // title: 'Profile',
          items: data
        },
        width: '60%'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });

  }

  performSave() {
    if(!this.update){
        const map = {};
        const data = this.formsArray.value.map((data) => {
            const array = data.details.map(this.transformObject);
            map[data.name] = array;
        })
        const transformedArray = [];
        transformedArray.push(map);
            const payload = {
                "event": {
                    "eventData": {
                        "application": "itoms",
                        "packageId": this.packageId,
                        "parameterLogInfoList": transformedArray
                    },
                    "eventType": "PARAMETER",
                    "eventSubType": "CREATE"
                }
            }
            this.dataService.addParametrs(payload).subscribe(
                response => {
                  console.log("fd",response);
                }
              )
    }else{
        if(this.deletedArray.length > 0){
            const array = [];
            this.deletedArray.forEach(element => {
                array.push(element.id);
            });
            const payload = {
                "event": {
                    "eventData": array,
                    "eventType": "PARAMETER",
                    "eventSubType": "SEARCH"
                }
            }
            this.dataService.deleteParametrs(payload).subscribe(
                response => {
                  console.log("fd",response);
                }
              )
        }else{
            this.activeForm?.updateValueAndValidity();
            const index = this.formsArray.controls.indexOf(this.activeForm);
            if (index !== -1) {
              this.formsArray.setControl(index, this.activeForm);
            }
            const map = {};
            const data = this.formsArray.value.map((data) => {
                const array = data.details.map(this.transformObject);
                map[data.name] = array;
            })
            const transformedArray = [];
            transformedArray.push(map);
        console.log("wew",transformedArray);
    const payload = {
        "event": {
            "eventData": {
                "batchId": this.formsArray.value[0]?.batchId,
                "packageId": this.packageId,
                "parameterLogInfoList": transformedArray
            },
            "eventType": "PARAMETER",
            "eventSubType": "UPDATE"
        }
    }
    this.dataService.updateParametrs(payload).subscribe(
        response => {
          console.log("fd",response);
        }
      )
    }
}
this.back.emit("");
  }


   transformObject(input) {
    console.log("qfq",input.defaultValue);
    return {
        id: input.id,
        title: input.label,
        description: input.description,
        paramLabel: input.label,
        paramKey: input.key,
        maxLength: input.minvalue,
        minLength: input.maxvalue,
        nullable: input.manadatroy ? true : false,
        defaultValue: input.default,
        valueType: input.type
    };
}

  ngAfterViewInit() {
    this.textareas.changes.subscribe(() => this.adjustTextareaSizes());
  }

  ngAfterViewChecked() {
    this.adjustTextareaSizes(); // Ensure it runs after view changes
    this.cdr.detectChanges(); // Ensure changes are detected
  }

  getLabelValue(labelName: string, labels: any): string {
    switch (labelName) {
      case 'key':
        return labels['(*)Param Key'] || '';
      case 'label':
        return labels['(*)Param Label'] || '';
      case 'type':
        return labels['(*)Value Type'] || '';
      case 'maxvalue':
        return labels['(*)Max Length'] || '';
      case 'minvalue':
        return labels['(*)Min Length'] || '';
      case 'default':
        return labels['Default Value'] || '';
      case 'description':
        return labels['Description'] || '';
      default:
        return '';
    }
  }

  prepopulate(){
    const data = [
        {
          "profile": [
            {
              "title": "Label 3",
              "description": "",
              "paramLabel": "Label 3",
              "paramKey": "string",
              "maxLength": "",
              "minLength": 255,
              "nullable": false,
              "defaultValue": "",
              "valueType": "STRING"
            },
            {
              "title": "Label 4",
              "description": "",
              "paramLabel": "Label 4",
              "paramKey": "string",
              "maxLength": "",
              "minLength": 255,
              "nullable": false,
              "defaultValue": "",
              "valueType": "STRING"
            }
          ],
          "Test": [
            {
              "title": "Label 0",
              "description": "",
              "paramLabel": "Label 0",
              "paramKey": "string",
              "maxLength": "",
              "minLength": 255,
              "nullable": false,
              "defaultValue": "",
              "valueType": "STRING"
            },
            {
              "title": "Label 1",
              "description": "",
              "paramLabel": "Label 1",
              "paramKey": "string",
              "maxLength": "",
              "minLength": 255,
              "nullable": false,
              "defaultValue": "",
              "valueType": "STRING"
            },
            {
              "title": "Label 2",
              "description": "",
              "paramLabel": "Label 2",
              "paramKey": "string",
              "maxLength": "",
              "minLength": 255,
              "nullable": false,
              "defaultValue": "",
              "valueType": "STRING"
            }
          ]
        }
      ]
    Object.keys(data[0]).forEach((key) => {
        const item = data[0][key];
        this.addGroupWithTitle(key);
        const array = this.getDetailsArrayByTitle(key);
        item.forEach(item => {
            if(item.paramLabel && !item.delete){
                const newForm: FormGroup = this.fb.group({
                    batchId: [item.batchId],
                    id:[item.id],
                    label: [item.paramLabel],
                    key: [item.paramKey],
                    type: [item.valueType],
                    default: [item.defaultValue],
                    maxvalue: [item.maxLength],
                    minvalue: [item.minLength],
                    manadatroy: [item.nullable],
                    description: [item.description]
                  });
                  array.push(newForm);
                  this.update = true;
            }
        });
    });
        // this.profile.forEach(item => {
        //     if(!item.paramLabel){
        //         const newForm: FormGroup = this.fb.group({
        //             label: [this.getLabelValue('label',item)],
        //             key: [this.getLabelValue('key',item)],
        //             type: [this.getLabelValue('type',item)],
        //             default: [this.getLabelValue('default',item)],
        //             maxvalue: [this.getLabelValue('maxvalue',item)],
        //             minvalue: [this.getLabelValue('minvalue',item)],
        //             manadatroy: [''],
        //             description: [this.getLabelValue('description',item)]
        //           });
        //           this.formsArray.push(newForm);
        //           this.update = false;
        //     }
        // })
    this.cdr.detectChanges(); // Ensure changes are detected after populating
  }

  adjustTextareaSizes() {
    if (this.textareas) {
      const width = window.innerWidth * 0.23;
      const height = 50;
      this.textareas.forEach((textarea) => {
        this.renderer.setStyle(textarea.nativeElement, 'width', `${width}px`);
        this.renderer.setStyle(textarea.nativeElement, 'height', `${height}px`);
      });
    }
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.showProfile = tab === 'Design';
  }

  createNewForm() {
    const newForm: FormGroup = this.fb.group({
      label: [`Label ${this.nextIndex}`],
      key: ['string'],
      type: ['STRING'],
      default: [''],
      maxvalue: [255],
      minvalue: [''],
      manadatroy: [''],
      description: ['']
    });

    this.activeGroup.push(newForm);
    this.nextIndex++;
    this.setActiveForm(newForm); // Set active form to the newly created form
  }

  setActiveForm(form: FormGroup) {
    this.activeForm = form;
  }

  typeChange(){
   const type = this.activeForm.get('type').value;
   if(type === 'NUMBER'){
    this.activeForm.get('default').setValue(0);
    this.activeForm.get('maxvalue').setValue(255);
   }else if(type === 'HEX'){
    this.activeForm.get('default').setValue('');
    this.activeForm.get('maxvalue').setValue(2048);
   }else if(type === 'BOOLEAN'){
    this.activeForm.get('default').setValue(true);
    this.activeForm.get('maxvalue').setValue('');
   }else if(type === 'STRING TEXT' || type === 'HEX TEXT' || type === 'TIME' || type === 'DATETIME' || type === 'DATE'){
    this.activeForm.get('default').setValue('');
    this.activeForm.get('maxvalue').setValue('');
   }else if(type === 'STRING'){
    this.activeForm.get('default').setValue('');
    this.activeForm.get('maxvalue').setValue(255);
   }

   this.activeForm.updateValueAndValidity();
}

  triggerPicker(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.showPicker(); // For modern browsers
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');
    inputElement.value = inputValue;
  }

  removeForm(index: number) {
    this.deletedArray.push(this.formsArray.value[index]);
    this.formsArray.removeAt(index);
    if (this.formsArray.length > 0) {
      this.activeForm = this.formsArray.at(0) as FormGroup; // Set active form to the first form if any remain
    } else {
      this.activeForm = undefined!; // Reset active form if no forms remain
    }
  }
}
