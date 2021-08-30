// Import Vue
import Vue from 'vue';

// Import Framework7
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';

// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.scss';
import '../css/style.sass';

import 'chartist/dist/chartist.min.css';

// Import App Component
import App from '../components/app.vue';
import store from '../store/store.js';
import cordovaApp from '../js/cordova-app.js';

import moment from 'moment';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

var db = null;

var tags = [];

var actualTasks = [];
var expiredTasks = [];
var futureTasks = [];

var subTasks = [];

var settings = {};

var stats = []

const isCordovaApp = (typeof window.cordova !== "undefined");
if (!isCordovaApp){
  // document.dispatchEvent(new CustomEvent("deviceready", {}));
  settings = {
    lang: 'ru',
    darkTheme: false
  };
  stats = [
    {
      name: 'Оборот день',
      id: 1,
      measure: 'ruble',
      plan: 10000,
    },
    {
      name: 'Тренировка',
      id: 2,
      measure: 'hour',
      plan: 1,
    }
  ];
  tags = [
    {
      id: 1,
      title: '#Важно',
      priority: 1
    },
    {
      id: 2,
      title: '#Работа',
      priority: 0
    },
    {
      id: 3,
      title: '#Семья',
      priority: 0
    },
    {
      id: 4,
      title: '#Учеба',
      priority: 0
    },
    {
      id: 5,
      title: '#Проект 1',
      priority: 0
    }
  ]
  subTasks = [
    {
      id: 1,
      completed: true,
      text: 'test subtask',
      pid: 1
    },
    {
      id: 2,
      completed: false,
      text: 'test subtask test subtask test subtask test subtask test subtask test subtask test subtasktest subtask test subtask test subtask',
      pid: 1
    },
  ];

  actualTasks = [
    {
      id: 1,
      text: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
      date: moment().format('DD.MM.YYYY'),
      time: 'unset',
      price: 100,
      completed: false,
      groupColor: 'green',
      tags: [],
    },
    {
      id: 2,
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      date: moment().format('DD.MM.YYYY'),
      time: 'unset',
      price: 100,
      completed: false,
      groupColor: 'none',
      tags: []
    },
    {
      id: 3,
      text: 'lorem ipsum lorem ipsum ',
      date: moment().format('DD.MM.YYYY'),
      time: 'unset',
      price: 100,
      completed: false,
      groupColor: 'red',
      tags: ['#Важно']
    },
  ];
  expiredTasks = [
    {
      id: 7,
      text: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
      date: '03.08.2021',
      time: 'unset',
      price: 100,
      completed: false,
      groupColor: 'green',
      tags: []
    },   
  ];
  futureTasks = [
    {
      id: 5,
      text: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
      date: '17.08.2021',
      time: 'unset',
      price: 100,
      completed: false,
      groupColor: 'purple',
      tags: ['#Семья']
    },   
  ]
  init();
}

document.addEventListener("deviceready", () => {
  db = window.sqlitePlugin.openDatabase({name: 'statistics_increaser.db', location: 'default'});

  cordova.plugins.notification.badge.requestPermission(function (granted) {
    //do stuff
  });
  prepare();
});

