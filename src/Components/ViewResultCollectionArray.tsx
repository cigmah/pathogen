import React, { useState } from "react";
import { Result, ResultCollection } from "../Lib/Result";
import "./ViewResultCollectionArray.css";

interface Props {
    results: undefined | Array<ResultCollection>
}

function ViewResultCollectionArray(props: Props) {
    if (props.results) {
        return (
            <section className="view-result-collection-section">
                <section className="view-result-collection-container">
                    {props.results.map((r) => ViewResultCollection(r))}
                </section>
                <button className="view-result-print-button">
                    Print
                </button>
            </section>
        )
    } else {
        return (
            <div className="view-result-collection-container blank"></div>
        )
    }
}

function ViewResultCollection(collection: ResultCollection) {

    function viewResultHeader(result: Result) {
        switch (result.type) {
            case "quant": {
                return (
                    <div className="view-result-quant-header view-result-header">
                        <div className="view-result-quant-header-identifier">
                            ID
                        </div>
                        <div className="view-result-quant-header-reference">
                            Reference
                        </div>
                        <div className="view-result-quant-header-units">
                            Units
                        </div>
                        <div className="view-result-quant-header-result">
                            Result
                        </div>
                    </div>
                )
            }
            default: {
                return;
            }
        }
    }
    return (
        <article className="view-result-collection-page">
            <div className="view-result-collection-page-header">

                <div className="view-result-collection-page-patient">
                    <div className="view-result-collection-page-patient-first-name">
                        {collection.patient.firstName}
                    </div>
                    <div className="view-result-collection-page-patient-last-name">
                        {collection.patient.lastName}
                    </div>
                    <div className="view-result-collection-page-patient-dob">
                        {collection.patient.dob.toDateString()}
                    </div>
                    <div className="view-result-collection-page-patient-collection-datetime">
                        {collection.collectionDate.toISOString()}
                    </div>
                    <div className="view-result-collection-page-patient-reporting-datetime">
                        {collection.reportingDate.toISOString()}
                    </div>

                </div>

                <div className="view-result-collection-page-lab">
                    <div className="view-result-collection-page-lab-name">
                        {collection.lab.name}
                    </div>
                    <div className="view-result-collection-page-lab-address">
                        {collection.lab.address}
                    </div>
                    <div className="view-result-collection-page-lab-phone">
                        {collection.lab.phoneNumber}
                    </div>
                    <div className="view-result-collection-page-lab-fax">
                        {collection.lab.faxNumber}
                    </div>
                </div>

            </div>
            <div className="view-result-collection-page-body">

                <div className="view-result-collection-page-history">
                    {collection.patient.history}
                </div>

                <div className="view-result-collection-page-results">
                    {viewResultHeader(collection.results[0])}
                    {collection.results.map((r) => ViewResult(r))}
                </div>

            </div>

            <div className="view-result-collection-page-footer">

            </div>

        </article>
    )
}

function ViewResult(result: Result) {
    switch (result.type) {
        case "quant": {
            const abnormalAsterisk = (result.result < result.refRange.lower || result.result > result.refRange.upper) ? " *" : "";
            return (
                <div className="view-result-quant">
                    <div className="view-result-quant-identifier">
                        {result.investigation.identifier}
                    </div>

                    <div className="view-result-quant-reference-range">
                        {result.refRange.lower.toString()} - {result.refRange.upper.toString()}
                    </div>

                    <div className="view-result-quant-units">
                        {result.spec.units}
                    </div>

                    <div className="view-result-quant-result">
                        {result.result.toPrecision(3) + abnormalAsterisk}
                    </div>
                </div>
            )
        }
        case "quali": {
            return (
                <div className="view-result-quali">
                    <div className="view-result-quali-name">
                        {result.investigation.name}
                    </div>
                    <div className="view-result-quali-report-header">
                        Report:
                    </div>
                    <div className="view-result-quali-report">
                        {result.result.report}
                    </div>
                </div>
            )
        }
    }
}

export default ViewResultCollectionArray;