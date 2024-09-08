import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HierarchySelectionComponent } from 'src/app/components/dialogs/hierarchy-selection/hierarchy-selection.component';
import { HierarchyFormComponent } from 'src/app/components/dialogs/hierarchy-form/hierarchy-form.component';

interface HierarchyItem {
  id: string;
  name: string;
  [key: string]: any;
}

interface HierarchyLevel {
  name: string;
  items: HierarchyItem[];
  selectedItem: HierarchyItem | null;
}

@Component({
  selector: 'app-hierarchy-level',
  templateUrl: './hierarchy-level.component.html',
  styleUrls: ['./hierarchy-level.component.scss']
})
export class HierarchyLevelComponent implements OnInit {
  hierarchyLevels: HierarchyLevel[] = [
    { name: 'Merchant', items: [], selectedItem: null },
    { name: 'Country', items: [], selectedItem: null },
    { name: 'State', items: [], selectedItem: null },
    { name: 'City', items: [], selectedItem: null },
  ];

  hierarchyData: any;
  selectedItem: HierarchyItem | null = null;
  selectedPath: string = ''; // New property for selected path
  itemForm: FormGroup;

  constructor(private dataService: TerminalService, public dialog: MatDialog,private fb: FormBuilder) {}

  ngOnInit() {
    this.itemForm = this.fb.group({
        name:['',Validators.required],
        description: [''],
        ipStartAddress: [''],
        ipEndAddress: [''],
        locationIdentifier: [''],
        timeZone: ['']
      });
    this.loadInitialData();
  }

