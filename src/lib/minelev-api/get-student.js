import { fintStudent } from '$lib/fintfolk-api/student'
import { logger } from '@vtfk/logger'
import { getUserData, repackMiniSchool } from './get-user-data'
import { env } from '$env/dynamic/private'
import { callGrep } from '$lib/grep'

/**
 * @typedef Fag
 * @property {string} systemId
 * @property {string} navn
 * @property {string[]} grepreferanse
 *
 */

/**
 * @typedef Faggruppe
 * @property {string} navn
 * @property {string} systemId
 * @property {Fag} fag
 * @property {import("./get-user-data").MiniSchool} skole
 */

/**
 * @typedef Basisgruppe
 * @property {string} navn
 * @property {string} systemId
 * @property {string} trinn
 * @property {import("./get-user-data").MiniSchool} skole
 */

/**
 * @typedef Student
 * @property {string} upn
 * @property {string} feidenavn
 * @property {string} elevnummer
 * @property {string} name
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} birthdate
 */

/**
 * @typedef StudentData
 * @property {Student} student
 * @property {Basisgruppe[]} basisgrupper
 * @property {Faggruppe[]} faggrupper
 * @property {Faggruppe[]} probableFaggrupper
 * @property {boolean} [hasYff]
 * @property {import('./get-user-data').MiniSchool[]} [yffSchools]
 *
 */

/**
 * @param {import("$lib/authentication").User} user
 * @param {string} studentFeidenavn
 * @param {boolean} includeSsn
 * @returns {StudentData}
 */
