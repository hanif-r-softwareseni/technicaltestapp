import React, { useEffect, FC, useState } from 'react'
import { Title, Subtitle, BodyText, Table } from '@reapit/elements'
import { useReapitConnect } from '@reapit/connect-session'
import { reapitConnectBrowserSession } from '../../core/connect-session'
import { propertiesApiService } from '../../platform-api/properties-api'
import { Properties } from '@reapit/foundations-ts-definitions'

export type AuthenticatedProps = {}

export const Authenticated: FC<AuthenticatedProps> = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [properties, setProperties] = useState<Properties | undefined>(undefined)

  useEffect(() => {
    const fetchAppoinmentConfigs = async () => {
      if (!connectSession) return
      const serviceResponse = await propertiesApiService(connectSession, { marketingMode: 'selling' })
      if (serviceResponse) {
        setProperties(serviceResponse)
      }
    }
    if (connectSession) {
      fetchAppoinmentConfigs()
    }
  }, [connectSession])

  // console.log('Properties are: ', properties)
  return (
    <>
      <Title>Properties for Sale</Title>
      <Table>

      </Table>
    </>
  )
}

export default Authenticated
