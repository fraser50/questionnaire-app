'use client'
import { useState } from "react";
// Currently these components only work for creating a form

const itemTypes = [
    {id: "single", name: "Text entry"},
    {id: "radio", name: "Choose one"},
    {id: "multiple", name: "Multiple choice"},
];

export function FormContainer() {
    const [questionList, setQuestionList] = useState([]);

    function updateEntry(oldEntry, newEntry) {
        setQuestionList(questionList.map(entry => entry == oldEntry ? newEntry : entry));
    }

    function removeQuestion(itemData) {
        let newQuestionList = [...questionList];
        newQuestionList.splice(newQuestionList.indexOf(itemData), 1);

        setQuestionList(newQuestionList);
    }

    return (
        <div>
            {questionList.map((question, i) => {return (
                <Question key={i} itemData={question} updateEntry={updateEntry} removeQuestion={removeQuestion} />)
        })}

        <AddQuestion questionList={questionList} setQuestionList={setQuestionList} />
        </div>
    );
}

export function Question({itemData, updateEntry, removeQuestion}) {
    function onSelectChange(event) {
        updateEntry(itemData, {
            type: event.target.value,
            required: itemData.required,
            question: itemData.question
        });
    }

    function renderQuestionType(type) {
        switch (type) {
            case "multiple":
                return <QuestionMultiple itemData={itemData} updateEntry={updateEntry} />;

            default:
                return null;
        }
    }

    return (
        <div className="questionContainer">
            <p>Question Type:</p>
            <p>Type ID: {itemData.type}</p>
            <select onChange={onSelectChange}>
                {itemTypes.map(item => {
                    return <option value={item.id} selected={item.id == itemData.type}>{item.name}</option>
                })}
            </select>
            <label>Required: </label><input type="checkbox" onChange={(e) => {
                let newItemData = Object.create(itemData);
                newItemData.required = e.target.checked;
                updateEntry(itemData, newItemData);
            }} checked={itemData.required} /><br />
            <p>Question:</p>
            <input type="text" placeholder="Enter the question" value={itemData.question} onChange={(event) => {
                let newItemData = Object.create(itemData);
                newItemData.question = event.target.value;

                updateEntry(itemData, newItemData);
            }} /><span style={{height: "1em", width: "100%", display: "block"}} />
            {renderQuestionType(itemData.type)}
            <span style={{height: "2em", width: "100%", display: "block"}} />
            <button onClick={() => removeQuestion(itemData)}>Delete Question</button>
            
        </div>
    );
}

export function AddQuestion({questionList, setQuestionList}) {
    function onClick() {   
        let newQuestionList = [...questionList];
        newQuestionList.push({
            type: "single",
            required: false,
            question: ""
        });
        setQuestionList(newQuestionList);
    }

    return <button onClick={onClick}>Add Question</button>;

}

export function MultipleAddOption({itemData, updateEntry}) {
    return (<><br /><button onClick={() => {
        let newOptionsList = itemData.options == undefined ? [] :  [...itemData.options];
        newOptionsList.push("");
        let newItemData = Object.create(itemData);
        newItemData.options = newOptionsList;
        updateEntry(itemData, newItemData);

    }}>Add Answer</button></>);
}

export function QuestionMultiple({itemData, updateEntry}) {
    function removeOption(option) {
        let newOptions = [...itemData.options];
        newOptions.splice(newOptions.indexOf(option), 1);

        let newItemData = Object.create(itemData);
        newItemData.options = newOptions;

        updateEntry(itemData, newItemData);
    }


    return (
        <>
            {itemData.options == undefined ? "" : itemData.options.map((option, i) => {
                return (
                    <div className="optionDiv">
                        <input type="text" key={i} placeholder="Enter an answer" value={option} style={{float: "left", flexGrow: 1}} onChange={(event) => {
                            let newOptions = [...itemData.options];
                            newOptions[i] = event.target.value;

                            let newItemData = Object.create(itemData);
                            newItemData.options = newOptions;

                            updateEntry(itemData, newItemData);
                        }} />
                        <button style={{float: "right"}} onClick={() => removeOption(option)}>Remove</button>
                    </div>
                );
            })}
            <MultipleAddOption itemData={itemData} updateEntry={updateEntry} />
        </>
    );
}