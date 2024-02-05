import { NextResponse } from "next/server";
import { getDB, dbRun } from "@/app/lib/db";

//TODO: Authentication
export async function POST(req) {
    if (req.method != "POST") {
        return res.status(403).json({error: "Requires POST!"});
    }

    if (typeof req.body == "object") {
        // TODO: Proper validation of uploaded form

        let jsonString = JSON.stringify(await req.json());
        let results = await dbRun("INSERT INTO forms (formData) VALUES (?)", [jsonString]);

        return NextResponse.json({status: "success", formID: results.lastID}, {status: 200});
    }

    return NextResponse.json({error: "Bad request"}, {status: 403});
}

export async function GET(req) {
    return NextResponse.json({error: "GET requests are not permitted for this endpoint"}, {status: 403});
}