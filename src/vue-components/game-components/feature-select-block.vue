<template>
	<div 
    class = "alpheios-features-select-block" 
    v-if="featuresList">

		<p class = "alpheios-features-select-block__title">Features list</p>

		<ul class="alpheios-features-select-block__list_features">

			<li v-for="(featureName, indexF) in featuresTitles" :key="indexF">
				<p class="alpheios-features-select-block__list_features_title">{{ featureName }}</p>

				<ul class="alpheios-features-select-block__list_values">
					<li
						:class="featureItemClass(featureValue, featureName)"
						@click = "selectFeature(featureName, featureValue)"
						v-for="(featureValue, indexFL) in features[featureName]" 
						:key="indexFL"
						>{{ featureValue.value }}</li>
				</ul>

			</li>

		</ul>

	</div>
</template>
<script>
  import Vue from 'vue/dist/vue'
  export default {
    name: 'FeatureSelectBlock',
    data () {
      return {
      	gameFeaturesList: null,
      	gameCheckTable: null
      }
    },
    props: {
      featuresList: {
      	type: Object,
      	required: true
      },
      finishGameFlag: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      featuresTitles () {
        if (Array.isArray(this.featuresList.featuresTitles) && this.featuresList.featuresTitles.length > 0) {
          Vue.nextTick(this.updateHeight)
        }
      	return this.featuresList.featuresTitles
      },
      features () {
        return this.featuresList.features
      }
    },
    watch: {
      'finishGameFlag': function (flag) {
        if (flag) {
          this.finishGame()
        }
      }
    },
    methods: {
      updateHeight () {
        let elSizes = this.$el.getBoundingClientRect()
        this.$el.style.maxHeight = (window.innerHeight - elSizes.top - 30) + 'px'
      },

      featureItemClass (featureValue, featureName) {
      	let classes = {
      	  'alpheios-features-select-block__list_values__item': true,
      	  'alpheios-features-select-block__list_values__item__success': featureValue.status === 'success',
          'alpheios-features-select-block__list_values__item__failed': featureValue.status === 'failed'
        }
        classes[featureName] = true
        return classes
      },

      checkIfOnlyOneFeatureValueLeft (featureName) {
        let uncheckedFeatureValues = this.featuresList.getUncheckedFeatureValues(featureName)
        if (uncheckedFeatureValues.length === 1) {
          uncheckedFeatureValues[0].status = uncheckedFeatureValues[0].hasFullMatch ? 'success' : 'failed'
          return true
        }
        return false
      },

      checkIfChosenTheOnlyFeatureWithFullMatch (featureName) {
        let uncheckedFeatureValues = this.featuresList.getUncheckedFeatureValues(featureName)

        if (uncheckedFeatureValues.every(featureValue => !featureValue.hasFullMatch)) {
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
          featureValue.status = featureValue.hasFullMatch ? 'success' : 'failed'
      	  this.$emit('selectFeature', featureName, featureValue.status, featureValue.value)
      	  this.$emit('incrementClicks')

          this.checkIfFeatureAllValuesChosen(featureName)
        }
      },

      finishGame: function () {
        this.featuresList.showAllFeatures()
      }
    }
  }
</script>
<style  lang="scss" scoped>
  @import "../../styles/alpheios";

  .alpheios-features-select-block {
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
    overflow: auto;
  }

  .alpheios-features-select-block__list_features li {
    font-size: 95%;
    padding-bottom: 2px;
  }

  .alpheios-features-select-block__list_features_title {
  	font-weight: bold;
  	margin: 0 0 5px;
  }

  .alpheios-features-select-block__list_values {
  	margin: 0 0 5px;
    list-style: none;
    // padding-left: 10px;
    padding-left: 0;
  }

  .alpheios-features-select-block__list_values__item {
  	background-color: transparent;
  	background-image: url(../../images/radiobutton-icon.png);
    background-position: left 4px;
    background-size: 10px auto;
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