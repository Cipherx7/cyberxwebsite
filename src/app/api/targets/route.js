import dbConnect from '../../../../lib/mongodb';
import Target from '../../../../models/Target';
import { verifyAdmin, unauthorizedResponse } from '../../../../lib/auth-utils';

export async function GET(req) {
    if (!await verifyAdmin(req)) return unauthorizedResponse();
    await dbConnect();

    try {
        const targets = await Target.find({}).sort({ createdAt: -1 });
        return Response.json({ success: true, data: targets });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req) {
    if (!await verifyAdmin(req)) return unauthorizedResponse();
    await dbConnect();

    try {
        const body = await req.json();
        const target = await Target.create(body);
        return Response.json({ success: true, data: target }, { status: 201 });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 400 });
    }
}
