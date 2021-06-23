import { Injectable } from '@angular/core';
import { UserInfoService } from '@services/user-info/user-info.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserLanguageService {

  private readonly defaultLanguage: BehaviorSubject<string>;
  private readonly currentUserLanguage: BehaviorSubject<string>;
  private readonly currentLanguage: Observable<string>;

  constructor() {
    this.defaultLanguage = new BehaviorSubject<string>('');
    this.currentUserLanguage = new BehaviorSubject<string>(UserInfoService.getLanguageCode);
    this.currentLanguage = this.currentUserLanguage.asObservable();
  }

  public get getCurrentLanguage(): Observable<string> {
    return this.currentLanguage;
  }

  public get getCurrentLanguageCode(): string {
    return this.currentUserLanguage.value;
  }

  public set setCurrentUserLanguage(currentUserLanguage) {
    this.currentUserLanguage.next(currentUserLanguage);
  }

  public get getDefaultLanguageCode(): string {
    return this.defaultLanguage.value;
  }

  public set setDefaultUserLanguage(defaultLanguage) {
    this.defaultLanguage.next(defaultLanguage);
  }
}
