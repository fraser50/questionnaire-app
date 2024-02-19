'use client'
import { useState, useEffect } from "react";

export function AnswerableQuestionHeader({questionNumber, required}) {
    return <div className="answerHeader">
        <h2>Question {questionNumber + 1}{required ? <span style={{color: "red"}}> *</span> : null}</h2>

    </div>;
}

export function AnswerableSimpleQuestion({itemData, updateState}) {
    return <div>
        <input type="text" placeholder="Enter an answer" value={itemData.providedAnswer != undefined ? itemData.providedAnswer : ""} onChange={(event) => {
            let newItemData = Object.assign({}, itemData);
            newItemData.providedAnswer = event.target.value;
            if (newItemData.providedAnswer == "") delete newItemData.providedAnswer;

            updateState(itemData, newItemData);
        }} /><br />
    </div>;
}

export function AnswerableMultipleQuestion({itemData, updateState}) {
    function isAnswerChosen(index) {
        if (itemData.multipleAllowed) {
            return itemData.providedAnswers != undefined && itemData.providedAnswers.indexOf(index) != -1;

        } else {
            return itemData.providedAnswer == index;
        }
    }

    return (<>
    {itemData.options.map((item, i) => {
        return <><label>{item}</label><input type={itemData.multipleAllowed ? "checkbox" : "radio"} checked={isAnswerChosen(i)} onChange={(event) => {
            let newItemData = Object.assign({}, itemData);
            if (itemData.multipleAllowed) {

                if (event.target.checked) {
                    let newAnswers = newItemData.providedAnswers != undefined ? [...newItemData.providedAnswers] : [];
                    newAnswers.push(i);
                    newItemData.providedAnswers = newAnswers;

                } else {
                    newItemData.providedAnswers = itemData.providedAnswers.filter((answer) => answer != i);
                    if (newItemData.providedAnswers.length == 0) {
                        delete newItemData.providedAnswers;
                    }
                }

            } else {
                if (event.target.checked) {
                    newItemData.providedAnswer = i;

                } else {
                    delete newItemData.providedAnswer;
                }
            }

            updateState(itemData, newItemData);
        }} /><br /></>;
    })}</>);
}

export function AnswerableQuestion({itemData, questionNumber, updateState}) {
    let questionBody;

    switch (itemData.type) {
        case "single":
            questionBody = <AnswerableSimpleQuestion itemData={itemData} updateState={updateState} />;
            break;

        case "multiple":
            questionBody = <AnswerableMultipleQuestion itemData={itemData} updateState={updateState} />;
            break;

        default:
            questionBody = null;
            break;
    }

    return (<div>
        <AnswerableQuestionHeader questionNumber={questionNumber} required={itemData.required} />
        <p>{itemData.question}</p>
        {questionBody}<br />
    </div>);
}

export function AnswerableQuestionHolder() {
    let [answerableQuestionList, setAnswerableQuestionList] = useState([]);

    useEffect(() => {
        let pathName = document.location.pathname;
        let pathNameSplit = pathName.split("/");
        
        let formID = pathNameSplit[pathNameSplit.length - 1];
        
        fetch("/api/readform/" + formID).then(async rsp => {
            if (rsp.ok) {
                let jObj = await rsp.json();

                setAnswerableQuestionList(jObj.form);
            }
        });
    }, []);

    let passesValidation = true;

    answerableQuestionList.forEach(question => {
        if (question.required) {
            if (question.providedAnswer == undefined && question.providedAnswers == undefined) passesValidation = false;
        }
    });

    function updateState(oldEntry, newEntry) {
        setAnswerableQuestionList(answerableQuestionList.map(entry => entry == oldEntry ? newEntry : entry));
    }

    return (<div>
        {answerableQuestionList.map((question, i) => {
            return <AnswerableQuestion itemData={question} questionNumber={i} updateState={updateState} />
        })}
        <button disabled={!passesValidation} onClick={() => {
            let questionAnswers = [];

            for (let i=0; i<answerableQuestionList.length; i++) {
                let question = answerableQuestionList[i];

                if (question.providedAnswer == undefined && question.providedAnswers == undefined) continue;

                let response = question.providedAnswer == undefined ? question.providedAnswers : question.providedAnswer;

                questionAnswers.push({index: i, answer: response});
            }

            let pathName = document.location.pathname;
            let pathNameSplit = pathName.split("/");
            
            let formID = pathNameSplit[pathNameSplit.length - 1];
            
            fetch("/api/submitanswers/" + formID, {method: "POST", body: JSON.stringify({answers: questionAnswers})}).then(async rsp => {
                let jsonObj = await rsp.json();

                if (jsonObj.status == "success") {
                    window.location.href = "/";

                } else {
                    alert(JSON.stringify(jsonObj));
                }
            });

        }}>Submit Answers</button>
    </div>);
}