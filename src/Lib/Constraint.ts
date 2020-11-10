import { QualiResult } from "./Investigation";

export type QuantConstraint =
    | { investigation: string; constraint: "above ref" }
    | { investigation: string; constraint: "below ref" }
    | { investigation: string; constraint: "normal" };

export type QualiConstraint =
    | { investigation: string; constraint: "exact"; result: QualiResult }
    | { investigation: string; constraint: "normal" };

export type Constraint = QuantConstraint | QualiConstraint;

export type ConstraintIndex = Record<string, Constraint | undefined>;
