import {
    Investigation,
    QualiResult,
    QuantSpec,
    QualiSpec,
    QuantRefRange,
} from "./Investigation";
import { Lab } from "./Lab";
import { Patient } from "./Patient";

export type Result =
    | {
        type: "quant";
        investigation: Investigation;
        spec: QuantSpec;
        result: number;
        refRange: QuantRefRange,
    }
    | {
        type: "quali";
        investigation: Investigation;
        spec: QualiSpec;
        result: QualiResult;
    };

export function makeQuantResult(
    investigation: Investigation,
    spec: QuantSpec,
    refRange: QuantRefRange,
    result: number
): Result {
    return {
        type: "quant",
        investigation: investigation,
        spec: spec,
        result: result,
        refRange: refRange
    };
}

export function makeQualiResult(
    investigation: Investigation,
    spec: QualiSpec,
    result: QualiResult
): Result {
    return {
        type: "quali",
        investigation: investigation,
        spec: spec,
        result: result,
    };
}

export interface ResultCollection {
    patient: Patient;
    lab: Lab;
    collectionDate: Date;
    reportingDate: Date;
    results: Array<Result>;
}
