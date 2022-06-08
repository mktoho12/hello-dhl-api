import type { NextPage } from 'next'
import Head from 'next/head'
import { FC, useEffect, useState } from 'react'
import iso from 'iso-3166-1'
import { format } from 'date-fns'

type ObjectTableType = {
  object: { [key: string]: any }
}

const ObjectTable: FC<ObjectTableType> = ({ object }) => {
  if (typeof object === 'string') {
    return <>{object}</>
  } else if (typeof object === 'number') {
    return <>{object}</>
  } else if (Array.isArray(object)) {
    return (
      <>
        {object.map((el, i) => (
          <ObjectTable key={i} object={{ [i]: el }} />
        ))}
      </>
    )
  } else if (!object) {
    return null
  }

  return (
    <table className="border-collapse">
      <tbody>
        {Object.entries(object).map(([key, value]) => (
          <tr key={key}>
            <td className="border border-slate-400">{key}</td>
            <td className="border border-slate-400">
              <ObjectTable object={value} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Home: NextPage = () => {
  const [data, setData] = useState<any>(undefined)

  const [originCountry, setOriginCountry] = useState('JP')
  const [originCity, setOriginCity] = useState('Tokyo')
  const [destinationCountry, setDestinationCountry] = useState('US')
  const [destinationCity, setDestinationCity] = useState('San Francisco')
  const [weight, setWeight] = useState(5)
  const [length, setLength] = useState(15)
  const [width, setWidth] = useState(10)
  const [height, setHeight] = useState(5)
  const [shippingDate, setShippingDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  )

  const callRatingAPI = async () => {
    setData(undefined)
    const res = await fetch('/api/rates', {
      method: 'POST',
      body: JSON.stringify({
        originCountry,
        originCity,
        destinationCountry,
        destinationCity,
        weight,
        length,
        width,
        height,
        shippingDate,
      }),
    })
    setData(await res.json())
  }

  return (
    <div>
      <Head>
        <title>DHL Express API Test</title>
      </Head>

      <main className="max-w-[1080px] w-full mt-12 mx-auto">
        <h1 className="text-3xl text-center my-6">DHL Express API Test</h1>

        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-full">配送元</div>

          <div>国</div>
          <div className="col-span-5">
            <select
              className="border border-black p-1 rounded"
              onChange={e => setOriginCountry(e.target.value)}
              value={originCountry}
            >
              <option></option>
              {iso.all().map(c => (
                <option key={c.alpha2} value={c.alpha2}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>

          <div>都市</div>
          <div className="col-span-5">
            <input
              type="text"
              className="border border-black rounded py-1 px-2"
              onChange={e => setOriginCity(e.target.value)}
              value={originCity}
            />
          </div>

          <div className="col-span-full mt-4">配送先</div>

          <div>国</div>
          <div className="col-span-5">
            <select
              className="border border-black p-1 rounded"
              onChange={e => setDestinationCountry(e.target.value)}
              value={destinationCountry}
            >
              <option></option>
              {iso.all().map(c => (
                <option key={c.alpha2} value={c.alpha2}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>

          <div>都市</div>
          <div className="col-span-5">
            <input
              type="text"
              className="border border-black rounded py-1 px-2"
              onChange={e => setDestinationCity(e.target.value)}
              value={destinationCity}
            />
          </div>

          <div className="col-span-full mt-4">荷物情報</div>

          <div>重さ</div>
          <div className="col-span-5">
            <input
              type="text"
              className="border border-black rounded py-1 px-2"
              onChange={e => setWeight(parseInt(e.target.value))}
              value={weight}
            />{' '}
            kg
          </div>

          <div>長さ</div>
          <div className="col-span-5">
            <input
              type="text"
              className="border border-black rounded py-1 px-2"
              onChange={e => setLength(parseInt(e.target.value))}
              value={length}
            />{' '}
            cm
          </div>
          <div>幅</div>
          <div className="col-span-5">
            <input
              type="text"
              className="border border-black rounded py-1 px-2"
              onChange={e => setWidth(parseInt(e.target.value))}
              value={width}
            />{' '}
            cm
          </div>
          <div>高さ</div>
          <div className="col-span-5">
            <input
              type="text"
              className="border border-black rounded py-1 px-2"
              onChange={e => setHeight(parseInt(e.target.value))}
              value={height}
            />{' '}
            cm
          </div>

          <div className="col-span-full mt-4"></div>
          <div>発送予定日</div>
          <div className="col-span-5">
            <input
              type="text"
              className="border border-black rounded py-1 px-2"
              placeholder="YYYY-MM-DD"
              onChange={e => setShippingDate(e.target.value)}
              value={shippingDate}
            />
          </div>
        </div>
        <button
          onClick={callRatingAPI}
          className="bg-slate-200 border border-slate-700 py-2 px-4 rounded"
        >
          料金を調べる
        </button>

        {data && data.products && (
          <>
            <h2 className="text-2xl mt-12 mb-4">料金</h2>
            <p className="my-2">
              合計:
              <span className="ml-2 text-xl font-bold">
                {data.products[0].totalPrice[0].price.toLocaleString()}
              </span>
              円
            </p>
            <p className="my-2">内訳: </p>
            <table className="ml-4">
              <tbody>
                {data.products[0].detailedPriceBreakdown[0].breakdown.map(
                  (detail: any) => (
                    <tr key={detail.name}>
                      <td>{detail.name}</td>
                      <td className="text-right">
                        <span className="font-bold">
                          {detail.price.toLocaleString()}
                        </span>
                        円
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </>
        )}

        {data && (
          <section className="text-slate-400">
            <h2 className="text-2xl mt-8 mb-4 text-black">デバッグ情報</h2>

            {data.products &&
              data.products.map((product: any) => (
                <ObjectTable key={product.productName} object={product} />
              ))}
            {data.exchangeRates &&
              data.exchangeRates.map((exchangeRate: any, i: number) => (
                <ObjectTable key={i} object={exchangeRate} />
              ))}

            {data.error && <ObjectTable object={data.error} />}
          </section>
        )}
      </main>
    </div>
  )
}

export default Home
