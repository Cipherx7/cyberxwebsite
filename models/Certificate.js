import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
    certificateNo: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    candidateName: {
        type: String,
        required: true,
    },
    candidateEmail: {
        type: String,
        required: true,
        index: true,
    },
    eventTitle: {
        type: String,
        default: 'OSINT Researcher & Digital Investigations',
    },
    eventCategory: {
        type: String,
        default: 'Technical',
    },
    eventDate: {
        type: String,
        default: '25th July, 2026',
    },
    descriptionTopic: {
        type: String,
        default: 'OSINT Researcher & Digital Investigations',
    },
    status: {
        type: String,
        default: 'Attended',
    },
    rsvpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rsvp',
    },
    rating: {
        type: Number,
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
    feedbackSubmittedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema, 'certificates');
