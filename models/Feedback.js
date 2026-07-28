import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    candidateEmail: {
        type: String,
        required: true,
        index: true,
    },
    candidateName: {
        type: String,
    },
    certificateNo: {
        type: String,
    },
    eventTitle: {
        type: String,
        default: 'OSINT Researcher & Digital Investigations',
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    ratingLabel: {
        type: String,
        default: '',
    },
    comment: {
        type: String,
        default: '',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema, 'feedbacks');
