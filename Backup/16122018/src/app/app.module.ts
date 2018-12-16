import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { HttpService } from "./shared/http.service";
import { StorageAndUtilsService } from "./shared/storageAndUtils.service";

import { SafebrowsePipe } from "./shared/safebrowse.pipe";
import { SafehtmlPipe } from './shared/safehtml.pipe';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MessagetimeComponent } from './messagetime/messagetime.component';

import { WebsocketService } from "./shared/websocket.service";
import { LoggerService } from './shared/logger.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ConversationComponent,
    MessagetimeComponent,
    SafebrowsePipe,SafehtmlPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    StorageAndUtilsService,
    HttpService,
    WebsocketService,
    { provide: LoggerService, useClass: LoggerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
