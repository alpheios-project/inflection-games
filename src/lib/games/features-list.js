export default class FeaturesList {
  constructor (view) {
    this.uploadFeatures(view.wideView)
  }

  uploadFeatures (wideView) {
    let shownFeatures = {}
    if (wideView) {
      wideView.rows.forEach(row => {
        row.cells.forEach(cell => {
          if (cell.isDataCell && !cell.hidden) {
            cell.features.forEach(feature => {
              if (shownFeatures[feature.type] === undefined) { shownFeatures[feature.type] = [] }

              if (!shownFeatures[feature.type].map(feat => feat.value).includes(feature.value)) {
                shownFeatures[feature.type].push({
                  value: feature.value,
                  status: null,
                  hasFullMatch: cell.morphemes.some(morpheme => morpheme.match.fullMatch)
                })
              } else {
                shownFeatures[feature.type].find(feat => feat.value).hasFullMatch = shownFeatures[feature.type].find(feat => feat.value).hasFullMatch || cell.morphemes.some(morpheme => morpheme.match.fullMatch)
              }
            })
          }
        })
      })
    }

    this.features = shownFeatures
  }

  clearValuesStatus () {
    Object.values(this.features).forEach(featureValues => {
      featureValues.forEach(featVal => { featVal.status = null })
    })
  }

  get featuresTitles () {
    return Object.keys(this.features).filter(key => this.features[key].length > 1)
  }

  get featureHasOnlyOneValueUnchecked () {
    return null
  }

  getUncheckedFeatureValues (featureName) {
    return this.features[featureName].filter(featureValue => featureValue.status === null)
  }

  showAllFeatures () {
    for (let featureKey in this.features) {
      this.features[featureKey].forEach(feature => {
        feature.status = feature.hasFullMatch ? 'success' : 'failed'
      })
    }
  }
}
