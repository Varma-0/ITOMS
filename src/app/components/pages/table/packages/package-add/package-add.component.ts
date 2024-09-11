import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import * as JSZip from 'jszip';
import { DesignSelectionComponent } from 'src/app/components/dialogs/design-selection/design-selection.component';
import { SelectCfgComponent } from 'src/app/components/dialogs/select-cfg/select-cfg.component';

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
  extractedInfo: {
    name: string;
    version: string;
  } = {
    name: '',
    version: '',
  };
  onlyName: string;
  version: string;

  selectType(type: any) {
    this.selectedType = type;
  }

  // designSelection() {
  //   const dialogRef = this.dialog.open(DesignSelectionComponent, {
  //       height: '80%',
  //       width: '40%'
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //           if(result?.type){
  //               this.profile = result.profile;
  //               this.param = result.parameters;
  //               this.showDynamicKeys = false;
  //           }else{
  //             const dialogRef = this.dialog.open(SelectCfgComponent);
  //             dialogRef.afterClosed().subscribe(result => {
  //               if (result) {
  //                   this.profile = [];
  //                   this.param = [];
  //                   this.showDynamicKeys = false;
  //               }
  //             });
  //           }
  //       }
  //     });
  //   }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
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
          if (this.selectedType.name === 'Android' && relativePath.endsWith('.apk')  || relativePath.endsWith('.APK')) {
            appFile = zipEntry;
          } else if (this.selectedType.name === 'Linux' && relativePath.endsWith('.NLD')  || relativePath.endsWith('.NLD')) {
            appFile = zipEntry;
          }
        });

        if (appFile) {
          // Extract info from APK or NLD file
          const appData = await appFile.async('uint8array');
          const { name, version } = await this.extractAppInfo(appData, appFile.name);

          this.extractedInfo = { name, version };
          // this.nextStep();
          this.fileName = appFile.name;
          const parts = this.fileName.split('.');
          parts.length > 1 ? this.fileName =  parts.slice(0, -1).join('.'):''
          this.onlyName = this.fileName.split('_')[0]
          this.version = this.fileName.split('_')[1]
          this.fileSize = file.size;
          console.log("efqq",this.fileName,this.fileSize);
          this.isUploaded = true;
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

  nextStep() {
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
