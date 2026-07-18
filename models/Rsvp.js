import mongoose from 'mongoose';

const RsvpSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    privacyAccepted: { type: Boolean, required: true },
    eventName: { type: String, default: 'How Investigators Find Anyone Online using Open Source Intelligence (OSINT)' },
    anonymousQuestion: { type: String, default: '' },
    eventDate: { type: String, default: '25th July | 3 PM IST (11:30 AM CET)' },
}, {
    timestamps: true
});

export default mongoose.models.Rsvp || mongoose.model('Rsvp', RsvpSchema);
