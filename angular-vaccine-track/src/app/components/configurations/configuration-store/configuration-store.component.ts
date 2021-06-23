import { Component, OnInit } from '@angular/core';
import { AppService } from '@services/app-service/app.service';
import { UserLanguageService } from '@services/user-language/user-language.service';
import jsonlint from 'jsonlint';
import { Subscription } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import * as $ from "jquery";
import { Substituter } from '@shared/utils/substituter';
import { ActivatedRoute } from '@angular/router';

window['jsonlint'] = jsonlint;
@Component({
  selector: 'app-configuration-store',
  templateUrl: './configuration-store.component.html',
  styleUrls: ['./configuration-store.component.scss']
})
export class ConfigurationStoreComponent {

  items = [];
  obj = "";
  currentLanguage$: Subscription;
  configuration: any;
  constructor(private readonly appService: AppService,
    private readonly userLanguageService: UserLanguageService,
    private readonly route: ActivatedRoute) {
    if(this.route.snapshot.paramMap.get("configId")) {
      this.currentLanguage$ = this.userLanguageService.getCurrentLanguage.pipe(startWith(""), pairwise()).subscribe(([prev, next]: [string, string]) => {
        if (prev !== next) {
          this.getConfigDetails(this.route.snapshot.paramMap.get("configId"));
        }
      });
    }
  }

  getConfigDetails(configId) {
    this.appService.get(`/config/lang/${configId}`).subscribe(data => {
      this.configuration = data;
      this.getConfigList();
    });
  }

  getConfigList() {
    this.appService.get(this.configuration?.configList?.api).subscribe(data => {
      this.items = data?.['result'];
      setTimeout(()=> {
        console.log($('.name'));
        for (const element of $('.name')) {
          const $this = $(element);
          if(element.offsetWidth < element.scrollWidth) {
            $this.attr('data-toggle', 'tooltip');
            $this.attr('data-placement', 'top');
            $this.attr('title', $this.text());
          }
        }
        for (const element of $('.details')) {
          const $this = $(element);
          if(element.offsetWidth < element.scrollWidth) {
            $this.attr('data-toggle', 'tooltip');
            $this.attr('data-placement', 'top');
            $this.attr('title', $this.text());
          }
        }
      }, 1000);
    });
  }

  performAction(config) {
    $('.element').removeClass('active')
    $(`#${config.id}`).addClass('active')
    const url = Substituter.replace(this.configuration?.config?.api, config);
    this.appService.get(url).subscribe(data => {
      this.obj = JSON.stringify(data, null, 3);
    });
  }

}
