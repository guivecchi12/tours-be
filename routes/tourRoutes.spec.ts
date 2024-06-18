import request from 'supertest'
import app from '../app'


describe("Get All Tours", () => {
  describe("successful request", () => {
    test("should respond with 200 status code", async () => {
      await request(app)
      .get('/api/v1/tours')
      .expect(200)
    })
    test("should return Json", async() => {
      const response = await request(app).get('/api/v1/tours')
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('success')
    })
  })
})

describe("POST tours", () => {
  describe("successful request", () => {
    test("should responde with 201 and json", async() => {
      const response = await request(app)
      .post("/api/v1/tours")
      .send({
        "name": "Fake Tours Nagazagitaa",
        "duration": 2,
        "maxGroupSize": 1,
        "difficulty": "easy",
        "ratingsAverage": 3,
        "price": 10,
        "description": "My tour",
        "imageCover": "http://image.png",
        "startLocation": {
            "coordinates": [
                1,
                2
            ]
        }
      })
      expect(response.statusCode).toBe(201)

      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('success')
    })
  })
  describe("Validation error", () => {
    test("should respond with a status code 400", async() => {
      const response = await request(app)
      .post("/api/v1/tours")
      .send({})

      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('error')
    })
  })
})