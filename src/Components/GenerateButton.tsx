import React from "react";
import { Condition } from "../Lib/Condition";
import { parseConfig } from "../Lib/Generator";
import { Investigation } from "../Lib/Investigation";
import { PatientInProgress } from "../Lib/Patient";
import "./GenerateButton.css";

interface Props {
    patient: PatientInProgress;
    condition: Condition | undefined;
    investigations: Array<Investigation>;
    onClick: (_: any) => void;
}

function GenerateButton(props: Props) {

    const parsed = parseConfig(props.patient, props.investigations, props.condition);

    if (parsed) {
        return (<button className="generate-button" onClick={props.onClick}>Generate Results</button>)
    } else {
        return (
            <div className="generate-button-placeholder">
                Choose a condition and at least one investigation to generate results for.
            </div>
        )
    }

}

export default GenerateButton;
