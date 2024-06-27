import request from 'supertest'
import app from '../app'

const tour = '5c88fa8cf4afda39709c2951'
const tourName = "The Forest Hiker"

const newTourBody = {
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
}

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

describe("Get One Tours", () => {
  describe("successful request", () => {
    test("should respond with 200 status code", async () => {
      await request(app)
      .get(`/api/v1/tours/${tour}`)
      .expect(200)
    })
    test("should return Json", async() => {
      const response = await request(app).get(`/api/v1/tours/${tour}`)
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('success')
      expect(response.body.data).toBeDefined()
      expect(response.body.data.name).toBe(tourName)
    })
  })
})

describe("POST tours", () => {
  describe("successful request", () => {
    test("should respond with 201 and json", async() => {
      const response = await request(app)
      .post("/api/v1/tours")
      .send(newTourBody)

      expect(response.statusCode).toBe(201)
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('success')
      
      // cleanup DB
      const newTour = response.body.data._id
      await request(app)
      .delete(`/api/v1/tours/${newTour}`)
    })
  })
})

describe("DELETE tour", () => {
  describe("successful request", () => {
    test("should respond with 204 and content", async () => {
      const createResponse = await request(app)
      .post("/api/v1/tours")
      .send(newTourBody)
      expect(createResponse.statusCode).toBe(201)

      const deleteTour = createResponse.body.data._id

      const response = await request(app)
      .delete(`/api/v1/tours/${deleteTour}`)
      
      expect(response.statusCode).toBe(204)
      expect(response.headers['content-type']).toBeUndefined()
    })
  })
  describe("failed request", () => {
    test("respond with 400 when tour doesnt exist", async () => {
      const response = await request(app).delete('/api/v1/tours/1')
      expect(response.statusCode).toBe(400)
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      expect(response.body.status).toBe("fail")
    })
  })
})