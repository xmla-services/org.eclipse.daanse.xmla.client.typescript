/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import { useToast } from "vuestic-ui";

let onClickFunc = null as unknown as Function;

export function useErrorHandler() {
    const { init } = useToast();

    const setOnClick = (cb) => {
        onClickFunc = cb;
    };

    const handleErrorToast = (error) => {
        console.error(error);
        const errorMessage =
            error.message.length > 40
                ? error.message.slice(0, 40) + "..."
                : `${error.message}${error.fileName}`;

        const handleClick = () => {
            if (onClickFunc && error.message.length > 40) {
                onClickFunc(error);
            }
        };

        init({
            title: "Error",
            message: errorMessage,
            duration: 5000,
            closeable: true,
            offsetX: 32,
            offsetY: 32,
            color: "danger",
            position: "bottom-right",
            onClick: handleClick,
        });
    };

    return { handleErrorToast, setOnClick };
}
