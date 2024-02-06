'use client'
import { useState } from "react";
// Currently these components only work for creating a form

const itemTypes = [
    {id: "single", name: "Text entry"},
    {id: "multiple", name: "Multiple choice"},
];

export function FormContainer() {
    const [questionList, setQuestionList] = useState([]);
    const [formDisabled, setFormDisabled] = useState(false);

    function updateEntry(oldEntry, newEntry) {
        setQuestionList(questionList.map(entry => entry == oldEntry ? newEntry : entry));
    }

    function removeQuestion(itemData) {
        let newQuestionList = [...questionList];
        newQuestionList.splice(newQuestionList.indexOf(itemData), 1);

        setQuestionList(newQuestionList);
    }

    async function submitForm() {
        let jsonString = JSON.stringify(questionList);

        let rsp = await fetch("/api/createform", {method: "POST", body: jsonString});
        
        let jsonObj = await rsp.json();

        if (jsonObj.status == "success") {
            alert(JSON.stringify(jsonObj));

        } else {
            alert("Failure\n" + JSON.stringify(jsonObj));
        }
    }

    return (
        <div>
            {questionList.map((question, i) => {return (
                <Question key={i} itemData={question} updateEntry={updateEntry} removeQuestion={removeQuestion} formDisabled={formDisabled} />)
        })}

        <AddQuestion questionList={questionList} setQuestionList={setQuestionList} formDisabled={formDisabled} />
        <span style={{height: "2em", width: "100%", display: "block"}} />
        <button disabled={formDisabled} onClick={() => {
            setFormDisabled(true);
            submitForm();
        }}>Submit Questionnaire</button><br />
        <button onClick={() => {
            setFormDisabled(false);
        }}>Enable</button>
        </div>
    );
}

export function Question({itemData, updateEntry, removeQuestion, formDisabled}) {
    function onSelectChange(event) {
        let newItemData = Object.assign({}, itemData);
        newItemData.type = event.target.value;
        if (newItemData.type != "multiple") {
            delete newItemData.options;
            delete newItemData.multipleAllowed;
        }

        updateEntry(itemData, newItemData);
    }

    function renderQuestionType(type) {
        switch (type) {
            case "multiple":
                return <QuestionMultiple itemData={itemData} updateEntry={updateEntry} formDisabled={formDisabled} />;

            default:
                return null;
        }
    }

    return (
        <div className="questionContainer">
            <p>Question Type:</p>
            <p>Type ID: {itemData.type}</p>
            <select onChange={onSelectChange} disabled={formDisabled}>
                {itemTypes.map(item => {
                    return <option value={item.id} selected={item.id == itemData.type}>{item.name}</option>
                })}
            </select>
            <label>Required: </label><input type="checkbox" onChange={(e) => {
                let newItemData = Object.assign({}, itemData);
                newItemData.required = e.target.checked;
                updateEntry(itemData, newItemData);
            }} checked={itemData.required} disabled={formDisabled} /><br />
            <p>Question:</p>
            <input type="text" placeholder="Enter the question" value={itemData.question} disabled={formDisabled} onChange={(event) => {
                let newItemData = Object.assign({}, itemData);
                newItemData.question = event.target.value;

                updateEntry(itemData, newItemData);
            }} /><span style={{height: "1em", width: "100%", display: "block"}} />
            {renderQuestionType(itemData.type)}
            <span style={{height: "2em", width: "100%", display: "block"}} />
            <button disabled={formDisabled} onClick={() => removeQuestion(itemData) }>Delete Question</button>
            
        </div>
    );
}

export function AddQuestion({questionList, setQuestionList, formDisabled}) {
    function onClick() {   
        let newQuestionList = [...questionList];
        newQuestionList.push({
            type: "single",
            required: false,
            question: ""
        });
        setQuestionList(newQuestionList);
    }

    return <button onClick={onClick} disabled={formDisabled}>Add Question</button>;

}

export function MultipleAddOption({itemData, updateEntry, formDisabled}) {
    return (<><br /><button disabled={formDisabled} onClick={() => {
        let newOptionsList = itemData.options == undefined ? [] :  [...itemData.options];
        newOptionsList.push("");
        let newItemData = Object.assign({}, itemData);
        newItemData.options = newOptionsList;
        updateEntry(itemData, newItemData);

    }}>Add Answer</button></>);
}

export function QuestionMultiple({itemData, updateEntry, formDisabled}) {
    function removeOption(option) {
        let newOptions = [...itemData.options];
        newOptions.splice(newOptions.indexOf(option), 1);

        let newItemData = Object.assign({}, itemData);
        newItemData.options = newOptions;

        updateEntry(itemData, newItemData);
    }


    return (
        <>
            <label>Multiple selections: </label><input type="checkbox" checked={itemData.multipleAllowed == undefined ? false : itemData.multipleAllowed} onChange={(event) => {
                let newItemData = Object.assign({}, itemData);
                newItemData.multipleAllowed = event.target.checked;

                updateEntry(itemData, newItemData);
            }} />
            {itemData.options == undefined ? "" : itemData.options.map((option, i) => {
                return (
                    <div className="optionDiv">
                        <input type="text" key={i} placeholder="Enter an answer" value={option} disabled={formDisabled} style={{float: "left", flexGrow: 1}} onChange={(event) => {
                            let newOptions = [...itemData.options];
                            newOptions[i] = event.target.value;

                            let newItemData = Object.assign({}, itemData);
                            newItemData.options = newOptions;

                            updateEntry(itemData, newItemData);
                        }} />
                        <button style={{float: "right"}} disabled={formDisabled} onClick={() => removeOption(option)}>Remove</button>
                    </div>
                );
            })}
            <MultipleAddOption itemData={itemData} updateEntry={updateEntry} formDisabled={formDisabled} />
        </>
    );
}