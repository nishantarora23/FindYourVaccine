import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationStoreComponent } from './configuration-store.component';

describe('ConfigurationStoreComponent', () => {
  let component: ConfigurationStoreComponent;
  let fixture: ComponentFixture<ConfigurationStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
