import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalState: EventEmitter<any> = new EventEmitter();
  valueChanged: EventEmitter<any> = new EventEmitter();

  constructor() { }

  openModal(title: any, value: any, unit: any, id: any, relevantMeasures: any) {    
    let obj: any = {};
    obj.title = title;
    obj.value = value;
    obj.unit = unit;
    obj.id = id;
    obj.relevantMeasures = relevantMeasures
    
    this.modalState.emit(obj);
  }

  updateValue(id:any, value: any, unit: any) {
    this.valueChanged.emit({id: id, value: value, unit: unit})
  }

  openModalQuantity(title: any, value: any, id: any) {    
    let obj:any = {};
    obj.title = title;
    obj.value = value;
    obj.id = id;
    
    this.modalState.emit(obj);
  }
}
