import dbConnect from '../../../../../lib/mongodb';
import Chapter from '../../../../../models/Chapter';
import { verifyAdminWithRole, unauthorizedResponse } from '../../../../../lib/auth-utils';

// PUT /api/chapters/[id] — Update chapter
export async function PUT(request, { params }) {
    const auth = await verifyAdminWithRole(request);
    if (!auth) return unauthorizedResponse();

    const { id } = await params;

    // Chapter leads can only update their own chapter
    if (auth.role === 'chapter_lead' && auth.chapterId !== id) {
        return unauthorizedResponse();
    }

    try {
        await dbConnect();
        const body = await request.json();

        // Chapter leads cannot change archive status
        if (auth.role === 'chapter_lead') {
            delete body.isArchived;
        }

        // Whitelist allowed fields to prevent mass assignment
        const allowedFields = ['city', 'state', 'status', 'lead', 'members', 'events',
            'description', 'founded', 'linkedin', 'instagram', 'highlights', 'isArchived'];
        const update = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                update[field] = body[field];
            }
        }

        const chapter = await Chapter.findByIdAndUpdate(id, update, { new: true });
        if (!chapter) {
            return Response.json({ error: 'Chapter not found' }, { status: 404 });
        }
        return Response.json({ chapter });
    } catch (error) {
        console.error('Error updating chapter:', error);
        return Response.json({ error: 'Failed to update chapter' }, { status: 500 });
    }
}

// GET /api/chapters/[id] — Get single chapter
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const chapter = await Chapter.findById(id);
        if (!chapter) {
            return Response.json({ error: 'Chapter not found' }, { status: 404 });
        }
        return Response.json({ chapter });
    } catch (error) {
        console.error('Error fetching chapter:', error);
        return Response.json({ error: 'Failed to fetch chapter' }, { status: 500 });
    }
}
