export type Gender =
    | "male"
    | "female"
    | "other"

export interface Patient {
    firstName: string;
    lastName: string;
    dob: Date;
    gender: Gender;
    history: string;
}

export interface PatientInProgress {
    firstName: string;
    lastName: string;
    dob: string;
    gender: Gender;
    history: string;
}

export const examplePatient = {
    firstName: "First",
    lastName: "Last",
    dob: "1960-01-01",
    gender: "male",
    history: "",
};

/** Returns the patient's age in years comparing their DOB to the current datetime. */
export function getAgeInYears(patient: Patient): Number {
    const now = new Date();
    const diffMillis = now.getTime() - patient.dob.getTime();
    return diffMillis / (1000 * 60 * 60 * 24 * 365.25);
}

export function updateFirstName(patient: PatientInProgress, newFirst: string): PatientInProgress {
    return { ...patient, firstName: newFirst };
}

export function updateLastName(patient: PatientInProgress, newLast: string): PatientInProgress {
    return { ...patient, lastName: newLast };
}

export function updateDob(patient: PatientInProgress, newDob: string): PatientInProgress {
    return { ...patient, dob: newDob };
}

export function updateGender(
    patient: PatientInProgress,
    newGender: Gender,
): PatientInProgress {
    return { ...patient, gender: newGender };
}

export function updateHistory(patient: PatientInProgress, newHistory: string): PatientInProgress {
    return { ...patient, history: newHistory };
}

export function parsePatient(patient: PatientInProgress): Patient | undefined {
    const date = new Date(patient.dob);
    if (date) {
        return { ...patient, dob: date };
    } else {
        return undefined;
    }
}