import {useMounted} from "../../../hooks/use-mounted";
import {useCallback, useEffect, useState} from "react";

export class ForItemDataState {
    constructor(item, setState) {
        this.item = item;
        this.setState = setState;
    }
}

export const useItem = (sectionApi, id) => {
    const isMounted = useMounted();
    const [item, setItem] = useState(null);

    const handleItemGet = useCallback(async () => {
        try {
            const response = await sectionApi.getItem(id);
            if (isMounted()) {
                setItem(response);
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMounted]);

    useEffect(() => {
            handleItemGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return new ForItemDataState(item, setItem);
};