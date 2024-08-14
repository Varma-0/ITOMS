import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-light',
  templateUrl: './table-light.component.html',
  styleUrls: ['./table-light.component.scss']
})
export class TableLightComponent implements OnInit {

  terminals=[
    {
      check:false,
      sn : 'JHDHJD726',
      model: 'hjddjh',
      status: 'Inventory',
      ostatus:'Offline',
      time:''
    },
    {
        check:false,
        sn : 'JHDHJD726',
        model: 'hjddjh',
        status: 'Inventory',
        ostatus:'Offline',
        time:''
      },
      {
        check:false,
        sn : 'JHDHJD726',
        model: 'hjddjh',
        status: 'Inventory',
        ostatus:'Offline',
        time:''
      }
  ];

  constructor() { }

  ngOnInit() {
  }

}
