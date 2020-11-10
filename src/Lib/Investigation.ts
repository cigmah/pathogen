import { data } from "../Data/investigations";
import { Patient, getAgeInYears } from "./Patient";

export interface QuantRefRange {
    lower: number;
    upper: number;
}

export interface QuantRefStatic {
    type: "static";
    lower: number;
    upper: number;
}

export type QuantRefGroupPredicate =
    | { type: "age"; lower: number; upper: number }
    | { type: "gender"; gender: "male" | "female" };

export interface QuantRefGroup {
    predicates: Array<QuantRefGroupPredicate>;
    range: QuantRefRange;
}

export interface QuantRefGrouped {
    type: "grouped";
    groups: Array<QuantRefGroup>;
    default: QuantRefRange;
}

export interface QuantSpec {
    type: "quant";
    units: string;
    minValue: number;
    maxValue: number;
    ref: QuantRefStatic | QuantRefGrouped;
}

export interface QualiResult {
    media: Array<string>;
    report: string;
}

export interface QualiSpec {
    type: "quali";
    normal: Array<QualiResult>;
}

export interface Investigation {
    name: string;
    description: string;
    alternateNames: Array<string>;
    identifier: string;
    collection?: string;
    spec: QuantSpec | QualiSpec;
}

export type InvestigationIndex = Record<string, Investigation | undefined>;

var builder: InvestigationIndex = {};
data.forEach((element) => {
    builder[element.name] = element as Investigation;
});

export const investigations: InvestigationIndex = builder;

function satisfiesPredicate(
    patient: Patient,
    predicate: QuantRefGroupPredicate
): Boolean {
    switch (predicate.type) {
        case "age": {
            const patientAgeInYears = getAgeInYears(patient);
            return (
                patientAgeInYears >= predicate.lower &&
                patientAgeInYears < predicate.upper
            );
        }
        case "gender": {
            return patient.gender == predicate.gender;
        }
    }
}

export function getRefRange(
    patient: Patient,
    quantSpec: QuantSpec
): QuantRefRange {
    switch (quantSpec.ref.type) {
        case "static": {
            return quantSpec.ref;
        }
        case "grouped": {
            const numGroups = quantSpec.ref.groups.length;
            for (let i = 0; i < numGroups; i++) {
                const group = quantSpec.ref.groups[i];
                const numPredicates = group.predicates.length;
                let satisfiesGroup = true;
                for (let j = 0; j < numPredicates; j++) {
                    const predicate = group.predicates[j];
                    if (!satisfiesPredicate(patient, predicate)) {
                        satisfiesGroup = false;
                        break;
                    }
                }
                if (satisfiesGroup) {
                    return group.range;
                } else {
                    continue;
                }
            }
            return quantSpec.ref.default;
        }
    }
}
