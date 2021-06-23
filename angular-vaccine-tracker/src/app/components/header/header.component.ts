import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@services/app-service/app.service';
import { UserInfoService } from '@services/user-info/user-info.service';
import { UserLanguageService } from '@services/user-language/user-language.service';
import { Subscription } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title: string;
  items;
  landingPageDetails;
  route: string;
  languages;
  language;
  currentLanguage$: Subscription;
  constructor(private readonly appService: AppService,
    private readonly userLanguageService: UserLanguageService,
    private readonly router : Router) {
    this.router.events.subscribe(data => {
      this.route = data?.['url'] || this.route;
    });
    this.currentLanguage$ = this.userLanguageService.getCurrentLanguage.pipe(startWith(""), pairwise()).subscribe(([prev, next]: [string, string]) => {
      if (prev !== next) {
        this.getConfigDetails();
      }
    });
  }

  getConfigDetails() {
    this.appService.get('/getNavbar').subscribe(result => {
      this.title = result?.['title'];
      this.items = result?.['items'];
      this.landingPageDetails = result?.['landingPageDetails'];
    });
  }

  ngOnInit() {
    this.getLanguages();
  }

  getLanguages() {
    this.language = UserInfoService.getLanguageCode;
    if (this.language) {
      this.userLanguageService.setCurrentUserLanguage = this.language;
    }
    this.appService.get(`/config/LANGUAGES`).subscribe(result => {
      this.languages = result['languages'];
      const defaultLanguage = this.languages.find(element => element.default);
      if (defaultLanguage.code) {
        this.userLanguageService.setDefaultUserLanguage = defaultLanguage.code;
        UserInfoService.setDefaultLanguageCode = defaultLanguage.code;
        if (!this.language) {
          this.language = defaultLanguage.code;
          UserInfoService.setLanguageCode = defaultLanguage.code;
          this.userLanguageService.setCurrentUserLanguage = defaultLanguage.code;
        }
      }
    });
  }

  languageChange() {
    this.userLanguageService.setCurrentUserLanguage = this.language;
    UserInfoService.setLanguageCode = this.language;
  }

}
