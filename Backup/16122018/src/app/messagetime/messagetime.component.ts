import { Component, OnInit } from '@angular/core';
import { StorageAndUtilsService } from '../shared/storageAndUtils.service';

@Component({
  selector: 'app-messagetime',
  templateUrl: './messagetime.component.html',
  styleUrls: ['./messagetime.component.css']
})
export class MessagetimeComponent implements OnInit {

  constructor(public utilsService:StorageAndUtilsService) { }

  ngOnInit() {
  }

}
