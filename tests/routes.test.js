const request = require('supertest');
const app = require('../server');

describe('Get route', ()=>{
    it('page should return EJS template', async (done)=>{
        const res = await request(app).get('/')
        expect(res.statusCode).toEqual(200)
        done()
    })
})


afterAll( async()=>{ await app.close() })