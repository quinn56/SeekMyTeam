import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserUtilsService, UserProfile, UserDetails } from '../services/users/user-utils.service';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { AlertService } from '../services/alerts/alert.service';
import { SkillsService } from '../services/skills/skills.service';


@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  acceptedMimeTypes: string[] = [
    'image/gif',
    'image/jpeg',
    'image/png'
  ];

  @ViewChild('fileInput') fileInput: ElementRef;
  fileDataUrl: string = '';
  
  details: UserProfile = {
    email: '',
    name: '',
    description: '',
    skills: [],
    facebook: '',
    linkedin: ''
  };

  editDetails: UserProfile = {
    email: '',
    name: '',
    description: '',
    skills: [],
    facebook: '',
    linkedin: ''
  };

  private getEmail: string;
  isCurrentUser: boolean;

  // For inviting the user who's profile is being used to a certain project
  selectedProject: string;
  ownedProjects: string[];

  SKILLS_ARRAY: string[];

  constructor(
    private user_utils: UserUtilsService,
    private post_utils: PostUtilsService,
    private skills: SkillsService,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit() { 
    this.SKILLS_ARRAY = this.skills.getSkills();

    this.loadProfile();
  }

  loadProfile() {
    this.route.params.subscribe(params => {
      this.getEmail = params['email']; 

      this.isCurrentUser = this.checkCurrentUser();

      this.user_utils.getProfile(this.getEmail).subscribe(profile => {
        this.details.email = profile.user.email;
        this.details.name = profile.user.name;
        this.details.description = profile.user.description;
        this.details.skills = JSON.parse(profile.user.skills);
        this.details.facebook = profile.user.facebook;
        this.details.linkedin = profile.user.linkedin;
        
        // Keep a new copy so that the edits dont show up before saving
        this.copyDetails();
        this.fileDataUrl = this.user_utils.buildProfilePicUrl(this.getEmail);

        this.handleSpaces();
      }, (err) => {
        if (err.status === 401) {
          this.alert.error('Profile not found for requested user', true);
          this.router.navigateByUrl('/profile/' + this.user_utils.getCurrentUserDetails().email);
        }
        console.error(err);
      });
    });
  }

  copyDetails() {
    this.editDetails.email = this.details.email;
    this.editDetails.name = this.details.name;
    this.editDetails.description = this.details.description;
    this.editDetails.facebook = this.details.facebook;
    this.editDetails.linkedin = this.details.linkedin;
    this.editDetails.skills = this.details.skills.slice();
  }

  handleSpaces() {
    if (this.details.description === ' ') {
      this.details.description = '';
    }
    if (this.details.facebook === ' ') {
      this.details.facebook = '';
    }
    if (this.details.linkedin === ' ') {
      this.details.linkedin = '';
    }
  }

  addSpaces() {
    if (this.details.description.length === 0) {
      this.details.description = ' ';
    }
    if (this.details.facebook.length === 0) {
      this.details.facebook = ' ';
    }
    if (this.details.linkedin.length === 0) {
      this.details.linkedin = ' ';
    }
  }

  checkCurrentUser() {
    var check: UserDetails;
    check = this.user_utils.getCurrentUserDetails();
    
    return (check.email === this.getEmail); 
  }

  deleteProfile() {
    /* Add a confirmation check here and use handle as callback */
  }

  handleDelete() {
    if (!this.isCurrentUser) {
      console.log('cannot delete another users profile');
    } else {
      this.user_utils.deleteProfile(this.user_utils.getCurrentUserDetails().email).subscribe(res => {
        this.alert.success('Successfully deleted profile');
        this.auth.logout();
      }, (err) => {
        this.alert.error('Could not delete profile');
      }) 
    }
  }

  updateProfile() {
    // :( dynamodb
    this.addSpaces();
    this.details = this.editDetails;

    this.user_utils.updateProfile(
      this.details.description,
      JSON.stringify(this.details.skills),
      this.details.facebook,
      this.details.linkedin
    ).subscribe(res => {
      this.uploadFile();
      this.alert.success('Successfully updated profile');
    }, (err) => {
      console.log(err);
    }) 
  }

  addSkill(skill: string) {
    if (!this.editDetails.skills.includes(skill)) {
      this.editDetails.skills.push(skill);
    }
  }

  resetEdit() {
    this.copyDetails();
  }

  deleteSkill(idx: number) {
    this.editDetails.skills.splice(idx, 1);
  }

  /*previewFile() {
    const file = this.fileInput.nativeElement.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
      reader.onload = () => {
        this.fileDataUrl = reader.result.toString();
      }
    } else {
      console.log('File must be jpg, png, or gif and cannot be exceed 500 KB in size');
    }
  }*/

  uploadFile() {
    let formData = new FormData();
    formData.append('image', this.fileInput.nativeElement.files[0]);
    this.user_utils.uploadProfilePicture(formData).subscribe((res) => {
      if (res.imageUrl) {
        location.reload();
      }
    }, (err) => {
      console.log(err);
    })
  }

  directFacebook() {
    window.location.href = this.details.facebook;
  }
  
  directLinkedin() {
    window.location.href = this.details.linkedin;
  }

  loadInvite() {    
    this.user_utils.getProfile(this.user_utils.getCurrentUserDetails().email).subscribe((data) => {
      this.ownedProjects = JSON.parse(data.user.posts);
    }, (err) => {
      console.log(err);
    })
  }
 
  invite(proj: string) {
    this.post_utils.invite(this.user_utils.getCurrentUserDetails().email, this.getEmail, proj ).subscribe((data) => {
      this.selectedProject = '';
      console.log('succesful invite');
      this.alert.success('Successfully invited user to work on project');
    }, (err) => {
        console.log(err);
    });
  }

  selectProject(proj: string) {
    this.selectedProject = proj;
  }

  resetSelectedProject() {
    this.selectedProject = '';
  }

  updateUrl(event) {
    this.fileDataUrl = this.user_utils.buildDefaultProfilePicUrl();
  }
}
