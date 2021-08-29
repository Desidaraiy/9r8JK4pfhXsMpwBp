import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
// import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentTask: {tags:[]},
    stats: [],
    currentStats: {},
    darkTheme: false,
    currentLang: "ru",
    strings: [
      {
        lang: "ru",
        appTitle: "Планер",

        settingsMyStats: 'Мои статистики',
        settingsMyStatsAdd: 'Добавить новую статистику',
        settingsMyStatsDelete: 'Удалить статистику?',

        settingsStatsEmpty: 'Добавьте статистику',
        settingsNavbar: 'Настройки',
        settingsBackLink: 'Назад',
        settingsDoneBtn: 'Готово',
        settingsGeneral: 'Основное',
        settingsDarkTheme: 'Темная тема',
        settingsUiLang: 'Язык интерфейса',
        settingsTags: 'Теги',
        settingsDeleteChip: 'Вы хотите удалить тег?',
        settingsAddChip: 'Введите название нового тега.',
        uiTasklistExpired: 'Просрочено',
        uiTasklistActual: 'Сегодня',
        uiTasklistPlanned: 'Запланировано',
        uiTaskListAddTask: 'Запланируйте что-нибудь',
        uiTaskListSubTasks: 'Подзадачи',
        uiTaskListAddSubTask: 'Добавьте подзадачу',
        uiTaskListDelete: 'Удалить',
        uiTaskListMove: 'Перенести',
        uiTaskListMoveTo: 'Перенести на...',
        uiTaskListMoveToToday: 'Сегодня',
        uiTaskListMoveToTomorrow: 'Завтра',
        uiTaskListMoveToDayAfter: 'Послезавтра',
        uiTaskListMoveToDate: 'Выбрать дату',
        uiTaskListWithoutTag: '#Без_тега',
        uiTaskListPoints: 'баллов',
        uiTaskListNewSubTask: 'Новая подзадача...',
        uiTaskListCancel: 'Отмена',
        uiTaskListSubsNotCompleted: 'Подзадачи не выполнены',

        uiHomePageTitle: 'Сегодня',
        uiHomePageScorePoints: 'баллов',
        uiHomePageSettings: 'Настройки',

        uiHomePageMsgBarPlaceHolder: 'Новая задача...',
        uiHomePageMsgBarClose: 'Закрыть',
        uiHomePageMsgBarAdd: 'Добавить',

        uiChartPageTitle: 'Статистика',
        uiChartPageNotEnoughData: 'Недостаточно данных',
        uiChartPageShowStats: 'Статистика',
        uiChartPageShowPeriod: 'Период',
        uiChartPageStatsProductivity: 'Продуктивность',
        uiChartPageStatsPeriodWeek: 'Неделя',
        uiChartPageStatsPeriodMonth: 'Месяц',
        uiChartPageStatsPeriodSelect: 'Выбрать период',
        uiChartPageAddStatData: 'Добавить данные',
        uiChartPageAddStatDataValue: 'Значение',
        uiChartPageAddStatDataPlan: 'План',

        uiMainInterfaceHome: 'Сегодня',
        uiMainInterfaceCharts: 'Статистика',

      },
      {
        lang: "en",
        appTitle: "Planner",
        settingsMyStats: 'My stats',
        settingsStatsEmpty: 'Add a new stats',
        settingsMyStatsAdd: 'Name new stats',
        settingsMyStatsDelete: 'Do you want to delete this stats?',
        settingsNavbar: 'Settings',
        settingsBackLink: 'Back',
        settingsDoneBtn: 'Done',
        settingsGeneral: 'General',
        settingsDarkTheme: 'Dark theme',
        settingsUiLang: 'Language',
        settingsTags: 'Tags',
        uiTasklistExpired: 'Overdue',
        uiTasklistActual: 'Today',
        uiTasklistPlanned: 'Planned',
        uiTaskListSubTasks: 'Subtasks',
        uiTaskListAddSubTask: 'Add new subtask',
        uiTaskListDelete: 'Delete',
        uiTaskListMove: 'Reschedule',
        uiTaskListMoveTo: 'Reschedule to...',
        uiTaskListMoveToToday: 'Today',
        uiTaskListMoveToTomorrow: 'Tomorrow',
        uiTaskListMoveToDayAfter: 'Two days from now',
        uiTaskListMoveToDate: 'Select a date',
        uiTaskListWithoutTag: '#No_tag',
        uiTaskListPoints: 'points',
        uiTaskListNewSubTask: 'New subtask...',
        uiTaskListCancel: 'Cancel',
        uiTaskListAddTask: 'Plan anything',
        uiTaskListSubsNotCompleted: 'Subtasks are not completed.',

        uiHomePageTitle: 'Today',
        uiHomePageScorePoints: 'points',
        uiHomePageSettings: 'Settings',

        uiHomePageMsgBarPlaceHolder: 'New task...',
        uiHomePageMsgBarClose: 'Close',
        uiHomePageMsgBarAdd: 'Add',

        uiChartPageTitle: 'Stats',
        uiChartPageNotEnoughData: 'No enough data',
        uiChartPageShowStats: 'Show stats',
        uiChartPageShowPeriod: 'For the period',
        uiChartPageStatsProductivity: 'Productivity',
        uiChartPageStatsPeriodWeek: '7 days',
        uiChartPageStatsPeriodMonth: '30 days',
        uiChartPageAddStatData: 'Add statistics data',
        uiChartPageStatsPeriodSelect: 'Select range of dates',
        uiChartPageAddStatDataValue: 'Value',
        uiChartPageAddStatDataPlan: 'Planned',
        uiMainInterfaceHome: 'Today',
        uiMainInterfaceCharts: 'Stats',
        settingsDeleteChip: 'Do you want to delete this tag?',
        settingsAddChip: 'Name your new tag',
      }
    ],
    user: {
      name: 'Иван',
    },
    allTasks: {
      tasks: [],
      expiredTasks: [],
      futureTasks: [],
    },
    subTasks: [],
    archiveTasks: [],
    tags: [
    ],
  },
  getters: {
    getCurrentTask: state => {
      return state.currentTask;
    },
    getStats: state => {
      return state.stats;
    },
    getDarkTheme: state => {
      return state.darkTheme;
    },
    getCurrentLang: state => {
      return state.currentLang;
    },
    getCurrentStats: state => {
      return state.currentStats;
    },
    getStrings: (state) => {
      return state.strings.find(string => string.lang === state.currentLang);
    },
    getAppTitle: (state) => {
      let index = state.strings.findIndex(string => string.lang === state.currentLang);
      return state.strings[index].appTitle;
    },
    getUserName: state => {
      return state.user.name;
    },
    getAllTasks: state => {
      return state.allTasks.tasks;
    },
    getAllTags: state => {
      return state.tags
    },
    getExpiredTasks: state => {
      return state.allTasks.expiredTasks;
    },
    getFutureTasks: state => {
      return state.allTasks.futureTasks;
    },
    getTaskList: (state) => (list) => {
      let toShow;
      switch(list){
        case 'expired':
          toShow = state.allTasks.expiredTasks;
          break;
        case 'actual':
          toShow = state.allTasks.tasks;
          break;
        case 'future':
          toShow = state.allTasks.futureTasks;
          break;
      }
      return toShow;
    },
    getSubTasks: (state) => (pid) => {
      return searchSubTasks(state, pid);
    },
    getAllSubTasks: (state) => {
      return state.subTasks;
    },
    getCompletedSubsCount: (state) => (pid) => {
      let cc = 0;
      state.subTasks.forEach((el) => {
        if(el.pid === pid){
          if(el.completed === true){
            cc += 1;
          }
        }
      });
      return cc;
    },
    getSubsCount: (state) => (pid) => {
      let cnc = 0;
      state.subTasks.forEach((el) => {
        if(el.pid === pid){
          cnc += 1;
        }
      });
      return cnc;
    },
    getCountTasks: state => {
      let countA = 0, countB = 0;
      state.allTasks.tasks.forEach((el) => {
        if(el.completed === false){
          countA++;
        }
      });
      state.allTasks.expiredTasks.forEach((el) => {
        if(el.completed === false){
          countB++;
        }
      });
      let countAll = countA+countB;
      return countAll;
    }
  },
  mutations: {
    setCurrentTask: (state, payload) => {
      state.currentTask = payload;
    },
    setCurrentStats: (state, payload) => {
      let id = payload;
      let key = state.stats.find(stats => stats.id === id);
      state.currentStats = key;
    },
    deleteTag: (state, payload) => {
      let index = state.tags.findIndex(tag => tag.id === payload);
      state.tags.splice(index, 1);
    },
    addTag: (state, payload) => {
      state.tags.push(payload);
    },
    addStats: (state, payload) => {
      state.stats.push(payload);
    },
    deleteStats: (state, payload) => {
      let index = state.stats.indexOf(payload);
      state.stats.splice(index, 1);
    },
    setCurrentLang: (state, payload) => {
      state.currentLang = payload;
    },
    setUserName: (state, payload) => {
      state.user.name = payload;
    },
    setDarkTheme: (state, payload) => {
      state.darkTheme = payload;
    },
    pushTags: (state, payload) => {
      state.tags = payload;
    },
    completeTask: (state, payload) => {
      let key = searchInTasks(state, payload, 'key');
      let type = searchInTasks(state, payload, 'arrname');
      if(type == 'expiredTasks'){
        state.allTasks.expiredTasks.splice(key, 1);
        state.allTasks.tasks.push(key);
        state.allTasks.tasks.sort((a, b) => a.tags.includes('#Важно') ? -1 : 1);
      }
      key.completed == true ? key.completed = false : key.completed = true;
    },
    removeTask: (state, payload) => {
      let index = searchInTasks(state, payload, 'index');
      let arr = searchInTasks(state, payload, 'array');
      arr.splice(index, 1);
    },
    removeSubTask: (state, payload) => {
      let index = state.subTasks.findIndex(x => x.id === payload);
      state.subTasks.splice(index, 1);
    },
    repriceTask: (state, payload) => {
      let id = payload.id
      let key = searchInTasks(state, id, 'key');
      key.price = payload.price;
    },
    retextTask: (state, payload) => {
      let id = payload[0]
      let key = searchInTasks(state, id, 'key');
      let newtext = payload[1].trim();
      key.text = newtext;
    },
    reTagTask: (state, payload) => {
      let id = payload[1];
      let tags = payload[0];
      let key = searchInTasks(state, id, 'key');
      let array = searchInTasks(state, id, 'array');
      key.tags = tags;
      array.sort((a, b) => a.tags.includes('#Важно') ? -1 : 1);
    },
    reColourTask: (state, payload) => {
      let id = payload[1];
      let newColor = payload[0];
      let key = searchInTasks(state, id, 'key');
      key.groupColor = newColor;
    },
    removeFutureTask: (state, payload) => {
      let index = state.allTasks.futureTasks.map(e => e.id).indexOf(payload);
      state.allTasks.futureTasks.splice(index, 1);
    },
    removeAllExpired: (state) =>{
      state.allTasks.expiredTasks.splice(0, state.allTasks.expiredTasks.length);
    },
    pushFutureTask: (state, payload) => {
      state.allTasks.futureTasks.push(payload);
      state.allTasks.futureTasks.sort((a, b) => moment(a.date, 'DD.MM.YYYY').isBefore(moment(b.date, 'DD.MM.YYYY')) ? -1 : 1);
    },
    pushNewTask: (state, payload) => {
      state.allTasks.tasks.push(payload);
      state.allTasks.tasks.sort((a, b) => a.tags.includes('#Важно') ? -1 : 1);
    },
    pushActualTasks: (state, payload) => {
      state.allTasks.tasks = payload;
      state.allTasks.tasks.sort((a, b) => a.tags.includes('#Важно') ? -1 : 1);
    },
    pushExpiredTasks: (state, payload) => {
      state.allTasks.expiredTasks = payload;
    },
    pushFutureTasks: (state, payload) => {
      state.allTasks.futureTasks = payload;
      state.allTasks.futureTasks.sort((a, b) => moment(a.date, 'DD.MM.YYYY').isBefore(moment(b.date, 'DD.MM.YYYY')) ? -1 : 1);
    },
    pushSubTasks: (state, payload) => {
      state.subTasks = payload;
    },
    pushStats: (state, payload) => {
      state.stats = payload;
    },
    pushSubTask: (state, payload) => {
      state.subTasks.push(payload);
      let id = payload.pid;
      let key = searchInTasks(state, id, 'key');
      key.subsCount = key.subsCount + 1;
      console.log(key.subsCount);
    },
    completeSubTask(state, payload){
      let parentTask;
      state.subTasks.filter(task => {
        if (task.id === payload){
          parentTask = task.pid;
          task.completed == true ? task.completed = false : task.completed = true;
        }
      });
      let key = searchInTasks(state, parentTask, 'key');
      // key.subsCount = key.subsCount - 1;
      // console.log(key.subsCount);
    }
  },
})

function searchInTasks(state, payload, searchfor){
  let obj = state.allTasks;
  let index;
  let ret = null;
  for (const key of Object.keys(obj)) {
    let found = obj[key].find((itm) => itm['id'] === payload);
    if (found) {
      switch(searchfor){
        case 'array':
          ret = obj[key];
        break;
        case 'arrname':
          ret = key;
        break;
        case 'index':
          ret = obj[key].findIndex(x => x.id === payload);
        break;
        case 'key':
          index = obj[key].findIndex(x => x.id === payload);
          ret = obj[key][index];
        break;
      }
      break;
    }
  }
  return ret;
}

function searchSubTasks(state, id){
	let found = [];
  state.subTasks.filter(obj => {
    if(obj.pid === id){
      found.push(obj);
    }
  })
  return found;
}