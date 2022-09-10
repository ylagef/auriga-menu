import fs from 'fs/promises'

export async function get({ params }) {
  console.log('GET:params', { params })
  try {
    const { id } = params
    const json = await fs.readFile('src/mock/auriga.json', 'utf8')

    return new Response(json, {
      status: 200
    })
  } catch (err) {
    console.log('ERR!', err)

    return new Response(err, {
      status: 405,
      statusText: err.message
    })
  }
}

export async function post({ request, params }: { request: Request; params: any }) {
  console.log('POST:params', { params })
  const { id } = params
  const body = await request.json()
  console.log('POST:body', { body })

  try {
    const json = await fs.readFile('src/mock/auriga.json', 'utf8')
    const data = JSON.parse(json)
    data.name = body.name
    await fs.writeFile('src/mock/auriga.json', JSON.stringify(data, null, 2))

    return new Response(JSON.stringify(data), {
      status: 200
    })
  } catch (err) {
    console.log(err)

    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    })
  }
}
