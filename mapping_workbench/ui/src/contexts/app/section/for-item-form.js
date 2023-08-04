import {ACTION} from "src/api/section";

export class ForItemForm {
    constructor(action, data, api) {
        this.action = action;
        this.data = data;
        this.api = api;
    }
}

export class ForItemEditForm extends ForItemForm {
    constructor(data, api, setState, schema = null) {
        super(ACTION.EDIT, data, api);
        this.setState = setState;
        this.isNew = false;
        this.isStateable = true;
        this.schema = schema;
    }
}

export class ForItemCreateForm extends ForItemForm {
    constructor(data, api) {
        super(ACTION.CREATE, data, api);
        this.isNew = true;
        this.isStateable = false;
    }
}