import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";

class FieldsRegistryApi extends SectionApi {
    get SECTION_TITLE() {
        return "Fields Registry";
    }

    get SECTION_TREE_TITLE() {
        return "Elements Tree"
    }

    get SECTION_ITEM_TITLE() {
        return "Fields Registry";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW];
    }

    constructor() {
        super("fields_registry");
        this.isProjectResource = true;
    }

    importEFormsFromGithub(request) {
        try {
            let endpoint = this.paths['import_eforms_from_github'];
            const headers = {"Content-Type": "multipart/form-data"};
            return appApi.post(endpoint, request, null, headers);
        } catch (err) {
        }
    }

    async getItemsTree(request) {
        return ([
          {
            id: 'ND-Root', label: 'ND-Root: /*',
            children: [
              { id: 'BT-02-notice', label: 'Notice Type: /*/cbc:NoticeTypeCode' },
              { id: 'BT-03-notice', label: 'Form Type: /*/cbc:NoticeTypeCode/@listName' },
              { id: 'BT-04-notice', label: 'Procedure Identifier: /*/cbc:ContractFolderID' },
              { id: 'ND-ContractingParty', label: 'ND-ContractingParty: /*/cac:ContractingParty',
              children: [
                  { id: 'BT-10-Procedure-Buyer', label: 'Activity Authority: /*/cac:ContractingParty/cac:ContractingActivity/cbc:ActivityTypeCode[@listName=\'authority-activity\']' },
                  { id: 'BT-10-Procedure-Buyer-List', label: 'Activity Authority Listname: /*/cac:ContractingParty/cac:ContractingActivity/cbc:ActivityTypeCode[@listName=\'authority-activity\']/@listName'}
              ] },
            ],
          }
        ])
    }

    async getStructuralElementsForSelector(request = {}) {
        request.page = 0;
        request.rowsPerPage = -1;
        let structuralElementsStore = await this.getItems(request, 'elements');
        return structuralElementsStore.items.map(
            structuralElement => ({id: structuralElement._id, eforms_sdk_element_id: structuralElement.eforms_sdk_element_id})
        ).sort((a, b) => a.eforms_sdk_element_id.localeCompare(b.eforms_sdk_element_id));
    }
}

export const fieldsRegistryApi = new FieldsRegistryApi();
