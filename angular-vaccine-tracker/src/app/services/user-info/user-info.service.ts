import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  static get getDefaultUserInfo(): IUserInfo {
    if (sessionStorage.getItem('user_info')) {
      return JSON.parse(sessionStorage.getItem('user_info'))
    }
    return {
      user_name: "",
      domain: "",
      modality: "",
      role: "",
      default_lang: "",
      language_code: "",
      access_token: "",
      refresh_token: ""
    }
  }

  private static set setDefaultUserInfo(userInfo: IUserInfo) {
    sessionStorage.setItem('user_info', JSON.stringify(userInfo))
  }

  private static readonly USER_INFO: IUserInfo = UserInfoService.getDefaultUserInfo;

  constructor() { }

  static clearUserInfo() {
    this.USER_INFO.user_name = "";
    this.USER_INFO.domain = "";
    this.USER_INFO.modality = "";
    this.USER_INFO.role = "";
    this.USER_INFO.default_lang = "";
    this.USER_INFO.language_code = "";
    this.USER_INFO.access_token = "";
    this.USER_INFO.refresh_token = "";
  }

  /**
   * @description: This method is used to set the user information based on key.
   * @argument: Takes key as string type and value as string type.
   * @returns: None
   */
  static setUserInfo(key: string, value: string) {
    this.USER_INFO[key] = value;
    UserInfoService.setDefaultUserInfo = this.USER_INFO;
  }

  /**
   * @description: This method is used to returns user name from use info.
   * @argument: Takes key as arguments.
   * @returns: key's value informations.
   */
  static getUserInfo(key: string): string {
    return this.USER_INFO[key];
  }

  /**
   * @description: This method is used to set the user name to use info.
   * @argument: Takes name as string type.
   * @returns: None
   */
  static set setUserName(name: string) {
    this.USER_INFO.user_name = name;
    UserInfoService.setDefaultUserInfo = this.USER_INFO;
  }

  /**
   * @description: This method is used to returns user name from use info.
   * @argument: Takes no arguments.
   * @returns: user_name
   */
  static get getUserName(): string {
    return this.USER_INFO.user_name;
  }

  /**
   * @description: This method is used to set the domain name to use info.
   * @argument: Takes domain as string type.
   * @returns: None
   */
  static set setDomain(domain: string) {
    this.USER_INFO.domain = domain;
    UserInfoService.setDefaultUserInfo = this.USER_INFO;
  }

  /**
   * @description: This method is used to returns domain name from use info.
   * @argument: Takes no arguments.
   * @returns: domain
   */
  static get getDomain(): string {
    return this.USER_INFO.domain;
  }

  /**
   * @description: This method is used to set the modality name to use info.
   * @argument: Takes modality as string type.
   * @returns: None
   */
  static set setModality(modality: string) {
    this.USER_INFO.modality = modality;
    UserInfoService.setDefaultUserInfo = this.USER_INFO;
  }

  /**
   * @description: This method is used to returns modality name from use info.
   * @argument: Takes no arguments.
   * @returns: modality
   */
  static get getModality(): string {
    return this.USER_INFO.modality;
  }

  /**
   * @description: This method is used to set the role type to use info.
   * @argument: Takes role as string type.
   * @returns: None
   */
  static set setRole(role: string) {
    this.USER_INFO.role = role;
    UserInfoService.setDefaultUserInfo = this.USER_INFO;
  }

  /**
   * @description: This method is used to returns role type from use info.
   * @argument: Takes no arguments.
   * @returns: role
   */
  static get getRole(): string {
    return this.USER_INFO.role;
  }

    /**
   * @description: This method is used to set the default language code type to use info.
   * @argument: Takes language code as string type.
   * @returns: None
   */
    static set setDefaultLanguageCode(languageCode: string) {
      this.USER_INFO.default_lang = languageCode;
      UserInfoService.setDefaultUserInfo = this.USER_INFO;
    }

    /**
     * @description: This method is used to returns default language code type from use info.
     * @argument: Takes no arguments.
     * @returns: language code
     */
    static get getDefaultLanguageCode(): string {
      return this.USER_INFO.default_lang;
    }

  /**
   * @description: This method is used to set the language code type to use info.
   * @argument: Takes language code as string type.
   * @returns: None
   */
  static set setLanguageCode(languageCode: string) {
    this.USER_INFO.language_code = languageCode;
    UserInfoService.setDefaultUserInfo = this.USER_INFO;
  }

  /**
   * @description: This method is used to returns language code type from use info.
   * @argument: Takes no arguments.
   * @returns: language code
   */
  static get getLanguageCode(): string {
    return this.USER_INFO.language_code;
  }

  /**
   * @description: This method is used to set the access token to use info.
   * @argument: Takes accessToken as string type.
   * @returns: None
   */
  static set setAccessToken(accessToken: string) {
    this.USER_INFO.access_token = accessToken;
    UserInfoService.setDefaultUserInfo = this.USER_INFO;
  }

  /**
   * @description: This method is used to returns access token name from use info.
   * @argument: Takes no arguments.
   * @returns: access_token
   */
  static get getAccessToken(): string {
    return this.USER_INFO.access_token;
  }

  /**
   * @description: This method is used to set the refresh token to use info.
   * @argument: Takes refreshToken as string type.
   * @returns: None
   */
  static set setRefreshToken(refreshToken: string) {
    this.USER_INFO.refresh_token = refreshToken;
    UserInfoService.setDefaultUserInfo = this.USER_INFO;
  }

  /**
   * @description: This method is used to returns refresh token name from use info.
   * @argument: Takes no arguments.
   * @returns: refresh_token
   */
  static get getRefreshToken(): string {
    return this.USER_INFO.refresh_token;
  }
}


export interface IUserInfo {
  user_name: string;
  domain: string;
  modality: string;
  role: string;
  default_lang: string;
  language_code: string;
  access_token: string;
  refresh_token: string;
}