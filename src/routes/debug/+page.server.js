import { env } from '$env/dynamic/private'
import { getAuthenticatedUser } from '$lib/authentication'
import { error } from '@sveltejs/kit'
import { logConfig, logger } from '@vtfk/logger'

/** @type {import('./$types').PageServerLoad} */
export async function load (pageRequest) {
  logConfig({
    remote: {
      onlyInProd: false
    }
  })
  const debugCode = pageRequest.url.searchParams.get('debug_code')
  if (!debugCode) {
    logger('info', ['Someone is accessing debug without debug_code'])
    throw error(400, 'Missing query param "debug_code"')
  }
  if (debugCode !== env.DEBUG_CODE) {
    throw error(400, 'Value in query param "debug_code" is not valid ')
  }

  const headers = []
  for (const header of pageRequest.request.headers) {
    headers.push({
      name: header[0],
      value: header[1]
    })
  }
  let entraUser
  try {
    entraUser = getAuthenticatedUser(pageRequest.request.headers)
  } catch (error) {
    logger('error', ['Feilet her jeg gitt', error.stack || error.toString()])
    throw error(500, `iuiui ${error.toString()}`)
  }

  logger('info', ['Er dette på server da?'])
  return {
    headers,
    entraUser
  }
}
