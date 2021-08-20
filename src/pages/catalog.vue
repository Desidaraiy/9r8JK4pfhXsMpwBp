<template>
  <f7-page name="catalog" @page:tabshow="showChart">
    <f7-navbar :title="strings.uiChartPageTitle"></f7-navbar>
    <f7-list
      media
      class="no-margin"
      >
      <f7-list-item
        smart-select
        :title="strings.uiChartPageShowStats"
        :smart-select-params="{openIn: 'sheet', sheetCloseLinkText: strings.settingsDoneBtn, closeOnSelect: true}"
      >
        <select name="showstat" :value="selectedStat" @change="selectedStat = $event.target.value; showChart()">
          <option value="prod">{{strings.uiChartPageStatsProductivity}}</option>
          <option v-for="(stat, index) in stats" :key="`stat-${index}`" :value="stat">{{stat}}</option>
        </select>
      </f7-list-item>
      <f7-list-item
        smart-select
        :title="strings.uiChartPageShowPeriod"
        :smart-select-params="{openIn: 'sheet', sheetCloseLinkText: strings.settingsDoneBtn, closeOnSelect: true}"
      >
        <select name="showperiod" :value="selectedPer" @change="selectedPer = $event.target.value; showChart()">
          <option :value="1">{{strings.uiChartPageStatsPeriodWeek}}</option>
          <option :value="2">{{strings.uiChartPageStatsPeriodMonth}}</option>
        </select>
      </f7-list-item>
    </f7-list>
    <f7-block strong>
      <chartist
        :key="chartkey"
        ratio="ct-chart ct-point ct-perfect-fourth"
        type="Line"
        :data="chartData"
        :options="chartOptions">
      </chartist>
    </f7-block>


    <f7-row v-show="selectedStat !== 'prod'">
      <f7-col width="10"></f7-col>
      <f7-button fill round width="80" @click="addData()">{{strings.uiChartPageAddStatData}}</f7-button>
      <f7-col width="10"></f7-col>
    </f7-row>
  </f7-page>
