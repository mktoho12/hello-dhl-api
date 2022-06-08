import axios, { AxiosRequestConfig } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = any

const callDHLExpressRating = async (payload: any) => {
  try {
    return await axios({
      baseURL: 'https://express.api.dhl.com/mydhlapi/test/rates',
      auth: {
        username: process.env.DHL_API_AUTH_USERNAME,
        password: process.env.DHL_API_AUTH_PASSWORD,
      },
      params: {
        accountNumber: '585234742',
        originCountryCode: payload.originCountry,
        originCityName: payload.originCity,
        destinationCountryCode: payload.destinationCountry,
        destinationCityName: payload.destinationCity,
        weight: payload.weight,
        length: payload.length,
        width: payload.width,
        height: payload.height,
        plannedShippingDate: payload.shippingDate,
        isCustomsDeclarable: false,
        unitOfMeasurement: 'metric',
      },
    })
  } catch (error) {
    delete error.config.auth
    return { data: { error } }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const payload = JSON.parse(req.body)
  const dhlResponse = await callDHLExpressRating(payload)

  res.status(200).json(dhlResponse.data)
}
