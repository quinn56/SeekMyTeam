import { Injectable } from '@angular/core';

@Injectable()
export class SkillsService {
    SKILLS_ARRAY: string[] = [
        'Web Development',
        'Backend Development',
        'Full Stack Development',
        'Project Management',
        'Database Management',
        'Low Level Programming',
        'Network Engineering',
        'System Design',
        'Version Control',
        'Infrastructure Engineering',
        'Big Data Analysis',
        'Machine Learning',
        'UI/UX Design'
    ];
    
    constructor() {
    }

    getSkills(): string[] {
        return this.SKILLS_ARRAY;
    }
}