const dom = { 
  date: document.getElementsByClassName('date')[0],
  word: document.getElementsByClassName('word')[0],
  pronunciation: document.getElementsByClassName('pronunciation')[0],
  definition: document.getElementsByClassName('definition')[0],
  type: document.getElementsByClassName('type')[0],
  example1: document.getElementsByClassName('example1')[0],
  example2: document.getElementsByClassName('example2')[0],
  link: document.getElementsByClassName('link')[0],
}

const updateDom = ({ word, pronunciation, definition, type = '', example1, example2, link }) => {
  dom.date.innerText = `- ${new Date().toDateString()}`
  dom.word.innerText = word
  dom.pronunciation.innerText = `/ ${pronunciation} /`
  dom.type.innerText = `(${type.slice(0, 1)})`
  dom.definition.innerText = definition
  dom.example1.innerText = example1
  dom.example2.innerText = example2
  dom.link.href = link
}

const collapse = el => {
  const height = el.scrollHeight

  const transition = element.style.transition
  element.style.transition = '' // reset transition

  requestAnimationFrame(_ => {
    el.style.height = height + 'px' // set manual height from auto height
    element.style.transition = transition // restore transition
    requestAnimationFrame(_ => el.style.height = 0 + 'px') // transition height to 0
  })
}

const expand = el => {
  const height = el.scrollHeight
  el.style.height = height + 'px'

  el.addEventListener('transitionend', function anon() {
    el.removeEventListener('transitionend', anon) // run once
    el.style.height = null
  })
}

const detailsEl = document.querySelector('details')

// detailsEl.addEventListener('change', ({ target }) => {
//   console.log(target.getAttribute('open'))

//   // target.getAttribute('open') ? expand(target) : collapse(target)
// })

const init = (async () => {
  const todaysDate = Math.floor(Date.parse(new Date().toDateString()) / 1000)

  const localWord = await browser.storage.local.get(`${todaysDate}`)

  if (!localWord || Object.keys(localWord).length == 0) {
    try {
      await browser.storage.local.clear() // clear storage

      const url = "https://wotd-api.herokuapp.com"
      const res = await fetch(url)
      const { date, ...fetched } = await res.json()
      await browser.storage.local.set({ [todaysDate]: fetched })

      updateDom({ date, ...fetched })
    } catch (err) {
      console.error(err)
    }
  } else {
    updateDom({date: todaysDate, ...localWord[todaysDate]})
  }
})()
