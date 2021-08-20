<template>
    <div>
        <f7-actions :opened="actionsOpened" @actions:closed="actionsOpened = false" >
            <f7-actions-group>
                <f7-actions-label>{{strings.uiTaskListMoveTo}}</f7-actions-label>
                <f7-actions-button v-show="list == 'expired'" @click="moveTask(1)" color="green">{{strings.uiTaskListMoveToToday}}</f7-actions-button>
                <f7-actions-button @click="moveTask(2)">{{strings.uiTaskListMoveToTomorrow}}</f7-actions-button>
                <f7-actions-button @click="moveTask(3)">{{strings.uiTaskListMoveToDayAfter}}</f7-actions-button>
                <f7-actions-button @click="moveTask(4)">{{strings.uiTaskListMoveToDate}}</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button color="red">{{strings.uiTaskListCancel}}</f7-actions-button>
            </f7-actions-group>
        </f7-actions>

        <f7-block-header v-show="tasks.length !== 0" class="tasks-list-header no-margin">
            <f7-row>
                <f7-col>
                {{listName}}  <f7-badge :color="list == 'expired' ? 'red' : 'blue'">{{tasks.length}}</f7-badge>
                </f7-col>
                <!-- <f7-col v-if="list == 'expired'">
                    <f7-button small color="red" @click="movingExpired = true; actionsOpened = true;">перенести</f7-button>
                </f7-col> -->
                <f7-col class="text-align-right" v-show="list !== 'actual'" @click="showing ? showing = false : showing = true">
                    <f7-icon :f7="showing ? 'eye' : 'eye_slash'" class="icon-in-header"></f7-icon>
                </f7-col>
            </f7-row>
        </f7-block-header>

        <f7-list class="no-margin tasks-list" v-if="list == 'actual' && tasks.length == 0">
            <f7-list-item :title="strings.uiTaskListAddTask"></f7-list-item>
        </f7-list>
        <f7-list media-list v-else v-show="showing" class="tasks-list">
            <f7-list-item
                swipeout
                v-for="item in tasks"
                :key="item.id"
                :id="'task-'+item.id"
                :class="'task-coloured-'+item.groupColor"
                >
                <f7-checkbox slot="media" :disabled="list == 'future'" :checked="item.completed" @change="completeTask(item, $event)"></f7-checkbox>
                <div v-if="item.tags.length !== 0" slot="header">
                    <span v-for="(tag, index) in item.tags" :key="`tag-${index}`">{{tag}}</span>
                </div>
                <div slot="footer">
                    <f7-row>
                        <f7-col :class="list == 'expired' ? 'task-body-expired-task-date' : list !== 'actual' ? 'task-body-future-task-date' : '' ">{{item.date}}</f7-col>
                        <f7-col class="text-align-center" v-show="item.subsCount !== false && item.subsCount !== 0">
                            <span class="demi-light-span">{{strings.uiTaskListSubTasks}}: {{item.subsCount}}</span>
                        </f7-col>
                        <f7-col class="text-align-right">{{item.price}} {{strings.uiTaskListPoints}}</f7-col>
                    </f7-row>
                </div>
                <div slot="inner" class="task-search" 
                    v-line-clamp:20="3" 
                    @click="setCurrentTask(item); currentColor = item.groupColor; sheetOpened = true" 
                    :class="item.completed ? 'tasks-list-task-completed' : ''"
                    >{{item.text}}</div>
                <f7-swipeout-actions right>
                <f7-swipeout-button class="color-theme-red" delete @click="removeTask(item)">{{strings.uiTaskListDelete}}</f7-swipeout-button>
                </f7-swipeout-actions>
                <f7-swipeout-actions left>
                <f7-swipeout-button class="color-theme-green" overswipe 
                @click="setCurrentTask(item); actionsOpened = true">{{strings.uiTaskListMove}}</f7-swipeout-button>
                </f7-swipeout-actions>
            </f7-list-item>
        </f7-list>

        <f7-sheet class="demo-sheet" 
            :opened="sheetOpened" 
            @sheet:closed="sheetOpened = false; priceStepperShow = false"
            @sheet:open="getSubTasks(currentTask.id)"
            backdrop
            close-by-backdrop-click
            >
            <f7-toolbar :class="'toolbar-'+currentTask.groupColor" >
                <f7-link popover-open="#pop-flagshit"><f7-icon f7="flag"></f7-icon></f7-link>
                <f7-link @click="moveTask(4)">{{currentTask.date}}</f7-link>
                <f7-link  v-if="priceStepperShow">
                <f7-stepper
                    small
                    class="color-theme-white"
                    :min="10" :max="200" :step="10" 
                    :value="currentTask.price" 
                    @input="currentTask.price = parseInt($event.target.value); repriceTask()"></f7-stepper>
                </f7-link >
                <f7-link v-else @click="priceStepperShow = true">{{currentTask.price}} {{strings.uiTaskListPoints}}</f7-link>
                <f7-link sheet-close><f7-icon f7="plus" class="cross-close"></f7-icon></f7-link>
            </f7-toolbar>
            <f7-block class="text-in-sheet">
                <span v-if="currentTask.tags.length !== 0 && currentTask.tags[0] !== ''">{{currentTask.tags.join('')}}<br/></span>
                <span v-else class="light-span">{{strings.uiTaskListWithoutTag}}<br/></span>
                <f7-text-editor
                class="text-in-sheet-div"
                mode="popover"
                :buttons="[]"
                :value="currentTask.text"
                @texteditor:change="(val) => retextTask(val)"
                />
            </f7-block>
            <f7-block-title class="margin-top">
                <f7-row>
                    <f7-col>{{strings.uiTaskListSubTasks}}</f7-col>
                    <f7-col class="text-align-right" @click="addSubTask(currentTask.id)"><f7-icon f7="plus"></f7-icon></f7-col>
                </f7-row>
            </f7-block-title>
            <f7-list class="no-margin" v-if="subsFound == false">
                <f7-list-item>{{strings.uiTaskListAddSubTask}}</f7-list-item>
            </f7-list>
            <f7-list media class="no-margin sheet-subtasks-list overflow-scroll" v-else>
                <f7-list-item v-for="item in subtasksId" :key="item.id">
                    <f7-checkbox slot="media"
                    @change="completeSubTask(item, $event)"
                    :checked="item.completed"></f7-checkbox>
                    <div slot="inner" :class="item.completed ? 'tasks-list-task-completed' : ''">{{item.text}}</div>
                </f7-list-item>
            </f7-list>
        </f7-sheet>

    </div>
