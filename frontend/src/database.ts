import axios from "axios";

type ID = number;

export interface Entity {
    id: ID;
}
export interface Named {
    name: string;
}
export interface Priority {
    priority: number;
}
export interface Noted {
    note: string;
}

export interface NamedEntity extends Entity, Named{
}

interface Teacher extends NamedEntity, Noted {
    source: ID;
}
interface Place extends Entity, Noted {
    source: ID;

    auditory: string;
    building: string;
}

export interface ScheduleElement extends Entity {
    schedule: ID;

    hour:   number;
    minute: number;
    time:   number;
}

export interface Schedule extends Entity {
    source: ID;

    schedule: Array<ScheduleElement>;
}

export interface LessonTemplate extends NamedEntity, Noted {
    defaultTeachers: Array<Teacher>;
}

export interface Lesson extends Entity {
    template: LessonTemplate;
    day: Day;
    place: Place;
    number: number;
}

export interface Day extends Entity {
    source: ID;
    schedule?: Schedule;
    lessons: Array<Lesson>;
    week?: Week;
    targetDate?:string;
}

export interface Week extends Entity {
    source: ID;

    number: number;
}

export interface Source extends Entity {
    defaultSchedule: Schedule;
    owner: string;
    teachers: Array<Teacher>;
    days: Array<Day>;
    schedules: Array<Schedule>;
    templates: Array<LessonTemplate>;
    places: Array<Place>;
    weeks: Array<Week>;
    reference?: Reference;
}

export interface Reference {
    code: string;
    source: ID;
    rights: number;
}

export interface User {
    username: string;
    password: string;
}


export interface SourcePriority {
    source: ID;
    priority: number;
}

export interface Changes {
    id: ID;
    lessons: Array<Lesson>;
    schedule: Array<ScheduleElement>;
    year: number;
    day: number;
}

async function updateRequest<T extends Entity>(name: string, user: User, e: T) {
    return axios.get("/api/edit/"+name, {auth: user});
}
async function getRequest<T extends Entity>(name: string, id: ID): Promise<T> {
    return axios.get("/api/find/"+name);
}