'use client'
import { useState } from "react";

export function AnswerableQuestionHeader({questionNumber, required}) {
    return <div className="answerHeader">
        <h2>Question {questionNumber + 1}{required ? <span style={{color: "red"}}> *</span> : null}</h2>

    </div>;
}

export function AnswerableSimpleQuestion({itemData, updateState}) {
    return <div>
        <p>Answer</p><br />
        <input type="text" placeholder="Enter an answer" value={itemData.providedAnswer != undefined ? itemData.providedAnswer : ""} /><br />
    </div>;
}

export function AnswerableMultipleQuestion({itemData, updateState}) {
    return (<>
    {itemData.options.map((item, i) => {
        return <><label>{item}</label><input type={itemData.multipleAllowed ? "checkbox" : "radio"} /><br /></>;
    })}</>);
}

export function AnswerableQuestion({itemData, questionNumber, updateState}) {
    let questionBody;

    switch (itemData.type) {
        case "single":
            questionBody = <AnswerableSimpleQuestion itemData={itemData} updateState={useState} />;
            break;

        case "multiple":
            questionBody = <AnswerableMultipleQuestion itemData={itemData} updateState={useState} />;
            break;

        default:
            questionBody = null;
            break;
    }

    return (<div>
        <AnswerableQuestionHeader questionNumber={questionNumber} required={itemData.required} />
        {questionBody}
    </div>);
}

export function AnswerableQuestionHolder() {
    // TODO: Fetch questionnaire from server
    let [answerableQuestionList, setAnswerableQuestionList] = useState([
        {type: "single", question: "A simple question", required: false},
        {type: "multiple", question: "Select one", required: true, options: ["A", "B", "C", "D"], multipleAllowed: true}
    ]);

    return (<div>
        {answerableQuestionList.map((question, i) => {
            return <AnswerableQuestion itemData={question} questionNumber={i} updateState={null} />
        })}
    </div>);
}