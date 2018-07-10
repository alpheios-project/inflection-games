<template>
	<div class = "alpheios-stat-block">
		<ul class = "alpheios-stat-block__list">
			<li class="alpheios-stat-block__list__item alpheios-stat-block__list__item__clicks">
				<p class="alpheios-stat-block__list__item__title">Made clicks</p>
				<p class="alpheios-stat-block__list__item__value" :class="clicksClass">{{ clicks }}</p>
			</li>
			<li class="alpheios-stat-block__list__item alpheios-stat-block__list__item__max_clicks">
				<p class="alpheios-stat-block__list__item__title">Max clicks</p>
				<p class="alpheios-stat-block__list__item__value">{{ maxClicks }}</p>
			</li>
			<li class="alpheios-stat-block__list__item alpheios-stat-block__list__item__failed">
				<p class="alpheios-stat-block__list__item__title">Failed</p>
				<p class="alpheios-stat-block__list__item__value">{{ failedGames }}</p>
			</li>
			<li class="alpheios-stat-block__list__item alpheios-stat-block__list__item__success">
				<p class="alpheios-stat-block__list__item__title">Success</p>
				<p class="alpheios-stat-block__list__item__value">{{ successGames }}</p>
			</li>
		</ul>
	</div>
</template>
<script>
  export default {
    name: 'StatBlock',
    props: {
      clicks: {
        type: Number,
        required: true
      },
      maxClicks: {
        type: Number,
        required: true
      },
      failedGames: {
        type: Number,
        required: true
      },
      successGames: {
        type: Number,
        required: true
      }
    },
    computed: {
      clicksClass: function () {
      	return {
      	  'alpheios-stat-block__smallColor': (this.clicks / this.maxClicks) <= 0.33,
      	  'alpheios-stat-block__mediumColor': (this.clicks / this.maxClicks) > 0.33 && (this.clicks / this.maxClicks) <= 0.66,
      	  'alpheios-stat-block__bigColor': (this.clicks / this.maxClicks) > 0.66
      	}
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/stat";
  .alpheios-stat-block {
    text-align: center;
  }

  .alpheios-stat-block__list {
  	padding: 0;
  	margin: 0 0 10px;
  	list-style: none;
  }

  .alpheios-stat-block__list__item {
  	display: inline-block;
  	vertical-align: bold;
  	text-align: center;
  	margin: 0 5px;
  	font-weight: bold;
  }

  .alpheios-stat-block__list__item__title {
  	margin: 0 0 5px;
  }

  .alpheios-stat-block__list__item__value {
  	margin: 0;
  }

  .alpheios-stat-block__list__item__max_clicks {
  	color: $alpheios-stat-block-max-clicks;
  }
  .alpheios-stat-block__list__item__failed {
  	color: $alpheios-stat-block-failed;
  }
  .alpheios-stat-block__list__item__success {
  	color: $alpheios-stat-block-success;
  }

  .alpheios-stat-block__smallColor {
  	color: $alpheios-stat-block-success;
  }
  .alpheios-stat-block__mediumColor {
  	color: $alpheios-stat-block-max-clicks;
  }
  .alpheios-stat-block__bigColor {
  	color: $alpheios-stat-block-failed;
  }

</style>