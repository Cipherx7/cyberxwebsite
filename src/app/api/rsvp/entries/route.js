import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import Rsvp from '../../../../../models/Rsvp';
import Feedback from '../../../../../models/Feedback';
import { verifyAdmin, unauthorizedResponse } from '../../../../../lib/auth-utils';

export async function GET(request) {
  // Ensure the request is from an authenticated admin
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return unauthorizedResponse();
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build filter object for RSVP
    const filter = {};

    if (search.trim()) {
      // Escape special regex characters to prevent ReDoS/injection
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { anonymousQuestion: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    // Fetch entries from 'osintevent' collection, sorted by newest first
    const rsvpEntries = await Rsvp.find(filter).sort({ createdAt: -1 }).lean();

    // Fetch all feedbacks from 'feedbacks' collection
    const feedbacks = await Feedback.find({}).sort({ submittedAt: -1 }).lean();

    // Create map of feedback by candidate email (case-insensitive)
    const feedbackMap = new Map();
    feedbacks.forEach((fb) => {
      if (fb.candidateEmail) {
        const key = fb.candidateEmail.trim().toLowerCase();
        if (!feedbackMap.has(key)) {
          feedbackMap.set(key, []);
        }
        feedbackMap.get(key).push(fb);
      }
    });

    // Calculate feedback stats
    const totalFeedbacks = feedbacks.length;
    let totalRatingSum = 0;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    feedbacks.forEach((fb) => {
      const r = Number(fb.rating) || 0;
      if (r >= 1 && r <= 5) {
        totalRatingSum += r;
        ratingCounts[r] = (ratingCounts[r] || 0) + 1;
      }
    });

    const averageRating = totalFeedbacks > 0 
      ? Number((totalRatingSum / totalFeedbacks).toFixed(1)) 
      : 0;

    // Attach feedback data to each RSVP entry
    const entries = rsvpEntries.map((entry) => {
      const key = (entry.email || '').trim().toLowerCase();
      const userFeedbacks = feedbackMap.get(key) || [];
      return {
        ...entry,
        feedback: userFeedbacks[0] || null, // Latest feedback
        allFeedbacks: userFeedbacks
      };
    });

    return NextResponse.json({
      success: true,
      entries,
      feedbacks,
      feedbackStats: {
        averageRating,
        totalFeedbacks,
        ratingCounts
      },
      total: entries.length
    });
  } catch (error) {
    console.error('Fetch RSVP entries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVP entries' },
      { status: 500 }
    );
  }
}

