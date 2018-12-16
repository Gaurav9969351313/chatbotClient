import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { ConversationComponent } from "../conversation/conversation.component";
import { LoggerService } from "../shared/logger.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showChatBotWrapper: boolean = false;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private _location: Location,
              private actRoute: ActivatedRoute,
              private loggerService: LoggerService) {
    try {
      this.actRoute.params.subscribe((params: any) => {
        this.showChatBotWrapper = params["openChat"];
      })
    } catch (error) {
      this.loggerService.log('error', "[Component] --> [] --> " + JSON.stringify(error));
    }
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  CloseChatBotWrapper() {
    this.showChatBotWrapper = false;
    this._location.back();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { 
      this.loggerService.log('error', "[HomeComponent] --> [scrollToBottom()] --> " + JSON.stringify(err));
    }
  }

  clearChat() {
    try {
      
    } catch (error) {
      this.loggerService.log('error', "[HomeComponent] --> [clearChat()] --> " + JSON.stringify(error));
    }
  }
}
