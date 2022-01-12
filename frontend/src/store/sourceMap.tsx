import {ChangesInfo, compareEntity, Day, Entity, LessonTemplate, Note, Place, Source, Teacher, Week} from "../database";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addElement, findElement, removeElement, removeElementComp, updateElement} from "../utils/arrayUtils";

export interface InternalRepresentationState {
    sources: {[key: number]: Source};

    teachers: {[key: number]: Teacher};
    places: {[key: number]: Place};
    templates: {[key: number]: LessonTemplate};
    weeks: {[key: number]: Week};
    days: {[key: number]: Day};
    notes: {[key: number]: Note};
}

const initialState: InternalRepresentationState = {
    sources: {},
    teachers: {},
    places: {},
    templates: {},
    weeks: {},
    days: {},
    notes: {}
}

export interface ArrayChanges<T> {
    item: T;
    source: number;
}

export interface ChangesCreator {
    day: Day;
    date: number;
}

function addToMap<T extends Entity>(map: {[key: number]: T}, array: Array<T>) {
    for (let i = 0; i < array.length; ++i) {
        map[array[i].id] = array[i];
    }
}

function remFromMap<T extends Entity>(map: {[key: number]: T}, array: Array<T>) {
    for (let i = 0; i < array.length; ++i) {
        delete map[array[i].id];
    }
}

function createElementFromMaps<T extends Entity>(name: keyof Source) {
    return (state: InternalRepresentationState, action: PayloadAction<ArrayChanges<T>>) => {
        const source = state.sources[action.payload.source] as Source;
        if (source == undefined) return;

        // @ts-ignore
        source[name].push(action.payload.item);
        // @ts-ignore
        state[name][action.payload.item.id] = action.payload.item;
    }
}

function changeElementFromMaps<T extends Entity>(name: keyof Source) {
    return (state: InternalRepresentationState, action: PayloadAction<ArrayChanges<T>>) => {
        const source = state.sources[action.payload.source] as Source;
        if (source == undefined) return;

        // @ts-ignore
        updateElement<T>(source[name], action.payload.item, compareEntity);

        // @ts-ignore
        state[name][action.payload.item.id] = action.payload.item;
    }
}

function removeElementMaps<T extends Entity>(name: keyof Source) {
    return (state: InternalRepresentationState, action: PayloadAction<ArrayChanges<T>>) => {
        const source = state.sources[action.payload.source] as Source;
        if (source == undefined) return;

        // @ts-ignore
        source[name] = removeElement<Place>(source[name], action.payload.item, compareEntity);

        // @ts-ignore
        delete state[name][action.payload.item.id]
    }
}

function update(state: InternalRepresentationState, source: Source) {
    state.sources[source.id] = source;
    addToMap(state.places,      source.places);
    addToMap(state.teachers,    source.teachers);
    addToMap(state.templates,   source.templates);
    addToMap(state.weeks,       source.weeks);
    addToMap(state.days,        source.days);
    addToMap(state.notes,       source.notes);
}

export const sourcesMapSlice = createSlice({
    name: 'sourceMap',
    initialState,
    reducers: {
        resetMaps: (state, action: PayloadAction) => {
            for (let key in state) {
                // @ts-ignore
                state[key] = {}
            }
        },

        updateSource: (state, action: PayloadAction<Source>) => {
            update(state, action.payload);
        },

        setSources: (state, action: PayloadAction<Array<Source>>) => {
            for (let i = 0; i < action.payload.length; ++i) {
                update(state, action.payload[i]);
            }
        },

        removeSource: (state, action: PayloadAction<number>) => {
            const source = state.sources[action.payload]
            if (source) {
                remFromMap(state.places, source.places);
                remFromMap(state.teachers, source.teachers);
                remFromMap(state.templates, source.templates);
                remFromMap(state.weeks, source.weeks);
                remFromMap(state.days, source.days);
                remFromMap(state.notes, source.notes);

                delete state.sources[action.payload];
            }
        },

        changePlace: changeElementFromMaps<Place>("places"),
        removePlace: removeElementMaps<Place>("places"),
        addPlace: createElementFromMaps<Place>("places"),

        changeDay: changeElementFromMaps<Day>("days"),
        removeDay: removeElementMaps<Day>("days"),
        addDay: createElementFromMaps<Day>("days"),

        changeWeek: changeElementFromMaps<Week>("weeks"),
        addWeek: createElementFromMaps<Week>("weeks"),
        removeWeek: (state, action: PayloadAction<ArrayChanges<Week>>) => {
            removeElementMaps<Week>("weeks")(state, action);
            const source = state.sources[action.payload.source];
            if (source != undefined) {
                for (let i = 0; i < source.weeks.length; ++i) {
                    if (source.weeks[i].number >= action.payload.item.number)
                        --source.weeks[i].number;
                }
            }
        },

        changeTeacher: changeElementFromMaps<Teacher>("teachers"),
        removeTeacher: removeElementMaps<Teacher>("teachers"),
        addTeacher: createElementFromMaps<Teacher>("teachers"),

        changeNote: changeElementFromMaps<Note>("notes"),
        removeNote: removeElementMaps<Note>("notes"),
        addNote: createElementFromMaps<Note>("notes"),

        changeTemplate: changeElementFromMaps<LessonTemplate>("templates"),
        removeTemplate: removeElementMaps<LessonTemplate>("templates"),
        addTemplate: createElementFromMaps<LessonTemplate>("templates"),

        addChanges: (state, action: PayloadAction<ChangesCreator>) => {
            const source = state.sources[action.payload.day.source];
            if (source == undefined) {
                return;
            }
            createElementFromMaps<Day>("days")(state, {
                type: "",
                payload: {
                    source: action.payload.day.source,
                    item:action.payload.day
                }
            });

            const insertIndex = source.changes.findIndex((v) => v.date > action.payload.date);

            source.changes = addElement<ChangesInfo>(source.changes, {
                day: action.payload.day.id,
                date: action.payload.date
            }, insertIndex == -1? source.changes.length : insertIndex);
        },
        removeChanges: (state, action: PayloadAction<ArrayChanges<number>>) => {
            const source = state.sources[action.payload.source];
            if (source == undefined) {
                return;
            }
            const changes = findElement(source.changes, (e) => e.date == action.payload.item);
            if (changes != undefined) {
                source.changes = removeElementComp(source.changes, (e) => e.date == action.payload.item);
                const day = state.days[changes.day];
                if (day != undefined) {
                    removeElementMaps<Day>("days")(state,{
                            type: "",
                            payload: {
                                source: action.payload.source,
                                item: day
                            }
                        }
                    )
                }
            }
        }
    },
});

export const { updateSource, removeSource, setSources, resetMaps,
    addPlace, addTeacher, addWeek, addTemplate, addNote, addChanges,
    removePlace, removeTeacher, removeWeek, removeTemplate, removeNote,
    changePlace, changeTeacher, changeWeek, changeTemplate, changeNote,
    addDay, changeDay, removeDay, removeChanges} = sourcesMapSlice.actions;

export default sourcesMapSlice.reducer;