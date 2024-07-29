import {useEffect, useState} from "react";

export class ForItemDataState {
    constructor(item, setState) {
        this.item = item;
        this.setState = setState;
    }
}

export const useItem = (sectionApi, id, path = null) => {
    const [item, setItem] = useState(null);

    const handleItemGet = () => {
         sectionApi.getItem(id, path)
             .then(res => setItem(res))
             .catch(err => console.error(err))
    };

    useEffect(() => {
            id && handleItemGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return new ForItemDataState(item, setItem);
    // return item
};