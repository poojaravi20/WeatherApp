import { Component, OnInit } from '@angular/core';
import { GeoCoordinatesService } from '../geo-coordinates.service';
import { FormGroup, FormControl,ReactiveFormsModule, Validators} from '@angular/forms';
import { AutocompleteService } from '../autocomplete.service';
import * as CanvasJS from '../canvasjs-2.3.2/canvasjs.min';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialogConfig,MatDialog } from '@angular/material';
import { MatDialogModule} from '@angular/material';
// $(function () {
//   $('[data-toggle="tooltip"]').tooltip()
// })

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit {
	city: string = ""; 
	form: FormGroup;
	message:string; 
	result:any;
	isT1Active:boolean = false;
	isT2Active:boolean = false;
	isT3Active:boolean = false;
	displayResults: boolean = false; 
	progressBar:boolean = false; 
	graph:any = [];
	valueY:any = [];  
	hourly:string; 
	barChartOptions:any;
	barChartLabels:any;
	barChartData:any;
	barChartType = 'bar';
	barChartLegend = true;
	file:any; 
	dateDisplay:string=""; 
	lat:any; 
	long: any;
	progressBarStatus:any;
	resetButtonStatus:any; 
	state:any; 
	barColors:any; 
	tweet:string; 

	isDetailClicked:boolean = false; 
	title = 'app';
	temperature:any; 
	invalidAddress:any = false;  
	timeClicked: any; 
	detailedWeatherInformation:any; 
	stateSealResponse:any; 

	// parameters for detailed weather card
	detailedTime:any; 
	detailedTemperature:any;
	detailedSummary:any;
	detailedIcon: any; 
	detailedPrecep:any; 
	detailedRain:any; 
	detailedWindSpeed:any; 
	detailedHumidity:any; 
	detailedVisibility:any; 

	// favorites
	isfavClicked:boolean=false; 
	favoritesValue:any; 
	showCard:boolean = false; 
	favoritesArray:any = []; 
	displayFavButton:boolean = false; 
	displayResButton:boolean = true; 
	noRecords: boolean = false; 
	isStarClicked:boolean = false; 

	
  constructor(private data: AutocompleteService) {
  	
   }

   displayGraph(legend,xLabel){
		this.barChartOptions = {
	    scaleShowVerticalLines: false,
	    responsive: true,
	    legend: {
            onClick: (e) => e.stopPropagation()
        },
	    scales: {
		    yAxes: [{
		      scaleLabel: {
		        display: true,
		        labelString: xLabel
		      }
		    }],
		    xAxes: [{
		      scaleLabel: {
		        display: true,
		        labelString: 'Time difference from current hour'
		      }
		    }],
  		},   
	  };
	  this.barChartLabels = this.graph;
	  this.barChartData = [
	    {data: this.valueY, label: legend, backgroundColor: "#9AC5F5", hoverBackgroundColor: "#9AC5F5"},
	  ];
	}

	



  ngOnInit() {
  		this.valueY = []; 
  		this.form = new FormGroup({
  		city: new FormControl('', Validators.required),
  		state: new FormControl('', Validators.required),
  		street: new FormControl('', Validators.required),

  	})
  		this.data.statMessage$.subscribe(statObj=>{
  			this.progressBarStatus = statObj;
  			console.log(this.progressBarStatus);
  			this.showProgressBar(this.progressBarStatus); 
  		}); 

  		this.data.resetMessage$.subscribe(resetObj=>{
  			this.resetButtonStatus = resetObj;
  			console.log(this.resetButtonStatus);
  			this.clearElements(this.resetButtonStatus); 
  			// this.showProgressBar(this.progressBarStatus); 
  		}); 

  		this.data.currentMessage$.subscribe(messageObj => {
  			if(messageObj != ""){
  				this.message = messageObj; 
  				console.log("message from form is: ");
  				console.log(messageObj);
  				var street = encodeURI(JSON.parse(this.message).key[0]);
  				var city = encodeURI(JSON.parse(this.message).key[1]);
  				this.city = JSON.parse(this.message).key[1]; 
  				var state = JSON.parse(this.message).key[2];
  				var isCurrentLocation = JSON.parse(this.message).key[3];
  				console.log(street, city, state);
  				console.log("isCurrentLocation: " + isCurrentLocation);
  				if(isCurrentLocation == "N"){
  					this.state = JSON.parse(this.message).key[2]; 
  					console.log("state is:"); 
  					console.log(this.state); 
  					this.data.getCoordinates(street,city,state).subscribe((response:any)=>{
	  					if(response.status == "OK"){
	  						this.noRecords = false; 
	  						this.isT1Active = false; 
	  						this.invalidAddress = false; 
	  						this.displayFavButton = false; 
	  						this.displayResButton = true; 
	  						this.isfavClicked = false; 
	  						this.lat = response.results[0].geometry.location.lat; 
	  						this.long = response.results[0].geometry.location.lng;
	  						this.data.getDetails(this.lat, this.long).subscribe((responsedetails:any) => {
			  					// console.log("In response of weather-details component");
			  					this.result = responsedetails;
			  					this.doDisplay(this.result);
			  						
			  					// console.log("response details:");
			  					// console.log(responsedetails); 
			  					this.data.getStateSeal(this.state).subscribe((sealResponse:any) =>{
	  								// console.log(sealResponse);
	  								this.stateSealResponse = sealResponse.items[0].link;
	  								// console.log(this.stateSealResponse); 

	  							})

			  					this.tweet = "The current temperature at " + this.city + " is " + this.result.currently.temperature + "˚ F. The weather conditions are " + this.result.currently.summary + ".&hashtags=CSCI571WeatherSearch"; 
			  					this.temperature = Math.round(this.result.currently.temperature);
			  					this.progressBar = false;
			  					this.displayResults = true; 
			  					this.isT1Active = true; 
			  					this.showCard = true; 

	  						}) 	
	  					}else{
	  						this.invalidAddress = true; 
	  						this.progressBar = false;
	  						this.displayResults = false; 
	  						this.isT1Active = false; 
	  					}
  									
  					});
  				}
  				else{
  					this.noRecords = false;
  					this.isStarClicked = false; 
  					this.isT3Active = false;
  					this.isT1Active = false; 
  					this.displayFavButton = false; 
  					this.displayResButton = true; 
  					this.isfavClicked = false; 
  					this.state = JSON.parse(this.message).key[4];
  					// console.log("state is:"); 
  					// console.log(this.state); 
  					this.lat = JSON.parse(this.message).key[0];
  					this.long = JSON.parse(this.message).key[1];
  					this.city = JSON.parse(this.message).key[2];
  					// console.log("lat: " + this.lat + " lang: " + this.long);
  					this.data.getDetails(this.lat, this.long).subscribe((responsedetails:any) => {
	  					// console.log("In response of weather-details component");
	  					this.result = responsedetails;
	  					this.doDisplay(this.result);

	  					this.data.getStateSeal(this.state).subscribe((sealResponse:any) =>{
	  						// console.log(sealResponse);
	  						this.stateSealResponse = sealResponse.items[0].link;
	  						// console.log(this.stateSealResponse);
	  					})
	  						
	  					// console.log("response details:");
	  					// console.log(responsedetails); 
	  					this.temperature = Math.round(this.result.currently.temperature);
	  					this.tweet = "The current temperature at " + this.city + " is " + this.result.currently.temperature + "˚ F .The weather conditions are" + this.result.currently.summary + ".&hashtags=CSCI571WeatherSearch"; 
	  					this.progressBar = false;
	  					this.displayResults = true; 
	  					this.isT1Active = true; 
	  					this.showCard = true; 
  					})
  				}
  				
			}
  		}
  	);
}

onClick(e) {

			this.isDetailClicked = true; 
			//click a modal button
			// console.log(this);
			// console.log(document);
			document.getElementById("myClick").click(); 
			// console.log(e.dataPointIndex);
			// console.log(this.result.daily.data[e.dataPointIndex].time)
			this.timeClicked = this.result.daily.data[e.dataPointIndex].time; 
			// console.log("time: " + this.timeClicked); 
			// console.log("lat: " +this.lat); 
			// console.log("lng:" + this.long); 

			this.data.getDetailedWeather(this.lat,this.long,this.timeClicked).subscribe((detailedWeatherResponse:any)=>{
				// console.log(detailedWeatherResponse); 
				this.detailedWeatherInformation = detailedWeatherResponse; 
				this.detailedTime = this.calculateDate(this.detailedWeatherInformation.daily.data[0].time) ;
				// console.log("detailed Card Info:");
				// console.log(this.detailedWeatherInformation); 
				this.detailedTemperature = Math.round(this.detailedWeatherInformation.currently.temperature);
				this.detailedSummary = this.detailedWeatherInformation.currently.summary;

				this.detailedIcon = this.detailedWeatherInformation.currently.icon;
				if(this.detailedIcon == "clear-day" || this.detailedIcon == "clear-night"){
					this.detailedIcon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png"; 
				}else if(this.detailedIcon == "rain"){
					this.detailedIcon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
				}else if(this.detailedIcon == "snow"){
					this.detailedIcon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
				}else if(this.detailedIcon == "sleet"){
					this.detailedIcon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png";
				}else if(this.detailedIcon == "wind"){
					this.detailedIcon = "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
				}else if(this.detailedIcon == "fog"){
					this.detailedIcon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
				}else if(this.detailedIcon == "cloudy"){
					this.detailedIcon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png";
				}else{
					this.detailedIcon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
				}
				this.detailedPrecep = this.detailedWeatherInformation.currently.precipIntensity
				this.detailedRain = (this.detailedWeatherInformation.currently.precipProbability) * 100;
				this.detailedWindSpeed = this.detailedWeatherInformation.currently.windSpeed;
				this.detailedHumidity = (this.detailedWeatherInformation.currently.humidity)*100;
				this.detailedVisibility = this.detailedWeatherInformation.currently.visibility;
				

			});

		}

		week(){
			var chart = new CanvasJS.Chart("chartContainer", {
			dataPointWidth: 15,
			animationEnabled: true,
			exportEnabled: false,
			title: {
				text: "Weekly Weather"
			},
			axisX: {
				title: "Days"
			},
			axisY: {
				includeZero: false,
				title: "Temperature in Fahrenheit",
				interval: 10,
				gridThickness: 0,
				suffix: "",
				prefix: ""
			}, 
			
			// click:displayDetails(),
			data: [{
				type: "rangeBar",
				showInLegend: true,
				yValueFormatString: "#0.#",
				indexLabel: "{y[#index]}",
				legendText: "Day wise temperature range",
				toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
				color:"#9AC5F5",
				// click: this.onClick(e),
				click: (e) => {
					this.onClick(e); 
				},
				dataPoints: [
					{ x: 10, y:[Math.round(this.result.daily.data[0].temperatureLow), Math.round(this.result.daily.data[0].temperatureHigh)], label: this.calculateDate(this.result.daily.data[0].time)},
					{ x: 20, y:[Math.round(this.result.daily.data[1].temperatureLow), Math.round(this.result.daily.data[1].temperatureHigh)], label: this.calculateDate(this.result.daily.data[1].time) },
					{ x: 30, y:[Math.round(this.result.daily.data[2].temperatureLow), Math.round(this.result.daily.data[2].temperatureHigh)], label: this.calculateDate(this.result.daily.data[2].time) },
					{ x: 40, y:[Math.round(this.result.daily.data[3].temperatureLow), Math.round(this.result.daily.data[3].temperatureHigh)], label: this.calculateDate(this.result.daily.data[3].time) },
					{ x: 50, y:[Math.round(this.result.daily.data[4].temperatureLow), Math.round(this.result.daily.data[4].temperatureHigh)], label: this.calculateDate(this.result.daily.data[4].time) },
					{ x: 60, y:[Math.round(this.result.daily.data[5].temperatureLow), Math.round(this.result.daily.data[5].temperatureHigh)], label: this.calculateDate(this.result.daily.data[5].time) },
					{ x: 70, y:[Math.round(this.result.daily.data[6].temperatureLow), Math.round(this.result.daily.data[6].temperatureHigh)], label: this.calculateDate(this.result.daily.data[6].time) },
					{ x: 80, y:[Math.round(this.result.daily.data[7].temperatureLow), Math.round(this.result.daily.data[7].temperatureHigh)], label: this.calculateDate(this.result.daily.data[7].time) }
				]
				
			}],
			
		});

		chart.render();
		
	}


	  //barChartData.data
	activate(elem){
	  //deactivate all first
	  this.isT1Active = false;
	  this.isT2Active = false;
	  this.isT3Active = false;

	  switch(elem){
	    case 't1':{this.isT1Active = true;
	    	this.isfavClicked = false;
	    	break;}
	    case 't2':{this.isT2Active = true;
	    	this.isfavClicked = false;
	    	break;}
	    case 't3':{
	    	this.isT3Active = true;
	    	this.week(); 
	    	this.isfavClicked = false;
	    	break;
	    }
	  }
	}

	showResults(){
		if(!this.progressBarStatus || this.invalidAddress){
			this.displayResults = false; 
			this.isT1Active = false; 
			this.isfavClicked = false;
			this.displayResButton = true;
			this.displayFavButton = false;  
			this.noRecords = false;
		}else{
			this.displayResults = true; 
			this.isT1Active = true; 
			this.isfavClicked = false;
			this.displayResButton = true;
			this.displayFavButton = false;  
			this.noRecords = false; 
		}
			
		
		
	}

	setProperty(selectedProperty){
    this.hourly = selectedProperty.target.value;

    this.doDisplay(this.result);
    // console.log("responseDEtails inside setProperty:" +this.result);
    //     console.log("this.hourly:" + this.hourly); 
  }

  doDisplay(file){
  	this.valueY = [];
  	this.graph = [];
  	// console.log("this.doDisplay:" +this.valueY); 
  	for(var i = 0; i < 24; i++){
  		this.graph.push(i); 
  		// console.log("this.hourly: ");
  		if(this.hourly === "temp"){
			this.valueY.push(Math.round(file.hourly.data[i].temperature)); 
  		}else if(this.hourly === "pres"){
  			this.valueY.push(file.hourly.data[i].pressure); 
  		}else if(this.hourly === "humid"){
  			this.valueY.push(file.hourly.data[i].humidity); 
  		}else if(this.hourly === "ozone"){
  			this.valueY.push(file.hourly.data[i].ozone); 
  		}else if(this.hourly === "visi"){
  			this.valueY.push(file.hourly.data[i].visibility); 
  		}else{
  			this.valueY.push(file.hourly.data[i].windSpeed);
  		}						
  	}
  	if(this.hourly === "temp"){
  		this.displayGraph("temperature", "Fahrenheit"); 
  	}else if(this.hourly === "pres"){
  		this.displayGraph("Pressure", "Millibars"); 
  	}else if(this.hourly === "humid"){
  		this.displayGraph("Humidity", "% Humidity");
  	}else if(this.hourly === "ozone"){
  		this.displayGraph("Ozone", "Dobson Units");
  	}else if(this.hourly === "visi"){
  		this.displayGraph("Visibility", "Miles (Maximum 10)");
  	}else if(this.hourly === "wind"){
  		this.displayGraph("windSpeed", "Miles per hour");
  	}else{
  		this.displayGraph("temperature","Fahrenheit"); 
  	}
}

calculateDate(timeStamp){
	var datePipe = new DatePipe("en-US");
    timeStamp = datePipe.transform(timeStamp * 1000, 'dd/MM/yyyy');
    this.dateDisplay = timeStamp; 
	return this.dateDisplay; 
}

showProgressBar(barStatus){
	if(barStatus){
		this.progressBar = true;
		this.displayResults = false;
		this.isT1Active = false;  
	}else{
		this.progressBar = false; 
	}
}

clearElements(clearStatus){
	this.progressBar = false; 
	this.displayResults = false;
	this.isT1Active = false; 
	this.isT2Active = false; 
	this.isT3Active = false; 
	this.invalidAddress = false; 
	this.isfavClicked = false;
	this.displayFavButton = false;
	this.displayResButton = true;
	this.noRecords = false; 
}

favoriteClick(){
	this.displayFavButton = true;
	this.displayResButton = false;
	this.invalidAddress = false;  
	this.isfavClicked = true;
	this.isT3Active = false;
	this.isT2Active = false;
	this.isT1Active = false; 
	this.displayResults = false; 

	this.favoritesArray = []; 
	if(localStorage.length === 0){
		this.noRecords = true; 
		this.isfavClicked = false; 
	}
	for(var i = 0; i < localStorage.length; i++){
		this.favoritesArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
		// console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));
	}
	// console.log(this.favoritesArray); 
	// console.log(this.favoritesArray[0].city);
}

createFavorites(){
	// localStorage.clear(); 
	// this.isfavClicked = false;
	this.isStarClicked = true; 
	this.favoritesValue = {
		// count:this.counter, 
		city:this.city, 
		state: this.state, 
		stateSeal: this.stateSealResponse, 
		latitude: this.lat, 
		longitude: this.long 
	}
	localStorage.setItem(JSON.stringify(this.city), JSON.stringify(this.favoritesValue)); 
	// console.log(JSON.stringify(this.city)); 
	
	// this.favoritesArray.push(this.favoritesValue); 
	// console.log(this.favoritesArray); 

	// console.log(localStorage);
}

deleteItem(event){
	// localStorage.removeItem(city);
	// console.log(event.target.id); 
	// console.log("\"event.target.id\"");
	// String valueCity; 
	// console.log(valueCity); 
	// console.log("=======");
	// console.log("Item to delete: " + localStorage.getItem("\"" +event.target.id + "\""));
	localStorage.removeItem("\"" +event.target.id + "\"");
	this.isStarClicked = false; 
	this.favoritesArray = this.favoritesArray.filter((arr)=>arr.city !== event.target.id); 
	// console.log("after delete:");
	// console.log(localStorage);
	if(localStorage.length == 0){
		this.isfavClicked = false; 
	}
}

displayDetails(event){

	// console.log(event.target.id); 
	// console.log(JSON.parse(localStorage.getItem("\"" +event.target.id + "\"")));
	var entry = JSON.parse(localStorage.getItem("\"" +event.target.id + "\"")); 
	this.isStarClicked = true; 
	this.displayResButton = true; 
	this.displayFavButton = false; 
	// console.log(entry);
	// console.log("Latitude: "); 
	// console.log(entry.latitude); 
	// console.log("longitude: "); 
	// console.log(entry.longitude); 
	this.city = entry.city; 
	this.lat = entry.latitude; 
	this.long = entry.longitude; 
	this.state = entry.state; 
	this.progressBar = true;
	this.isfavClicked = false; 
	this.isT1Active = false; 
	this.isT3Active = false; 
	this.isfavClicked = false; 
	this.data.getDetails(this.lat, this.long).subscribe((responsedetails:any) => {
		// console.log("In response of weather-details component");
		this.result = responsedetails;
		this.doDisplay(this.result);
			  						
		// console.log("response details:");
		// console.log(responsedetails); 
		this.data.getStateSeal(this.state).subscribe((sealResponse:any) =>{
	  		// console.log(sealResponse);
	  		this.stateSealResponse = sealResponse.items[0].link;
	  		// console.log(this.stateSealResponse); 

	  	})

		this.tweet = "The current temperature at " + entry.city + " is " + this.result.currently.temperature + "˚ F. The weather conditions are  " + this.result.currently.summary + ".&hashtags=CSCI571WeatherSearch"; 
		this.temperature = Math.round(this.result.currently.temperature);
		this.progressBar = false;
		this.displayResults = true; 
		this.isT1Active = true; 
		this.showCard = true; 
		this.isfavClicked = false; 

	 }) 	
}



//*ngFor = "let variableName of arrayName"

  

	
}
