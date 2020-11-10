import React, { useState } from "react";
import Fuse from "fuse.js";
import { Condition, conditions } from "../Lib/Condition";

interface Props {
    condition: Condition | undefined;
    onSelectCondition: (c: Condition) => void;
    onDeselectCondition: () => void;
}

interface State {
    currentSearch: string,
    filtered: Array<Fuse.FuseResult<Condition>>,
}

const defaultState: State = {
    currentSearch: "",
    filtered: []
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
                        <button className="select-condition-selected-delete" onClick={(e) => props.onDeselectCondition()}>
                            ×
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="select-condition">
                <div className="select-condition-results-container">
                    {state.filtered.map((r) => ViewConditionResult(r, props.onSelectCondition))}
                </div>
                <div className="select-condition-input-container">
                    <label
                        className="select-condition-input-label"
                        htmlFor="select-condition-input">
                        Simulated Disease or Condition
                    </label>
                    <input
                        type="text"
                        id="select-condition-input"
                        className="select-condition-input"
                        value={state.currentSearch}
                        onChange={onChange}
                    />
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
