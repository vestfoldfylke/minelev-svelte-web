export const documentStatuses = [
  {
    id: 'queued',
    short: {
      nb: 'I kø',
      nn: 'I kø',
      en: 'Queued'
    },
    description: {
      nb: 'Venter i kø',
      nn: 'Venter i kø',
      en: 'Queued'
    }
  },
  {
    id: 'sent',
    short: {
      nb: 'Sendt',
      nn: 'Sendt',
      en: 'Sent'
    },
    description: {
      nb: 'Sendt til digital postkasse med SvarUT',
      nn: 'Sendt til digital postkasse med SvarUT',
      en: 'Sent to digital mailbox with SvarUT'
    }
  },
  {
    id: 'archived',
    short: {
      nb: 'Arkivert',
      nn: 'Arkivert',
      en: 'Archived'
    },
    description: {
      nb: 'Arkivert i elevens elevmappe',
      nn: 'Arkivert i elevens elevmappe',
      en: 'Archived in student file'
    }
  }
]

export const periods = [
  {
    id: '01',
    value: {
      nb: 'Halvårsvurdering 1. termin',
      nn: 'Halvårsvurdering 1. termin',
      en: 'Halvårsvurdering 1. termin'
    }
  },
  {
    id: '02',
    value: {
      nb: 'Halvårsvurdering 2. termin',
      nn: 'Halvårsvurdering 2. termin',
      en: 'Halvårsvurdering 2. termin'
    }
  },
  {
    id: '03',
    value: {
      nb: 'Standpunktkarakter',
      nn: 'Standpunktkarakter',
      en: 'Standpunktkarakter'
    }
  }
]

export const courseReasons = [
  {
    id: '01',
    description: {
      nb: 'Eleven har manglende vurderingsgrunnlag',
      nn: 'Eleven har manglande vurderingsgrunnlag',
      en: 'Eleven har manglende vurderingsgrunnlag'
    },
    value: {
      nb: 'Du har manglende vurderingsgrunnlag',
      nn: 'Du har manglande vurderingsgrunnlag',
      en: 'Du har manglende vurderingsgrunnlag'
    }
  },
  {
    id: '02',
    description: {
      nb: 'Eleven har udokumentert fravær',
      nn: 'Eleven har udokumentert fråvær',
      en: 'Eleven har udokumentert fravær'
    },
    value: {
      nb: 'Du har udokumentert fravær',
      nn: 'Du har udokumentert fråvær',
      en: 'Du har udokumentert fravær'
    }
  }
]

export const orderReasons = [
  {
    id: '01',
    description: {
      nb: 'Eleven er for sen til undervisning',
      nn: 'Eleven er for sein til undervisning',
      en: 'Eleven er for sen til undervisning'
    },
    value: {
      nb: 'Du er for sen til undervisning',
      nn: 'Du er for sein til undervisning',
      en: 'Du er for sen til undervisning'
    }
  },
  {
    id: '02',
    description: {
      nb: 'Eleven har ikke nødvendig skolemateriell klart til undervisning',
      nn: 'Eleven har ikkje nødvendig skulemateriell klart til undervisning',
      en: 'Eleven har ikke nødvendig skolemateriell klart til undervisning'
    },
    value: {
      nb: 'Du har ikke nødvendig skolemateriell klart til undervisning',
      nn: 'Du har ikkje nødvendig skulemateriell klart til undervisning',
      en: 'Du har ikke nødvendig skolemateriell klart til undervisning'
    }
  },
  {
    id: '03',
    description: {
      nb: 'Eleven har manglende eller for sen innlevering av arbeid',
      nn: 'Eleven har manglande eller for sein innlevering av arbeid',
      en: 'Eleven har manglende eller for sen innlevering av arbeid'
    },
    value: {
      nb: 'Du har manglende eller for sen innlevering av arbeid',
      nn: 'Du har manglande eller for sein innlevering av arbeid',
      en: 'Du har manglende eller for sen innlevering av arbeid'
    }
  },
  {
    id: '04',
    description: {
      nb: 'Eleven har udokumentert fravær',
      nn: 'Eleven har udokumentert fravær',
      en: 'Eleven har udokumentert fravær'
    },
    value: {
      nb: 'Du har udokumentert fravær',
      nn: 'Du har udokumentert fravær',
      en: 'Du har udokumentert fravær'
    }
  },
  {
    id: '05',
    description: {
      nb: 'Eleven har brutt skolens ordensreglement',
      nn: 'Eleven har brutt skolens ordensreglement',
      en: 'Eleven har brutt skolens ordensreglement'
    },
    value: {
      nb: 'Du har brutt skolens ordensreglement',
      nn: 'Du har brutt skolens ordensreglement',
      en: 'Du har brutt skolens ordensreglement'
    }
  }
]

