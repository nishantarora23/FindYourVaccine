import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '@services/app-service/app.service';
import { UserLanguageService } from '@services/user-language/user-language.service';
import { District, State } from '@shared/models/states';
import { Substituter } from '@shared/utils/substituter';
import { Subscription } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { JSONPath } from 'jsonpath-plus';
import { ActivatedRoute } from '@angular/router';
declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  states: Array<State>;
  districts: Array<District>;
  userInfo: FormGroup;
  currentLanguage$: Subscription;
  configuration: any;
  response = {
    "status": "",
    "type": "",
    "message": ""
  };
  test = {};

  constructor(private readonly appService: AppService,
    private readonly formBuilder: FormBuilder,
    private readonly userLanguageService: UserLanguageService,
    private readonly el: ElementRef,
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
    this.test = {};
    this.appService.get(`/config/lang/${configId}`).subscribe(data => {
      this.configuration = data;
      this.userInfoFormBuilder();
    });
  }

  userInfoFormBuilder() {
    this.userInfo = this.formBuilder.group({});
    for(const element of this.configuration?.formDetails) {
      if(element?.api) {
        this.getOptions(element);
      } else if (element?.jsonpath) {
        this.getOptions(element);
      }
      const validators = [];
      if(element?.['validators']) {
        const validator = element?.['validators'];
        if(validator.required) {
          validators.push(Validators.required)
        }
        if(validator.email) {
          validators.push(Validators.email)
        }
        if(validator.pattern) {
          validators.push(Validators.pattern(validator.pattern))
        }
      }
      this.userInfo.addControl(element?.control, this.formBuilder.control(element?.['defaultValue'], validators))
    }
  }

  performAction(event) {
    switch(event?.type) {
      case 'submit': {
        this.submit(event);
        break;
      }
      case 'clear': {
        this.userInfo.reset();
        break;
      }
    }
  }

  submit(event) {
    if(this.userInfo.invalid) {
      this.userInfo.markAllAsTouched();
      setTimeout(() => {
        this.scrollToFirstInvalidControl();
      }, 100);
      return;
    }
    console.log(this.userInfo.value);
    const body = { ...this.userInfo.value, id: this.userInfo.value.email }
    this.appService.post(event?.api, body).subscribe(data => {
      this.response['status'] = 'Successful';
      this.response['type'] = 'success';
      this.response['message'] = 'Successfully updated the user info.';
      if(event?.toaster?.onSuccess) {
        this.response = event?.toaster?.onSuccess;
        jQuery('.toast').toast('show');
      }
    }, error => {
      if(event?.toaster?.onError) {
        this.response = event?.toaster?.onError;
        jQuery('.toast').toast('show');
      }
    })
  }

  closeToast() {
    jQuery('.toast').toast('hide');
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      ".form-control"
    );
    firstInvalidControl.focus();
  }

  get userInfoFormControls() {
    return this.userInfo.controls;
  }

  userInfoFormControlsByName(name) {
    return this.userInfo.get(name);
  }

  onChange(element) {
    if(element?.onChange) {
      const control = this.configuration?.formDetails?.find(ele => ele?.control === element?.onChange);
      this.getData(control);
    }
  }

  getOptions(element) {
    if(!this.test?.[element.control]) {
      this.getData(element);
    }
  }

  getData(element) {
    const body = {
      'dependent': this.userInfo.get(element?.api?.dependent)?.value || null,
      'configuration': this.configuration,
      'form': this.userInfo.value
    }
    if(element?.api) {
      const url = Substituter.replace(element?.api?.url, body)
      if((element?.api?.dependent && body?.dependent) || !element?.api?.dependent) {
        this.appService.get(url).subscribe(data => {
          const jsonpath = {
            path: element?.api?.path,
            json: data,
            wrap: false
          }
          this.test[element.control] = JSONPath(jsonpath);
        });
      }
    } else if(element?.jsonpath) {
      const jsonpath = element?.jsonpath;
      jsonpath.json = body;
      this.test[element.control] = JSONPath(jsonpath);
    }
  }

}
