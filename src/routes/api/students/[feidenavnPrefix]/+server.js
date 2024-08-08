import { env } from "$env/dynamic/private"
import { getStudent } from "$lib/api"
import { getAuthenticatedUser } from "$lib/authentication"
import { json } from "@sveltejs/kit"

export const GET = async ({ params, request, url }) => {
  try {
    const user = await getAuthenticatedUser(request.headers)
    const studentFeidenavn = `${params.feidenavnPrefix}@${env.FEIDENAVN_SUFFIX}`
    const student = await getStudent(user, studentFeidenavn)
    return json(student)
  } catch (error) {
    return json({ message: 'Failed when getting student', error: error.response?.data || error.stack || error.toString() }, { status: 500 }) 
  }
}