</template>
<script>
import { f7, f7ready } from 'framework7-vue';
import moment from 'moment';
import Vue       from 'vue'
import lineClamp from 'vue-line-clamp'

Vue.use(lineClamp,{
    importCss: false
});

export default{
    name: 'tasklist',
    components: {

    },
    props: {
        list: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            required: false
        }
    },
    computed: {
        tasks: function(){
            return this.$store.getters.getTaskList(this.list);
        },
        listName: function(){
            switch(this.list){
                case 'actual':
                    return this.strings.uiTasklistActual;
                case 'future':
                    return this.strings.uiTasklistPlanned;
                case 'expired':
                    return this.strings.uiTasklistExpired;
            }
        },
        strings: function(){
            return this.$store.getters.getStrings;
        },
    },
    watch: {
        tasks: function(newTasks, oldTasks){
            return this.$store.getters.getTaskList(this.list);
        },
        strings: function(newCurrent, oldCurrent){
            return this.$store.getters.getStrings;
        }
    },
    data(){
        const db = this.$root.db;
        const tags = this.$store.getters.getAllTags;
        return {
            db,
            showing: this.show,
            sheetOpened: false,
            actionsOpened: false,
            priceStepperShow: false,
            currentTask: {tags:[]},
            ncld: 0,
            dateToMove: 0,
            tags,
            subtasksId: [],
            subsFound: false,
            movingExpired: false,
        }
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            const self = this;
            const app = self.$f7;
            const $ = self.$$;
            let today = new Date();
            let yesterday = new Date(today.setDate(today.getDate() - 1))
            $('.cross-close').transform('rotate(45deg)');
            self.ncld = app.calendar.create({
                openIn: 'customModal',
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
                        self.dateToMove = `${day}.${month}.${year}`;
                        self.moveTask(5);
                        self.ncld.close();
                    }
                }
            });            
        },
        getSubTasks(id){
            const self = this;
            self.subtasksId = self.$store.getters.getSubTasks(id);
            if(self.subtasksId.length !== 0){
                self.subsFound = true;
            }else{
                self.subsFound = false;
            }
        },
        addSubTask(id){
            const self = this;
            const app = self.$f7;
            const $ = self.$$;
            let text = '';
            app.dialog.prompt(self.strings.uiTaskListNewSubTask, self.strings.appTitle, function(resp){
                if(resp == ''){
                    return;
                }
                let newSubTask = {
                    id: false,
                    pid: id,
                    text: text,
                    completed: false
                };
                newSubTask.text = resp;
                if(self.db !== null){
                    self.db.transaction(function(tx){
                        tx.executeSql('INSERT INTO subTasksTable(text, parentId, completed) VALUES(?,?,?)', [resp, id, 0], function(tx, response){
                            newSubTask.id = response.insertId;
                        });
                    });
                }
                self.$store.commit('pushSubTask', newSubTask);
                self.getSubTasks(id);
            });
        },
        completeSubTask(item, e){
            const self = this;
            self.$store.commit('completeSubTask', item.id);
            let compl = e.target.checked ? 1 : 0;
            let query = 'UPDATE subTasksTable SET completed = ? WHERE id = ?';
            let arr = [compl, item.id];
            self.writeChanges(query, arr);
        },
        setCurrentTask(item){
            this.currentTask = item;
            this.$store.commit('setCurrentTask', item);
        },
        countScore(){
            this.$emit('taskchanged');
        },
        completeTask(item, e){
            const self = this;
            self.$store.commit('completeTask', item.id);
            this.countScore();
            let compl = e.target.checked ? 1 : 0;
            let today = moment().format('YYYY-MM-DD');
            let query, arr;
            if(self.list !== 'expired'){
                query = 'UPDATE tasksTable SET completed = ? WHERE id = ?';
                arr = [compl, item.id];
            }else{
                query = 'UPDATE tasksTable SET completed = ?, date = ? WHERE id = ?';
                arr = [compl, today, item.id];
            }
            self.writeChanges(query, arr);
        },
        removeTask(item){
            const self = this;
            self.$store.commit('removeTask', item.id);
            self.writeChanges('DELETE FROM tasksTable WHERE id = ?', [item.id]);
            self.countScore();
        },
        repriceTask(){
            this.$store.commit('repriceTask', this.currentTask);
            let query = 'UPDATE tasksTable SET text = ?, price = ? WHERE id = ?';
            let arr = [this.currentTask.text, this.currentTask.price, this.currentTask.id];
            this.writeChanges(query, arr);
        },
        retextTask(val){
            let payload = [this.currentTask.id, val];
            this.$store.commit('retextTask', payload);
            let query = 'UPDATE tasksTable SET text = ?, price = ? WHERE id = ?';
            let arr = [val, this.currentTask.price, this.currentTask.id];
            this.writeChanges(query, arr);
        },
        moveTask(time){
            const self = this; 
            let newDateToShow;
            let addDays = false;
            var exparr = [];
            switch(time){
                case 1:
                    addDays = 0;
                break;
                case 2:
                    addDays = 1; 
                break;
                case 3: 
                    addDays = 2
                break;
                case 4:
                    self.ncld.open();
                break;
                case 5:
                    let todaysfixing = moment().isAfter(moment(self.dateToMove, 'DD.MM.YYYY')) ? 0 : 1;
                    addDays = moment(self.dateToMove, 'DD.MM.YYYY').diff(moment(), 'days')+todaysfixing;
                break;
            }
            if(addDays !== false){
                if(self.movingExpired === false){
                    self.$store.commit('removeTask', self.currentTask.id); 
                    newDateToShow = moment().add(addDays, 'days').format('DD.MM.YYYY');
                    self.currentTask.date = newDateToShow;
                    self.$store.commit((addDays > 0 ? 'pushFutureTask' : 'pushNewTask'), self.currentTask);
                    let query = 'UPDATE tasksTable SET date = ? WHERE id = ?';
                    let arr = [moment(newDateToShow, 'DD.MM.YYYY').format('YYYY-MM-DD'), self.currentTask.id];
                    self.writeChanges(query, arr);
                }else{
                    let expiredToMove = self.$store.getters.getTaskList('expired');
                    exparr = expiredToMove;
                    self.$store.commit('removeAllExpired');
                    self.movingExpired = false;

                }

            }
        },
        moveAllExpired(){
            const self = this;

        },
        writeChanges(query, arr){
            const self = this;
            if(self.db !== null){
                self.db.transaction(function(tx){
                    tx.executeSql(query, arr);
                });
            }
        },
        selectTag(title){
            const self = this;
            const app = self.$f7;
            const $ = self.$$;
            let tags = [];
            $('input[name="checktags"]:checked').each(function() {
            tags.push($(this).val());
            });
            self.selectedTagsLength = tags.length; 
        },
    }
}
</script>

