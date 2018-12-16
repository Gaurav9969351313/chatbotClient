import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { StorageAndUtilsService, HttpService, LoggerService, WebsocketService, SafebrowsePipe } from '../shared';
import { environment } from '../../environments/environment';
import { Global } from '../shared/doc';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, OnChanges {

  @Input() loggedInUser: any;
  @ViewChild('wrapper') wrapper: any;

  qTicket: string = "";
  userName: string = "";

  arrConversation = [];

  messageDialogModel: any = {}; 

  dictLandingPageLinks = [];
  dictLandingPageLinksWithURLS = [];

  showAll: boolean = false;

  constructor(private httpService: HttpService,
    private websocket: WebsocketService,
    private loggerService: LoggerService,
    private storageAndUtilsService: StorageAndUtilsService) {
    try {
      this.dictLandingPageLinks = [];
      this.dictLandingPageLinksWithURLS = [];

      this.dictLandingPageLinks = [];

      Object.keys(environment.landingPageLinks).forEach(element => {
        var indivisualIntentDetails: any = environment.landingPageLinks[element];
        this.dictLandingPageLinks.push(indivisualIntentDetails);
      });

      for (let i = 0; i < this.dictLandingPageLinks.length; i++) {
        const element = this.dictLandingPageLinks[i];

        this.dictLandingPageLinks[i]["url"] = this.dictLandingPageLinks[i].name.trim().toLowerCase().replace(/ /g, '');
        this.dictLandingPageLinksWithURLS.push(this.dictLandingPageLinks[i]);
      }
      this.showMoreOrLessLandingPageLinks()

    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [Ctor()] --> " + JSON.stringify(error));
    }
  }

  ngOnChanges(change: any) {
    try {
      this.qTicket = change.loggedInUser.currentValue.ticketInfo.Ticket;
      this.userName = change.loggedInUser.currentValue.ticketInfo.UserId;
    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [ngOnChanges()] --> " + JSON.stringify(error));
    }
  }

  ngOnInit() {
    try {
      this.websocket.initiateWebSocketComm().subscribe((message: any) => {
        this.loggerService.log('info', "Initiated Socket Communication");
      });

      this.arrConversation.push(
        // { type: 'userMsg', text: "Welcome" },
        { type: 'landingCard', text: "Welcome" }
        // { type: 'iframe', url: 'https://plnkr.co' },
        // { type: 'iframewithbuttons', url: '', btnsData: ["Button 1", "button 2", "Button 1", "button 2"] }
      );
    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [ngOnInit()] --> " + JSON.stringify(error));
    }
  }

  showMoreOrLessLandingPageLinks() {
    // this.showAll = !this.showAll;
    try {
      if (this.showAll) {
        this.dictLandingPageLinksWithURLS = [];
        this.dictLandingPageLinksWithURLS = this.dictLandingPageLinks;
      } else {
        this.dictLandingPageLinksWithURLS = [];
        this.dictLandingPageLinksWithURLS = this.dictLandingPageLinks.slice(0, 3);
      }
    } catch (error) {
      this.loggerService.log('error', "[ConverstaionComponent] --> [showMoreOrLessLandingPageLinks()] --> " + JSON.stringify(error));
    }
  }

  toggle() {
    try {
      this.showAll = !this.showAll;
      this.showMoreOrLessLandingPageLinks();
    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [toggle()] --> " + JSON.stringify(error));
    }
  }

  btnClicked(btnName) {
    var primaryContext = JSON.parse(this.storageAndUtilsService.getUserData("PrimaryContext"));

    if (primaryContext !== null) {
      console.log("Object Title:- " + btnName + " Wise " + primaryContext);
    }

    var a = btnName.replace(/\s+/g, "").toLowerCase();
    var dynamicObjRenderURL = environment.dynamicMashUpObjRendererUrl

    if (environment.secondLevelBtns.includes(btnName)) {
      if (environment.btnsByIndent[a].objId) {
        dynamicObjRenderURL = dynamicObjRenderURL + "?strObjID=" + environment.btnsByIndent[a].objId + "&strDim=false&strContext=" + primaryContext;
        this.arrConversation.push(
          {
            type: "iframewithbuttons",
            cardHeader: environment.cardHeader.replace('{% intent %}', primaryContext),
            btnsData: environment.btnsByIndent[a].btns,
            url: dynamicObjRenderURL
          });
      } else {
        dynamicObjRenderURL = dynamicObjRenderURL + "?strObjID=false&strDim=" + environment.btnsByIndent[a].strDim + "&strContext=" + primaryContext;
        this.arrConversation.push(
          {
            type: "iframewithbuttons",
            cardHeader: environment.cardHeader.replace('{% intent %}', primaryContext),
            btnsData: environment.btnsByIndent[a].btns,
            url: dynamicObjRenderURL
          });
      }
    }

    try {

      // Selection
      if (environment.firstLevelFilters.includes(btnName)) {
        setTimeout(() => {
          this.websocket.secondLevelDocOpration("GetField", Global.GetField('', "Employee Category"));
        }, 1000);

        setTimeout(() => {
          this.websocket.secondLevelDocOpration("Select", Global.Select(Global.docLevelMethodHandle, btnName));
        }, 2000);
      }
      else {
        console.log(btnName + " Might be mesure or Dimention");
      }

      if (this.storageAndUtilsService.getUserData("PrimaryContext") !== null) {

        this.arrConversation.push(
          {
            type: "iframewithbuttons",
            cardHeader: environment.cardHeader.replace('{% intent %}', primaryContext),
            btnsData: environment.btnsByIndent[a].btns,
            url: this.getSingleConfigratorURL(primaryContext)
          });
      }
      else if (environment.thirdLevelBtns.includes(btnName)) {
        this.arrConversation.push({ type: "iframe" });
      }

    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [] --> " + JSON.stringify(error));
    }
  }

  landingPageLinkClicked(intent) {
    try {

      console.log(intent);

      if (Object.keys(environment.landingPageLinks).includes(intent)) {
        this.getSingleConfigratorURL(intent);
        this.storageAndUtilsService.saveUserdata("PrimaryContext", intent);
        if (!environment.exceptionalSingleIframs.includes(intent)) {
          this.arrConversation.push(
            {
              type: "iframewithbuttons",
              cardHeader: environment.cardHeader.replace('{% intent %}', intent),
              btnsData: environment.btnsByIndent[intent].btns,
              url: this.getSingleConfigratorURL(intent)
            });
        }
      }
    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [landingPageLinkClicked(intent)] --> " + JSON.stringify(error));
    }
  }

  getSingleConfigratorURL(intent) {
    try {
      if (environment.exceptionalSingleIframs.includes(intent)) {
        var mshUpUrl = environment.dynamicMashUpObjRendererUrl + "?strObjID="+ environment.btnsByIndent[intent].objId +"&strDim=false&strContext=" + intent;
        this.loggerService.log('info', mshUpUrl);
        this.arrConversation.push(
          {
            type: "iframe",
            cardHeader: environment.cardHeader.replace('{% intent %}', intent),
            url: mshUpUrl
          });

      } else {
        var url = "https://qsdev.mahindra.com/single/?appid=" + environment.appId + "&obj=" + environment.btnsByIndent[intent].objId + "&opt=currsel%2cnoanimate&qlikTicket=" + this.qTicket;
        this.loggerService.log('info', url);
        return url;
      }
    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [getSingleConfigratorURL(intent)] --> " + JSON.stringify(error));
    }
  }

  sendMessage() {
    try {
      // this.httpService.post(environment.nlpServiceEndpoint,{"userInput":this.messageDialogModel.dialog })
      // .subscribe((extracteddata:any)=>{
      //     console.log(extracteddata);
      //     this.loggerService.log('warn',JSON.stringify(extracteddata));
      // });

      this.loggerService.log('warn', this.messageDialogModel.dialog);

      this.arrConversation.push(
        { type: 'userMsg', text: this.messageDialogModel.dialog });

      this.messageDialogModel.dialog = "";
    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [sendMessage()] --> " + JSON.stringify(error));
    }
  }

  clearChat() {
    try {
      this.arrConversation = [];
      this.showAll = false;
      this.showMoreOrLessLandingPageLinks();
      this.arrConversation.push(
        { type: 'landingCard', text: "Welcome" },
      );
    } catch (error) {
      this.loggerService.log('error', "[ConversationComponent] --> [clearChat()] --> " + JSON.stringify(error));
    }
  }
}
