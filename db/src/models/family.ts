import {BaseModel} from 'reperio-db-starter';

export class Family extends BaseModel {
    id: string;
    manufacturer: string;
    name: string;
    component_name: string;

    static get tableName() {
        return 'families';
    }

    autoGeneratedId() {
        return 'id';
    }
}