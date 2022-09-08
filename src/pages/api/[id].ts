import fs from 'fs/promises'
import { CleanOptions, SimpleGit, simpleGit } from 'simple-git'
import { RESTAURANT } from 'src/mock/auriga'

export async function get({ params }) {
  const { id } = params
  const product = RESTAURANT.zones[id]

  console.log('Requesting product', id)
  console.log({ product })
  console.log({ simpleGit })
  try {
    // list files in root with fs
    const files = await fs.readdir(`${process.cwd().split('/').slice(0, -1).join('/')}`)
    console.log({ files })
    return new Response(JSON.stringify(files), {
      status: 200
    })
  } catch (err) {
    console.log(err)
  }

  if (!product) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    })
  }

  return new Response(JSON.stringify(product), {
    status: 200
  })
}
