<script>
  import { page } from "$app/stores";
  import Elevsamtale from "$lib/document-types/Elevsamtale.svelte";
  import VarselAtferd from "$lib/document-types/VarselAtferd.svelte";
  import VarselFag from "$lib/document-types/VarselFag.svelte";
  import VarselOrden from "$lib/document-types/VarselOrden.svelte";
  import { documentTypes } from "$lib/document-types/document-types";
  /** @type {import('./$types').PageData} */
  export let data

  const studentFeidenavnPrefix = $page.params.feidenavnPrefix
  const teacherStudent = data.students.find(stud => stud.feidenavnPrefix === studentFeidenavnPrefix)
  const studentData = data.studentData

  let documentTypeId = $page.url.searchParams.get('document_type') || undefined

  //let availableSchools

  const getAvailableSchools = (documentTypeId) => {
    const availableSchools = documentTypeId ? teacherStudent.availableDocumentTypes.find(docType => docType.id === documentTypeId).schools : []
    return availableSchools
  }

  let selectedSchoolNumber = documentTypeId ? getAvailableSchools(documentTypeId).length > 1 ? "" : getAvailableSchools(documentTypeId)[0].skolenummer : ""
  $: selectedSchoolNumber = documentTypeId ? getAvailableSchools(documentTypeId).length > 1 ? "" : getAvailableSchools(documentTypeId)[0].skolenummer : ""

</script>

<h2>Opprett nytt dokument</h2>

<div class="label-select">
  <label for="documentType">Dokumenttype</label>
  <select bind:value={documentTypeId} id="documentType">
    {#if teacherStudent.availableDocumentTypes.length === 1} <!-- Hvis det bare er en gyldig dokumenttype, så bruker vi bare den -->
      <option value="{teacherStudent.availableDocumentTypes[0].id}">{teacherStudent.availableDocumentTypes[0].title}</option>
    {:else}
      <option value="">--Velg dokumenttype--</option>
      <hr />
      {#each teacherStudent.availableDocumentTypes as docType}
        <option value="{docType.id}">{docType.title}</option>
      {/each}
    {/if}
    </select>
</div>
{#if documentTypeId}
  {#if getAvailableSchools(documentTypeId).length > 1}
    <section>
      <h4>Velg skole</h4>
      {#each getAvailableSchools(documentTypeId) as school}
        <input type="radio" id="school-{school.skolenummer}" name="schoolNumber" bind:group={selectedSchoolNumber} value="{school.skolenummer}" required />
        <label for="school-{school.skolenummer}">{school.navn}</label><br>
      {/each}
    </section>
  {:else}
    <section style="display: none;">
      <h4>Velg skole</h4>
      <input type="radio" id="school-{getAvailableSchools(documentTypeId)[0].skolenummer}" name="school" bind:group={selectedSchoolNumber} value="{getAvailableSchools(documentTypeId)[0].skolenummer}" />
      <label for="school-{getAvailableSchools(documentTypeId)[0].skolenummer}">{getAvailableSchools(documentTypeId)[0].navn}</label><br>
    </section>
  {/if}
{/if}

<!-- Kan vi flytte skolevelgingen ut hit mon tro?? Kan kanskje flytte all "vanlig" dokumentdata ut hit, og fore det inn i content-componnentene, type og variant får vi sette i content-valideringa -->

{#if documentTypeId && selectedSchoolNumber}
  {#if documentTypeId === 'varsel-fag'}
    <VarselFag {documentTypeId} {studentFeidenavnPrefix} {selectedSchoolNumber} faggrupper={studentData.faggrupper} probableFaggrupper={studentData.probableFaggrupper} />
  {/if}
  {#if documentTypeId === 'varsel-orden'}
    <VarselOrden {documentTypeId} {studentFeidenavnPrefix} {selectedSchoolNumber} />
  {/if}
  {#if documentTypeId === 'varsel-atferd'}
    <VarselAtferd {documentTypeId} {studentFeidenavnPrefix} {selectedSchoolNumber} />
  {/if}
  {#if documentTypeId === 'samtale'}
    <Elevsamtale {documentTypeId} {studentFeidenavnPrefix} {selectedSchoolNumber} />
  {/if}
  {#if documentTypeId === 'notat'}
    Hallo notat
  {/if}
  {#if documentTypeId === 'yff'}
    Hallo yff
  {/if}
{/if}

<style>
  select {
    min-width: 15rem;
  }
  h4 {
    border-bottom: 1px solid var(--primary-color);
  }
  section {
    /* background-color: var(--primary-color-20); */
    padding-bottom: 0.5rem;
  }
</style>