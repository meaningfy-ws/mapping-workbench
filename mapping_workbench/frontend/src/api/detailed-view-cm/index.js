import {SectionApi} from "../section";
import {appApi} from "../app";

export const SESSION_PROJECT_KEY = 'sessionProject';

class DetailedViewCmApi extends SectionApi {
    get SECTION_TITLE() {
        return "Projects";
    }

    get SECTION_ITEM_TITLE() {
        return "Project";
    }

    constructor() {
        super("detailed_view_cm");
    }

    getList() {
        // /api/v1/ontology_fragment/list
         return  {
  items: [
    {
      ontology_fragment_id: "876b7d2j333",
      ontology_fragment_name: "epo:AwardCriterion"
    },
    {
      ontology_fragment_id: "87h57d2433jk3",
      ontology_fragment_name: "epo:Notice"
    }
  ]
}
    }
    async getSessionProjects(request = {}) {
        // let projectsStore = await this.getItems();
        // return projectsStore.items.map(
        //     project => ({id: project._id, title: project.title})
        // ).sort((a, b) => a.title.localeCompare(b.title));
    }
}

export const detailedViewCmApi = new DetailedViewCmApi();
