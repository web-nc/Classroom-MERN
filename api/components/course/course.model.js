import mongoose from 'mongoose';

const Course = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    teachers: Array,
    students: Array,
    inviteCode: Array,
    name: String,
    details: String,
    code: String,
    briefName: String,
    gradeBoard: Array,
    reviewRequests: Array,
    createdDate: {
        type: Date,
        default: () => Date.now(),
    },
});

export default mongoose.model("course", Course, "course");