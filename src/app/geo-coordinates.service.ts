import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class GeoCoordinatesService {
	// private_messageSource = new Subject<String>(); 
	// message$ = this.messageSource.asObservable(); 

  constructor(private http: HttpClient) { }

 //  getCoordinates(k_street, k_city, k_state){
	// return this.http.get("http://localhost:3000/complete?address=" + k_street + "," + k_city + "," + k_state);
 //  }

 	// sendMessage(msg: string){
 	// 	this.messageSource.next(msg); 
 	// }
}
