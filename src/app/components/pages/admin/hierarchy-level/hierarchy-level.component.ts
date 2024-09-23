import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HierarchySelectionComponent } from 'src/app/components/dialogs/hierarchy-selection/hierarchy-selection.component';
import { HierarchyFormComponent } from 'src/app/components/dialogs/hierarchy-form/hierarchy-form.component';
import { Router } from '@angular/router';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { timeout } from 'rxjs';
import { SharedServices } from 'src/app/services/shared.service';

interface HierarchyItem {
    id: string;
    name: string;
    [key: string]: any;
}

interface HierarchyLevel {
    name: string;
    pid: string;
    items: any[];
    selectedItem: HierarchyItem | null;
}

@Component({
    selector: 'app-hierarchy-level',
    templateUrl: './hierarchy-level.component.html',
    styleUrls: ['./hierarchy-level.component.scss']
})
export class HierarchyLevelComponent implements OnInit {
    hierarchyLevels: HierarchyLevel[] = [];

    private countries = ['India', 'United States', 'Canada', 'Germany', 'France'];
    private states = {
        India: ['Maharashtra', 'Karnataka', 'Gujarat'],
        'United States': ['California', 'New York', 'Texas'],
        Canada: ['Ontario', 'Quebec'],
        Germany: ['Bavaria', 'Berlin'],
        France: ['Île-de-France', 'Provence-Alpes-Côte d\'Azur'],
    };
    private cities = {
        Maharashtra: ['Mumbai', 'Pune'],
        Karnataka: ['Bangalore', 'Mysore'],
        Gujarat: ['Ahmedabad', 'Surat'],
        California: ['Los Angeles', 'San Francisco'],
        NewYork: ['New York City', 'Buffalo'],
        Texas: ['Houston', 'Dallas'],
        Ontario: ['Toronto', 'Ottawa'],
        Quebec: ['Montreal', 'Quebec City'],
        Bavaria: ['Munich', 'Nuremberg'],
        Berlin: ['Berlin'],
        'Île-de-France': ['Paris', 'Versailles'],
        'Provence-Alpes-Côte d\'Azur': ['Marseille', 'Nice'],
    };

    hierarchyData: any;
    selectedItem: HierarchyItem | null = null;
    selectedPath: string = ''; // New property for selected path
    itemForm: FormGroup;
    merchants = [];
    pId = null;
    hlId = "";
    mId = "";
    levelIndex: any;

    constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder, private dataService: TerminalService, private shared: SharedServices) { }

    ngOnInit() {
        this.itemForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            ipStartAddress: [''],
            ipEndAddress: [''],
            locationIdentifier: [''],
            path: [''],
            timeZone: ['']
        });
        this.getLevels();
    }

    getLevels() {
        this.hierarchyLevels = [];
        const event = new terminalEvent('MERCHANT', 'SEARCH');
        const payload = new terminalBody(event);
        this.dataService.hierarchyLevelData(payload).subscribe(
            response => {
                if(response.status == 200) {
                    this.hierarchyLevels.push({
                        name: "MERCHANT",
                        pid: "",
                        items: [],
                        selectedItem: null
                    });
                    response.event.eventData.map(data => this.hierarchyLevels.push({
                        name: data.name,
                        pid: data.id,
                        items: [],
                        selectedItem: null
                    }));
                    this.loadMerchants();
                    // this.shared.showSuccess("Level Updated successfully!")
                }
            },
            error => {
                this.hierarchyLevels.push({
                    name: "MERCHANT",
                    pid: "",
                    items: [],
                    selectedItem: null
                });
                this.loadMerchants();
                console.error('Error:', error);
                // this.shared.showError(error.message);
            }
        )
    }

    loadMerchants() {
        const event = new terminalEvent('MERCHANT', 'SEARCH');
        const merchantRequest = new terminalBody(event);
        this.dataService.merchantData(merchantRequest).subscribe(
            response => {
                response.event.eventData.map(data => this.hierarchyLevels[0].items.push({
                    name: data.name,
                    mid: data.id,
                }));
            },
            error => {
                this.shared.showError(error.message);
                console.error('Error:', error);
            }
        )
    }

    generateMerchantData(merchantNames: string[]): any {
        return merchantNames.map((merchantName, mIndex) => {
            // Create copies of the original arrays to avoid modifying them
            const availableCountries = [...this.countries];
            const countries = this.generateCountries(availableCountries, mIndex);

            return {
                id: `m${mIndex + 1}`,
                name: merchantName,
                countries: countries,
            };
        });
    }

    private generateCountries(availableCountries: string[], mIndex: number) {
        const numCountries = this.getRandomNumber(1, 3);
        const countriesArray = [];

        for (let i = 0; i < numCountries; i++) {
            const randomCountry = this.getRandomItem(availableCountries);
            if (randomCountry) {
                const availableStates = [...this.states[randomCountry]];
                const states = this.generateStates(randomCountry, availableStates, mIndex);

                countriesArray.push({
                    id: `c${mIndex + 1}-${i + 1}`,
                    name: randomCountry,
                    states: states,
                });

                // Remove the selected country to avoid duplicates
                this.removeItem(availableCountries, randomCountry);
            }
        }
        return countriesArray;
    }

    private generateStates(country: string, availableStates: string[], mIndex: number) {
        const numStates = this.getRandomNumber(1, 3);
        const statesArray = [];

        for (let i = 0; i < numStates; i++) {
            const randomState = this.getRandomItem(availableStates);
            if (randomState && this.cities[randomState]) {
                const availableCities = [...this.cities[randomState]];
                const cities = this.generateCities(randomState, availableCities, mIndex);

                statesArray.push({
                    id: `s${mIndex + 1}-${i + 1}`,
                    name: randomState,
                    cities: cities,
                });

                // Remove the selected state to avoid duplicates
                this.removeItem(availableStates, randomState);
            }
        }
        return statesArray;
    }


    private generateCities(state: string, availableCities: string[], mIndex: number) {
        const numCities = this.getRandomNumber(1, 3);
        const citiesArray = [];

        for (let i = 0; i < numCities; i++) {
            const randomCity = this.getRandomItem(availableCities);
            if (randomCity) {
                citiesArray.push({
                    id: `city${mIndex + 1}-${i + 1}`,
                    name: randomCity,
                });

                // Remove the selected city to avoid duplicates
                this.removeItem(availableCities, randomCity);
            }
        }
        return citiesArray;
    }

    private getRandomItem(array: string[]): string {
        if (!array || array.length === 0) {
            return null;
        }
        return array[Math.floor(Math.random() * array.length)];
    }

    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private removeItem(array: string[], item: string): void {
        const index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
    loadInitialData() {
        // this.hierarchyData = {
        //     "merchants": [
        //       {
        //         "id": "m1",
        //         "name": "MegaMart",
        //         "countries": [
        //           {
        //             "id": "c1",
        //             "name": "United States",
        //             "states": [
        //               {
        //                 "id": "s1",
        //                 "name": "California",
        //                 "cities": [
        //                   {
        //                     "id": "city1",
        //                     "name": "Los Angeles"
        //                   },
        //                   {
        //                     "id": "city2",
        //                     "name": "San Francisco"
        //                   }
        //                 ]
        //               },
        //               {
        //                 "id": "s2",
        //                 "name": "New York",
        //                 "cities": [
        //                   {
        //                     "id": "city3",
        //                     "name": "New York City"
        //                   },
        //                   {
        //                     "id": "city4",
        //                     "name": "Buffalo"
        //                   }
        //                 ]
        //               }
        //             ]
        //           },
        //           {
        //             "id": "c2",
        //             "name": "Canada",
        //             "states": [
        //               {
        //                 "id": "s3",
        //                 "name": "Ontario",
        //                 "cities": [
        //                   {
        //                     "id": "city5",
        //                     "name": "Toronto"
        //                   },
        //                   {
        //                     "id": "city6",
        //                     "name": "Ottawa"
        //                   }
        //                 ]
        //               }
        //             ]
        //           }
        //         ]
        //       },
        //       {
        //         "id": "m2",
        //         "name": "TechWorld",
        //         "countries": [
        //           {
        //             "id": "c3",
        //             "name": "Germany",
        //             "states": [
        //               {
        //                 "id": "s4",
        //                 "name": "Bavaria",
        //                 "cities": [
        //                   {
        //                     "id": "city7",
        //                     "name": "Munich"
        //                   }
        //                 ]
        //               }
        //             ]
        //           }
        //         ]
        //       }
        //     ]
        //   }
        // console.log(this.hierarchyData);
        this.hierarchyData = {
            'merchants': this.generateMerchantData(this.merchants)
        }
        console.log
        localStorage.setItem('Hlist', JSON.stringify(this.hierarchyData));
        this.hierarchyLevels[0].items = this.hierarchyData.merchants;
    }

    selectItem(levelIndex, level, item: HierarchyItem) {
        this.hierarchyLevels[levelIndex].selectedItem = item;
        this.hierarchyLevels[levelIndex+1].items = [];
        this.hierarchyLevels.map((data,i) => {
            if(i > levelIndex){
                data.items = []
            }
        })
        this.selectedItem = item;
        this.levelIndex = levelIndex;
        this.mId = item.mid;
        this.pId = level.name == "MERCHANT" ? null : item.id;
        this.hlId = this.hierarchyLevels[levelIndex+1].pid;
        if (level.name == "MERCHANT") {
            this.getSearchData(item.mid);
        } else {
            this.getChild(this.pId)
        }
    }

    getSearchData(item){
        const payload = {
            "event": {
                "eventData": {
                    "mid": item
                },
                "eventType": "HIERARCHY",
                "eventSubType": "SEARCH"
            }
        }
        this.dataService.hierarchySearchData(payload).subscribe(
            response => {
                if(response.status == 200) {
                    response.event.eventData.map(data => data.parentId == null ? this.hierarchyLevels[1].items.push({
                        name: data.name,
                        pid: data.parentId,
                        hid: data.hlId,
                        mid: data.mid,
                        id: data.id
                    }) : null);
                }
            },
            error => {
                this.shared.showError(error.message);
                console.error('Error:', error);
            }
        )
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
                const payload = {
                    "event": {
                        "eventData": {
                            "name": result.name,
                            "description": result.description,
                            "zoneId": -2,
                            "ipAddressRange": {
                                "start": result.ipStartAddress,
                                "end": result.ipEndAddress
                            },
                            "hlId": this.hlId,
                            "mid": this.mId,
                            "parentId": this.pId
                        },
                        "eventType": "HIERARCHY",
                        "eventSubType": "CREATE"
                    }
                }
                this.dataService.hierarchyAddData(payload).subscribe(
                    response => {
                        if(this.pId){
                            this.getChild(this.pId)
                        }else{
                            this.getSearchData(this.mId);
                        }
                    },
                    error => {
                        console.error('Error:', error);
                    }
                )
            }
        });
    }

    getChild(id){
        const payload = {
            "event": {
                "eventData": id,
                "eventType": "HIERARCHY_LEVEL",
                "eventSubType": "SEARCH"
            }
        }
        this.dataService.hierarchyChildData(payload).subscribe(
            response => {
                if(response.status == 200) {
                    if(response.status == 200) {
                        response.event.eventData.map(data =>this.hierarchyLevels[this.levelIndex + 1].items.push({
                            name: data.name,
                            pid: data.parentId,
                            hid: data.hlId,
                            mid: data.mid,
                            id: data.id
                        }));
                    }
                }
            },
            error => {
                this.shared.showError(error.message);
                console.error('Error:', error);
            }
        )
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(HierarchySelectionComponent, {
            data: {
                title: 'Hierarchy Levels',
                list: this.hierarchyLevels
            },
            width: '30%'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.dataService.hierarchyAddLevel(result).subscribe(
                    response => {
                            this.getLevels();
                    },
                    error => {
                        this.shared.showError(error.message);
                        console.error('Error:', error);
                    }
                )
            }
        });
    }

    deleteItem(item: HierarchyItem) {
        const payload = {
            "event": {
                "eventData": item.id,
                "eventType": "HIERARCHY",
                "eventSubType": "DELETE"
            }
        }
        this.dataService.hierarchyAddData(payload).subscribe(
            response => {
                    this.getSearchData(this.mId);
            },
            error => {
                this.shared.showError(error.message);
                console.error('Error:', error);
            }
        )
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
        const data = JSON.parse(localStorage.getItem('hier')) ? JSON.parse(localStorage.getItem('hier')) : [];
        this.itemForm.get('path').setValue(this.selectedPath);
        data.push(this.itemForm.value)
        const string = JSON.stringify(data);
        localStorage.setItem('hier', string);
        this.loadInitialData();
        this.itemForm.reset();
        this.resetComponentState();
    }

    resetComponentState() {
        // Clear the form
        this.itemForm.reset();

        // Reset hierarchy levels
        this.hierarchyLevels.forEach(level => {
            level.items = [];
            level.selectedItem = null;
        });

        // Reload initial data
        this.loadInitialData();

        // Clear the selected item and path
        this.selectedItem = null;
        this.selectedPath = '';
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
