import { Constraint, ConstraintIndex } from "./Constraint";
import { data } from "../Data/conditions";

export interface Condition {
    name: string;
    description: string;
    constraints: ConstraintIndex;
}

export type ConditionIndex = Record<string, Condition | undefined>;

var builder: ConditionIndex = {};
data.forEach((element) => {
    let constraintIndex: ConstraintIndex = {};
    const constraints = element.constraints;
    constraints.forEach(
        (c) => (constraintIndex[c.investigation] = c as Constraint)
    );
    const newElement = {
        name: element.name,
        description: element.description,
        constraints: constraintIndex,
    };
    builder[newElement.name] = newElement as Condition;
});

export const conditions: ConditionIndex = builder;
