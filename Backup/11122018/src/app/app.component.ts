import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { HttpService, StorageAndUtilsService } from './shared';
import { environment } from '../environments/environment';
import { LoggerService } from "./shared/logger.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Qliksense-chatbot-production';

  constructor(private httpService: HttpService,
    private loggerService: LoggerService,
    private storageAndUtilsService: StorageAndUtilsService,
    private router: Router) {
  }

  ngOnInit() {
    try {
      
    } catch (error) {
      this.loggerService.log('error', "This is Error On Console");
    }

    if (this.storageAndUtilsService.getUserData("appMeta") != null) {
      this.httpService.httpGet(environment.cachingMetaDataUrl).subscribe((objMeta: any) => {
        var d = JSON.parse(objMeta._body);
        if (d.ResponseString == 1) {
          console.log("Successfully fetched metadata from cached memory");
          this.storageAndUtilsService.saveUserdata("appMeta", d.ResponseObject);
          var mainArr = [];
          var allSheets = JSON.parse(d.ResponseObject);
          for (var sheetIndex = 0; sheetIndex < allSheets.length; sheetIndex++) {
            var obj = {
              "SheetName": "",
              "sheetUtrance": "",
              "objectsData": {},
            }

            var sheet = allSheets[sheetIndex];
            obj.SheetName = sheet.SheetTitle;
            obj.sheetUtrance = sheet.SheetTitle.replace(/\s+/g, "").toLowerCase();

            sheet.sheetWiseObjects.forEach(sheetwiseObject => {
              var objData = {
                "name": "",
                "type": "",
                "mesNames": [],
                "dimNames": []
              }
              objData.name = sheetwiseObject.ObjectName;
              objData.type = sheetwiseObject.ObjectType;

              // var getSubset = (keys, obj) => keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
              // console.log(getSubset(['color', 'annoying'], elmo));

              sheetwiseObject.ObjectMetaData.Mesures.forEach(element => {
                objData.mesNames.push(element.qDef.qDef);
              });

              sheetwiseObject.ObjectMetaData.Dimentions.forEach(ele => {
                //fieldDefs
                objData.dimNames.push(ele.qDef.qFieldDefs.join('|'));
              });

              obj.objectsData = objData;

            });
            mainArr.push(obj);
          }
          console.log(mainArr);

          JSON.parse(d.ResponseObject)[27].sheetWiseObjects[0].ObjectMetaData.Dimentions.forEach(element => {
            console.log(element.qDef.qFieldDefs);
          });

          JSON.parse(d.ResponseObject)[27].sheetWiseObjects[0].ObjectMetaData.Mesures.forEach(e => {
            console.log(e.qDef.qLabel);
          });
        } else {
          // console.table(JSON.parse(d.ResponseObject),["SheetTitle"])
          // console.table(JSON.parse(d.ResponseObject)[27].sheetWiseObjects[0].ObjectMetaData.Dimentions,["qDef.qFieldDefs"])

          // JSON.parse(d.ResponseObject)[27].sheetWiseObjects[0].ObjectMetaData.Dimentions.forEach(element => {
          //   console.log(element.qDef.qFieldDefs);
          // });

          // JSON.parse(d.ResponseObject)[27].sheetWiseObjects[0].ObjectMetaData.Mesures.forEach(e => {
          //   console.log(e.qDef.qLabel);
          // });
        }
      });
    }
    else {
      //get data from localstorage
    }
  }

  navigateToHome() {
    try {
      this.router.navigate(['/home', { openChat: 'true' }]);
    } catch (error) {
      this.loggerService.log('error', "[AppComponent] --> [navigateToHome] --> " + JSON.stringify(error));
    }   
  }
}
