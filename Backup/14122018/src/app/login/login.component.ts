import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Router } from "@angular/router";
import { HttpService,StorageAndUtilsService, LoggerService } from '../shared';
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showLogin: boolean = true;
  showConverSation: boolean = false;

  userModel: any = {};

  loginInfo = {};
  passingClearChatFlag: any;
  
  @ViewChild('loginHandle') loginHandle: ElementRef;

  constructor(private storageService: StorageAndUtilsService,
    private httpService: HttpService,
    private loggerService: LoggerService,
    private router: Router) { }

  ngOnInit() {

    try {
      this.showLogin = true;
      this.showConverSation = false;
      var storedData: any = JSON.parse(this.storageService.getUserData(environment.userDataStorageKey));
      if (storedData != null) {
        console.log("Stored Data");
        this.userModel.username = storedData.username;
        this.userModel.password = storedData.password;
        this.userModel.rememberMe = storedData.rememberMe;
      }
    } catch (error) {
      this.loggerService.log('error', "[LoginComponent] --> [ngOnInit()] --> " + JSON.stringify(error));
    }

  }

  login() {
    try {
      if (this.userModel.rememberMe == true)
        this.storageService.saveUserdata(environment.userDataStorageKey, this.userModel);

      // this.httpService.authenticateAD(this.userModel.username, this.userModel.password).subscribe((adData:any)=>{
      //   console.log("adData:- ",adData);
      // })

      this.httpService.authenticateWithQlik(this.userModel.username, this.userModel.password).subscribe((data: any) => {
        // also in this callback i have to have check 
        // with login with username and password 
        // and also whether the user has that sheet access or not 
        var objData = JSON.parse(data._body);
        if (objData.ResponseString == 1) {
          this.loginInfo = objData.ResponseObject;
          this.storageService.saveUserdata("jSession", data._body);
          this.showLogin = false;
          this.showConverSation = true;
          this.loginHandle.nativeElement.offsetParent.lastChild.classList.add("shortWrapper");
        }
        else if (objData.ResponseString == 0) {
          alert("User Dont Have App Level Access...!!");
        }
        else {
          alert("Error...");
        }
      });
    } catch (error) {
      this.loggerService.log('error', "[LoginComponent] --> [login()] --> " + JSON.stringify(error));
    }
  }
}