export const getStudent = async (user, studentFeidenavn, includeSsn = false) => {
  const loggerPrefix = `getStudent - user: ${user.principalName} - student: ${studentFeidenavn}`
  logger('info', [loggerPrefix, 'New request'])

  // First validate access to student
  const userData = await getUserData(user)

  const availableStudents = userData.students
  logger('info', [loggerPrefix, 'Validating access to student'])
  const teacherStudent = availableStudents.find(stud => stud.feidenavn === studentFeidenavn)
  const allowedToView = teacherStudent
  if (!allowedToView) {
    logger('warn', [loggerPrefix, 'no access to student, or student does not exist'])
    throw new Error('No access to student, or student is not registered')
  }
  logger('info', [loggerPrefix, 'Access validated, fetching data'])

  const classes = userData.classes

  const student = await fintStudent(studentFeidenavn)

  logger('info', [loggerPrefix, 'Got student from FINT, repacking'])

  const repackedStudent = {
    upn: student.upn,
    feidenavn: student.feidenavn,
    elevnummer: student.elevnummer,
    name: student.navn,
    firstName: student.fornavn,
    lastName: student.etternavn,
    birthdate: student.fodselsdato
  }
  if (includeSsn) repackedStudent.personalIdNumber = student.fodselsnummer

  // Alle faggrupper, fordi vi mangler relasjon mellom lærer og faggrupper
  const faggrupper = []
  const basisgrupper = []
  for (const elevforhold of student.elevforhold.filter(forhold => forhold.aktiv || (new Date() < new Date(forhold.gyldighetsperiode.start)))) { // Aktive eller aktive i fremtiden
    for (const basisgruppe of elevforhold.basisgruppemedlemskap.filter(medlemskap => medlemskap.aktiv || (new Date() < new Date(medlemskap.medlemskapgyldighetsperiode.start)))) { // Aktive eller aktive i fremtiden
      basisgrupper.push({
        navn: basisgruppe.navn,
        systemId: basisgruppe.systemId,
        trinn: basisgruppe.trinn,
        skole: repackMiniSchool(elevforhold.skole)
      })
    }
    for (const faggruppe of elevforhold.faggruppemedlemskap.filter(medlemskap => medlemskap.aktiv || (new Date() < new Date(medlemskap.medlemskapgyldighetsperiode.start)))) { // Aktive eller aktive i fremtiden
      faggrupper.push({
        navn: faggruppe.navn,
        systemId: faggruppe.systemId,
        fag: faggruppe.fag,
        skole: repackMiniSchool(elevforhold.skole)
      })
    }
  }

  logger('info', [loggerPrefix, `Finsihed repacking ${faggrupper.length} faggrupper, finding faggrupper teacher probably teaches`])
  // Henter alle faggrupper der det er en undervisningsgruppe som heter det samme som faggruppen eller har special match, resten må lærer utvide for å få se / velge. Frontend må passe på å vise alle som er valgt til en hver tid
  const probableFaggrupper = faggrupper.filter(faggruppe => {
    if (classes.some(group => group.navn === faggruppe.navn)) return true
    const faggruppeNameList = faggruppe.navn.split('/')
    if (faggruppeNameList.length !== 3 && faggruppeNameList.length !== 2) return false // Antar faggruppe navn lik "{klasse}/{fagnavn}/{fagkode}" eller "{klasse}/{fagkode}"
    const faggruppeClassName = faggruppeNameList[0]
    const faggruppeCourseCode = faggruppeNameList.length === 3 ? faggruppeNameList[2] : faggruppeNameList[1]
    const specialMatch = classes.some(group => {
      const groupNameList = group.navn.split('/')
      if (groupNameList.length !== 3 && groupNameList.length !== 2) return false // Antar undervisningsgruppenavn lik "{klasse}/{gruppenavn}/{fagkode}" eller "{klasse}/{fagkode}"
      const groupClassName = groupNameList[0]
      const groupCourseCode = groupNameList.length === 3 ? groupNameList[2] : groupNameList[1]
      if (faggruppeClassName === groupClassName && faggruppeCourseCode === groupCourseCode) {
        // console.log(`${faggruppeClassName} er lik ${groupClassName} og ${faggruppeCourseCode} er lik ${groupCourseCode} - match`)
        return true
      }
      // Norsk undervisningsgrupper har flere faggrupper under ofte, kan legge til flere special cases her og evt
      if (faggruppeClassName === groupClassName && faggruppeCourseCode.startsWith('NOR') && groupCourseCode.startsWith('NOR') && faggruppeCourseCode.startsWith(groupCourseCode.substring(0, 5))) {
        // console.log(`${faggruppeClassName} er lik ${groupClassName} og ${faggruppeCourseCode} starter med NOR, og ${groupCourseCode} starter med NOR, og ${faggruppeCourseCode} starter med ${groupCourseCode.substring(0, 5)} - match`)
        return true
      }
      return false
    })
    if (specialMatch) return true
    return false
  })

  logger('info', [loggerPrefix, `Found ${probableFaggrupper.length} probable faggrupper. Creating result object with results`])

  const studentData = {
    student: repackedStudent,
    basisgrupper,
    faggrupper,
    probableFaggrupper
  }

  // Så henter vi skoler læreren underviser eleven, og der eleven har yrkesfaglig elevforhold? Returner disse skolene som yff-schools. Disse brukes i kombo for å validere om læreren kan produsere yff-greier for eleven
  if (env.YFF_ENABLED === 'true') {
    const yffSchools = []
    logger('info', [loggerPrefix, 'YFF_ENABLED is true, checking for elevforhold with "yrkesfaglig" utdanningsprogram, at schools teacher have access to'])
    const elevforholdToCheckForYFF = student.elevforhold.filter(forhold => teacherStudent.skoler.some(school => school.skolenummer === forhold.skole.skolenummer))
    for (const elevforhold of elevforholdToCheckForYFF) {
      // Sjekker først om vi har yff på denne skolen alledere, i så fall kan vi skippe
      if (yffSchools.some(school => school.skolenummer === elevforhold.skole.skolenummer)) continue
      let grepReferanser = []
      for (const programomraade of elevforhold.programomrademedlemskap) {
        for (const program of programomraade.utdanningsprogram) {
          grepReferanser.push(...program.grepreferanse)
        }
      }
      if (grepReferanser.length === 0) {
        logger('warn', [loggerPrefix, `Found ${grepReferanser.length} grepReferanser for elevforhold ${elevforhold.systemId} - adding school to yffSchools because we don't know if yrkesfaglig or not...`])
        yffSchools.push(teacherStudent.skoler.find(school => school.skolenummer === elevforhold.skole.skolenummer))
        continue
      }
      logger('info', [`Found ${grepReferanser.length} grepReferanser to check for elevforhold ${elevforhold.systemId}, checking grep-values ${grepReferanser.join(', ')} from udir`])
      for (const grepReferanse of grepReferanser) {
        // Sjekker først om vi har yff på denne skolen alledere, i så fall kan vi skippe
        if (yffSchools.some(school => school.skolenummer === elevforhold.skole.skolenummer)) continue
        try {
          const utdanningsCode = grepReferanse.substring(grepReferanse.lastIndexOf('/') + 1) // Grep is on the format "https://psi.udir.no/kl06/TP"
          const grepResult = await callGrep(`utdanningsprogram/${utdanningsCode}`)
          const utdanningsprogram = grepResult['type-utdanningsprogram']?.uri || 'Ukjent'
          const hasYff = utdanningsprogram.endsWith('yrkesfaglig') || utdanningsprogram === 'Ukjent'
          if (hasYff) {
            logger('info', [loggerPrefix, `Found yrkesfaglig utdannningsprogram or ukjent: ${utdanningsprogram} - student has YFF at school`])
            yffSchools.push(teacherStudent.skoler.find(school => school.skolenummer === elevforhold.skole.skolenummer))
          } else {
            logger('info', [loggerPrefix, `No yrkesfaglig utdannningsprogram found on: ${utdanningsprogram}`])
          }
        } catch (error) {
          logger('error', [loggerPrefix, `Failed when fetching grep resource utdanningsprogram/${'tp'}`, 'Dont know if we have YFF - should we set True? We dont do it yet at least...', error.response?.data || error.stack || error.toString()])
          // yffSchools.push(teacherStudent.skoler.find(school => school.skolenummer === elevforhold.skole.skolenummer))
        }
      }
    }
    if (yffSchools.length > 0) {
      logger('info', [loggerPrefix, `Teacher has student in ${yffSchools.length} YFF-schools, setting yffData in response`])
      studentData.hasYff = true
      studentData.yffSchools = yffSchools
    } else {
      logger('info', [loggerPrefix, 'Teacher does not have student in any YFF-schools, setting yffData to none in response'])
      studentData.hasYff = false
      studentData.yffSchools = yffSchools
    }
  }

  logger('info', [loggerPrefix, `All is good, returning data`])

  return studentData
}
