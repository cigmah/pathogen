import { Condition } from "./Condition";
import {
    getRefRange,
    Investigation,
    investigations,
    QualiSpec,
    QuantSpec,
    QualiResult,
    QuantRefRange,
} from "./Investigation";
import { Constraint, QualiConstraint, QuantConstraint } from "./Constraint";
import { parsePatient, Patient, PatientInProgress } from "./Patient";
import {
    makeQualiResult,
    makeQuantResult,
    Result,
    ResultCollection,
} from "./Result";
import { collect, Collection } from "./Collection";
import { Lab, laboratories } from "./Lab";

/** Returns a random number between min and max. */
function randomBounded(min: number, max: number): number {
    const diff = max - min;
    return min + diff * Math.random();
}

function randomChoice<T>(array: Array<T>): T | undefined {
    const n = array.length;
    if (n == 0) {
        return undefined;
    } else {
        const index = Math.floor(randomBounded(0, n));
        return array[index];
    }
}

function randomDate(): Date {
    const minDate = 1262304000000; // 2010-01-0
    const maxDate = new Date().getTime(); // now
    const date = randomBounded(minDate, maxDate);
    return new Date(date);
}

function generateQuantResultValue(
    patient: Patient,
    spec: QuantSpec,
    constraint: QuantConstraint,
    range: QuantRefRange,
): number {
    switch (constraint.constraint) {
        case "above ref":
            return randomBounded(range.upper, spec.maxValue);
        case "below ref":
            return randomBounded(spec.minValue, range.lower);
        case "normal":
            return randomBounded(range.lower, range.upper);
    }
}

function generateQualiResultValue(
    patient: Patient,
    spec: QualiSpec,
    constraint: QualiConstraint
) {
    switch (constraint.constraint) {
        case "exact":
            return constraint.result;
        case "normal":
            return randomChoice(spec.normal) as QualiResult; // normal must always be specified so cannot return undefined
    }
}

function generateQuantFromCondition(
    patient: Patient,
    investigation: Investigation,
    spec: QuantSpec,
    condition: Condition
): Result {
    const constraint = condition.constraints[investigation.name];
    const refRange = getRefRange(patient, spec);
    if (constraint) {
        switch (constraint.constraint) {
            case "above ref":
            case "below ref":
            case "normal": {
                const result = generateQuantResultValue(
                    patient,
                    spec,
                    constraint,
                    refRange,
                );
                return makeQuantResult(investigation, spec, refRange, result);
            }
            default:
                throw `Mismatched investigation and constraint types for investigation "${investigation.name}" and constraint "${constraint.constraint}" in condition "${condition.name}"`;
        }
    } else {
        const normalConstraint: QuantConstraint = {
            investigation: investigation.name,
            constraint: "normal",
        };
        const result = generateQuantResultValue(
            patient,
            spec,
            normalConstraint,
            refRange
        );
        return makeQuantResult(investigation, spec, refRange, result);
    }
}

function generateQualiFromCondition(
    patient: Patient,
    investigation: Investigation,
    spec: QualiSpec,
    condition: Condition
): Result {
    const constraint = condition.constraints[investigation.name];
    if (constraint) {
        switch (constraint.constraint) {
            case "exact":
            case "normal": {
                const result = generateQualiResultValue(
                    patient,
                    spec,
                    constraint
                );
                return makeQualiResult(investigation, spec, result);
            }
            default:
                throw `Mismatched investigation and constraint types for investigation "${investigation.name}" and constraint "${constraint.constraint}" in condition "${condition.name}"`;
        }
    } else {
        const normalConstraint: QualiConstraint = {
            investigation: investigation.name,
            constraint: "normal",
        };
        const result = generateQualiResultValue(
            patient,
            spec,
            normalConstraint
        );
        return makeQualiResult(investigation, spec, result);
    }
}

function generateResult(
    patient: Patient,
    investigation: Investigation,
    condition: Condition
): Result {
    switch (investigation.spec.type) {
        case "quant":
            return generateQuantFromCondition(
                patient,
                investigation,
                investigation.spec,
                condition
            );
        case "quali":
            return generateQualiFromCondition(
                patient,
                investigation,
                investigation.spec,
                condition
            );
    }
}

function generateCollection(
    patient: Patient,
    collection: Collection,
    condition: Condition
): ResultCollection {
    const lab = randomChoice(laboratories) as Lab;
    const collectionDate = randomDate();
    const reportingDate = new Date(
        collectionDate.getTime() + randomBounded(0, 172800000)
    );

    let results: Array<Result> = [];
    collection.investigations.forEach((i) => {
        const result = generateResult(patient, i, condition);
        results.push(result);
    });

    return {
        patient: patient,
        lab: lab,
        collectionDate: collectionDate,
        reportingDate: reportingDate,
        results: results,
    };
}

function generateCollections(
    patient: Patient,
    collections: Array<Collection>,
    condition: Condition
): Array<ResultCollection> {
    return collections.map((c) => generateCollection(patient, c, condition));
}

export interface GeneratorConfig {
    patient: Patient;
    investigations: Array<Investigation>;
    condition: Condition;
}

export function generateAll(config: GeneratorConfig): Array<ResultCollection> {
    const collections = collect(config.investigations);
    return generateCollections(config.patient, collections, config.condition);
}

export function parseConfig(
    patient: PatientInProgress,
    investigations: Array<Investigation>,
    condition: undefined | Condition
): GeneratorConfig | undefined {
    const parsedPatient = parsePatient(patient);
    if (parsedPatient && condition && investigations.length > 0) {
        return {
            patient: parsedPatient,
            investigations: investigations,
            condition: condition,
        };
    } else {
        return undefined;
    }
}

export function isValid(
    patient: PatientInProgress,
    investigations: Array<Investigation>,
    condition: undefined | Condition
): Boolean {
    return !(condition === undefined) && investigations.length > 0;
}
