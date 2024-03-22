import {useEffect, useState} from "react";
import {useMounted} from "../../../hooks/use-mounted";

export class ForItemDataState {
    constructor(item, setState) {
        this.item = item;
        this.setState = setState;
    }
}

export const useItem = (sectionApi, id, path = null) => {
    const isMounted = useMounted();
    const [item, setItem] = useState(null);

    const handleItemGet = async () => {
        try {
            const response = await sectionApi.getItem(id, path);
            setItem(response);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
            id && isMounted() && handleItemGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id, isMounted()]);

    return new ForItemDataState(item, setItem);
    // return item
};