import { Component, OnChanges } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnChanges {
  profilePic: string;
  isCollapsed: Boolean = true;
  currentEmail: string;
  searchText: string;
  
  constructor(
    private auth: AuthenticationService,
    private authGuard: AuthGuardService,
    private user_utils: UserUtilsService,
    private router: Router
  ) {
   }

  ngOnInit() {
    this.currentEmail = this.user_utils.getCurrentUserDetails().email;
    this.profilePic = this.user_utils.buildProfilePicUrl(this.currentEmail);
  }

  isLoggedIn() {
    return this.authGuard.isLoggedIn();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  updateUrl(event) {
    this.profilePic = this.user_utils.buildDefaultProfilePicUrl();
  }

  routeProfile() {
    this.currentEmail = this.user_utils.getCurrentUserDetails().email;
    this.router.navigateByUrl('/profile/' + this.currentEmail);
  }

  routeMyProjects() {
    this.currentEmail = this.user_utils.getCurrentUserDetails().email;
    this.router.navigateByUrl('/profile/' + this.currentEmail + '/posts');
  }

  logout() {
    this.auth.logout();
  }
}
