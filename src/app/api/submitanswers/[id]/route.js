import { NextResponse } from "next/server";
import { getDB, dbRun } from "@/app/lib/db";

export async function POST(req, { params }) {
    let id = params.id;
    let jsonObj = await req.json();

    if (typeof jsonObj == "object") {
        // TODO: Check that answers are valid for the questions
        
        let answerData = jsonObj.answers;

        await dbRun("INSERT INTO answers (answerData, formID) VALUES (?, ?)", [JSON.stringify(answerData), id]);

        return NextResponse.json({status: "success"});

    } else {
        return NextResponse.json({status: "error", message: "JSON required"});
    }
}