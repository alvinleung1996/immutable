/**
 * @license
 *
 * Copyright (c) 2019 Leung Ho Pan Alvin. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Immutable from 'immutable';



export const set = <T, K extends keyof T>(
    obj: T,
    key: K,
    val: T[K]
): T => Immutable.set(obj, key, val);

export const setWith = <T, K extends keyof T>(
    obj: T,
    key: K,
    getVal: (val: T[K]) => T[K]
) => {
    return Immutable.update(obj, key, getVal);
};



export const merge = <T>(
    oldVal: T,
    newVal: Partial<T>,
    merger?: <K extends keyof T>(oldVal: T[K], newVal: T[K]) => T[K]
): T => {
    if (merger === undefined) {
        return Immutable.merge(oldVal, newVal);
    } else {
        return Immutable.mergeWith(merger, oldVal, newVal);
    }
};



export const removeItem = <T>(
    items: ReadonlyArray<T>,
    index: number
) => Immutable.remove(items, index);

export const migrateArray = <T>(
    olds: ReadonlyArray<T>,
    currs: ReadonlyArray<T>,
    merger: (old: T, curr: T) => T = (_, curr) => curr
): ReadonlyArray<T> => {
    for (let i = 0; i < Math.min(olds.length, currs.length); ++i) {
        olds = Immutable.set(olds, i, merger(olds[i], currs[i]));
    }
    if (olds.length < currs.length) {
        return [
            ...olds,
            ...currs.slice(olds.length)
        ];
    } else if (olds.length > currs.length) {
        return olds.slice(0, currs.length);
    } else {
        return olds;
    }
};

export const mapArray = <T>(
    vals: ReadonlyArray<T>,
    mapper: (item: T, index: number) =>T
): ReadonlyArray<T> => {
    return vals.reduce((newVals, item, index) => {
        return Immutable.set(newVals, index, mapper(item, index));
    }, vals);
};
