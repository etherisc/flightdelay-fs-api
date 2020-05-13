
const PERIL_HAILSTORM = 0
const PERIL_FIRE = 1
const PERIL_DROUGHT = 2
const PERIL_FLOOD = 3
const perils = [
  'hailstorm',
  'fire',
  'drought',
  'flood'
]

const origins = [
  'system',
  'user'
]

const SCALEFACTOR = 1000

const perilToString = peril => perils[peril]
const stringToPeril = peril => {

  const ti = perils.findIndex((element) => element === peril.toLowerCase())
  if (ti < 0) throw new Error('Peril "' + peril + '" not allowed')
  return ti

}

const originToString = origin => origins[origin]

module.exports = {
  PERIL_HAILSTORM,
  PERIL_FIRE,
  PERIL_DROUGHT,
  PERIL_FLOOD,
  perilToString,
  stringToPeril,
  originToString,
  SCALEFACTOR
}
