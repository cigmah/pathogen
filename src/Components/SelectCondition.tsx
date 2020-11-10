import React, { useState } from "react";
import Fuse from "fuse.js";
import { Condition, conditions } from "../Lib/Condition";
import "./SelectCondition.css";

interface Props {
    condition: Condition | undefined;
    onSelectCondition: (c: Condition) => void;
    onDeselectCondition: () => void;
}

interface State {
    currentSearch: string,
    filtered: Array<Fuse.FuseResult<Condition>>,
    showResults: Boolean,
}

const defaultState: State = {
    currentSearch: "",
    filtered: [],
    showResults: true,
}

function SelectCondition(props: Props) {

    const [state, setState] = useState(defaultState)

    const conditionArray = Object.values(conditions) as Array<Condition>;
    const options = { keys: ["name", "description",] };
    const fuse = new Fuse(conditionArray, options);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setState((s) => {
            const text = e.target.value;
            const results = fuse.search(text);
            return { ...s, currentSearch: text, filtered: results }
        })
    }

    function onDeselectCondition(_: any) {
        props.onDeselectCondition();
        setState((s) => {
            return { ...s, currentSearch: "", filtered: [] }
        })
    }

    // function onBlur() {
    //     setState((s) => {
    //         return { ...s, showResults: false }
    //     })
    // }

    // function onFocus() {
    //     setState((s) => {
    //         return { ...s, showResults: true }
    //     })
    // }

    const showResultsClass = state.showResults ? "" : " hidden";

    if (props.condition) {
        return (
            <div className="select-condition">
                <div className="select-condition-input-container">
                    <label
                        className="select-condition-input-label"
                        htmlFor="select-condition-input">
                        Simulated Disease or Condition
                    </label>
                    <div className="select-condition-input" >
                        <div className="select-condition-selected-name">
                            {props.condition.name}
                        </div>
                        <button className="select-condition-selected-delete" onClick={onDeselectCondition}>
                            ×
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="select-condition">
                <div className="select-condition-input-container"
                >
                    <label
                        className="select-condition-input-label"
                        htmlFor="select-condition-input">
                        Simulated Disease or Condition
                    </label>
                    <div className="select-condition-input-results-container">
                        <div className={"select-condition-results-container" + showResultsClass}>
                            {state.filtered.map((r) => ViewConditionResult(r, props.onSelectCondition))}
                        </div>
                        <input
                            type="text"
                            id="select-condition-input"
                            className="select-condition-input"
                            value={state.currentSearch}
                            onChange={onChange}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

function ViewConditionResult(fuseResult: Fuse.FuseResult<Condition>, onClick: (c: Condition) => void) {
    const condition = fuseResult.item;

    return (
        <button
            className="select-condition-result"
            onClick={(e) => onClick(condition)}
        >
            <div className="select-condition-result-name">
                {condition.name}
            </div>
            <div className="select-condition-result-description">
                {condition.description}
            </div>
        </button>
    );
}

export default SelectCondition;
