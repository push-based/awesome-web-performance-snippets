const fs = require('fs')
const _ = require('lodash')

const allKey = 'all'

function getUrlTimeMap (filePath, eventName) {
  const file = fs.readFileSync(__dirname + '/' + filePath, { encoding: 'utf8' })
  const events = JSON.parse(file)
  const filteredEvents = events.filter(e => e.name === eventName)
  return createUrlMap(filteredEvents, eventName)
}

function createUrlMap (events, defaultKeyName) {
  const map = { [allKey]: [] }

  events.forEach(t => {
    const key = t.args.data.url || defaultKeyName
    const dur = t.dur || 0
    if (!dur) {return}
    if (!map[key]) {
      map[key] = [dur]
    } else {
      map[key].push(dur)
    }
    map[allKey].push(dur)
  })
  return _.mapValues(map, value => +(_.mean(value).toFixed(0)))
}

function compare (firstPath, secondPath, eventName, showTotal = true) {
  const map1 = getUrlTimeMap(firstPath, eventName)
  const map2 = getUrlTimeMap(secondPath, eventName)
  const diffLabel = 'diff(%)'
  let resultsTable = [];
  _.uniq([...Object.keys(map1), ...Object.keys(map2)]).forEach(key => {
    if (key === allKey && !showTotal) {
      return
    }
    const val1 = map1[key]
    const val2 = map2[key]
    if (val1 && val2) {
      const diff = +((val2 / val1) * 100).toFixed(0)
      resultsTable.push({ url: key.substring(0, 80), [firstPath]: val1, [secondPath]: val2, [diffLabel]: diff })
    }
  })
  resultsTable.sort((a, b) => b.url === allKey ? 0 : b[diffLabel] - a[diffLabel])

  console.table(resultsTable)
}

function compareXHR (first, second) {
  compare('xhr/' + first, 'xhr/' + second, 'XHRLoad')
}

function compareTimer (first, second) {
  compare('timer/' + first, 'timer/' + second, 'TimerFire', false)
}

compareXHR('xhr_patched.json', 'xhr_not_patched.json')
compareTimer('timers_patched.json', 'timers_not_patched.json')