  loadInitialData() {
    this.hierarchyData = {
        "merchants": [
          {
            "id": "m1",
            "name": "MegaMart",
            "countries": [
              {
                "id": "c1",
                "name": "United States",
                "states": [
                  {
                    "id": "s1",
                    "name": "California",
                    "cities": [
                      {
                        "id": "city1",
                        "name": "Los Angeles"
                      },
                      {
                        "id": "city2",
                        "name": "San Francisco"
                      }
                    ]
                  },
                  {
                    "id": "s2",
                    "name": "New York",
                    "cities": [
                      {
                        "id": "city3",
                        "name": "New York City"
                      },
                      {
                        "id": "city4",
                        "name": "Buffalo"
                      }
                    ]
                  }
                ]
              },
              {
                "id": "c2",
                "name": "Canada",
                "states": [
                  {
                    "id": "s3",
                    "name": "Ontario",
                    "cities": [
                      {
                        "id": "city5",
                        "name": "Toronto"
                      },
                      {
                        "id": "city6",
                        "name": "Ottawa"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "m2",
            "name": "TechWorld",
            "countries": [
              {
                "id": "c3",
                "name": "Germany",
                "states": [
                  {
                    "id": "s4",
                    "name": "Bavaria",
                    "cities": [
                      {
                        "id": "city7",
                        "name": "Munich"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }

    this.hierarchyLevels[0].items = this.hierarchyData.merchants;
  }

  selectItem(levelIndex: number, item: HierarchyItem) {
    this.hierarchyLevels[levelIndex].selectedItem = item;
    this.selectedItem = item;

    // Reset all subsequent levels
    for (let i = levelIndex + 1; i < this.hierarchyLevels.length; i++) {
      this.hierarchyLevels[i].selectedItem = null;
      this.hierarchyLevels[i].items = [];
    }

    // Load children for the next level
    if (levelIndex < this.hierarchyLevels.length - 1) {
      this.loadChildrenForLevel(levelIndex + 1, item);
    }

    this.updateSelectedPath(); // New method call
    this.updateForm(item);
  }

  updateForm(item: HierarchyItem) {
    this.itemForm.patchValue({
      description: item.description || '',
      ipStartAddress: item.ipStartAddress || '',
      ipEndAddress: item.ipEndAddress || '',
      locationIdentifier: item.locationIdentifier || '',
      timeZone: item.timeZone || ''
    });
  }


  loadChildrenForLevel(levelIndex: number, parentItem: HierarchyItem) {
    const childrenKeys = ['countries', 'states', 'cities'];
    const childKey = childrenKeys[levelIndex - 1];

    if (parentItem[childKey]) {
      this.hierarchyLevels[levelIndex].items = parentItem[childKey];
    } else {
      this.hierarchyLevels[levelIndex].items = [];
    }
  }

  addNewItem(levelIndex: number) {
    if (levelIndex >= this.hierarchyLevels.length - 1) {
      console.log("Cannot add child to the lowest level");
      return;
    }

    const parentItem = this.hierarchyLevels[levelIndex].selectedItem;
    if (!parentItem) {
      console.log("Please select a parent item first");
      return;
    }

    const dialogRef = this.dialog.open(HierarchyFormComponent, {
      data: { levelName: this.hierarchyLevels[levelIndex + 1].name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const childrenKeys = ['countries', 'states', 'cities'];
        const childKey = childrenKeys[levelIndex];

        const newItem: HierarchyItem = {
          id: Date.now().toString(),
          name: result.name,
          description: result.description,
          ipStartAddress: result.ipStartAddress,
          ipEndAddress: result.ipEndAddress,
          locationIdentifier: result.locationIdentifier,
          timeZone: result.timeZone
        };

        if (!parentItem[childKey]) {
          parentItem[childKey] = [];
        }
        parentItem[childKey].push(newItem);

        // Update the next level's items
        this.hierarchyLevels[levelIndex + 1].items = parentItem[childKey];

        // Select the parent item to refresh the view
        this.selectItem(levelIndex, parentItem);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(HierarchySelectionComponent,{
        data:{
            title:'Hierarchy Levels',
            list:this.hierarchyLevels
        },
        width:'30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }

  deleteItem(levelIndex: number, item: HierarchyItem) {
    if (levelIndex === 0) {
      const index = this.hierarchyData.merchants.indexOf(item);
      if (index > -1) {
        this.hierarchyData.merchants.splice(index, 1);
      }
    } else {
      const parentItem = this.hierarchyLevels[levelIndex - 1].selectedItem;
      if (parentItem) {
        const childrenKeys = ['countries', 'states', 'cities'];
        const childKey = childrenKeys[levelIndex - 1];
        const index = parentItem[childKey].indexOf(item);
        if (index > -1) {
          parentItem[childKey].splice(index, 1);
        }
      }
    }

    const index = this.hierarchyLevels[levelIndex].items.indexOf(item);
    if (index > -1) {
      this.hierarchyLevels[levelIndex].items.splice(index, 1);
    }

    if (this.hierarchyLevels[levelIndex].selectedItem === item) {
      this.hierarchyLevels[levelIndex].selectedItem = null;
      this.selectedItem = null;
      for (let i = levelIndex + 1; i < this.hierarchyLevels.length; i++) {
        this.hierarchyLevels[i].selectedItem = null;
        this.hierarchyLevels[i].items = [];
      }
    }
  }

  updateSelectedPath() {
    this.selectedPath = this.hierarchyLevels
      .filter(level => level.selectedItem)
      .map(level => level.selectedItem!.name)
      .join(' >> ');
  }

  saveHierarchyPath() {
    if (this.selectedPath) {
      console.log('Saving hierarchy path:', this.selectedPath);
      // In a real application, you would make an API call here to save the path
      console.log('Updated hierarchy data:', this.hierarchyData);
    }
  }

  saveHierarchyItem() {
    localStorage.setItem('hpath',this.selectedPath);
  }

  updateItemInHierarchy(updatedItem: HierarchyItem) {
    const updateRecursive = (items: HierarchyItem[]) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === updatedItem.id) {
          items[i] = updatedItem;
          return true;
        }
        if (items[i].countries) {
          if (updateRecursive(items[i].countries)) return true;
        }
        if (items[i].states) {
          if (updateRecursive(items[i].states)) return true;
        }
        if (items[i].cities) {
          if (updateRecursive(items[i].cities)) return true;
        }
      }
      return false;
    };

    updateRecursive(this.hierarchyData.merchants);
  }

  getSelectedPath(): string {
    return this.hierarchyLevels
      .filter(level => level.selectedItem)
      .map(level => level.selectedItem!.name)
      .join(' >> ');
  }
}
