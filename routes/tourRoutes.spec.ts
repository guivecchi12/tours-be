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

describe("GET All Tours", () => {
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

describe("GET One Tours", () => {
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

describe("GET top 5", () => {
  describe("successful request", () => {
    test("should respond with 200 status code", async () => {
      await request(app)
      .get('/api/v1/tours/top-5')
      .expect(200)
    })
    test("should return Json", async() => {
      const response = await request(app).get('/api/v1/tours/top-5')
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('success')
      expect(response.body.results).toBe(5)
    })
  })
})

describe("GET stats", () => {
  test("should respond with 1 difficult tour", async () => {
      const response = await request(app)
      .get('/api/v1/tours/tour-stats')

      expect(response.body.status).toBe('success')
      expect(response.body.data[0].numTours).toBe(1)
  })
  test("should return 4 easy tours", async() => {
    const response = await request(app)
      .get('/api/v1/tours/tour-stats?rating=1')

      expect(response.body.status).toBe('success')
      expect(response.body.data[0].numTours).toBe(4)
  })
})

describe("GET tours-within", () => {
  test("should respond with 3 tours within radius", async () => {
      const response = await request(app)
      .get('/api/v1/tours/tours-within/400/center/34.111745,-118.113491/unit/mi')

      expect(response.body.status).toBe('success')
      expect(response.body.results).toBe(3)
  })
})
describe("GET tours distance", () => {
   test("should show distance for all 9 tours", async () => {
      const response = await request(app)
      .get('/api/v1/tours/distances/34.111745,-118.113491/unit/mi')

      expect(response.body.status).toBe('success')
      expect(response.body.results).toBe(9)
      expect(response.body.data[0]._id).toBeDefined()
      expect(response.body.data[0].name).toBeDefined()
      expect(response.body.data[0].distance).toBeGreaterThan(0)
  })
})
describe("GET monthly-plan", () => {
  test("should show all 6 tours available in 2021", async () => {
      const response = await request(app)
      .get('/api/v1/tours/monthly-plan/2021')

      expect(response.body.status).toBe('success')
      expect(response.body.results).toBe(6)
      expect(response.body.data.plan).toBeDefined()
      expect(response.body.data.plan[0].month).toBe(2)
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