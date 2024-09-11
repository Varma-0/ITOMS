import { Component, ElementRef, QueryList, Renderer2, ViewChildren, AfterViewInit, OnInit, Input, ChangeDetectorRef, AfterViewChecked, EventEmitter, Output, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { TerminalService } from "src/app/services/terminal/devicelist";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Output() dataChange = new EventEmitter<any>();
  formsArray!: FormArray;
  @ViewChildren('textarea') textareas!: QueryList<ElementRef<HTMLTextAreaElement>>;
  private nextIndex = 0;
  activeForm!: FormGroup;
  types = ['STRING','NUMBER','HEX','BOOLEAN','TIME','DATE','DATETIME','STRING TEXT','HEX TEXT']
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

  constructor(private fb: FormBuilder, private renderer: Renderer2, private cdr: ChangeDetectorRef,private dataService: TerminalService) {}

  ngOnInit() {
    this.formsArray = this.fb.array([]);
    if(this.profile){
        this.prepopulate();
    }
  }

  performSave() {
    const transformedArray = this.formsArray.value.map(this.transformObject);
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
  }

   transformObject(input) {
    return {
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
    this.profile.forEach(item => {
        const newForm: FormGroup = this.fb.group({
            label: [this.getLabelValue('label',item)],
            key: [this.getLabelValue('key',item)],
            type: [this.getLabelValue('type',item)],
            default: [this.getLabelValue('default',item)],
            maxvalue: [this.getLabelValue('maxvalue',item)],
            minvalue: [this.getLabelValue('minvalue',item)],
            manadatroy: [''],
            description: [this.getLabelValue('description',item)]
          });
          this.formsArray.push(newForm);
    });
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

    this.formsArray.push(newForm);
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
    this.formsArray.removeAt(index);
    if (this.formsArray.length > 0) {
      this.activeForm = this.formsArray.at(0) as FormGroup; // Set active form to the first form if any remain
    } else {
      this.activeForm = undefined!; // Reset active form if no forms remain
    }
  }
}
