import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-package-add',
  templateUrl: './package-add.component.html',
  styleUrl: './package-add.component.scss'
})
export class PackageAddComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() view: any;
  @Input() insideview: any;
  @Output() viewChange = new EventEmitter<boolean>();
  @Output() insideviewChange = new EventEmitter<boolean>();
  steps: string[] = ['Upload File', 'Details', 'Pilot', 'Release', 'Param'];
  currentStep: number = 1;
  maxFileSize: number = 500;

  appTypes = [
    { name: 'Android', icon: 'assets/img/android-logo.png' },
    { name: 'Linux', icon: 'assets/img/linux-icon.png' },
    { name: 'RTOS', icon: 'assets/img/rtos.png' }
  ];
  selectedType: any = null;

  extractedInfo: {
    name: string;
    version: string;
    imageUrl: string | null;
  } = {
    name: '',
    version: '',
    imageUrl: null
  };

  selectType(type: any) {
    this.selectedType = type;
  }

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
        console.log(contents)
        let appFile: JSZip.JSZipObject | null = null;
        console.log(appFile);
        let imageFile: JSZip.JSZipObject | null = null;
        console.log(imageFile);


        contents.forEach((relativePath, zipEntry) => {
        console.log(relativePath,zipEntry)

          if (relativePath['name'].endsWith('.apk') || relativePath['name'].endsWith('.nld')) {
            appFile = zipEntry;
          } else if (relativePath.toLowerCase().endsWith('.png') || relativePath.toLowerCase().endsWith('.jpg')) {
            // imageFile = zipEntry;
          }
        });

        if (appFile || imageFile) {
          // Extract info from APK or NLD file
          const appData = await appFile.async('uint8array');
          const { name, version } = await this.extractAppInfo(appData, appFile.name);

          // Process image file
          const imageData = await imageFile.async('blob');
          const imageUrl = URL.createObjectURL(imageData);

          this.extractedInfo = { name, version, imageUrl };
          this.nextStep();
        } else {
          alert('ZIP file must contain one APK or NLD file and one image file.');
        }
      } catch (error) {
        console.error('Error processing ZIP file:', error);
        alert('Error processing ZIP file. Please try again.');
      }
    } else {
      alert('Please upload a ZIP file.');
    }
  }

  async extractAppInfo(data: Uint8Array, fileName: string): Promise<{ name: string, version: string }> {
    if (fileName.toLowerCase().endsWith('.apk')) {
      return this.extractApkInfo(data);
    } else if (fileName.toLowerCase().endsWith('.nld')) {
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
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  toggleView() {
    this.view = !this.view;
    this.insideview = !this.insideview;
    this.viewChange.emit(this.view);
    this.insideviewChange.emit(this.insideview);
  }
}
