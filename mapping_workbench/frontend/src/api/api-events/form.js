import {paths} from "../../paths";
import {getToastId, toastError, toastSuccess} from "../../components/app-toast";

export const onApiFormError = ((err, formHelpers) => {
    const toastId = getToastId()
    toastError('Something went wrong: ' + err.message, toastId);
    formHelpers.setStatus({success: false});
    formHelpers.setErrors({submit: err.message});
    formHelpers.setSubmitting(false);
});

export const onApiFormSuccess = ((formHelpers, sectionApi, itemCtx) => {
    const toastId = getToastId()
    toastSuccess(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemCtx.isNew ? "created" : "updated"), toastId);
    formHelpers.setStatus({success: true});
    formHelpers.setSubmitting(false);
});


export const onFormEditResponse = (response, formHelpers, itemCtx) => {
    response.then((v) => {
        onApiFormSuccess(formHelpers, sectionApi, itemCtx);
        if (itemCtx.isStateable) {
            itemCtx.setState(response);
        }
    }, (err) => {
        onApiFormError(err, formHelpers);
    });
}

export const onFormCreateResponse = (response, formHelpers, sectionApi, itemCtx, router) => {
    response.then((resolve) => {
        onApiFormSuccess(formHelpers, sectionApi, itemCtx);
        router.push({
            pathname: paths.app[sectionApi.section].edit,
            query: {id: response._id}
        });
    }).catch((err) => {
        onApiFormError(err, formHelpers);
    });
}