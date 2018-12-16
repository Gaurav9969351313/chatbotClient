import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from "../shared/doc";
import { environment } from '../../environments/environment';

@Injectable()
export class WebsocketService {

  constructor() { }

  public initiateWebSocketComm() {
    let observable = new Observable(observer => {

      var ws = Global.ws;

      if (ws.readyState === WebSocket.OPEN) {
        console.log("******************* Web Socket Opened and Connected*******************");
        // ws.send(JSON.stringify("hey hii"));
      }
      else {
        ws = Global.ws;
        console.log("Opening New WebSocket As it didnt opened");
      }

      ws.onclose = function() {
        console.log("Closed Websocket");
      }

      ws.onerror = function(err) {
        console.log("Error on websocket", JSON.stringify(err));
      }

      ws.onmessage = function (evt) {
        console.log(JSON.stringify(evt.data));
        var d = JSON.parse(evt.data);
        if (evt.returnValue && d.result != null) {
          Global.docLevelMethodHandle = d.result["qReturn"]["qHandle"];
          console.log(d.result["qReturn"]["qHandle"]);
        }
      }

      setTimeout(() => {
        var openDoc = Global.openDoc(environment.appId, "11003", "Mumbai1947")

        setTimeout(() => {
          console.log(ws);
          ws.send(JSON.stringify(openDoc));
          // ws.send(JSON.stringify(this.GetField('', '')))
          // Global.docLevelMethodHandle++;
        }, 2000);

      }, 1000);

    })
    return observable;
  }

  public secondLevelDocOpration(methodName, request) {
    Global.ws.send(JSON.stringify(request));
    // if (Global.firstLevelOperations.includes(methodName))
    //Global.docLevelMethodHandle++;
  }

}
