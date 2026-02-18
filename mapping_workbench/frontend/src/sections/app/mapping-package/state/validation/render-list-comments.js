export const prepareExistingValidationComments = (
    sectionApi,
    stateId,
    items,
    setExistingComments,
    setExistingCommentsReady,
    updateItems
) => {
    sectionApi.getExistingValidationComments(stateId, items.map(item => item.validation_element_id))
        .then(res => {
            setExistingComments(res);
            if (updateItems) {
                updateItems(items.map(item => ({
                    ...item,
                    nb_comments: res[item.validation_element_id]?.count || 0
                })));
                setExistingCommentsReady(true);
            }
        })
        .catch(err => {
            console.error(err);
        })
}