</template>
<script>
  import { f7, f7ready } from 'framework7-vue';
  import moment from 'moment';
  import chartist from 'vue-chartist';
  import * as ChartistTooltips from 'chartist-plugin-tooltips';
  import Vue from 'vue';

  Vue.use(chartist, {
    messageNoData: "Недостаточно данных",
    classNoData: "empty"
  })

  export default {
    name: "catalog-view",
    components: {
    },
    data(){
      const db = this.$root.db;
      var chartData = {};
      var chartOptions = {};
      const stats = this.$store.getters.getStats;
      const customDialog = false;
      return{
        db,
        chartData,
        chartOptions,
        selectedStat: 'prod',
        selectedPer: 1,
        stats,
        customDialog,
        chartkey: 1,
      }
    },
    mounted(){
      this.init();
    },
    computed: {
      strings: function(){
        return this.$store.getters.getStrings;
      },
    },
    watch:{
      strings: function(newCurrent, oldCurrent){
        return this.$store.getters.getStrings;
      },
      stats: function(newStats, oldStats){
        return this.$store.getters.getStats;
      }
    },
    methods: {
      init(){
        const self = this;
        const app = self.$f7;
        const $ = self.$$;
        let today = moment().format('DD.MM.YYYY');
        self.customDialog = app.dialog.create({
          title: self.strings.appTitle,
          content: `
            <div class="list no-margin-bottom no-margin-top">
              <ul>
                <li class="item-content item-input">
                  <div class="item-inner">
                    <div class="item-input-wrap">
                      <input type="number" class="datavalue" value="" placeholder="${self.strings.uiChartPageAddStatDataValue}">
                    </div>
                  </div>
                </li>
                <li class="item-content item-input">
                  <div class="item-inner">
                    <div class="item-input-wrap">
                      <input type="number" class="dataplan" value="" placeholder="${self.strings.uiChartPageAddStatDataPlan}">
                    </div>
                  </div>
                </li>
                <li class="item-content item-input">
                  <div class="item-inner">
                    <div class="item-input-wrap">
                      <input type="text" class="datadate" id="demo-calendar-default" value="" placeholder="${today}">
                    </div>
                  </div>
                </li>  
              <ul>            
            </div>`,
            buttons: [
              {
                text: app.params.dialog.buttonCancel,
                onClick: function(dialog){
                  dialog.close();
                }
              },
              {
                text: app.params.dialog.buttonOk,
                onClick: function(dialog){
                  let newDataValue = dialog.$el.find('.datavalue').val();
                  let newDataPlan = dialog.$el.find('.dataplan').val();
                  let newDataDate = dialog.$el.find('.datadate').val();
                  newDataDate = moment(newDataDate, 'DD.MM.YYYY').format('YYYY-MM-DD');

                  self.db.transaction(function(tx){
                    tx.executeSql('INSERT INTO statsTable(value, plan, date, stat_name) VALUES (?,?,?,?)', 
                    [newDataValue, newDataPlan, newDataDate, self.selectedStat]);
                  });

                  self.showChart();
                  dialog.close();
                }
              }
                    ]
        });
        app.calendar.create({
          inputEl: '#demo-calendar-default',
        });
      },
      addData(){
        const self = this;
        const app = self.$f7;
        const $ = self.$$;

        self.customDialog.open();
        
      },
      showChart(){
        const self = this;
        const app = self.$f7;
        const $ = self.$$;
        let weekTotals = [];
        let labels = [];
        let startDate = moment().format('YYYY-MM-DD');
        let period;
        switch(parseInt(self.selectedPer)){
          case 1:
            period = 6;
          break;
          case 2:
            period = 30;
          break;
          case 3:
            period = 20;
          break;
        }
        let lastDate = moment(startDate).subtract(period, 'days').format('YYYY-MM-DD');
        let allDates = self.getAllDates(startDate, lastDate, period);
        let query = '';
        let axisX = {};

        if(self.selectedStat == 'prod'){
          query = 'SELECT sum(price) AS sum_price FROM tasksTable WHERE completed = ? AND date = ?';
        }else{
          query = 'SELECT sum(value) AS sum_price FROM statsTable WHERE stat_name = ? AND date = ?';
        }
        if(self.db != null){
          self.db.transaction(function(tx){
            let f = self.selectedStat == 'prod' ? 1 : self.selectedStat;
            for(let i = 0; i < allDates.length; i++) { 
              tx.executeSql(query, [f, allDates[i]], function(tx, rs){
                for(var j = 0; j < rs.rows.length; j++){
                  var row = rs.rows.item(j);
                }
                if(typeof(row.sum_price) === "number"){
                  weekTotals.push(row.sum_price);
                }else{
                  weekTotals.push(0);
                }
                labels.push(moment(allDates[i]).format('DD.MM'));
              });
            }
          }, function(error){

          }, function(){
            switch(parseInt(self.selectedPer)){
              case 2:
                labels = self.getNewLabels(labels);
              break;
            }
            self.chartData = {
              labels: labels,
              series: [weekTotals]
            };
          });
        } 
        self.chartOptions = {
          plugins: [
            self.$chartist.plugins.tooltip({
              class: 'ct-super-tooltip',
              anchorToPoint: true
            })
          ]
        };
      },
      getNewLabels(arr){
        arr.forEach(function(item, index, arr) {
          if(index % 5 !== 0){
            arr[index] = null;
          }
        });
        return arr;
      },
      getAllDates(start, end, period){
        const self = this;
        const app = self.$f7;
        const $ = self.$$;
        var dates = [];
        var currDate = moment(start);
        var lastDate = moment(end);
        let ltdt = moment(lastDate).subtract(1, 'days').format('YYYY-MM-DD')
        dates.push(ltdt);
        for(let i = 0; i < period; i++){
          let dta = moment(lastDate, 'YYYY-MM-DD').add(i, 'days').format('YYYY-MM-DD');
          dates.push(dta);
        }
        currDate = moment(currDate).format('YYYY-MM-DD');
        dates.push(currDate);
        return dates; 
      }
    }
  };
</script>
