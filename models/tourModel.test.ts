import Tour from './tourModel'
import { createOne } from '../utils/handleQuery'

jest.mock('../utils/handleQuery')

describe('tour model', () => {
  it('should great tour', async () => {
    const tour = await createOne(Tour)
    console.log(tour)
    expect(tour).toBe('')
  })
})
