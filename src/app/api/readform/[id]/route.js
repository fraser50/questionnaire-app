import { NextRequest, NextResponse } from "next/server";
import { getDB, dbRun, dbGet } from "@/app/lib/db";

export async function GET(req, { params }) {
    const row = await dbGet("SELECT formData FROM forms WHERE id=?", [Number(params.id)]);

    if (!row) return NextResponse.json({status: "error", message: "Form not found"});

    return NextResponse.json({status: "success", form: JSON.parse(row.formData)});
}