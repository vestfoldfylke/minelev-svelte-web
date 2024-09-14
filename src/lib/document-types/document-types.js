import { error } from '@sveltejs/kit'
import { periods, courseReasons, orderReasons, behaviourReasons } from './data/document-data'
import { isValidEmail, isValidMobile } from './content-validation'

const getSchoolYearFromDate = (date, delimiter = '/') => {
  // Hvis vi er etter 15 juli inneværende år, så swapper vi til current/next. Ellers bruker vi previous/current
  const year = date.getFullYear()
  const previousYear = year - 1
  const nextYear = year + 1
  const midsommar = new Date(`${year}-07-15`)
  if (date > midsommar) return `${year}${delimiter}${nextYear}`
  return `${previousYear}${delimiter}${year}`
}

export const getCurrentSchoolYear = (delimiter = '/') => {
  return getSchoolYearFromDate(new Date(), delimiter)
}

// accessConditions: 'hasUndervisningsgruppe', 'isContactTeacher', 'yff'

export const documentTypes = [
  {
    id: 'varsel-fag',
    title: 'Varsel fag',
    accessCondition: 'hasUndervisningsgruppe',
    matchContent: { // What should be the result of generateContent()
      year: '2023/2024',
      period: {
        id: '02',
        nb: 'Halvårsvurdering 2. termin',
        nn: 'Halvårsvurdeiring 2. termin',
        en: 'Halvårsvurdering 2. termin'
      },
      classes: [
        {
          id: '9384395',
          name: 'STB3/KODD2789',
          schoolId: '234545',
          nb: 'Fagets navn',
          nn: 'Fagets namn',
          en: 'Course name'
        }
      ],
      reasons: [
        {
          id: '01',
          nb: 'en grunn',
          nn: 'ein grunn',
          en: 'a reason'
        }
      ]
    },
    generateContent: (student, content) => {
      if (!student) throw new Error('Missing required argumnet "student"')
      const { periodId, courseIds, reasonIds } = content
      if (!(periodId && courseIds && reasonIds)) throw new Error('Missing required argument(s) "periodId", "courseIds" and/or "reasonIds"')
      if (typeof periodId !== 'string') throw new Error('parameter "period" must be string')
      if (!Array.isArray(courseIds) || courseIds.some(course => typeof course !== 'string')) throw new Error('parameter "courses" must be Array of strings')
      if (!Array.isArray(reasonIds) || reasonIds.some(reason => typeof reason !== 'string')) throw new Error('parameter "reasons" must be Array of strings')

      let period = periods.find(p => p.id === periodId)
      if (!period) throw error(400, `Chosen period "${period}" is not a valid period`)
      period = { id: period.id, ...period.value }

      const courses = courseIds.map(courseId => {
        const course = student.faggrupper.find(gruppe => gruppe.systemId === courseId)
        if (!course) throw error(400, `Could not find course for student with systemId: "${courseId}"`)
        const { systemId, navn, fag } = course
        if (!(systemId && navn && fag.navn)) throw error(500, `Missing either systemId, name, or course.name for course with id: "${courseId}"`)
        return {
          id: systemId,
          name: navn,
          schoolId: course.skole.skolenummer,
          nb: fag.navn,
          nn: fag.navn,
          en: fag.navn
        }
      })

      const reasons = reasonIds.map(reasonId => {
        const reason = courseReasons.find(r => r.id === reasonId)
        if (!reason) throw error(400, `Could not find courseReason with id: "${reasonId}"`)
        return { id: reason.id, ...reason.value }
      })

      return {
        year: getCurrentSchoolYear(),
        period,
        classes: courses,
        reasons
      }
    }
  },
  {
    id: 'varsel-orden',
    title: 'Varsel orden',
    accessCondition: 'isContactTeacher',
    matchContent: {
      year: '2023/2024',
      period: {
        id: '02',
        nb: 'Halvårsvurdering 2. termin',
        nn: 'Halvårsvurdeiring 2. termin',
        en: 'Halvårsvurdering 2. termin'
      },
      reasons: [
        {
          id: '01',
          nb: 'en grunn',
          nn: 'ein grunn',
          en: 'a reason'
        }
      ]
    },
    generateContent: (student, content) => {
      if (!student) throw new Error('Missing required argumnet "student"')
      const { periodId, reasonIds } = content
      if (!(periodId && reasonIds)) throw new Error('Missing required argument(s) "periodId" and/or "reasonIds"')
      if (typeof periodId !== 'string') throw new Error('parameter "period" must be string')
      if (!Array.isArray(reasonIds) || reasonIds.some(reason => typeof reason !== 'string')) throw new Error('parameter "reasons" must be Array of strings')

      let period = periods.find(p => p.id === periodId)
      if (!period) throw error(400, `Chosen period "${period}" is not a valid period`)
      period = { id: period.id, ...period.value }

      const reasons = reasonIds.map(reasonId => {
        const reason = orderReasons.find(r => r.id === reasonId)
        if (!reason) throw error(400, `Could not find orderReason with id: "${reasonId}"`)
        return { id: reason.id, ...reason.value }
      })

      return {
        year: getCurrentSchoolYear(),
        period,
        reasons
      }
    }
  },
  {
    id: 'varsel-atferd',
    title: 'Varsel atferd',
    accessCondition: 'isContactTeacher',
    matchContent: {
      year: '2023/2024',
      period: {
        id: '02',
        nb: 'Halvårsvurdering 2. termin',
        nn: 'Halvårsvurdeiring 2. termin',
        en: 'Halvårsvurdering 2. termin'
      },
      reasons: [
        {
          id: '01',
          nb: 'en grunn',
          nn: 'ein grunn',
          en: 'a reason'
        }
      ]
    },
    generateContent: (student, content) => {
      if (!student) throw new Error('Missing required argumnet "student"')
      const { periodId, reasonIds } = content
      if (!(periodId && reasonIds)) throw new Error('Missing required argument(s) "periodId" and/or "reasonIds"')
      if (typeof periodId !== 'string') throw new Error('parameter "period" must be string')
      if (!Array.isArray(reasonIds) || reasonIds.some(reason => typeof reason !== 'string')) throw new Error('parameter "reasons" must be Array of strings')

      let period = periods.find(p => p.id === periodId)
      if (!period) throw error(400, `Chosen period "${period}" is not a valid period`)
      period = { id: period.id, ...period.value }

      const reasons = reasonIds.map(reasonId => {
        const reason = behaviourReasons.find(r => r.id === reasonId)
        if (!reason) throw error(400, `Could not find behaviourReason with id: "${reasonId}"`)
        return { id: reason.id, ...reason.value }
      })

      return {
        year: getCurrentSchoolYear(),
        period,
        reasons
      }
    }
  },
  {
    id: 'samtale',
    title: 'Elevsamtale',
    accessCondition: 'isContactTeacher',
    matchContent: {
      year: '2023/2024'
    },
    generateContent: (student, content) => {
      if (!student) throw new Error('Missing required argumnet "student"')
      return {
        year: getCurrentSchoolYear()
      }
    }
  },
  {
    id: 'notat',
    title: 'Notat',
    accessCondition: 'hasUndervisningsgruppe',
    isEncrypted: true,
    matchContent: {
      note: 'fjidsofjkldsfkldsjflks'
    },
    generateContent: (student, content) => {
      if (!student) throw new Error('Missing required argumnet "student"')
      const { note } = content
      if (!note) throw new Error('Missing required argument "content.note"')
      return {
        note
      }
    }
  },
  {
    id: 'yff-bekreftelse',
    title: 'YFF - Bekreftelse på utplassering',
    accessCondition: 'yffEnabled',
    isEncrypted: false,
    matchContent: {
      bekreftelse: {
        oppmotested: 'Whatever',
        kopiPrEpost: ['optional'],
        fraDato: '02.02.2021', // Konverteres fra format 2024-12-24
        tilDato: '03.02.2021',
        daysPerWeek: '17',
        startTid: '08:00',
        sluttTid: '16:00',
        kontaktpersonData: [
          {
            navn: 'Whatever',
            telefon: '0118 999 881 999 119 7253',
            epost: 'nei@nei.no',
            avdeling: 'Whatever'
          }
        ],
        parorendeData: [
          {
            navn: 'Halla Balla',
            telefon: 'Sakesak'
          }
        ],
        bedriftsNavn: 'VESTFOLD OG TELEMARK FYLKESKOMMUNE',
        bedriftsData: {
          organisasjonsNummer: '821227062',
          navn: 'VESTFOLD OG TELEMARK FYLKESKOMMUNE',
          adresse: 'Postboks 2844',
          postnummer: '3702',
          poststed: 'SKIEN',
          avdeling: 'Whatever',
          type: 'enhet eller underenhet'
        }
      },
      utdanningsprogramId: 'blabababa',
      utdanningsprogram: {
        kode: 'BA',
        uri: 'optional',
        'url-data': 'optional',
        tittel: {
          default: 'Bygg- og anleggsteknikk',
          nb: 'Bygg- og anleggsteknikk',
          nn: 'Bygg- og anleggsteknikk',
          en: 'Building and Construction',
          sm: 'Huksen- ja ráhkadusteknihkka'
        },
        type: {
          'url-data': 'optional',
          beskrivelse: {
            default: 'Yrkesfaglig utdanningsprogram',
            nb: 'Yrkesfaglig utdanningsprogram',
            nn: 'Yrkesfaglig utdanningsprogram',
            en: 'Yrkesfaglig utdanningsprogram',
            sm: 'Yrkesfaglig utdanningsprogram'
          }
        },
        programomrade: [
          'optional'
        ]
      },
      level: 'VG1',
      year: '2020/2021'
    },
    /**
     *
     * @param {import('$lib/minelev-api/get-student').StudentData} student
     * @param {Object} content
     */
    generateContent: (student, content) => {
      if (!student) throw new Error('Missing required argumnet "student"')
      // We cannot add to db here, because this file is used client-side as well...
      // First we check bekreftelse
      if (!content.bekreftelse.oppmotested) throw new Error('Mangler oppmøtested for utplasseringen')
      if (!Array.isArray(content.bekreftelse.kopiPrEpost)) throw new Error('property "bekreftelse.kopiPrEpost" must be Array')
      for (const email of content.bekreftelse.kopiPrEpost) {
        if (!isValidEmail(email)) throw new Error(`Kopimottaker: "${email}" er ikke en gyldig e-post-adresse`)
      }
      if (!content.bekreftelse.fraDato) throw new Error('Mangler "fra dato"')
      if (!content.bekreftelse.tilDato) throw new Error('Mangler "til dato"')
      const convertDate = (date) => {
        const dateList = date.split('-')
        if (!dateList.length === 3) throw new Error('Dato må være på format "yyyy-mm-dd"')
        return `${dateList[2]}.${dateList[1]}.${dateList[0]}`
      }
      const fraDato = convertDate(content.bekreftelse.fraDato)
      const tilDato = convertDate(content.bekreftelse.tilDato)
      if (new Date(content.bekreftelse.fraDato) > new Date(content.bekreftelse.tilDato)) throw new Error('Utplasseringens fra-dato må være før utplasseringens til-dato...')

      content.bekreftelse.fraDato = fraDato
      content.bekreftelse.tilDato = tilDato

      if (!content.bekreftelse.daysPerWeek) throw new Error('Mangler antall dager i uken for utplasseringen')
      if (isNaN(content.bekreftelse.daysPerWeek)) throw new Error('"Antall dager i uken" må være et tall')

      content.bekreftelse.daysPerWeek = content.bekreftelse.daysPerWeek.toString()

      if (!content.bekreftelse.startTid) throw new Error('Mangler "startTid" for utplasseringen')
      if (!content.bekreftelse.sluttTid) throw new Error('Mangler "sluttTid" for utplasseringen')
      if (!Array.isArray(content.bekreftelse.kontaktpersonData)) throw new Error('property "bekreftelse.kontaktpersonData" must be Array')
      if (content.bekreftelse.kontaktpersonData.length === 0) throw new Error('Må ha minst en kontaktperson ved utplasseringsbedriften')
      for (const person of content.bekreftelse.kontaktpersonData) {
        if (!person.navn) throw new Error('Kontaktperson ved bedriften mangler "Navn"')
        if (person.telefon) person.telefon = person.telefon.toString()
        if (person.telefon && !isValidMobile(person.telefon)) throw new Error(`Telefonnummer ${person.telefon} til kontaktperson er ikke et gyldig telefonnummer`)
        if (person.epost && !isValidEmail(person.epost)) throw new Error(`E-post adresse ${person.epost} til kontaktperson er ikke en gyldig e-postadresse`)
      }
      if (!Array.isArray(content.bekreftelse.parorendeData)) throw new Error('property "bekreftelse.parorendeData" must be Array')
      if (content.bekreftelse.parorendeData.length === 0) throw new Error('Må ha minst en pårørerende for eleven')
      for (const person of content.bekreftelse.parorendeData) {
        if (!person.navn) throw new Error('Pårørerende for eleven mangler "Navn"')
        if (person.telefon) person.telefon = person.telefon.toString()
        if (!person.telefon) throw new Error('Pårørerende for eleven mangler "Telefon"')
        if (!isValidMobile(person.telefon)) throw new Error(`Telefonnummer ${person.telefon} til pårørende er ikke et gyldig telefonnummer`)
      }
      if (!content.bekreftelse.bedriftsData) throw new Error('Missing property "bekreftelse.bedriftsData"')
      if (!content.bekreftelse.bedriftsData.organisasjonsNummer) throw new Error('Missing property "bekreftelse.bedriftsData.organisasjonsNummer"')
      if (isNaN(content.bekreftelse.bedriftsData.organisasjonsNummer) || content.bekreftelse.bedriftsData.organisasjonsNummer.length !== 9) throw new Error('property "bekreftelse.bedriftsData.organisasjonsNummer" er ikke et gyldig organisasjonsnummer')
      if (!content.bekreftelse.bedriftsData.navn) throw new Error('Missing property "content.bekreftelse.bedriftsData.navn"')
      if (!content.bekreftelse.bedriftsData.adresse) throw new Error('Missing property "content.bekreftelse.bedriftsData.adresse"')
      if (!content.bekreftelse.bedriftsData.postnummer) throw new Error('Missing property "content.bekreftelse.bedriftsData.postnummer"')
      if (!content.bekreftelse.bedriftsData.poststed) throw new Error('Missing property "content.bekreftelse.bedriftsData.poststed"')
      if (!content.bekreftelse.bedriftsData.avdeling) content.bekreftelse.bedriftsData.avdeling = ''

      content.bekreftelse.bedriftsNavn = content.bekreftelse.bedriftsData.navn

      // Så tar vi utdanningsprogram og level
      if (!content.utdanningsprogramId) throw new Error('Missing property "utdanningsprogramId')
      const yffSchool = student.yffSchools.find(school => school.utdanningsprogrammer.some(program => program.uri === content.utdanningsprogramId))
      const utdanningsprogram = yffSchool.utdanningsprogrammer.find(program => program.uri === content.utdanningsprogramId)
      if (!utdanningsprogram) throw new Error(`Could not find students utdanningsprogram with id ${content.utdanningsprogramId}`)
      content.utdanningsprogram = utdanningsprogram
      if (!content.level) throw new Error('Missing property "level"')
      return {
        ...content,
        year: getCurrentSchoolYear()
      }
    }
  },
  {
    id: 'yff-laereplan',
    title: 'YFF - Lokal læreplan',
    accessCondition: 'yffEnabled',
    isEncrypted: false,
    matchContent: {
      note: 'fjidsofjkldsfkldsjflks'
    },
    generateContent: (student, content) => {
      if (!student) throw new Error('Missing required argumnet "student"')
      const { note } = content
      if (!note) throw new Error('Missing required argument "content.note"')
      return {
        note
      }
    }
  },
  {
    id: 'yff-tilbakemelding',
    title: 'YFF - Tilbakemelding på utplassering',
    accessCondition: 'yffEnabled',
    isEncrypted: false,
    matchContent: {
      note: 'fjidsofjkldsfkldsjflks'
    },
    generateContent: (student, content) => {
      if (!student) throw new Error('Missing required argumnet "student"')
      const { note } = content
      if (!note) throw new Error('Missing required argument "content.note"')
      return {
        note
      }
    }
  }
]
