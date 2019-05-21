import { Component } from '@angular/core';
import { UserUtilsService } from '../services/users/user-utils.service';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../home/home.component';
import { SkillsService } from '../services/skills/skills.service';

@Component({
  templateUrl: './post-list.component.html'
})
export class PostListComponent {
    getEmail: string;
    userPosts: Post[];
    appliedPosts: Post[];
    searchText: string;
    selectedPost: Post;
    

    /* Keeps track of which list to show */
    showApplied: boolean;
    title: string;

    SKILLS_ARRAY: string[];
    
    // Post to keep track of edits without changing before save
    editPost: Post;
    isOP: boolean;

    constructor(
        private user_utils: UserUtilsService,
        private post_utils: PostUtilsService,
        private skills: SkillsService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.SKILLS_ARRAY = this.skills.getSkills();
        this.showApplied = false;
        this.title = 'My Projects';
        this.userPosts = [];
        this.appliedPosts = [];

        this.selectedPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };

        this.editPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };


        this.loadUserPosts();
    }

    loadUserPosts() {
        this.userPosts = [];
        this.route.params.subscribe(params => {
            this.getEmail = params['email'];

            this.post_utils.fetchUserPosts(this.getEmail).subscribe((data) => {
                this.userPosts = this.parsePosts(data.posts);
            }, (err) => {
                console.log(err);
            });
        }, (err) => {
            console.log(err);
        });
    }

    loadAppliedPosts() {
        this.appliedPosts = [];
        this.post_utils.fetchAppliedPosts(this.getEmail).subscribe((data) => {
            this.appliedPosts = this.parseAppliedPosts(data.posts);
            console.log(this.appliedPosts);
        }, (err) => {
            console.log(err);
        });
    }


    parsePosts(data): Post[] {
        var arr: Post[] = [];

        data.forEach((item) => {
            let parse: Post = {
                name: item.Name.S,
                description: item.Description.S,
                ownerName: item.OwnerName.S,
                ownerEmail: item.OwnerEmail.S,
                skills: JSON.parse(item.Skills.S)
            };
            if (parse.description === ' ') {
                parse.description = '';
            }
            arr.push(parse); 
        })
        return arr;
    }

    parseAppliedPosts(posts): Post[] {
        var arr: Post[] = [];

        posts.forEach(element => {
            arr.push(JSON.parse(element));
        });
        return arr;
    }

    checkOP() {
        if (this.selectedPost) { 
            if (this.selectedPost.ownerEmail === this.user_utils.getCurrentUserDetails().email) {
                this.isOP = true;
            } else {
                this.isOP = false;
            }
        }
    }

    displayPost(item) {
        this.selectedPost = item;
        this.copyEditPost();

        this.checkOP();
    }

    copyEditPost() {
        this.editPost.name = this.selectedPost.name;
        this.editPost.description = this.selectedPost.description;
        this.editPost.ownerEmail = this.selectedPost.ownerEmail;
        this.editPost.ownerName = this.selectedPost.ownerName;
        this.editPost.skills = this.selectedPost.skills.slice();
    }
    
    selectedAddSkill(skill: string) {
        if (!this.editPost.skills.includes(skill)) {
            this.editPost.skills.push(skill);
        }
    }

    selectedDeleteSkill(idx: number) {
        this.editPost.skills.splice(idx, 1);
    }

    saveSelectedPost() {
        this.selectedPost = this.editPost;
        this.post_utils.update(this.selectedPost.name, this.selectedPost.description, JSON.stringify(this.selectedPost.skills)).subscribe(data => {
            location.reload();
        }, (err) => {
            console.log(err);
        })
    }

    clearEdit() {
        this.editPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };
    }
    deletePost(idx:number) {
        this.post_utils.delete(this.selectedPost.name).subscribe(data => {  
            this.userPosts.splice(idx,1);
        }, (err) => {
            console.log(err);
        });
    }

    toggleMyPosts() {
        if (!this.showApplied) {
            return;
        }

        this.loadUserPosts();
        this.title = 'My Projects';
        this.showApplied = false;
    }

    toggleAppliedPosts() {
        if (this.showApplied) {
            return;
        }

        this.title = 'Applied Projects';
        this.loadAppliedPosts();
        this.showApplied = true;
    }
}