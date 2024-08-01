let config = {}

const renderTemplate = (fileName, data) => {
  const src = document.getElementById(`${fileName}-template`).innerHTML
  const template = Handlebars.compile(src)
  const rendered = template({ ...data, labels: config.labels })

  document.getElementById(fileName).innerHTML += rendered
}

const fetchAndRender = async (fileName) => {
  const res = await fetch(`${fileName}.json`)
  const data = await res.json()

  if (fileName === 'apps' && config.useAppCategories) {
    const categories = data.apps.reduce((acc, app) => {
      if (!acc.includes(app.category)) acc.push(app.category)
      return acc
    }, [])

    const sortedData = categories.map((category) => {
      return {
        category,
        apps: data.apps.filter((app) => app.category === category)
      }
    })

    sortedData.forEach((item) => renderTemplate(fileName, item))
  } else {
    renderTemplate(fileName, data)
  }

  return null
}

const fetchUser = async () => {
  const res = await fetch(
    `${config.oauth2ProxyBaseUrl.replace(/\/$/, '')}/oauth2/userinfo`,
    {
      credentials: 'include'
    }
  )

  return await res.json()
}

const fetchConfig = async () => {
  const res = await fetch('config.json')
  const data = await res.json()

  config = data

  for (const theme of Object.keys(config.themes)) {
    const src = document.getElementById(`theme-button`).innerHTML
    const template = Handlebars.compile(src)
    const rendered = template({ theme })

    document.getElementById('modal-theme').innerHTML += rendered
  }

  if (config.backgroundImage && config.backgroundImage.length > 0)
    document.body.style =
      "background-image: url('" +
      config.backgroundImage +
      "'); background-size: cover; background-repeat: no-repeat; background-attachment: fixed;"

  return true
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchConfig()

  if (config.hideSettings) {
    document.getElementById('modal').style.display = 'none'
    document.getElementById('modal_init').style.display = 'none'
  }

  const user = config.useOauth2Proxy ? await fetchUser() : null

  Handlebars.registerHelper('hasGroup', (groups) => {
    if (!groups || groups.length === 0) return true
    return user[config.userPermissionKey].some((g) => groups.includes(g))
  })

  if (config.withApps) await fetchAndRender('apps')

  if (config.withLinks) await fetchAndRender('links')

  if (config.withSearch) {
    await fetchAndRender('providers')
    document.getElementById('search').style.display = 'block'
    document.getElementById('provider-area').style.display = 'block'
  }

  setValueFromLocalStorage('color-background')
  setValueFromLocalStorage('color-text-pri')
  setValueFromLocalStorage('color-text-acc')
})
