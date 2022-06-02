let questionDB = new Schema({
    product_id: Number,
    question_id: Number,
    question_body: String,
    question_date: Date,
    asker_name: String,
    question_helpfulness: Number,
    reported: Boolean,
});
let photo = new Schema({
    photo_id: Number,
    url: String,
});
let answerDB = new Schema({
    question_id: Number,
    answer_id: Number,
    answer_body: String,
    answer_date: Date,
    answerer_name: String,
    helpfulness: Number,
    photos: [photo],
});