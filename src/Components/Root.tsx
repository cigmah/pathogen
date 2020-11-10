import React, { useState } from "react";
import SelectInvestigations from "./SelectInvestigations";
import "./Root.css";
import { Condition } from "../Lib/Condition";
import { Investigation } from "../Lib/Investigation";
import { ResultCollection } from "../Lib/Result";
import {
    Patient,
    PatientInProgress,
    updateDob,
    updateFirstName,
    updateGender,
    updateHistory,
    updateLastName,
} from "../Lib/Patient";
import { generateAll, parseConfig } from "../Lib/Generator";
import PatientDetails from "./PatientDetails";
import SelectCondition from "./SelectCondition";
import GenerateButton from "./GenerateButton";
import ViewResultCollectionArray from "./ViewResultCollectionArray";

interface State {
    patient: PatientInProgress;
    condition: undefined | Condition;
    investigations: Array<Investigation>;
    results: undefined | Array<ResultCollection>;
}

const defaultState: State = {
    patient: {
        firstName: "John",
        lastName: "Smith",
        dob: "1960-01-01",
        gender: "male",
        history: "",
    },
    condition: undefined,
    investigations: [],
    results: undefined,
};

function Root() {
    const [state, setState] = useState(defaultState);

    function onChangePtFirstName(e: React.ChangeEvent<HTMLInputElement>) {
        setState((s) => {
            return {
                ...s,
                patient: updateFirstName(s.patient, e.target.value),
            };
        });
    }
    function onChangePtLastName(e: React.ChangeEvent<HTMLInputElement>) {
        setState((s) => {
            return { ...s, patient: updateLastName(s.patient, e.target.value) };
        });
    }
    function onChangePtDob(e: React.ChangeEvent<HTMLInputElement>) {
        setState((s) => {
            return {
                ...s,
                patient: updateDob(s.patient, e.target.value),
            };
        });
    }
    function onChangePtHistory(e: React.ChangeEvent<HTMLInputElement>) {
        setState((s) => {
            return { ...s, patient: updateHistory(s.patient, e.target.value) };
        });
    }
    function onChangePtGender(e: React.ChangeEvent<HTMLInputElement>) {
        const gender = e.target.value;
        switch (gender) {
            case "male":
            case "female":
            case "other": {
                setState((s) => {
                    return { ...s, patient: updateGender(s.patient, gender) };
                });
                break;
            }
        }
    }

    function onSelectCondition(condition: Condition) {
        setState((s) => {
            return { ...s, condition: condition };
        });
    }

    function onDeselectCondition() {
        setState((s) => {
            return { ...s, condition: undefined };
        });
    }

    function onAddInvestigation(investigation: Investigation) {
        setState((s) => {
            let names = s.investigations.map((i) => i.name);
            if (names.includes(investigation.name)) {
                return s;
            } else {
                let newInvestigations = [...s.investigations, investigation];
                return { ...s, investigations: newInvestigations };
            }
        });
    }

    function onDeleteInvestigation(investigation: Investigation) {
        setState((s) => {
            const newInvestigations = s.investigations.filter(
                (i) => i.name !== investigation.name
            );
            return { ...s, investigations: newInvestigations };
        });
    }

    function onClickGenerate(_: any) {
        setState((s) => {
            const parsed = parseConfig(
                s.patient,
                s.investigations,
                s.condition
            );
            if (parsed) {
                const results = generateAll(parsed);
                return { ...s, results: results };
            } else {
                return s; // should not be reached as button should only be clickable when succesfully parsed
            }
        });
    }

    return (
        <main className="main">
            <section className="main-left">
                <PatientDetails
                    patient={state.patient}
                    onChangeFirstName={onChangePtFirstName}
                    onChangeLastName={onChangePtLastName}
                    onChangeDob={onChangePtDob}
                    onChangeGender={onChangePtGender}
                    onChangeHistory={onChangePtHistory}
                />
                <SelectCondition
                    condition={state.condition}
                    onSelectCondition={onSelectCondition}
                    onDeselectCondition={onDeselectCondition}
                />
                <SelectInvestigations
                    investigations={state.investigations}
                    onAddInvestigation={onAddInvestigation}
                    onDeleteInvestigation={onDeleteInvestigation}
                />
                <GenerateButton
                    patient={state.patient}
                    condition={state.condition}
                    investigations={state.investigations}
                    onClick={onClickGenerate}
                />
            </section>
            <section className="main-right">
                <ViewResultCollectionArray results={state.results} />
            </section>
        </main>
    );
}

export default Root;
