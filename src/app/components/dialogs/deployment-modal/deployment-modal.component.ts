import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-deployment-modal',
  templateUrl: './deployment-modal.component.html',
  styleUrl: './deployment-modal.component.scss'
})
export class DeploymentModalComponent {
  currentVersion = {
    versionNumber: '2.7.3P',
    releaseDate: new Date('2024-09-04 18:14:12'),
    details: [
      { label: 'Version Code', value: '126' },
      { label: 'Installed Devices', value: '0' },
      { label: 'Installation Mode', value: 'Incremental Update' },
      { label: 'Update Mode', value: 'Auto Update' },
      { label: 'Disable Uninstall', value: 'No' },
      { label: 'Total File Size', value: '31.37 MB' },
      { label: 'File MD5', value: '96B3342B59238094B451F6DF16AA5118' },
      { label: 'Introduction', value: '' },
      { label: 'Distribute', value: 'ALL' },
      { label: 'Supported Device Models', value: 'N950, N910 Pro, N910, N950S ECR, N700 ...' },
      { label: 'Deployment', value: '' },
    ]
  };

  previousVersion = {
    versionNumber: '2.5.8',
    releaseDate: new Date('2022-06-05 17:40:30'),
    details: [
      { label: 'Version Code', value: '120' },
      { label: 'Installed Devices', value: '5' },
      { label: 'Installation Mode', value: 'Full Update' },
      { label: 'Update Mode', value: 'Manual Update' },
      { label: 'Disable Uninstall', value: 'Yes' },
      { label: 'Total File Size', value: '30.12 MB' },
      { label: 'File MD5', value: 'AB3342B59238094B451F6DF16AA5119' },
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }


  private openCollapseId: string | null = null;

  toggleCollapse(collapseId: string) {
    if (this.openCollapseId === collapseId) {
      // If the same section is clicked, just collapse it
      this.openCollapseId = null;
      this.collapse(collapseId, false);
    } else {
      // Collapse the currently open section if any
      if (this.openCollapseId) {
        this.collapse(this.openCollapseId, false);
      }
      // Expand the new section
      this.openCollapseId = collapseId;
      this.collapse(collapseId, true);
    }
  }

  private collapse(collapseId: string, show: boolean) {
    const element = document.getElementById(collapseId);
    if (element) {
      if (show) {
        element.classList.add('show');
      } else {
        element.classList.remove('show');
      }
    }
  }

  
}
