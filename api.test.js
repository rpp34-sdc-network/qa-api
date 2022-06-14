const supertest = require('supertest');
// const { describe } = require('yargs');
// const { response } = require('./server/server.js');
const app = require('./server/server.js');

describe('GET /qa/questions', ()=> {

    test('should respond with a status code of 200', async ()=> {
        const response = await supertest(app).get('/qa/questions/?product_id=68680')
        expect(response.statusCode).toBe(200);
    })
})

describe('GET /qa/questions/:id/answers', ()=> {

    test('should respond with a status code of 200', async ()=> {
        const response = await supertest(app).get('/qa/questions/68680/answers')
        expect(response.statusCode).toBe(200);
    })
})
describe('POST /qa/questions', ()=> {

    test('should respond with a status code of 200', async ()=> {
        const response = await supertest(app).post('/qa/questions/').send({
            "body":"How long does it last?","name":"funnygirl","email":"afnekfnek@gmail.com","product_id":64680
        })
        expect(response.statusCode).toBe(201);
    })
})
describe('POST /qa/questions/:question_id/answers', ()=> {

    test('should respond with a status code of 200', async ()=> {
        const response = await supertest(app).post('/qa/questions/2/answers').send({
            "body":"How long does it last?","name":"funnygirl","email":"afnekfnek@gmail.com","photos":['test1','test2']
        })
        expect(response.statusCode).toBe(201);
    })

    ///qa/questions/:question_id/helpful
})
describe('PUT /qa/questions/:question_id/helpful',()=> {
    test('should respond with a status code of 204', async() => {
        const response = await supertest(app).put('/qa/questions/1/helpful');
        expect(response.statusCode).toBe(204);
    })
})
describe('PUT /qa/questions/:question_id/report',()=> {
    test('should respond with a status code of 204', async() => {
        const response = await supertest(app).put('/qa/questions/55/report');
        expect(response.statusCode).toBe(204);
    })
})
describe('PUT /qa/answers/:answer_id/helpful',()=> {
    test('should respond with a status code of 204', async() => {
        const response = await supertest(app).put('/qa/answers/15/helpful');
        expect(response.statusCode).toBe(204);
    })
})
describe('PUT /qa/answers/:answer_id/report',()=> {
    test('should respond with a status code of 204', async() => {
        const response = await supertest(app).put('/qa/answers/15/report');
        expect(response.statusCode).toBe(204);
    })
})