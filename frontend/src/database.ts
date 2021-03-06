import {timeToStr} from "./utils/time";

/**
 * Тип описывает ИД
 */
export type ID = number;

/**
 * Сущность, хранит свой уникальный ид
 */
export interface Entity {
    id: ID;
}

/**
 * Этот объект имеет имя
 */
export interface Named {
    name: string;
}

/**
 * У этого объекта есть заметка
 */
export interface Noted {
    note?: string;
}

/**
 * У этот объект является частью Источника
 */
export interface PartOfSource {
    source: ID;
}


export interface Teacher extends Entity, Named, PartOfSource, Noted {
    position: string;
}

export interface Place extends Entity, PartOfSource, Noted {
    auditory: string;
    building: string;
}

export interface LessonTemplate extends Entity, Named, PartOfSource, Noted {
    defaultTeachers: Array<number>;
    hours: number;
}

export interface Lesson extends Entity {
    template: ID;
    day: ID;
    place: ID;

    number: number;

    teachers: Array<ID>;
}


export interface ScheduleElement extends Entity {
    hour:   number;
    minute: number;
    time:   number;
}

export interface Day extends Entity, PartOfSource {
    schedule?: Array<ScheduleElement>;
    lessons: Array<Lesson>;
}

export interface Week extends Entity, PartOfSource {
    number: number;
    days: Array<WeekDay>;
}

export interface WeekDay extends Entity {
    day: ID;
    number: number;
}

export enum Rights {
    DELETE="DELETE", UPDATE="UPDATE", READ="READ", READ_UPDATE="READ_UPDATE", OWNER="OWNER"
}

export const RIGHT_LEVELS: {[key: string] : string} = {
    READ: "ЧТЕНИЕ",
    READ_UPDATE: "РЕДАКТИРОВАНИЕ",
    OWNER: "ВЛАДЕЛЕЦ"
}

export function hasUpdateRight(rights: Rights) {
    return (rights == Rights.OWNER) || (rights == Rights.READ_UPDATE) || (rights == Rights.UPDATE);
}

export interface ChangesInfo {
    day: number;
    date: number;
}

export interface SourceInfo extends Entity, Named {
    defaultSchedule?: Array<ScheduleElement>;
    owner: string;
    rights: Rights;

    startDate: number;
    endDate?: number;
    startWeek: number;

    code?: string;
    refRights?: Rights;
    local?: boolean;
}


export interface Source extends SourceInfo {
    weeks: Array<Week>;
    places: Array<Place>;
    teachers: Array<Teacher>;
    templates: Array<LessonTemplate>;
    days: Array<Day>;
    notes: Array<Note>;
    changes: Array<ChangesInfo>;
}


export interface User {
    username: string;
    password: string;
}


export interface SourcePriority extends Entity {
    sourceId: ID;
    priority: number;
    name: string;
}

export interface Note extends Entity, PartOfSource {
    text: string;
    date: number;
}

export interface Changes extends Entity, PartOfSource {
    day: ID;
    date: number;
    priority: number;
}

export function compareEntity(e1: Entity, e2: Entity): boolean {
    return e1.id == e2.id
}

export function printScheduleElement(e: ScheduleElement) {
    return timeToStr(e.hour) + ":" + timeToStr(e.minute)
}