import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';

export interface UserDetails {
  email: string,
  exp: number,
  iat: number
}

export interface UserProfile {
  email: string,
  name: string,
  description: string,
  skills: string[],
  facebook: string,
  linkedin: string
}

interface DeletePayload {
  email: string
}

interface UpdatePayload {
  description: string,
  skills: string,
  facebook: string,
  linkedin: string
}

interface MarkAppliedPayload {
  project: string
}

@Injectable({
  providedIn: 'root'
})
export class UserUtilsService {

  constructor(private http: HttpClient) { }

  public buildProfilePicUrl(email: string) { 
    var S3_URL = 'https://s3.us-east-2.amazonaws.com/seekmyteam-profile-pics/';
    return S3_URL + email + '/picture?' + new Date().getTime();
  }
  
  public buildDefaultProfilePicUrl() { 
    var S3_URL = 'https://s3.us-east-2.amazonaws.com/seekmyteam-profile-pics/default_profile.png?';
    return S3_URL + new Date().getTime();
  }

  public markApplied(proj: string) {
    var req: MarkAppliedPayload = {
      project: proj
    };
    return this.postMarkApplied(req);
  }

  public updateProfile(description: string, skills: string, facebook: string, linkedin: string): Observable<any> {
    var req: UpdatePayload = {
        description: description,
        skills: skills,
        facebook: facebook,
        linkedin: linkedin
    };
    return this.requestUpdateProfile(req);
  }

  public getAllUsers(): Observable<any> {
    return this.requestAllUsers();
  }

  public getProfile(email: string): Observable<any> {
    return this.requestProfile(email);
  }

  public deleteProfile(email: string): Observable<any> {
    var req: DeletePayload = {
      email: email
    }
    return this.requestDeleteProfile(req);
  }

  public uploadProfilePicture(data: FormData): Observable<any> {
    return this.postPicture(data);
  }

  private postMarkApplied(req: MarkAppliedPayload): Observable<any> {
    let base = this.http.post('/api/profile/markApplied', req, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private requestAllUsers(): Observable<any> {
    let base = this.http.get('/api/users', { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postPicture(req: FormData) {
    let base = this.http.post('/api/profile/uploadPicture', req, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private requestUpdateProfile(req: UpdatePayload): Observable<any> {
    let base = this.http.post('/api/profile/update', req, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private requestDeleteProfile(req: DeletePayload): Observable<any> {
    let base = this.http.post('/api/profile/delete', req, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private requestProfile(email: string): Observable<any> {
    let base = this.http.get('/api/profile/' + email, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private getToken(): string {
    return localStorage.getItem('jwt-token');
  }

  public getCurrentUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;

    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }
}
