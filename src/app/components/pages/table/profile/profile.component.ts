import { Component, ElementRef, QueryList, Renderer2, ViewChildren, AfterViewInit, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  formsArray!: FormArray;
  @ViewChildren('textarea') textareas!: QueryList<ElementRef<HTMLTextAreaElement>>;
  private nextIndex = 0;
  activeForm!: FormGroup;
  types = ['String','Number','Hex','Boolean','Time','Date','DateTime','String Text','Hex Text']
  ifDate = ['Time','Date','DateTime']
  maxVal = ['String','Number','Hex']
  showProfile = true;
  activeTab: string = 'Design';
  isEditing = false;
  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.showProfile = tab == 'Design' ? true : false;

  }

  constructor(private fb: FormBuilder, private renderer: Renderer2) {}

  ngOnInit() {
    this.formsArray = this.fb.array([]);
  }

  ngAfterViewInit() {
    this.textareas.changes.subscribe(() => this.adjustTextareaSizes());
  }

  viewParameters(data){
    this.showProfile = data == 'design' ? true : false;
  }

  createNewForm() {
    const newForm: FormGroup = this.fb.group({
      label: [`Label ${this.nextIndex}`],
      key: ['string'],
      type: ['String'],
      default: [''], // Default value for textarea
    //   dateformat: [''],
      maxvalue: [255], // Default max value
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
   if(type == 'Number'){
    this.activeForm.get('default').setValue(0);
    this.activeForm.get('maxvalue').setValue(255);
   }else if(type == 'Hex'){
    this.activeForm.get('default').setValue('');
    this.activeForm.get('maxvalue').setValue(2048);
   }else if(type == 'Boolean'){
    this.activeForm.get('default').setValue(true);
    this.activeForm.get('maxvalue').setValue('');
   }else if(type == 'String Text' || type ==  'Hex Text' || type == 'Time' || type == 'DateTime' || type == 'Date'){
    this.activeForm.get('default').setValue('');
    this.activeForm.get('maxvalue').setValue('');
   }else if(type == 'String'){
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

  adjustTextareaSizes() {
    const width = window.innerWidth * 0.23;
    const height = 50;
    this.textareas.forEach((textarea) => {
      this.renderer.setStyle(textarea.nativeElement, 'width', `${width}px`);
      this.renderer.setStyle(textarea.nativeElement, 'height', `${height}px`);
    });
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
