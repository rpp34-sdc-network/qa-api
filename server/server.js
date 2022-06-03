const express = require('express');
const app = express();
const pool = require('../db/index.js');

app.use(express.json());
app.get(`/qa/questions/:id/answers`, (req, res) => {
    let id = req.params.id;
    let ret = { question_id: id }
    pool.query(`SELECT answers.id as answer_id, answers.body, to_timestamp(answers.date_written/1000) as date, answers.answerer_name, answers.helpful as helpfulness, json_agg(json_build_object('id', photos.id, 'url', photos.url)) AS photos from answers left JOIN photos ON photos.answer_id = answers.id WHERE answers.question_id = ${id} GROUP BY answers.id`)
        .then(output => {
            console.log(output.rows)
            ret.results = output.rows
            res.send(ret);
        })
})

app.get(`/qa/questions`, async (req, res) => {
    console.log('staring it ssss')
    const eachQuestion = async (qs) => {
        for (let q of qs.results) {
            q.answers = {};
            let answers = await pool.query(`SELECT answers.id, answers.body, to_timestamp(answers.date_written/1000) as date,
          answers.answerer_name, answers.helpful as helpfulness, json_agg(photos.url) AS photos
          FROM answers LEFT JOIN photos ON photos.answer_id = answers.id
          WHERE question_id = ${q.question_id} GROUP BY answers.id`);
            for (let answer of answers.rows) {
                q.answers[JSON.stringify(answer.id)] = answer
            };
        }
        res.send(qs);
        // res.sendStatus(200);
    };
    let id = req.query.product_id;
    let ret = { product_id: id }
    pool.query(`SELECT id as question_id, body as question_body,
    to_timestamp(date_written/1000) as question_date, asker_name, helpful as question_helpfulness,
     reported FROM questions WHERE product_id = ${id} LIMIT 50`)
        .then(output => {
            ret.results = output.rows;
            return ret
        })
        .then(() => {
            eachQuestion(ret)
        })

})
app.post('/qa/questions', (req, res) => {
    const {
        body, name, email, product_id
    } = req.body;
    return pool.query('select MAX(id) from questions')
        .then(output => {
            console.log(product_id, 'productID');
            console.log(output.rows[0].max, 'output');
            let question_id = output.rows[0].max;
            return pool.query('INSERT INTO questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [question_id + 1, product_id, body, Date.now(), name, email, false, 0])
                .then((output) => {
                    console.log('added');
                    res.sendStatus(201);
                })
                .catch(err => {
                    console.log(err)
                    res.sendStatus(500);
                })
        })
})
app.post('/qa/questions/:question_id/answers', async (req, res) => {
    let question_id = req.params.question_id;
    let photo_id = await pool.query('select max(id) from photos');
    let answer_id = await pool.query('select max(id) from answers');
    // console.log(photo_id.rows[0].max, 'here is photo id');
    photo_id = photo_id.rows[0].max;
    answer_id = answer_id.rows[0].max;
    const { body, name, email, photos } = req.body;
    return pool.query('INSERT INTO answers(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [answer_id + 1, question_id, body, Date.now(), name, email, false, 0])
    .then(()=> {
        console.log(photos, 'arrrays')
        return photos.forEach((photo) => {
            console.log(photo, 'photo url')
            photo_id += 1;
            return pool.query('INSERT INTO PHOTOS(id, answer_id, url) VALUES ($1, $2, $3)', [photo_id, answer_id, photo])
            .then(()=> {
                console.log('added photos')
                res.sendStatus(201)
            })
            .catch(err => {
                res.sendStatus(500);
            })
        }) 
    })
})

app.put('/qa/questions/:question_id/helpful', async (req,res) => {
    let question_id = req.params.question_id;
    let count = await pool.query(`select helpful from questions where id = ${question_id}`);
    count = count.rows[0].helpful;
    return pool.query(`update questions set helpful = ${count+1} where id = ${question_id}`)
    .then(output => {
        console.log('updated helpful on questions')
        res.sendStatus(204);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})
app.put('/qa/questions/:question_id/report', async (req,res) => {
    let question_id = req.params.question_id;
    let count = await pool.query(`select reported from questions where id = ${question_id}`);
    count = count.rows[0].reported;
    return pool.query(`update questions set reported = ${count+1} where id = ${question_id}`)
    .then(output => {
        console.log('updated reported on questions')
        res.sendStatus(204);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.put('/qa/answers/:answer_id/helpful', async (req,res) => {
    let answer_id = req.params.answer_id;
    let count = await pool.query(`select helpful from answers where id = ${answer_id}`);
    count = count.rows[0].helpful;
    return pool.query(`update questions set helpful = ${count+1} where id = ${answer_id}`)
    .then(output => {
        console.log('updated helpful on answers')
        res.sendStatus(204);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})
app.put('/qa/answers/:answer_id/report', async (req,res) => {
    let answer_id = req.params.answer_id;
    let count = await pool.query(`select reported from answers where id = ${answer_id}`);
    count = count.rows[0].reported;
    return pool.query(`update questions set reported = ${count+1} where id = ${answer_id}`)
    .then(output => {
        console.log('updated reported on answers')
        res.sendStatus(204);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})
module.exports = app;