import {useMounted} from "../../../hooks/use-mounted";
import {useEffect, useState} from "react";

export class ForItemDataState {
    constructor(item, setState) {
        this.item = item;
        this.setState = setState;
    }
}

export const useItem = (sectionApi, id, path = null) => {
    console.log('useItem')
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
            isMounted() && handleItemGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isMounted()]);

    return new ForItemDataState(item, setItem);
    // return item
};