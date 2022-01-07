import { useEffect, FC, useState, useMemo } from 'react'
import { 
  Title, 
  Table,
} from '@reapit/elements'
import { useReapitConnect } from '@reapit/connect-session'
import { reapitConnectBrowserSession } from '../../core/connect-session'
import { propertiesApiService } from '../../platform-api/properties-api'

import { PropertyModelPagedResult, PropertyAddressModel } from '@reapit/foundations-ts-definitions'
import { RowProps } from '@reapit/elements'

export type AuthenticatedProps = {}

export const Authenticated: FC<AuthenticatedProps> = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [properties, setProperties] = useState<PropertyModelPagedResult | undefined>(undefined)

  useEffect(() => {
    const fetchProperties = async () => {
      if (!connectSession) return
      const serviceResponse = await propertiesApiService(connectSession, { marketingMode: 'selling' })
      if (serviceResponse) {
        setProperties(serviceResponse)
      }
    }
    if (connectSession) {
      fetchProperties()
    }
  }, [connectSession])

  const propertiesRowModel = useMemo<RowProps[]>((): RowProps[] => {
    let rows: RowProps[] = []

    if (properties === undefined) {
      return rows
    }

    rows = properties!._embedded!.map((item): RowProps => {

      return {
        cells: [
          {
            label: 'Price',
            value: presentPrice(item.selling!.price!, item.currency!)
          },
          {
            label: 'Recommended Price',
            value: presentRecommendedPrice(item.selling!.recommendedPrice!, item.currency!)
          },
          {
            label: 'address',
            value: presentAddress(item.address as PropertyAddressModel)
          },
          {
            label: 'bedrooms',
            value: item.bedrooms + '',
          },
          {
            label: 'bathrooms',
            value: item.bathrooms + '',
          },
          {
            label: 'type',
            value: item.type!.join(', '),
          },
          {
            label: 'summary',
            value: item.summary !== null ? item.summary + '' : '',
          }
        ]
      }
    })

    return rows
  }, [properties])

  function presentPrice(price: number, currency: string): string {
    if (currency === 'GBP') {
      return `£${price.toFixed(2)}`
    } else {
      return `£${price.toFixed(2)}`
    }
  }

  function presentRecommendedPrice(price: number | null, currency: string): string {
    if (price === 0 || price === null) {
      return 'None'
    }
    return presentPrice(price, currency)
  }

  function presentAddress(addr: PropertyAddressModel): string {
    let lines = [addr.line1, addr.line2, addr.line3, addr.line4]
    let strLines = lines
      .filter((line) => line !== '' && line !== undefined)
      .join(', ')
    
    return `${strLines}, building number: ${addr.buildingNumber}, postal code: ${addr.postcode}`
  }

  return (
    <>
      <Title>Properties for Sale</Title>
      <Table rows={propertiesRowModel} />
    </>
  )
}

export default Authenticated
