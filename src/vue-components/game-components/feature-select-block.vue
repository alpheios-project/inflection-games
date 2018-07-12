<template>
	<div 
    class = "alpheios-features-select-block" 
    v-if="featuresList">

		<p class = "alpheios-features-select-block__title">Features list</p>

		<ul class="alpheios-features-select-block__list_features">

			<li v-for="(featureName, indexF) in featuresKeys" :key="indexF">
				<p class="alpheios-features-select-block__list_features_title">{{ featureName }}</p>

				<ul class="alpheios-features-select-block__list_values">
					<li
						:class="featureItemClass(featureValue)"
						@click = "selectFeature(featureName, featureValue)"
						v-for="(featureValue, indexFL) in featuresList[featureName]" 
						:key="indexFL"
						>{{ featureValue.value }}</li>
				</ul>

			</li>

		</ul>

	</div>
</template>
<script>
  export default {
    name: 'FeatureSelectBlock',
    data () {
      return {
      	gameFeaturesList: null,
      	gameCheckTable: null
      }
    },
    props: {
      selectedGame: {
      	type: Object,
      	required: true
      },
      finishGameFlag: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      featuresKeys () {
      	return this.selectedGame.featuresListTitles
      },
      featuresList () {
        return this.selectedGame.featuresList
      }
    },

    methods: {
      featureItemClass (featureValue) {
      	return {
      	  'alpheios-features-select-block__list_values__item': true,
      	  'alpheios-features-select-block__list_values__item__success': featureValue.status === 'success',
      	  'alpheios-features-select-block__list_values__item__failed': featureValue.status === 'failed'
      	}
      },

      checkFeatureHasFullMatch (featureName, featureValue) {
        return this.selectedGame.featureHasFullMatch(featureName, featureValue) ? 'success' : 'failed'
      },

      checkIfOnlyOneFeatureValueLeft (featureName) {
        let hasOnlyOneFeatureLeft = this.featuresList[featureName].filter(featureValue => featureValue.status === null).length === 1
        if (hasOnlyOneFeatureLeft) {
          let lastFeatureValue = this.featuresList[featureName].find(featureValue => featureValue.status === null)

          lastFeatureValue.status = this.checkFeatureHasFullMatch(featureName, lastFeatureValue)
          return true
        }
        return false
      },

      checkIfChosenTheOnlyFeatureWithFullMatch (featureName) {
        let uncheckedFeatureValues = this.featuresList[featureName].filter(featureValue => featureValue.status === null)

        let allNotFullMatch = uncheckedFeatureValues.every(featureValue => !this.selectedGame.featureHasFullMatch(featureName, featureValue))
        if (allNotFullMatch) {
          uncheckedFeatureValues.forEach(featureValue => { featureValue.status = 'failed' })
          return true
        }
        return false
      },

      checkIfFeatureAllValuesChosen (featureName) {
        if (this.checkIfOnlyOneFeatureValueLeft(featureName)) {
          return true
        }
        this.checkIfChosenTheOnlyFeatureWithFullMatch(featureName)
      },

      selectFeature (featureName, featureValue) {
        if (!this.finishGameFlag) {
          featureValue.status = this.checkFeatureHasFullMatch(featureName, featureValue)
      	  this.$emit('selectFeature', featureName, featureValue.status, featureValue.value)
      	  this.$emit('incrementClicks')

          this.checkIfFeatureAllValuesChosen(featureName)
        }
      }
    }
  }
</script>
<style  lang="scss" scoped>
  @import "../../styles/alpheios";

  .alpheios-features-select-block {
  	display: block;
    width: 145px;
    float: left;
    border-right: 1px dashed $alpheios-sidebar-header-border-color;
  }
  .alpheios-features-select-block__title {
  	font-weight: bold;
  	margin: 0 0 10px;
  	font-size: 110%;
  }

  .alpheios-features-select-block__list_features {
    list-style: none;
    padding-left: 5px;
    margin: 0;
  }

  .alpheios-features-select-block__list_features_title {
  	font-weight: bold;
  	margin: 0 0 5px;
  }

  .alpheios-features-select-block__list_values {
  	margin: 0 0 10px;
    list-style: none;
    padding-left: 10px;
  }

  .alpheios-features-select-block__list_values__item {
  	background-color: transparent;
  	background-image: url(../../images/radiobutton-icon.png);
  	background-position: left center;
  	background-size: auto 60%;
  	background-repeat: no-repeat;

  	padding-left: 15px;
  	cursor: pointer;
  }

  .alpheios-features-select-block__list_values__item__success {
  	background-image: url(../../images/check-icon.png);
  }

  .alpheios-features-select-block__list_values__item__failed {
  	background-image: url(../../images/cross-icon.png);
  }
  
</style>