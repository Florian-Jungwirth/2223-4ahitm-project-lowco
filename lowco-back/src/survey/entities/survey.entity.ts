import { Measurements, Types } from "src/schema/survey.schema";

export class Survey {
    id: string;
    iconName: string;
    title: string;
    measurement: string;
    type: Types;
    standardValue: number;
    activated: number;
}
