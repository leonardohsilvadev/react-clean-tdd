import { mockGetRequest } from './../../../data/test/mock-http';
import { mockPostRequest } from '@/data/test'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import axios from 'axios'
import { AxiosHttpClient } from "./axios-http-client"

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()
  const mockedAxios = mockAxios()
  return { sut, mockedAxios }
}

describe('AxiosHttpClient', () => {
  describe('post', () => {
    test('Should call axios.post with correct values', async () => {
      const request = mockPostRequest()
      const { sut, mockedAxios } = makeSut()
      await sut.post(request)
      expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
    })
  
    test('Should return correct response on axios.post', () => {
      const { sut, mockedAxios } = makeSut()
      const promise = sut.post(mockPostRequest())
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })
  
    test('Should return correct error on axios.post', async () => {
      const { sut, mockedAxios } = makeSut()
      const httpResponse = await sut.post(mockPostRequest())
      const axiosResponse = await mockedAxios.post.mock.results[0].value
      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })
  })

  describe('get', () => {
    test('Should call axios.get with correct values', async () => {
      const request = mockGetRequest()
      const { sut, mockedAxios } = makeSut()
      await sut.get(request)
      expect(mockedAxios.get).toHaveBeenCalledWith(request.url)
    })
  })

  test('Should return correct response on axios.get', async () => {
    const { sut, mockedAxios } = makeSut()
    const httpResponse = await sut.get(mockGetRequest())
    const axiosResponse = await mockedAxios.get.mock.results[0].value
    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    })
  })
})