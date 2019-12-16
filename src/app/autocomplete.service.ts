import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs'; 
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
	// private messageSource = new Subject<string>();
	private messageObj = new BehaviorSubject<string>(""); 
	currentMessage$ = this.messageObj.asObservable(); 

	private statObj = new BehaviorSubject<boolean>(false); 
	statMessage$ = this.statObj.asObservable(); 

  private resetObj = new BehaviorSubject<boolean>(false); 
  resetMessage$ = this.resetObj.asObservable();

  constructor(private http: HttpClient) { 
  }

  getSuggestions(keyword){
	return this.http.get("/complete?keyword=" + keyword);
  }

  getCoordinates(street, city, state){
  	return this.http.get("/getCoordinate?address=" + street + "," + city + "," + state);
  }

  getDetails(lat, long){
  	return this.http.get("/getInfo?val=" + lat + "," + long);
  }

   sendMessage(details:string){
  	this.messageObj.next(details); 
  }

  sendFormStatus(value:boolean){
  	this.statObj.next(value); 
  }

  getCurrentLocation(){
    // return this.http.get("http://ip-api.com/json"); 
    return this.http.get("https://ipapi.co/json"); 
  }

  sendResetStatus(resetVal:boolean){
    this.resetObj.next(resetVal); 
  }

   getDetailedWeather(lat, lng, time){
    return this.http.get("/getDetailedInfo?details=" + lat + "," + lng + "," + time);
  }

  getStateSeal(state){
    return this.http.get("/getSeal?q=" + state);
  }
}



// function getSuggestions(keyword){
//   	this.http.get("http://localhost:3000/complete/"+keyword).subscribe(data =>{
//   		console.log(data); 
//   	})
//   }