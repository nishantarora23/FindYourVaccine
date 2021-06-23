import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfoService } from '@services/user-info/user-info.service';
import { UserLanguageService } from '@services/user-language/user-language.service';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {

  constructor(private readonly userLanguageService: UserLanguageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cLang = this.userLanguageService.getCurrentLanguageCode || UserInfoService.getLanguageCode;
    const dLang = this.userLanguageService.getDefaultLanguageCode || UserInfoService.getDefaultLanguageCode;
    let url = request.url;
    if (cLang && dLang && !url.startsWith('http')) {
      if (this.detectQueryString(request.url)) {
        url = `/common${request.url}&cLang=${cLang}&dLang=${dLang}`;
      }  else {
        url = `/common${request.url}?&cLang=${cLang}&dLang=${dLang}`;
      }
    } else if (!url.startsWith('http')) {
      url = `/common${request.url}`;
    }
    return next.handle(request.clone({url}));
  }

  private detectQueryString(url) {
    // regex pattern for detecting querystring
    const pattern = new RegExp(/\?.+=.*/g);
    return pattern.test(url);
  }
}
