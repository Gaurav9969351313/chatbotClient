import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { map } from "rxjs/operators";
import { StorageAndUtilsService } from "./storageAndUtils.service";
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class HttpService {

  private baseUrl = environment.apiUrl;
  //https://mapps.mahindra.com/BMCRemedyBotTest/chatbot?tokens=214333
  //23180189

  //214333
  //m&mprd@59

  //mahindra\11003
  //Mumbai1947

  constructor(private http: Http, private utilsService: StorageAndUtilsService) { }

  authenticateAD(username, password) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    var enc = this.utilsService.encryptWithAES(username, password);
    var adServiceBody = { "tokenid": enc };
    console.log("adServiceBody:- ", adServiceBody);
    return this.http.post(environment.loginFromADUrl, adServiceBody, options);
  }

  authenticateWithQlik(username, password) {
    return this.http.post(environment.urlForQlikAuthentication, { "username": username });
    //this.http.get("http://localhost:7000/getWholeMetaData");
  }

  httpGet(url: string) {
    return this.http.get(url);
  }

  pushtLogToServer(url:string,body:Object) {
    return this.http.post(url,body).subscribe(()=>{});
  }

  get(url: string) {
    return this.request(url, RequestMethod.Get);
  }

  post(url: string, body: Object) {
    return this.request(url, RequestMethod.Post, body);
  }

  put(url: string, body: Object) {
    return this.request(url, RequestMethod.Put, body);
  }

  delete(url: string) {
    return this.request(url, RequestMethod.Delete);
  }

  request(url: string, method: RequestMethod, body?: Object) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('    ', `Bearer ${this.auth.getToken()}`);

    const requestOptions = new RequestOptions({
      url: `${this.baseUrl}/${url}`,
      method: method,
      headers: headers
    });

    if (body) {
      requestOptions.body = body;
    }

    const request = new Request(requestOptions);

    return this.http.request(request)
      .pipe(map((res: Response) => res.json()));
  }
}
