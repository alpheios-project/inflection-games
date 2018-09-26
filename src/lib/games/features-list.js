export default class FeaturesList {
  constructor (view) {
    this.uploadFeatures(view.features, view.morphemes)
  }

  uploadFeatures (features, morphemes) {
    let featuresFromMorphemes = this.prepareFeaturesFromMorphemes(morphemes)
    let featuresFromFeatures = this.prepareFeaturesFromFeatures(features, featuresFromMorphemes)
    this.features = this.removeUnusefulFeatures(featuresFromFeatures)
  }

  prepareFeaturesFromMorphemes (morphemes) {
    let featuresFromMorpheme = {}

    morphemes.forEach(morpheme => {
      if (morpheme.match.fullMatch) {
        Object.values(morpheme.features).forEach(morphemeFeature => {
          if (featuresFromMorpheme[morphemeFeature.type] === undefined) {
            featuresFromMorpheme[morphemeFeature.type] = []
          }
          featuresFromMorpheme[morphemeFeature.type].push(morphemeFeature.value)
        })
      }
    })
    return featuresFromMorpheme
  }

  prepareFeaturesFromFeatures (features, featuresFromMorphemes) {
    let featuresFromFeatures = {}

    for (let featureKey in features) {
      let featureType = features[featureKey].type
      featuresFromFeatures[featureType] = Array.from(features[featureKey].featureMap.keys()).map(featureValue => ({
        value: featureValue,
        status: null,
        hasFullMatch: featuresFromMorphemes[featureType] && featuresFromMorphemes[featureType].includes(featureValue)
      }))
    }
    return featuresFromFeatures
  }

  removeUnusefulFeatures (featuresFromFeatures) {
    let finalFeatures = {}

    for (let featureType in featuresFromFeatures) {
      if (featuresFromFeatures[featureType].some(featureVal => featureVal.hasFullMatch !== undefined)) {
        finalFeatures[featureType] = featuresFromFeatures[featureType]
      }
    }

    return finalFeatures
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
}
