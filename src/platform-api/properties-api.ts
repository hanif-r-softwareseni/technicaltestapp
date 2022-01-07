import { ReapitConnectSession } from '@reapit/connect-session'
import { PropertyModelPagedResult } from '@reapit/foundations-ts-definitions'
import { URLS, BASE_HEADERS } from '../constants/api'

type QueryParams = {
  marketingMode?: "selling" | "letting" | "sellingAndLetting"
}
export const propertiesApiService = async (
  session: ReapitConnectSession,
  queryParams?: QueryParams,
): Promise<PropertyModelPagedResult | undefined> => {
  try {
    const url = new URL(`${window.reapit.config.platformApiUrl}${URLS.PROPERTIES}`)
    url.search =  new URLSearchParams(queryParams).toString()

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (response) {
      const responseJson: Promise<PropertyModelPagedResult | undefined> = response.json()
      return responseJson
    }

    throw new Error('No response returned by API')
  } catch (err) {
    console.error('Error fetching Properties', err)
  }
}
