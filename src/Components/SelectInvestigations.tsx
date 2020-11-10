import React, { useState } from "react";
import Fuse from "fuse.js";
import "./SelectInvestigations.css";
import { Investigation, investigations } from "../Lib/Investigation";

interface Props {
    investigations: Array<Investigation>;
    onAddInvestigation: (i: Investigation) => void;
    onDeleteInvestigation: (i: Investigation) => void;
}

function SelectInvestigations(props: Props) {

    const [currentSearch, setSearch] = useState("");
    const [filtered, setFiltered] = useState(
        ([] as unknown) as Array<Fuse.FuseResult<Investigation>>
    );

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const text = e.target.value;
        const results = fuse.search(text);
        setSearch(() => text);
        setFiltered(() => results);
    }

    const investigationArray = Object.values(investigations) as Array<
        Investigation
    >;
    const options = {
        keys: [
            "name",
            "description",
            "identifier",
            "collection",
            "alternateNames",
        ],
    };
    const fuse = new Fuse(investigationArray, options);

    return (
        <div className="select-investigation">
            <div className="select-investigation-input-container">
                <input
                    type="text"
                    className="select-investigation-input"
                    value={currentSearch}
                    onChange={onChange}
                />
                <div className="select-investigation-results-container">
                    {filtered.map((r) =>
                        ViewInvestigationResult(r, props.onAddInvestigation)
                    )}
                </div>
            </div>
            <div className="select-investigation-selected-container">
                {props.investigations.map((s) => ViewSelected(s, props.onDeleteInvestigation))}
            </div>
        </div>
    );
}

function ViewInvestigationResult(
    fuseResult: Fuse.FuseResult<Investigation>,
    onClick: (
        i: Investigation,
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void
) {
    const investigation = fuseResult.item;

    let collectionElement;
    if (investigation.collection) {
        collectionElement = (
            <div className="select-investigation-result-collection">
                {investigation.collection}
            </div>
        );
    } else {
        collectionElement = (
            <div className="select-investigation-result-collection"></div>
        );
    }

    return (
        <button
            className="select-investigation-result"
            onClick={(e) => onClick(investigation, e)}
        >
            <div className="select-investigation-result-name">
                {investigation.name}
            </div>
            <div className="select-investigation-result-description">
                {investigation.description}
            </div>
            {collectionElement}
        </button>
    );
}

function ViewSelected(
    investigation: Investigation,
    onClick: (i: Investigation) => void
) {
    return (
        <div className="select-investigation-selected">
            <div className="select-investigation-selected-body">
                <div className="select-investigation-selected-name">
                    {investigation.name}
                </div>
            </div>
            <button
                className="select-investigation-selected-delete"
                onClick={(_) => onClick(investigation)}
            >
                ×
            </button>
        </div>
    );
}

export default SelectInvestigations;
