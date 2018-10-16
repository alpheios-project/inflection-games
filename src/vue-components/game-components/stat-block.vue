<template>
  <div class = "alpheios-stat-block">
    <ul class = "alpheios-stat-block__list">
      <li 
        class="alpheios-stat-block__list__item"
        :class = "item.class"
        v-for="(item, index) in statItems" 
        :key="index"
      >
        <p class="alpheios-stat-block__list__item__title">{{ item.title }}</p>
        <p class="alpheios-stat-block__list__item__value" :class="item.classValue">{{ item.value }}</p>        
      </li>
      <li class="alpheios-stat-block__list__item">
        <p class="alpheios-stat-block__list__restart_button" @click="restartScoreGame">Restart score?</p>
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
      clicksClass () {
        return {
          'alpheios-stat-block__smallColor': (this.clicks / this.maxClicks) <= 0.33,
          'alpheios-stat-block__mediumColor': (this.clicks / this.maxClicks) > 0.33 && (this.clicks / this.maxClicks) <= 0.66,
          'alpheios-stat-block__bigColor': (this.clicks / this.maxClicks) > 0.66
        }
      },
      statItems () {
        return [
          { title: 'Made clicks', value: this.clicks, class: "alpheios-stat-block__list__item__clicks", classValue: this.clicksClass },
          { title: 'Max clicks', value: this.maxClicks, class: "alpheios-stat-block__list__item__max_clicks" },
          { title: 'Failed', value: this.failedGames, class: "alpheios-stat-block__list__item__failed" },
          { title: 'Success', value: this.successGames, class: "alpheios-stat-block__list__item__success" }
        ]
      }
    },
    methods:  {
      restartScoreGame () {
        this.$emit('restartScoreGame')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/alpheios";
  @import "../../styles/stat";

  .alpheios-stat-block {
    text-align: center;
  }

  .alpheios-stat-block__list {
    padding: 10px;
    margin: 0 0 10px;
    list-style: none;
    display: inline-block;
    border: 1px dashed $alpheios-sidebar-header-border-color;
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

  .alpheios-stat-block__list__restart_button {
    cursor: pointer;
    max-width: 100px;
    text-align: center;
    padding-top: 0;
    margin: 0;
    color: $alpheios-stat-block-restart;
    padding: 5px 0;
    border: 1px solid $alpheios-stat-block-restart;
    border-radius: 30%;
    font-size: 90%;
  }

</style>