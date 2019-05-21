import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './register/confirm.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './home/users.component';
import { PostListComponent } from './profile/post-list.component';
import { AlertComponent } from './alerts/alert.component';

import { AuthGuardService } from './services/authentication/auth-guard.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthRedirectService } from './services/authentication/auth-redirect.service';
import { UserUtilsService } from './services/users/user-utils.service';
import { PostUtilsService } from './services/posts/post-utils.service';
import { AlertService } from './services/alerts/alert.service';
import { SkillsService } from './services/skills/skills.service';
 
import { FilterPipe } from './services/pipes/filter.pipe';
import { SkillsPipe } from './services/pipes/skills.pipe';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent, canActivate: [AuthRedirectService]},
  { path: 'register', component: RegisterComponent, canActivate: [AuthRedirectService] },
  { path: 'profile/:email', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'profile/:email/posts', component: PostListComponent, canActivate: [AuthGuardService] },
  { path: 'confirm/:email', component: ConfirmComponent, canActivate: [AuthRedirectService] },
  { path: '**', redirectTo: '/' }
];

// const appRoutes: Routes = [
//     { path: '', component: HomeComponent, canActivate: [] },
//   { path: 'users', component: UsersComponent, canActivate: []},
//   { path: 'login', component: LoginComponent, canActivate: []},
//   { path: 'register', component: RegisterComponent, canActivate: [] },
//   { path: 'profile/:email', component: ProfileComponent, canActivate: [] },
//   { path: 'profile/:email/posts', component: PostListComponent, canActivate: [] },
//   { path: 'confirm/:email', component: ConfirmComponent, canActivate: [] },
//   { path: '**', redirectTo: '/' }
// ];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmComponent,
    ProfileComponent,
    NavbarComponent,
    HomeComponent,
    UsersComponent,
    PostListComponent,
    AlertComponent,
    FilterPipe,
    SkillsPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    FormsModule
  ],
  providers: [
    AuthGuardService,
    AuthRedirectService,
    AuthenticationService,
    UserUtilsService,
    PostUtilsService,
    AlertService,
    SkillsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
