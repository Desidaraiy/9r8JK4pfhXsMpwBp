<template>
  <f7-page name="home" class="pager" @page:reinit="closeFab">
      <f7-popover class="popnotes">
        <f7-row>
          <span class="popnotes-row-color">
            <label v-for="(color, index) in colors" :key="`color-${index}`" class="radio no-ripple">
              <input type="radio" name="color" :value="color" :checked="color == 'none'"/>
              <i class="icon-radio popnotes-cc"
                :class="color == 'none' ? 'popnotes-color-picker-'+color : 'color-theme-white popnotes-color-picker-'+color"
                @click="changeColor(color)"
                ></i>
            </label>
          </span>
        </f7-row>
        <f7-list>
          <f7-list-item
            v-for="tag in tags"
            :key="tag.id"
            @change="selectTag(tag.title)"
            :value="tag.title"
            name="checktags"
            checkbox
          >{{tag.title}}</f7-list-item>
        </f7-list>
      </f7-popover>

      <f7-popover id="pop-flagshit">
        <f7-row>
          <span class="popnotes-row-color">
            <label v-for="(color, index) in colors" :key="`color-${index}`" class="radio no-ripple">
              <input type="radio" name="newcolor" :value="color" v-model="currentTask.groupColor"/>
              <i class="icon-radio popnotes-cc"
                :class="color == 'none' ? 'popnotes-color-picker-'+color : 'color-theme-white popnotes-color-picker-'+color"
                @click="recolourTask(color)"
                ></i>
            </label>
          </span>
        </f7-row>
        <f7-list>
          <f7-list-item
          v-for="tag in tags"
          :key="tag.id"
          @change="reTagTask(tag.title)"
          :value="tag.title"
          :checked="currentTask.tags.includes(tag.title)"
          name="checknewtags"
          checkbox
          >{{tag.title}}</f7-list-item>
        </f7-list>
      </f7-popover>

      <f7-navbar :title="strings.uiHomePageTitle+' • '+score+' '+strings.uiHomePageScorePoints"></f7-navbar>

      <f7-fab id="megafab" position="right-bottom" morph-to=".fab-morph-target.toolbar.messagebar" @click="refreshActions">
        <f7-icon ios="f7:plus" aurora="f7:plus" md="material:add"></f7-icon>
      </f7-fab>

      <tasklist list="expired" :show="true" @taskchanged="countScore()"></tasklist>
      <tasklist list="actual" :show="true" @taskchanged="countScore()"></tasklist>
      <tasklist list="future" :show="false" @taskchanged="countScore()"></tasklist>

      <f7-messagebar 
        class="fab-morph-target msgbr" 
        :placeholder="strings.uiHomePageMsgBarPlaceHolder" 
        :value="newTaskText" 
        @input="newTaskText = $event.target.value" 
        @submit="onSubmit"
      >
        <div slot="after-inner" class="elements-near-messagebar">
          <f7-row class="row-under-messagebar">
            <span class="row-under-messagebar-elements">
              <span class="row-under-messagebar-elements-span">
                <f7-stepper  
                  class="row-under-messagebar-elements-span-stepper" 
                  :min="10" :max="200" :step="10" 
                  :value="newTaskPrice" 
                  @input="newTaskPrice = parseInt($event.target.value)"
                ></f7-stepper>
              </span>
              <f7-link class="row-under-messagebar-elements-link" @click="getDate">
                <f7-icon f7="calendar" class="c-init icn-coloured"></f7-icon>
              </f7-link>
              <f7-link class="row-under-messagebar-elements-link" popover-open=".popnotes">
                <f7-icon popover-open=".popnotes" :f7="flagIcon" :class="flagClassList">
                  <f7-badge v-show="selectedTagsLength !== 0" class="flag-badge">{{selectedTagsLength}}</f7-badge>
                </f7-icon>
              </f7-link>
              <f7-link class="row-under-messagebar-elements-link" @click="paydFunc">
                <f7-icon f7="alarm" class="icn-coloured"></f7-icon>
              </f7-link>
            </span>
          </f7-row>
        </div>
        <span slot="send-link">{{msgbract}}</span>
      </f7-messagebar>
  </f7-page>

