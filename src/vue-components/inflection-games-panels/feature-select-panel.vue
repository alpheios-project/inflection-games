<template>
	<div class = "alpheios-features_select" v-if="gameFeaturesList">
		<p class = "alpheios-features_select__title">Features list</p>

		<ul class="alpheios-features_select__features_select__list">
			<li v-for="(featureName, indexF) in featuresKeys" :key="indexF">
				<p class="alpheios-features_select__list__feature_title">{{ featureName }}</p>

				<ul class="alpheios-features_select__features_select__list__values_list">
					<li
						:class="featureItemClass(featureName, featureValue)"
						@click = "selectFeature(featureName, featureValue)"
						v-for="(featureValue, indexFL) in gameFeaturesList[featureName]" 
						:key="indexFL"
						>{{ featureValue.value }}</li>
				</ul>
			</li>
		</ul>

	</div>
</template>
<script>
  export default {
    name: 'FeatureSelectPanel',
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
      featuresListChanged: {
      	type: Number,
      	required: true
      },
      gameTable: {
      	type: Object,
      	required: true
      },
      inflectionData: {
      	type: Object,
      	required: true
      }
    },
    computed: {
      featuresKeys: function () {
      	return Object.keys(this.gameFeaturesList).filter(key => this.gameFeaturesList[key].length > 1)
      }
    },
    watch: {
      featuresListChanged: function () {
      	this.createGameFeaturesList()
      }
    },
    methods: {
      featureItemClass: function (featureName, featureValue) {
      	return {
      	  'alpheios-features_select__features_select__list__values_list_item': true,
      	  'alpheios-features_select__features_select__list__values_list_item__success': featureValue.status === 'success',
      	  'alpheios-features_select__features_select__list__values_list_item__failed': featureValue.status === 'failed'
      	}
      },

      selectFeature: function (featureName, featureValue) {
      	let hasFullMatch = this.gameCheckTable.rows.some(row => row.cells.some(cell => cell.fullMatch && cell[featureName] === featureValue.value))
      	featureValue.status = hasFullMatch ? 'success' : 'failed'
      	this.$emit('selectFeature', featureName, featureValue.status, featureValue.value)
      	this.$emit('incrementClicks')
      },

      getFeatures: function (cell) {
        let ignoreProps = ['role', 'value', 'hidden', 'fullMatch']
        return Object.keys(cell).filter(prop => (ignoreProps.indexOf(prop) === -1))
      },

      compareLexemesToCell: function (cell) {
        let cellFeatures = this.getFeatures(cell)

        return this.inflectionData.homonym.lexemes.some(lexeme => 
          lexeme.inflections.some(inflection => 
            cellFeatures.every(feature => {
              return inflection.hasOwnProperty(feature) && inflection[feature].value === cell[feature]
            })
          )
        )
      },

      createGameCheckTable: function () {
        this.gameCheckTable = null
        let table = { rows: [] }

        this.gameTable.rows.forEach(row => {
          let cells = []
          row.cells.forEach(cell => {
            cell.fullMatch = cell.role === 'data' ? this.compareLexemesToCell(cell) : null
            cell.hidden = cell.role === 'data' ? true : false
            cells.push(Object.assign({}, cell))
          })
          table.rows.push({ cells: cells })
        })

        this.gameCheckTable = table
      },

      createGameFeaturesList: function () {
      	let gameFeaturesList = {}

      	Object.keys(this.featuresList).forEach(key => {
      	  gameFeaturesList[key] = []
      	  this.featuresList[key].forEach(value => { gameFeaturesList[key].push(
      	  	{ value: value, status: null }
      	  ) })
      	})
      	this.gameFeaturesList = gameFeaturesList

      	this.createGameCheckTable()
      }
    },
    mounted () {
      this.createGameFeaturesList()
    }
  }
</script>
<style  lang="scss">
  .alpheios-features_select {
  	display: block;
    width: 145px;
    float: left;
    border-right: 1px dashed;
  }
  .alpheios-features_select__title {
  	font-weight: bold;
  	margin: 0 0 10px;
  	font-size: 110%;
  }

  .alpheios-features_select__list__feature_title {
  	font-weight: bold;
  	margin: 0 0 5px;
  }

  .alpheios-features_select__features_select__list {
  	list-style: none;
  	padding-left: 5px;
  	margin: 0;
  }

  .alpheios-features_select__features_select__list__values_list {
  	margin: 0 0 10px;
    list-style: none;
    padding-left: 10px;
  }

  .alpheios-features_select__features_select__list__values_list_item {
  	background-color: transparent;
  	background-image: url(../../images/radiobutton-icon.png);
  	background-position: left center;
  	background-size: auto 60%;
  	background-repeat: no-repeat;

  	padding-left: 15px;
  	cursor: pointer;
  }

  .alpheios-features_select__features_select__list__values_list_item__success {
  	background-image: url(../../images/check-icon.png);
  }

  .alpheios-features_select__features_select__list__values_list_item__failed {
  	background-image: url(../../images/cross-icon.png);
  }
  
</style>