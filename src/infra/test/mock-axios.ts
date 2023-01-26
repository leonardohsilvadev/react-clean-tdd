import { faker } from '@faker-js/faker'
import axios from 'axios'

export const mockHttpResponse = (): any => ({
  data: faker.datatype.json(),
  status: Number(faker.random.numeric(3))
})

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  
  mockedAxios.post.mockResolvedValue(mockHttpResponse)
  mockedAxios.get.mockResolvedValue(mockHttpResponse)

  return mockedAxios
}