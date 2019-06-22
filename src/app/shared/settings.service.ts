import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ISettings, IGetSettings, IPutSettings, IUpdateSettings } from "./models";

@Injectable()
export class SettingsService {
  api = environment.api;
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }

  settings: ISettings

  constructor(private http: HttpClient) {}

  async initialiseSettingsData(): Promise<boolean> {
    try {
      const { data: settings } = await this.fetchSettingsData();
      this.settings = settings;
      return true;
    } catch(e) {
      throw new Error();
    }
  }

  async fetchAdminSettings() {
    if (!this.settings) await this.initialiseSettingsData();
    console.log(this.settings, 'frooommmm')
    return this.settings;
  }

  syncWithAPI() {
    return this.initialiseSettingsData();
  }

  getReopenDate(cronDate) {
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const dayOfTheMonth = cronDate.split(' ')[2];
    const currentDay = today.getDate();

    if (dayOfTheMonth > currentDay) {
      return new Date(thisYear, thisMonth, dayOfTheMonth).toDateString();
    }
    return new Date(thisYear, thisMonth + 1, dayOfTheMonth).toDateString();
  }

  fetchSettingsData(): Promise<IGetSettings> {
    return this.http.get<IGetSettings>(`${this.api}/admin/settings`, this.options).toPromise();
  }

  updateSettings(settings: IUpdateSettings): Promise<IPutSettings> {
    return this.http.put<IPutSettings>(`${this.api}/admin/settings/schedules`, settings, this.options).toPromise();
  }
}