export const behaviourReasons = [
  {
    id: '01',
    description: {
      nb: 'Eleven forstyrrer undervisning eller skoleaktivitet',
      nn: 'Eleven uroar undervisning eller skuleaktivitet',
      en: 'Eleven forstyrrer undervisning eller skoleaktivitet'
    },
    value: {
      nb: 'Du forstyrrer undervisning eller skoleaktivitet',
      nn: 'Du uroar undervisning eller skuleaktivitet',
      en: 'Du forstyrrer undervisning eller skoleaktivitet'
    }
  },
  {
    id: '02',
    description: {
      nb: 'Eleven utviser provoserende atferd mot ansatte eller medelever',
      nn: 'Eleven viser provoserande åtferd mot tilsette eller medelevar',
      en: 'Eleven utviser provoserende atferd mot ansatte eller medelever'
    },
    value: {
      nb: 'Du utviser provoserende atferd mot ansatte eller medelever',
      nn: 'Du viser provoserande åtferd mot tilsette eller medelevar',
      en: 'Du utviser provoserende atferd mot ansatte eller medelever'
    }
  },
  {
    id: '03',
    description: {
      nb: 'Eleven forlater undervisning uten avklaring med lærer',
      nn: 'Eleven forlèt undervisning utan avklaring med lærar',
      en: 'Eleven forlater undervisning uten avklaring med lærer'
    },
    value: {
      nb: 'Du forlater undervisning uten avklaring med lærer',
      nn: 'Du forlèt undervisning utan avklaring med lærar',
      en: 'Du forlater undervisning uten avklaring med lærer'
    }
  },
  {
    id: '04',
    description: {
      nb: 'Eleven har fusket',
      nn: 'Eleven har fuska',
      en: 'Eleven har fusket'
    },
    value: {
      nb: 'Du har fusket',
      nn: 'Du har fuska',
      en: 'Du har fusket'
    }
  },
  {
    id: '05',
    description: {
      nb: 'Eleven har benyttet rusmidler i skoletida',
      nn: 'Eleven har nytta rusmiddel i skuletida',
      en: 'Eleven har benyttet rusmidler i skoletida'
    },
    value: {
      nb: 'Du har benyttet rusmidler i skoletida',
      nn: 'Du har nytta rusmiddel i skuletida',
      en: 'Du har benyttet rusmidler i skoletida'
    }
  },
  {
    id: '06',
    description: {
      nb: 'Eleven har brutt skolens ordensreglement',
      nn: 'Eleven har brote skulen sitt ordensreglement',
      en: 'Eleven har brutt skolens ordensreglement'
    },
    value: {
      nb: 'Du har brutt skolens ordensreglement',
      nn: 'Du har brote skulen sitt ordensreglement',
      en: 'Du har brutt skolens ordensreglement'
    }
  }
]

export const conversationStatuses = [
  {
    id: 'samtale',
    value: {
      nb: 'Elevsamtalen er gjennomført',
      nn: 'Elevsamtalen er gjennomført',
      en: 'Elevsamtalen er gjennomført'
    }
  },
  {
    id: 'ikke-samtale',
    value: {
      nb: 'Eleven ønsker ikke samtale',
      nn: 'Eleven ønsker ikke samtale',
      en: 'Eleven ønsker ikke samtale'
    }
  }
]

export const yffEvalueringsdata = {
  hms: {
    title: {
      nb: 'Eleven følger retningslinjer og HMS innenfor fagområdet',
      nn: 'Eleven følgjer retningslinjer og HMS innanfor fagområdet'
    }
  },
  'respekt-retningslinjer': {
    title: {
      nb: 'Eleven viser gode holdninger og respekt for opplæringsstedets regler og retningslinjer',
      nn: 'Eleven viser gode haldningar og respekt for opplæringsstaden sine reglar og retningslinjer'
    }
  },
  'respekt-mennesker': {
    title: {
      nb: 'Eleven viser gode holdninger og respekt for mennesker de møter under utplasseringen',
      nn: 'Eleven viser gode haldningar og respekt for menneske dei møter under utplasseringa'
    }
  },
  tilpasningsdyktig: {
    title: {
      nb: 'Eleven er tilpasningsdyktig og kan samarbeide',
      nn: 'Eleven er tilpassingsdyktig og kan samarbeide'
    }
  },
  kommunikasjon: {
    title: {
      nb: 'Eleven har kommunikasjonsevner i møte med kollegaer, kunder og brukere',
      nn: 'Eleven viser kommunikasjonsevner i møte med kollegaer, kundar og brukarar'
    }
  },
  veiledning: {
    title: {
      nb: 'Eleven tar imot veiledning',
      nn: 'Eleven tek imot rettleiing'
    }
  },
  oppfylle: {
    title: {
      nb: 'Eleven utfører tildelte arbeidsoppgaver',
      nn: 'Eleven utfører tildelte arbeidsoppgåver'
    }
  },
  initiativ: {
    title: {
      nb: 'Eleven viser initiativ og interesse for arbeidet',
      nn: 'Eleven viser initiativ og interesse for arbeidet'
    }
  }
}
