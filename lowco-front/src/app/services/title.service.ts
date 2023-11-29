import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  title = new BehaviorSubject<string>("");

  constructor() {
  }

  setTitle(title: string) {
    this.title.next(title);
  }

  getTitle() {
    return this.title;
  }
}
