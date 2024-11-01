import {Component, ViewChild, ElementRef, OnInit } from '@angular/core';

interface Section {
  title: string;
  content: string;
}

@Component({
  selector: 'app-basic-card',
  templateUrl: './basic-card.component.html',
  styleUrls: ['./basic-card.component.scss']
})
export class BasicCardComponent{
  sections: Section[] = [
    { title: 'Section 1', content: 'Content for Section 1' },
    { title: 'Section 2', content: 'Content for Section 2' },
    { title: 'Section 3', content: 'Content for Section 3' },
    { title: 'Section 4', content: 'Content for Section 4' },
    { title: 'Section 5', content: 'Content for Section 5' },
    { title: 'Section 6', content: 'Content for Section 6' },
    { title: 'Section 7', content: 'Content for Section 7' },
    { title: 'Section 8', content: 'Content for Section 8' },
    { title: 'Section 9', content: 'Content for Section 9' },
    { title: 'Section 10', content: 'Content for Section 10' },
    { title: 'Section 11', content: 'Content for Section 11' },
    { title: 'Section 12', content: 'Content for Section 12' },
    { title: 'Section 13', content: 'Content for Section 13' },
    { title: 'Section 14', content: 'Content for Section 14' },
    { title: 'Section 15', content: 'Content for Section 15' }
  ];

  selectedIndex: number | null = null;
    currentStartIndex: number = 0;

    @ViewChild('sectionContainer') sectionContainer!: ElementRef;

    getVisibleSections() {
        return this.sections.slice(this.currentStartIndex, this.currentStartIndex + 7); // Show only 3 sections
    }

    selectSection(index: number) {
        this.selectedIndex = index;
    }

  //   scrollToPrevious() {
  //     const sectionContainer = this.sectionContainer.nativeElement;

  //     // Scroll back to the first section
  //     this.currentStartIndex = 0; // Set to start
  //     sectionContainer.scrollTo({
  //         left: 0, // Scroll to the very start
  //         behavior: 'smooth'
  //     });
  // }

  //   scrollToNext() {
  //       const sectionContainer = this.sectionContainer.nativeElement;

  //       // Scroll directly to the last section
  //       this.currentStartIndex = Math.max(0, this.sections.length - 3); // Ensure it doesn't exceed the number of sections
  //       sectionContainer.scrollTo({
  //           left: (this.currentStartIndex * sectionContainer.clientWidth) / 3,
  //           behavior: 'smooth'
  //       });
  //   }
  scrollToPrevious() {
    const sectionContainer = this.sectionContainer.nativeElement;
    const sectionWidth = sectionContainer.clientWidth / 3; // Width of one section

    // Reset to the first section
    this.currentStartIndex = 0; // Set to start
    sectionContainer.querySelector('.sections').style.transform = `translateX(0px)`; // Reset position
}

scrollToNext() {
    const sectionContainer = this.sectionContainer.nativeElement;
    const sectionWidth = sectionContainer.clientWidth / 3; // Width of one section

    // Scroll directly to the last section
    this.currentStartIndex = Math.max(0, this.sections.length - 3); // Ensure it doesn't exceed the number of sections
    const translateX = -this.currentStartIndex * sectionWidth; // Calculate translation
    sectionContainer.querySelector('.sections').style.transform = `translateX(${translateX}px)`; // Apply transformation
}

}
