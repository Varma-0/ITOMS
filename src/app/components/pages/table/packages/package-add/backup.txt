import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { DesignSelectionComponent } from 'src/app/components/dialogs/design-selection/design-selection.component';
import { SelectCfgComponent } from 'src/app/components/dialogs/select-cfg/select-cfg.component';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

interface SelectedCard {
  id: string;
  name: string;
}
@Component({
  selector: 'app-package-add',
  templateUrl: './package-add.component.html',
  styleUrl: './package-add.component.scss'
})
export class PackageAddComponent {
  @ViewChild('stepper') private stepper!: MatStepper;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() view: any;
  @Input() insideview: any;
  @Output() viewChange = new EventEmitter<boolean>();
  @Output() insideviewChange = new EventEmitter<boolean>();
  steps: string[] = ['Upload File', 'Details', 'Release', 'Param'];
  currentStep: number = 1;
  maxFileSize: number = 500;

  appTypes = [
    { name: 'Android', icon: 'assets/img/android-logo.png' },
    { name: 'Linux', icon: 'assets/img/linux-icon.png' },
    // { name: 'RTOS', icon: 'assets/img/rtos.png' }
  ];
  selectedType: any = null;
  isUploaded: boolean = false;
  fileName: string = ''; 
  fileSize: number = 0;
  modelsList: any[] = [];
  isUploading = false;
  size: any[] = ['100Mb','300Mb','110Mb','50Mb','105Mb','95mb','280mb','75mb','69mb','250mb'];
  selectedCards: SelectedCard[] = [];
  extractedInfo: {
    name: string;
    version: string;
  } = {
    name: '',
    version: '',
  };
  onlyName: string;
  version: string;
  uploadedFile: File | null = null;
  type: string;
  blobFile: File;
  randomSize: string = '';

  constructor(private http: HttpClient, private dataService: TerminalService,private router:Router) {}

  selectType(type: any) {
    this.selectedType = type;
  }

