import {compareEntity, Day, Entity, LessonTemplate, Place, Source, Teacher, Week} from "../database";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {removeElement, updateElement} from "../utils/arrayUtils";


export interface InternalRepresentationState {
    sources: {[key: number]: Source};

    teachers: {[key: number]: Teacher};
    places: {[key: number]: Place};
    templates: {[key: number]: LessonTemplate};
    weeks: {[key: number]: Week};
    days: {[key: number]: Day};
}


const initialState: InternalRepresentationState = {
    sources: {},
    teachers: {},
    places: {},
    templates: {},
    weeks: {},
    days: {}
}

export interface ArrayChanges<T> {
    item: T;
    source: number;
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
}

export const sourcesMapSlice = createSlice({
    name: 'sourceMap',
    initialState,
    reducers: {
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

        changeTemplate: changeElementFromMaps<LessonTemplate>("templates"),
        removeTemplate: removeElementMaps<LessonTemplate>("templates"),
        addTemplate: createElementFromMaps<LessonTemplate>("templates"),
    },
});

export const { updateSource, removeSource, setSources,
    addPlace, addTeacher, addWeek, addTemplate,
    removePlace, removeTeacher, removeWeek, removeTemplate,
    changePlace, changeTeacher, changeWeek, changeTemplate,
    addDay, changeDay, removeDay} = sourcesMapSlice.actions;

export default sourcesMapSlice.reducer;