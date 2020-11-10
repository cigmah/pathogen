import React, { useState, ChangeEvent } from "react";
import { Gender, Patient, PatientInProgress } from "../Lib/Patient";

interface Props {
    patient: PatientInProgress;
    onChangeFirstName: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeLastName: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeDob: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeGender: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeHistory: (e: ChangeEvent<HTMLInputElement>) => void;
}

function PatientDetails(props: Props) {

    return (
        <article className="patient-details-group">
            <h2 className="patient-details-group-header">Sim Patient Details</h2>
            <div className="patient-details-name-group">
                <LabelWithInput
                    label="First Name"
                    onChange={props.onChangeFirstName}
                    type="text"
                    value={props.patient.firstName}
                />
                <LabelWithInput
                    label="Last Name"
                    onChange={props.onChangeLastName}
                    type="text"
                    value={props.patient.lastName}
                />
            </div>
            <div className="patient-details-dob-gender-group">
                <LabelWithInput
                    label="Date of Birth"
                    onChange={props.onChangeDob}
                    type="date"
                    value={props.patient.dob}
                />
                <div className="patient-details-input-group">
                    <GenderRadio label="male" chosen={props.patient.gender} onChange={props.onChangeGender} />
                    <GenderRadio label="female" chosen={props.patient.gender} onChange={props.onChangeGender} />
                    <GenderRadio label="other" chosen={props.patient.gender} onChange={props.onChangeGender} />
                </div>
            </div>
            <LabelWithInput
                label="Clinical History"
                onChange={props.onChangeHistory}
                type="text"
                value={props.patient.history}
            />
        </article>
    )
}

function GenderRadio(props: { label: Gender, chosen: Gender, onChange: (g: ChangeEvent<HTMLInputElement>) => void }) {
    const inputId = "patient-details-input-gender" + props.label;
    const chosen = props.label == props.chosen;

    let userLabel;
    switch (props.label) {
        case "male": {
            userLabel = "M";
            break;
        }
        case "female": {
            userLabel = "F";
            break;
        }
        case "other": {
            userLabel = "Other";
            break;
        }
    }

    return (
        <div className="patient-details-input-radio-group">
            <input type="radio"
                id={inputId}
                name="patient-details-input-gender"
                value={props.label}
                onChange={props.onChange}
                checked={chosen} />
            <label className="patient-details-input-label" htmlFor={inputId}>{userLabel}</label>
        </div>
    )
}

interface LabelWithInputProps<T> {
    label: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type: string;
    value: string;
}

function LabelWithInput<T>(props: LabelWithInputProps<T>) {

    const inputId = "patient-details-input" + props.label.toLowerCase().replace(" ", "-");

    return (
        <div className="patient-details-input-group">
            <label className="patient-details-input-label" htmlFor={inputId}>{props.label}</label>
            <input
                className="patient-details-input"
                id={inputId}
                type={props.type}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    )
}

export default PatientDetails;