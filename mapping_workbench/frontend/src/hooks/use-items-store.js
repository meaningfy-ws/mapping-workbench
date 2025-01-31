import {useEffect, useState} from 'react';

export const useItemsStore = (sectionApi) => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0,
        load: true
    });

    const handleItemsGet = () => {
        sectionApi.getItems()
            .then(res => setState({items: res.items, itemsCount: res.count}))
            .catch(err => {
                setState(prev => ({...prev, error: true}))
                console.error(err)
            })
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return {
        handleItemsGet,
        ...state
    };
};