  ngOnInit() {
    this.getRandomSize();
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  redirect(name){
    this.router.navigate(['/table/parameters'], {
        queryParams: { name: name }
      });

  }

  getRandomSize() {
    const randomIndex = Math.floor(Math.random() * this.size.length);
    this.randomSize = this.size[randomIndex];
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  async handleFile(file: File) {
    if (file.size > this.maxFileSize * 1024 * 1024) {
      alert(`File size exceeds ${this.maxFileSize}MB limit.`);
      return;
    }
    
    if (file.name.toLowerCase().endsWith('.zip')) {
      this.isUploading = true;
      try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        console.log(contents.files)
        let appFile: JSZip.JSZipObject | null = null;
        console.log(appFile);


        // contents.forEach((relativePath, zipEntry) => {
        // console.log(relativePath,zipEntry)

        //   if (relativePath['name'].endsWith('.apk') || relativePath['name'].endsWith('.nld')) {
        //     appFile = zipEntry;
        //   } 
        // });
        contents.forEach((relativePath, zipEntry) => {
          // if (this.selectedType.name === 'Android' && relativePath.endsWith('.apk')  || relativePath.endsWith('.APK')) {
            this.type = "apk"
            appFile = zipEntry;
          // } else if (this.selectedType.name === 'Linux' && relativePath.endsWith('.nld')  || relativePath.endsWith('.NLD')) {
          //   this.type = "nld"
          //   appFile = zipEntry;
          // }
        });

        if (appFile) {
          // Extract info from APK or NLD file
          var appInfoData = await appFile.async('blob'); // Get the file data as a Blob
          this.blobFile = new File([appInfoData], appFile.name, { type: 'application/octet-stream' });
          const appData = await appFile.async('uint8array');
          const { name, version } = await this.extractAppInfo(appData, appFile.name);

          this.extractedInfo = { name, version };
          // this.nextStep();
          this.fileName = appFile.name;
          console.log(this.fileName);
          const parts = this.fileName.split('.');
          parts.length > 1 ? this.fileName =  parts.slice(0, -1).join('.'):''
          this.onlyName = this.fileName.split('_')[0]
          this.version = this.fileName.split('_')[1]
          this.fileSize = file.size;
          console.log("efqq",this.fileName,this.fileSize);
          this.isUploaded = true;
          setTimeout(() => {
            this.fileName = file.name;
            this.fileSize = file.size;
            this.isUploading = false;
            this.isUploaded = true;
          }, 2000);
          // this.uploadedFile = file;
        } else {
          alert('ZIP file must contain one APK or NLD file.');
        }
      } catch (error) {
        console.error('Error processing ZIP file:', error);
        alert('Error processing ZIP file. Please try again.');
      }
    } else {
      alert('Please upload a ZIP file.');
    }
  }

  // selectCard(card: any): void {
  //   card.selected = !card.selected;
  //   this.selectedCard = {
  //     id: card.modelId,
  //     name: card.name,
  //   };
  //   console.log('Selected Card:', this.selectedCard);
  // }
  selectCard(card: any): void {
    card.selected = !card.selected;

    if (card.selected) {
      // Add the card to selectedCards if it's not already there
      if (!this.selectedCards.some(selectedCard => selectedCard.id === card.modelId)) {
        this.selectedCards.push({
          id: card.modelId,
          name: card.name,
        });
      }
    } else {
      // Remove the card from selectedCards if it's there
      this.selectedCards = this.selectedCards.filter(selectedCard => selectedCard.id !== card.modelId);
    }

    console.log('Selected Cards:', this.selectedCards);
  }

  get selectedCount(): number {
    return this.modelsList.filter(card => card.selected).length;
  }

  async uploadPackage() {
    if (!this.blobFile) {
      console.error('No file uploaded');
      return;
    }

    // const formData = new FormData();
    const formData = new FormData();
    formData.append('multipartFile', this.blobFile);

    const jsonData = {
        "event":{
           "eventData":{
              "name":`${this.onlyName}.${this.type}`,
              "description":"sample package for testing",
              "version":this.version,
              "type":"apk",
              "postInstallationAction":"REBOOT",
              "platformType":"ANDROID",
              "packageTypeIdentifier":"APPLICATION",
              "tags":"",
              "packageFile":{
                 "filePath":"INA-TMS/INA-TMS/TMS-PACKAGES",
                 "fileSize":this.randomSize,
                 "fileName":"InaImagePackage"
              },
              "models":this.selectedCards
           },
           "eventType":"PACKAGE",
           "eventSubType":"CREATE"
        }
    };

    formData.append('json', JSON.stringify(jsonData));
    this.dataService.uploadPackage(formData).subscribe(
      response => {
        console.log(response,"uploadPackage");
      },
      error => {
          console.error('Error:', error);
      }
    )
  }

  resetUpload() {
    this.isUploaded = false;
    this.fileName = '';
    this.fileSize = 0;
    this.onlyName = '';
    this.version = '';
    this.fileInput.nativeElement.value = '';
    this.extractedInfo = { name: '', version: '' };
  }

  async extractAppInfo(data: Uint8Array, fileName: string): Promise<{ name: string, version: string }> {
    if (fileName.toLowerCase().endsWith('.apk') || fileName.toLowerCase().endsWith('.APK')) {
      return this.extractApkInfo(data);
    } else if (fileName.toLowerCase().endsWith('.nld') || fileName.toLowerCase().endsWith('.NLD')) {
      return this.extractNldInfo(data);
    } else {
      throw new Error('Unsupported file type');
    }
  }
  
  extractApkInfo(data: Uint8Array): { name: string, version: string } {
    const content = new TextDecoder().decode(data);
    const nameMatch = content.match(/application-label:'(.+?)'/);
    const versionMatch = content.match(/versionName='(.+?)'/);
    
    return {
      name: nameMatch ? nameMatch[1] : 'Unknown',
      version: versionMatch ? versionMatch[1] : 'Unknown'
    };
  }
  
  extractNldInfo(data: Uint8Array): { name: string, version: string } {
    const content = new TextDecoder().decode(data);
    const nameMatch = content.match(/NAME:\s*(.+)/i);
    const versionMatch = content.match(/VERSION:\s*(.+)/i);
    
    return {
      name: nameMatch ? nameMatch[1].trim() : 'Unknown',
      version: versionMatch ? versionMatch[1].trim() : 'Unknown'
    };
  }

  async getModelsApi() {
    const event = new terminalEvent('MODEL', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.dataService.modelData(terminalRequest).subscribe(
      response => {
        this.modelsList = response.event.eventData.map(data => ({
          modelId: data.id,
          name: data.name,
          // oem: data.oem,
          // description: data.description,
          // fulldate: data.createdBy.ts.split('T')[0],
          // delete: data.delete
        }));
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  nextStep() {
    console.log("wegw",this.currentStep);
    this.currentStep === 1 ? this.getModelsApi(): '';
    this.currentStep === 2 ? this.uploadPackage()    : '';
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      // this.stepper.next();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      // this.stepper.previous();
    }
  }

  toggleView() {
    this.view = !this.view;
    this.insideview = !this.insideview;
    this.viewChange.emit(this.view);
    this.insideviewChange.emit(this.insideview);
  }
}
