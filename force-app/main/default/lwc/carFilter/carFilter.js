
import { LightningElement , wire} from 'lwc';
import {getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi'
import CAR_OBJECT from '@salesforce/schema/Car__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'

const CATEGORY_ERROR='Error in loading Categories'
const MAKE_ERROR = 'Error in loading Make'
//Lightning Message Service and Message channel
import CAR_FILTERED_MESSAGE from'@salesforce/messageChannel/carsFiltered__c'
import {publish, MessageContext }from 'lightning/messageService'
export default class CarFilter extends LightningElement {
    
    filters={
        searchKey:'',
        maxPrice:999999
    }
    timer
    categoryError = CATEGORY_ERROR
    makeError = MAKE_ERROR
    //Load context for LMS
    @wire(MessageContext)
    messageContext

    @wire(getObjectInfo,{objectApiName:CAR_OBJECT})
    carObjectInfo
    

    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: CATEGORY_FIELD })categories


    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:MAKE_FIELD
    })makeType 
    
    handleSearchKeyChange(event){
        this.filters={...this.filters,"searchKey":event.target.value}
        console.log(event.target.value)
        this.sendDataToCarList()

    }
    handleMakePriceChange(event){
        this.filters={...this.filters,"maxPrice":event.target.value}
        console.log(event.target.value)
        this.sendDataToCarList()

    }
    handleCheckBox(event){
        const {name,value} = event.target.dataset
        console.log("name", name)
        console.log("value", value)

    }

    sendDataToCarList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext, CAR_FILTERED_MESSAGE, {
                filters:this.filters
            })
        }, 400)
        
    }
}
