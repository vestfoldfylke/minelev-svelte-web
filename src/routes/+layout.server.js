import { env } from '$env/dynamic/private'
import { getAuthenticatedUser } from '$lib/authentication'
import { getUserData } from '$lib/minelev-api/get-user-data'
import { error } from '@sveltejs/kit'
import { logger } from '@vtfk/logger'

/** @type {import('./$types').LayoutServerLoad} */
export async function load ({ request }) {
  try {
    const user = await getAuthenticatedUser(request.headers)

    // If maintenance no need to return data
    if (env.MAINTENANCE_MODE === 'true') {
      return {
        user,
        maintenanceMode: true
      }
    }
    const userData = await getUserData(user)

    return {
      user,
      ...userData
    }
  } catch (err) {
    logger('error', ['Could not get data...', err.response?.data || err.stack || err.toString()])
    throw error(500, `Could not get data... ${err.toString()}`)
  }
}