const prepare = () => {
  function numberToBool(v){
    switch(v){
      case 0:
        return false;
      case 1: 
        return true;
      case '1':
        return true;
      case '0':
        return false;
    }
  }
  var today = moment().format('YYYY-MM-DD');
  
  if(db !== null){
    db.transaction(function(tx){
      tx.executeSql('CREATE TABLE IF NOT EXISTS statsTable(id INTEGER PRIMARY KEY, date, value, plan, stat_name)');
      tx.executeSql('SELECT DISTINCT stat_name FROM statsTable', [], function(tx, rs){
        for (var i = 0; i < rs.rows.length; i++) {
          var row = rs.rows.item(i);
          stats.push(row.stat_name);
        }
      });

      tx.executeSql('SELECT count(*) AS tablecount FROM sqlite_master WHERE type = ? AND name = ?', ['table', 'plannerSettings'], function(tx, rs){
        for (var i = 0; i < rs.rows.length; i++) {
          var row = rs.rows.item(i);
        }
        if(row.tablecount < 1){   
          tx.executeSql('CREATE TABLE plannerSettings(id INTEGER PRIMARY KEY, setting, value)');
          tx.executeSql('INSERT INTO plannerSettings(setting, value) VALUES(?,?)', ['darktheme', 0]);
          tx.executeSql('INSERT INTO plannerSettings(setting, value) VALUES(?,?)', ['lang', 'ru']);
          settings = {
            lang: 'ru',
            darkTheme: false
          };
        }else{
          tx.executeSql('SELECT * FROM plannerSettings', [], function(tx, rs){
            for (var i = 0; i < rs.rows.length; i++) {
              var row = rs.rows.item(i);
              switch(row.setting){
                case 'lang':
                  settings.lang = row.value;
                break;
                case 'darktheme':
                  settings.darkTheme = numberToBool(row.value);
                break;
              }
            }   
          });
        }
      });
      tx.executeSql('SELECT count(*) AS tablecount FROM sqlite_master WHERE type = ? AND name = ?', ['table', 'tagsTable'], function(tx, rs){
        for (var i = 0; i < rs.rows.length; i++) {
          var row = rs.rows.item(i);
        }
        if(row.tablecount < 1){   
          tx.executeSql('CREATE TABLE tagsTable(id INTEGER PRIMARY KEY, title)');
          tx.executeSql('INSERT INTO tagsTable(title, prioity) VALUES(?, ?)', ['#Важно', 1]);
          tx.executeSql('INSERT INTO tagsTable(title, prioity) VALUES(?, ?)', ['#Работа', 0]);
          tx.executeSql('INSERT INTO tagsTable(title, prioity) VALUES(?, ?)', ['#Семья', 0]);
          tx.executeSql('INSERT INTO tagsTable(title, prioity) VALUES(?, ?)', ['#Учеба', 0]);
          tx.executeSql('INSERT INTO tagsTable(title, prioity) VALUES(?, ?)', ['#Проект1', 0]);
          tags = [
            {
              id: 1,
              title: '#Важно',
              priority: 1
            },
            {
              id: 2,
              title: '#Работа',
              priority: 0
            },
            {
              id: 3,
              title: '#Семья',
              priority: 0
            },
            {
              id: 4,
              title: '#Учеба',
              priority: 0
            },
            {
              id: 5,
              title: '#Проект1',
              priority: 0
            }
          ];
          console.log('tags created');
        }else{
          tx.executeSql('SELECT * FROM tagsTable', [], function(tx, rs){
            for (var i = 0; i < rs.rows.length; i++) {
              var row = rs.rows.item(i);
              var newTag = {
                id: row.id,
                title: row.title,
                priority: row.priority
              };
              tags.push(newTag);
            }       
          });
        }
      });

      tx.executeSql('CREATE TABLE IF NOT EXISTS tasksTable(id INTEGER PRIMARY KEY, text, date, time, completed, price, groupColor, tags)');
      tx.executeSql('SELECT * FROM tasksTable WHERE date = ?', [today], function(tx, response){
        if(response.rows.length !== 0){
          for (var i = 0; i < response.rows.length; i++) {
            var row = response.rows.item(i);
            var dateToShow = moment(row.date).format('DD.MM.YYYY');
            var tagsToWork = row.tags.split(',');
            var compl = numberToBool(row.completed);
            var taskObj = {
              id: row.id,
              text: row.text,
              date: dateToShow,
              time: row.time,
              completed: compl,
              price: row.price,
              groupColor: row.groupColor,
              tags: tagsToWork,
            }
            actualTasks.push(taskObj);
          }
        }
      });
      tx.executeSql('SELECT * FROM tasksTable WHERE date < ? AND completed = ?', [today, 0], function(tx, rs){
        if(rs.rows.length !== 0){
          for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            var dateToShow = moment(row.date).format('DD.MM.YYYY');
            var tagsToWork = row.tags.split(',');
            var compl = numberToBool(row.completed);
            var taskObj = {
              id: row.id,
              text: row.text,
              date: dateToShow,
              time: row.time,
              completed: compl,
              price: row.price,
              groupColor: row.groupColor,
              tags: tagsToWork,
            }
            expiredTasks.push(taskObj);
          }
        }
      });
      tx.executeSql('SELECT * FROM tasksTable WHERE date > ?', [today], function(tx, rs){
        if(rs.rows.length !== 0){
          for (var i = 0; i < rs.rows.length; i++) {
            var row = rs.rows.item(i);
            var dateToShow = moment(row.date).format('DD.MM.YYYY');
            var tagsToWork = row.tags.split(',');
            var compl = numberToBool(row.completed);
            var taskObj = {
              id: row.id,
              text: row.text,
              date: dateToShow,
              time: row.time,
              completed: compl,
              price: row.price,
              groupColor: row.groupColor,
              tags: tagsToWork,
            }
            futureTasks.push(taskObj);
          }
        }
        
      });
    });


    db.transaction(function(tx){
      for(let j = 0; j < futureTasks.length; j++){
        tx.executeSql('SELECT * FROM subTasksTable WHERE parentId = ?', [futureTasks[j].id], function(tx, rs){
          if(rs.rows.length !== 0){

            for(let i = 0; i < rs.rows.length; i++){
              let row = rs.rows.item(i);
              let compl = numberToBool(row.completed);
              let taskObj = {
                id: row.id,
                text: row.text,
                completed: compl,
                pid: row.parentId
              };
              subTasks.push(taskObj);              
            }
          }
        });
      }
      for(let j = 0; j < actualTasks.length; j++){
        tx.executeSql('SELECT * FROM subTasksTable WHERE parentId = ?', [actualTasks[j].id], function(tx, rs){
          if(rs.rows.length !== 0){
            for(let i = 0; i < rs.rows.length; i++){
              let row = rs.rows.item(i);
              let compl = numberToBool(row.completed);
              let taskObj = {
                id: row.id,
                text: row.text,
                completed: compl,
                pid: row.parentId
              };
              subTasks.push(taskObj);              
            }
          }
        });
      }
      for(let j = 0; j < expiredTasks.length; j++){
        tx.executeSql('SELECT * FROM subTasksTable WHERE parentId = ?', [expiredTasks[j].id], function(tx, rs){
          if(rs.rows.length !== 0){
            for(let i = 0; i < rs.rows.length; i++){
              let row = rs.rows.item(i);
              let compl = numberToBool(row.completed);
              let taskObj = {
                id: row.id,
                text: row.text,
                completed: compl,
                pid: row.parentId
              };
              subTasks.push(taskObj);              
            }
          }
          
        });
      }
      init();
    });

    
  }
  
}
function init() {
  new Vue({
    el: '#app',
    render: (h) => h(App),
    store,
    data: {
      db,
    },
    components: {
      app: App
    },
    mounted(){
      const self = this;
      
      self.$store.commit('pushTags', tags);
      self.$store.commit('pushStats', stats);
      self.$store.commit('pushActualTasks', actualTasks);
      self.$store.commit('pushExpiredTasks', expiredTasks);
      self.$store.commit('pushFutureTasks', futureTasks);
      self.$store.commit('pushSubTasks', subTasks);
      self.$store.commit('setDarkTheme', settings.darkTheme);
      self.$store.commit('setCurrentLang', settings.lang);

    }
  });
}


