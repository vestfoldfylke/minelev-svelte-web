<script>
  import '../app.css' // Add global css (and make it hot reload)
  import logo from '$lib/assets/logo.svg'
  import logoDarkmode from '$lib/assets/logo-darkmode.svg'
  import { page } from '$app/stores'
  import { navigating } from '$app/stores'
  import { clickOutside } from '$lib/helpers/click-outside'

  /** @type {import('./$types').PageData} */
	export let data

  let showUsermenu = false

  const isActiveRoute = (route, currentRoute) => {
    if (currentRoute === route) return true
    if (route.length > 1 && currentRoute.substring(0, route.length) === route) return true
    return false
  }

  const getPathLinks = (path) => {
    const parts = path.split('/')
    const pathLinks = [
      {
        name: 'Hjem',
        href: '/',
        addSlashBefore: false
      }
    ]
    let currentLink = ''
    for (const part of parts) {
      if (part === '') continue
      currentLink += `/${part}`
      pathLinks.push({
        name: part,
        href: currentLink,
        addSlashBefore: true
      })
    }
    return pathLinks
  }

  const sideMenuItems = [
    {
      title: 'Hjem',
      href: '/',
      icon: 'home'
    },
    {
      title: 'Elever',
      href: '/elever',
      icon: 'person'
    },
    {
      title: 'Klasser',
      href: '/klasser',
      icon: 'group'
    }
  ]

</script>

<div class="layout">
  <div class="fakesidebartotakeupspace">
    <p>Jeg burde ikke synes</p>
  </div>
  <div class="sidebar">
    <a class="logoLink inward-focus-within" href="/">
      <img class="logo" src={logo} alt="Fylkekommunens logo" />
      <img class="logoDarkmode" src={logoDarkmode} alt="Fylkekommunens logo" />
    </a>
    <!--<md-divider role="separator"></md-divider>-->
    {#each sideMenuItems as menuItem}
      <a href={menuItem.href} class="menuLink inward-focus-within">
        <div class="menuItem{isActiveRoute(menuItem.href, $page.url.pathname) ? ' active' : ''}">
          <span class="material-symbols-outlined">{menuItem.icon}</span>
          <div>{menuItem.title}</div>
        </div>
      </a>
      <!--<md-divider role="separator"></md-divider>-->
    {/each}
  </div>
  <div class="pageContent">
    <div class="topbar">
      <h1>Min Elev</h1>
      <div class="userContainer">
        <p>{data.user.name}</p>
        <!-- Note the position: relative style -->
        <button class="action{showUsermenu ? ' cheatActive' : ''}" on:click={() => {showUsermenu = !showUsermenu}} use:clickOutside on:click_outside={() => {showUsermenu = false}}>
          <span class="material-symbols-outlined">more_vert</span>
          {#if showUsermenu}
            <div class="userMenu">
              <button class="blank userMenuOption inward-focus-within">Logg ut</button>
              <button class="blank userMenuOption inward-focus-within">Huoo</button>
              <button class="blank userMenuOption inward-focus-within">Hepp</button>
            </div>
          {/if}
        </button>
      </div>
    </div>
    <!--<md-divider role="separator"></md-divider>-->
    <div class="pathtracker">
      {#each getPathLinks($page.url.pathname) as pathlink}
        {#if pathlink.addSlashBefore}
          <span>/</span>
        {/if}
        <a class="pathtrackerlink" href="{pathlink.href}">
          {pathlink.name}
        </a>
      {/each}
    </div>
    <div class="contentContainer">
      <div class="content">
        {#if $navigating}
          <div class="loadingOverlay">
            <div class="spinner" style="width: 10rem">
              <svg viewBox="0 0 50 50" focusable="false" aria-label="Laster...">
                  <title>Laster...</title>
                  <circle cx="25" cy="25" r="20"></circle>
                  <circle cx="25" cy="25" r="20"></circle>
              </svg>
            </div>
          </div>
        {/if}
        <slot></slot>
      </div>
    </div>
  </div>
</div>


<style>
  .layout {
    display: flex;
  }
  .fakesidebartotakeupspace, .sidebar {
    width: 8rem;
    flex-direction: column;
    flex-shrink: 0;
    align-items: center;
    padding: 1.5rem 0rem;
    display: flex;
    height: 100vh;
    background-color: var(--secondary-color-20);
  }
  .sidebar {
    position: fixed;
  }
  .logoLink {
    padding-bottom: 2rem;
  }
  .logo, .logoDarkmode {
    width: 8rem;
  }
  /* Fylket hakke dark mode...
  @media (prefers-color-scheme: light) {
    .logoDarkmode {
      display: none;
    }
  }
  @media (prefers-color-scheme: dark) {
    .logo {
      display: none;
    }
  }
  */ 
  .logoDarkmode {
    display: none;
  }
  .menuLink, .logoLink {
    border-bottom: 1px solid var(--primary-color);
    text-decoration: none;
    color: var(--font-color);
  }
  .menuItem {
    width: 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0px;
    cursor: pointer;
  }
  .menuItem span {
    font-size: 1.5rem;
  }
  .menuItem.active {
    font-weight: bold;
    background-color: var(--secondary-color-10);
  }
  .menuItem:hover {
    background-color: var(--secondary-color-30);
  }
  .pageContent {
    flex-grow: 1;
    max-width: 80rem;
    margin: 0rem auto;
    padding: 0rem;
  }
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0rem 2rem;
    border-bottom: 1px solid var(--primary-color);
  }
  .pathtracker {
    display: flex;
    padding: 0.4rem 2rem;
  }
  .pathtrackerlink {
    padding: 0rem 0.4rem;
    text-decoration: none;
  }
  .userContainer {
    display: flex;
    align-items: center;
    position: relative;
  }

  .cheatActive {
    background-color: rgba(0,0,0,0.1);
  }

  .userMenu {
    position: absolute;
    display: flex;
    flex-direction: column;
    right: 0.125rem;
    top: 3rem;
    border: 2px solid var(--primary-color);
  }
  .userMenuOption {
    flex-grow: 1;
    padding: 1rem;
    background-color: var(--primary-background-color);
  }
  .userMenuOption:hover {
    padding: 1rem;
    background-color: var(--primary-color-10);
  }

  .loadingOverlay {
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    z-index: 1000; /* Should be enough?? */
  }
  .spinner {
    margin: auto;
    margin-top: 5rem;
  }

  .contentContainer {
    padding: 1rem 4rem;
  }
  .content {
    margin: 0rem auto 0rem auto;
  }
</style>