</template>
<script>
  import { f7, f7ready } from 'framework7-vue';
  import moment from 'moment';
  import Vue       from 'vue';
  import lineClamp from 'vue-line-clamp';
  import tasklist from '@/components/tasklist.vue';

  Vue.use(lineClamp,{
    importCss: false
  });

  export default{
    name: 'homeview',
    components: {
      tasklist
    },
    watch: {
      tasks: function(newTasks, oldTasks){
        return this.$store.getters.getTaskList('actual');
      },
      currentTask: function(newCurrent, oldCurrent){
        return this.$store.getters.getCurrentTask;
      },
      strings: function(newCurrent, oldCurrent){
        return this.$store.getters.getStrings;
      }
    },
    computed: {
      tasks: function(){
        return this.$store.getters.getTaskList('actual');
      },
      currentTask: function(){
        return this.$store.getters.getCurrentTask;
      },
      strings: function(){
        return this.$store.getters.getStrings;
      }
    },
    data(){
      const db = this.$root.db;
      const tags = this.$store.getters.getAllTags;
      const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'none'];
      const msgbract = '';
      return{
        db,
        score: 0,
        flagClassList: 'icn-coloured',
        flagIcon: 'flag',
        newTaskText: '',
        newTaskPrice: 10,
        newTaskDate: null,
        cld: 0,        
        selectedTagsLength: 0,
        tags,
        colors,
        msgbract,
      }
    },
    mounted(){
      this.init();
    },

    methods: {
      paydFunc(){
        const self = this;
        const app = self.$f7;
        const $ = self.$$;
        app.dialog.alert('Доступно по премиум подписке. Желаете приобрести?', self.strings.appTitle);
      },
      closeFab(){
        const self = this;
        const app = self.$f7;
        const $ = self.$$;
        let fabEl = $('#megafab');
        app.fab.close(fabEl);
      },
      refreshActions(){
        this.msgbract = this.strings.uiHomePageMsgBarClose;
      },
      init(){
        const self = this;
        const app = self.$f7;
        const $ = self.$$;
        let today = new Date();
        let yesterday = new Date(today.setDate(today.getDate() - 1))
        self.msgbract = self.strings.uiHomePageMsgBarClose;
        self.cld = app.calendar.create({
          backdrop: true,
          closeByOutsideClick: true,
          disabled: {
            from: '1970-01-01',
            to: yesterday
          },
          on: {
            dayClick: function(p, dayContainer, year, month, day){
              if(parseInt(day) < 10){
                day = '0'+day;
              }
              month = parseInt(month)+1;
              if(parseInt(month) < 10){
                month = '0'+month;
              }
              self.newTaskDate = `${day}.${month}.${year}`;
              self.cld.close();
            }
          }
        });
        $(document).on('fab:open', function(e){
          app.toolbar.hide('#tool-tab', true);
          e.preventDefault();
        });
        $(document).on('fab:close', function(e){
          app.toolbar.show('#tool-tab', true);
          e.preventDefault();
        });

        $('textarea.resizable').on('input', function(e){
          if(self.newTaskText == ''){
            self.msgbract = self.strings.uiHomePageMsgBarClose;
          }else{
            self.msgbract = self.strings.uiHomePageMsgBarAdd;
          }
          e.preventDefault();
        })    
        self.countScore();
      },
      getDate(){
        const self = this;
        const app = self.$f7;
        const $ = self.$$;
        self.cld.open();
      },
      countScore(){
        const self = this;
        self.score = 0;
        for (let index = 0; index < this.tasks.length; index++) {
          let current = this.tasks[index];
          if(current.completed == true){
            self.score = self.score + current.price;
          }          
        }
      },
      onSubmit(){
        const self = this;
        const app = self.$f7;
        const $ = self.$$;
        self.newTaskPrice = parseInt(self.newTaskPrice);
        self.lastId = parseInt(self.lastId) + 1;
        if(self.newTaskText == ''){
          app.fab.close(fabEl);
          return;
        }
        if(self.newTaskDate == null){
          self.newTaskDate = moment().format('DD.MM.YYYY');
        }
        let groupColor = $('input[name="color"]:checked').val();
        let tags = [];
        $('input[name="checktags"]:checked').each(function() {
          tags.push($(this).val());
        });
        
        let newTask = {
          id: false,
          text: self.newTaskText,
          date: self.newTaskDate,
          time: 'unset',
          completed: false,
          price: self.newTaskPrice,
          groupColor,
          tags,
          subsCount: false,
        };

        let dateToWrite = moment(self.newTaskDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
        let tagsToWrite = newTask.tags.join(',');

        self.db.transaction(function(tx){
          tx.executeSql('INSERT INTO tasksTable(text, date, time, completed, price, groupColor, tags) VALUES(?,?,?,?,?,?,?)', 
            [newTask.text, dateToWrite, newTask.time, 0, newTask.price, newTask.groupColor, tagsToWrite], function(tx, response){
              newTask.id = response.insertId;
            });
        });

        let now = moment().format('YYYY-MM-DD');
        let toCompare = moment(self.newTaskDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
        if(moment(toCompare).isAfter(now)){
          self.$store.commit('pushFutureTask', newTask);
        }else{
          self.$store.commit('pushNewTask', newTask);
        }
        self.newTaskPrice = 10;
        self.newTaskText = '';
        self.msgbract = self.strings.uiHomePageMsgBarClose;
        let fabEl = $('#megafab');
        app.fab.close(fabEl);
      },
      selectTag(title){
        const self = this;
        const $ = self.$$;
        let tags = [];
        $('input[name="checktags"]:checked').each(function() {
          tags.push($(this).val());
        });
        self.selectedTagsLength = tags.length; 
      },
      reTagTask(title){
        const self = this;
        const $ = self.$$;
        let tags = [];
        $('input[name="checknewtags"]:checked').each(function() {
          tags.push($(this).val());
        });
        let payload = [tags, self.currentTask.id];
        self.$store.commit('reTagTask', payload);
        self.writeChanges('UPDATE tasksTable SET tags = ? WHERE id = ?', payload);
      },
      changeColor(color){
        this.flagClassList = 'icn-coloured-'+color;
        this.flagIcon = color == 'none' ? 'flag' : 'flag_fill';
      },
      recolourTask(color){
        let payload = [color, this.currentTask.id];
        this.$store.commit('reColourTask', payload);
        this.writeChanges('UPDATE tasksTable SET groupColor = ? WHERE id = ?', payload);
      },
      writeChanges(query, arr){
        const self = this;
        if(self.db !== null){
          self.db.transaction(function(tx){
            tx.executeSql(query, arr);
          });
        }
      },
    },
  };
</script>
