import { Component, OnInit } from '@angular/core';
import { AutocompleteService } from '../autocomplete.service';
import { FormGroup, FormControl,ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
	city: string = ""; 
  state:string = ""; 
	form: FormGroup;
	myControl = new FormControl();
  	options: string[] = [];
    details:string[] = []; 
    details_pass:string; 
    currentLocation:string;
    form_submit:boolean = false; 
    chkbox:boolean = false; 
    resetStatus:boolean =false; 

  constructor(private autocomplete: AutocompleteService) {
  	 
   }

  ngOnInit() {
  	this.form = new FormGroup({
  		city: new FormControl('', Validators.required),
  		state: new FormControl("Select State", Validators.required),
  		street: new FormControl('' , Validators.required),
      // cb: new FormControl([false, Validators.required]),
  	})

  	this.form.controls["city"].valueChanges.subscribe(res => {
  		this.autocomplete.getSuggestions(this.form.controls['city'].value).subscribe(response =>{
  			// console.log(response);
  			res = response; 
  			// console.log(res.predictions);
  			this.options = [];
  			for(var i = 0; i < res.predictions.length; i++){
  				if(i < 5){
  					this.options.push(res.predictions[i].structured_formatting.main_text); 
  					// console.log(res.predictions[i].structured_formatting.main_text); 
  					// console.log(this.options[i]);
  				}else{
  					break; 
  				}
  			}

  			// console.log("First:" + this.options.length); 
  			
  		})
  	})
  }

  getDetails(){

    if(this.chkbox){
      this.autocomplete.getCurrentLocation().subscribe((data:any) => {
        console.log("data");
        console.log(data);
        // this.currentLocation = "{ \"key\": [\""+ data.lat + "\",\"" + data.lon + "\",\"" +data.city+"\", \"Y\",\"" +data.region+"\"] }"; 
        this.currentLocation = "{ \"key\": [\""+ data.latitude + "\",\"" + data.longitude + "\",\"" +data.city+"\", \"Y\",\"" +data.region_code+"\"] }";
        console.log(this.currentLocation); 
        this.autocomplete.sendMessage(this.currentLocation); 
        this.form_submit = true; 
        this.autocomplete.sendFormStatus(this.form_submit);
      }); 
      console.log("Inside getDatils when checkboc is clicked:");
      console.log(this.autocomplete.getCurrentLocation());
    }else{
      this.details = [this.form.controls['street'].value,this.form.controls['city'].value,this.state]; 
      this.details_pass = "{ \"key\": [\""+ this.form.controls['street'].value + "\",\"" + this.form.controls['city'].value + "\",\"" +this.state+"\", \"N\",\"None\"] }"; 
      // console.log(this.details_pass); 
      this.form_submit = true; 

      this.autocomplete.sendMessage(this.details_pass); 
      this.autocomplete.sendFormStatus(this.form_submit); 
      // this.autocomplete.sendMessage(this.form.controls['street'].value);
      // this.autocomplete.sendMessage(this.state);
    }
      
  

  }
  filterChanged(selectedValue:string){
    this.state = selectedValue; 
  }

  ischeckBoxChecked(event){
    if(event.target.checked){
      this.chkbox = true;
      // this.form.controls['city'].value = ""; // not working
      this.form.get('street').disable();
      this.form.get('city').disable();
      this.form.get('state').disable();
    }else{
      this.chkbox = false;
      this.form.get('street').enable();
      this.form.get('city').enable();
      this.form.get('state').enable();
    }
    // console.log(this.chkbox);
  }

  resetData(){
    
    console.log(this.form.controls['city'].value);
    this.resetStatus = true; 
    this.chkbox = false;
    this.form.get('street').enable();
    this.form.get('city').enable();
    this.form.get('state').enable();
    this.autocomplete.sendResetStatus(this.resetStatus);
  }

}
