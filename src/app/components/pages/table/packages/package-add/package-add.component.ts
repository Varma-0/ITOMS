import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { DesignSelectionComponent } from 'src/app/components/dialogs/design-selection/design-selection.component';
import { SelectCfgComponent } from 'src/app/components/dialogs/select-cfg/select-cfg.component';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { ZipExtractorService } from 'src/app/services/zipExtractor.service';

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
    { name: 'apk', type:'Android', icon: 'assets/img/android-logo.png' },
    { name: 'nld', type: 'Linux', icon: 'assets/img/linux-icon.png' },
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

  constructor(private http: HttpClient, private dataService: TerminalService,private router:Router,private zipExtractorService: ZipExtractorService) {}

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
    try {
      const { appFile, imageBase64, zipBlob } = await this.zipExtractorService.extractZip(file, this.selectedType.name.toLowerCase());
      if (appFile) {
        this.fileName = appFile.name; // Get the name of the application file

        const parts = this.fileName.split('.');
        // Remove the extension from the file name
        this.fileName = parts.length > 1 ? parts.slice(0, -1).join('.') : '';
        // Extract the only name and version from the file name
        const nameParts = this.fileName.split('_');
        this.onlyName = nameParts[0]; // Assuming name is the first part
        this.version = nameParts.length > 1 ? nameParts[1] : ''; // Assuming version is the second part
        this.fileSize = file.size; // Get the size of the uploaded file

        this.isUploaded = true; // Set upload status to true
        if (zipBlob) {
          this.blobFile = new File([zipBlob], appFile.name, { type: 'application/octet-stream' });
          const blobUrl = URL.createObjectURL(zipBlob);

        }
      } else {
        throw new Error('App file not found in the ZIP archive.'); // Handle case where appFile is null
      }

    } catch (error) {
      alert(error.message); // Alert if there’s an error
    }

  }

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
  }

  get selectedCount(): number {
    return this.modelsList.filter(card => card.selected).length;
  }

  async uploadPackage() {
    if (!this.blobFile) {
      return;
    }

    // const formData = new FormData();
    const formData = new FormData();
    formData.append('multipartFile', this.blobFile);

    const jsonData = {
        "event":{
           "eventData":{
              "name":`${this.onlyName}.${this.selectedType.name.toLowerCase()}`,
              "description":"sample package for testing",
              "version":this.version,
              // "type":`${this.selectedType.name.toLowerCase()}`,
              "type":"apk",
              "postInstallationAction":"REBOOT",
              "platformType":`${this.selectedType.type.toUpperCase()}`,
              "packageTypeIdentifier":"APPLICATION",
              "tags":"",
              "packageFile":{
                 "filePath":"INA-TMS/INA-TMS/TMS-PACKAGES",
                 "fileSize":this.fileSize,
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
      },
      error => {
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


  async getModelsApi() {
    const event = new terminalEvent('MODEL', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.dataService.modelData(terminalRequest).subscribe(
      response => {
        this.modelsList = response.event.eventData.map(data => ({
          modelId: data.id,
          name: data.name,
        }));
      },
      error => {
      }
    );
  }

  nextStep() {
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
