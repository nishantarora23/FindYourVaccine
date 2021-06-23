import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private readonly http: HttpClient) { }

  get(url: string) {
    return this.http.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  patch(url: string, data: object) {
    return this.http.patch(url, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  post(url: string, data: object) {
    return this.http.post(url, data).pipe(
      map(data => {
        return data;
      })
    );
  }

  delete(url: string) {
    return this.http.delete(url).pipe(
      map(data => {
        return data;
      })
    );
  }
}
