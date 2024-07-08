/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
declare interface SerializableParts {
    [key: string]: ISerializable;
}

export function useSerialization(serializableParts: SerializableParts) {
    const getSerializedState = () => {
        const state = {};

        Object.keys(serializableParts).forEach((key) => {
            console.log(key, serializableParts[key]);
            state[key] = JSON.parse(serializableParts[key].getState());
        });

        return JSON.stringify(state);
    };

    const loadState = (state: string) => {
        const parsed = JSON.parse(state);
        console.log(parsed);
        Object.keys(serializableParts).forEach((key) => {
            if (!parsed[key]) return;
            console.log(serializableParts[key], key);
            serializableParts[key].loadState(JSON.stringify(parsed[key]));
        });
    };

    return {
        getSerializedState,
        loadState,
    };
}
