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

    return (
        <div>
            {questionList.map((question, i) => {return (
                <Question key={i} itemData={question} updateEntry={updateEntry} />)
        })}

        <AddQuestion questionList={questionList} setQuestionList={setQuestionList} />
        </div>
    );
}

export function Question({itemData, updateEntry}) {
    function onSelectChange(event) {
        updateEntry(itemData, {
            type: event.target.value,
            required: itemData.required
        });
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
            }} checked={itemData.required} />
        </div>
    );
}

export function AddQuestion({questionList, setQuestionList}) {
    function onClick() {   
        let newQuestionList = [...questionList];
        newQuestionList.push({
            type: "single",
            required: false
        });
        setQuestionList(newQuestionList);
    }

    return <button onClick={onClick}>Add Question</button>;

}

export function QuestionMultiple({itemData}) {
    return (
        <>
            
        </>
    );
}