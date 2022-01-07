import { propertiesApiService } from '../properties-api'
import { PropertyModelPagedResult } from '@reapit/foundations-ts-definitions'
import { mockBrowserSession } from '../__mocks__/session'

const mockedFetch = jest.spyOn(window, 'fetch')
const mockProperties = {
  _embedded: [{
    selling: {
      price: 100,
      recommendedPrice: 200,
    },
    address: {
      buildingNumber: '123',
      line1: 'line 1',
      line2: 'line 2',
      line3: 'line 3',
      line4: 'line 4',
      postcode: '12345'
    },
    bedrooms: 2,
    bathrooms: 3,
    type: ['house', 'land'],
    summary: 'this is summary',
  }],
  pageNumber: 1,
  pageSize: 5,
  pageCount: 10,
  totalPageCount: 50,
  totalCount: 100,
  _links: {
    aName: {
      href: "http://example.com"    }
  }
 } as PropertyModelPagedResult

describe('propertiesApiService', () => {
  it('should return a response from the properties service', async () => {
    mockedFetch.mockReturnValueOnce({ json: jest.fn(() => mockProperties) } as any)
    expect(await propertiesApiService(mockBrowserSession)).toEqual(mockProperties)
    expect(mockedFetch).toHaveBeenCalledTimes(1)
  })

  it('should catch an error if no response from properties service', async () => {
    const errorSpy = jest.spyOn(console, 'error')
    mockedFetch.mockReturnValueOnce(undefined as any)
    await propertiesApiService(mockBrowserSession)
    expect(errorSpy).toHaveBeenCalledWith(
      'Error fetching Configuration Appointment Types',
      'No response returned by API',
    )
  })

  it.only('fetch should receive a url with query params', async () => {
    mockedFetch.mockReturnValueOnce({ json: jest.fn(() => mockProperties) } as any)
    await propertiesApiService(mockBrowserSession, { marketingMode: 'selling' })
    expect(mockedFetch).toHaveBeenCalledTimes(1)
    expect(mockedFetch.mock.calls[0][0]).toBe('https://platform.reapit.cloud/properties?marketingMode=selling')
  })
})
