import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { SharedServices } from './shared.service'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root',
})
export class ZipExtractorService {
  maxFileSize: number = 500; // Maximum file size in MB (change as needed)

  constructor(private sharedService: SharedServices) {} // Inject SharedServices

  async extractZip(file: File, selectedType: 'apk' | 'nld'): Promise<{ appFile: File | null; imageBase64: string | null; zipBlob: Blob | null }> {
    let appFile: File | null = null;
    let imageBase64: string | null = null;
    let zipBlob: Blob | null = null; // Declare variable to hold the ZIP Blob

    try {
      // Check if the file size exceeds the maximum limit
      if (file.size > this.maxFileSize * 1024 * 1024) {
        this.sharedService.showError(`File size exceeds ${this.maxFileSize}MB limit.`);
        return { appFile, imageBase64, zipBlob }; // Early return if there's an error
      }

      if (!file.name.toLowerCase().endsWith('.zip')) {
        this.sharedService.showError('File must be a ZIP file.');
        return { appFile, imageBase64, zipBlob }; // Early return if there's an error
      }

      // Create a Blob from the file
      zipBlob = new Blob([file], { type: file.type }); // Create a Blob from the ZIP file

      const zip = new JSZip();
      const contents = await zip.loadAsync(file);

      // Determine the required file extension based on the selected type
      const requiredExtension = selectedType === 'apk' ? '.apk' : '.nld';
      let foundAppFile = false;
      let foundImage = false;

      // Iterate over each file in the ZIP archive
      for (const relativePath in contents.files) {
        const zipEntry = contents.files[relativePath];
        const entryName = zipEntry.name.toLowerCase(); // Normalize the file name to lowercase

        // Check for the required application file type (case-insensitive)
        if (entryName.endsWith(requiredExtension)) {
          const appInfoData = await zipEntry.async('blob'); // Get the file data as a Blob
          appFile = new File([appInfoData], zipEntry.name, { type: 'application/octet-stream' }); // Create a File from the Blob
          foundAppFile = true; // Set the flag if the app file is found
        } else if (entryName.endsWith('.png')) {
          // Convert image file to Base64
          const imageBlob = await zipEntry.async('blob');
          imageBase64 = await this.convertBlobToBase64(imageBlob);
          foundImage = true; // Set the flag if an image file is found
        }
      }

      // Check if both required files are found
      if (!foundAppFile && !foundImage) {
        this.sharedService.showError(`No ${requiredExtension.toUpperCase()} file and no PNG image found in the ZIP.`);
      } else if (!foundAppFile) {
        this.sharedService.showError(`No ${requiredExtension.toUpperCase()} file found in the ZIP.`);
      } else if (!foundImage) {
        this.sharedService.showError(`No PNG image found in the ZIP.`);
      } else {
        // Show success message if both files are found
        this.sharedService.showSuccess(`Successfully extracted ${requiredExtension.toUpperCase()} file and PNG image!`);
      }

      return { appFile, imageBase64, zipBlob }; // Return results including the ZIP Blob

    } catch (error) {
      this.sharedService.showError(`An error occurred: ${error.message}`);
    }

    return { appFile, imageBase64, zipBlob }; // Return results
  }

  private async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
