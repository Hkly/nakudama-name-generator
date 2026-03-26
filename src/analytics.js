import Plausible from '@plausible-analytics/tracker'

const plausible = Plausible({
  hashBasedRouting: true,
  domain: 'hkly.io/nakudama-name-generator'
})

export default plausible
