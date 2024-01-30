'use client'
import { useState } from "react";
// Currently these components only work for creating a form

const itemTypes = [
    {id: "single", name: "Text entry"},
    {id: "radio", name: "Choose one"},
    {id: "radio", name: "Multiple choice"},
];

export function FormContainer() {
    const [questionList, setQuestionList] = useState([]);

    return (
        <div>
            {questionList.map((question, i) => {return (
                <Question key={question.type} itemData={question} />)
        })}

        <AddQuestion questionList={questionList} setQuestionList={setQuestionList} />
        </div>
    );
}

export function Question({itemData}) {
    return (
        <div className="questionContainer">
            <p>Question Type:</p>
            <select>
                {itemTypes.map(item => {
                    return <option value={item.id} selected={item.id == itemData.type}>{item.name}</option>
                })}
            </select>
        </div>
    );
}

export function AddQuestion({questionList, setQuestionList}) {
    function onClick() {   
        let newQuestionList = [...questionList];
        newQuestionList.push({
            type: "single"
        });
        setQuestionList(newQuestionList);
    }

    return <button onClick={onClick}>Add Question</button>;

}