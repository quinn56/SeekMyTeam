import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
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
  constructor(private auth: AuthenticationService, private user_utils: UserUtilsService, private router: Router) { }

  ngOnInit() {
    this.currentEmail = this.user_utils.getCurrentUserDetails().email;
    this.profilePic = this.user_utils.buildProfilePicUrl(this.currentEmail);
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  routeProfile() {
    this.currentEmail = this.user_utils.getCurrentUserDetails().email;
    this.router.navigateByUrl('/profile/' + this.currentEmail);
  }

  logout() {
    this.auth.logout();
  }
}
