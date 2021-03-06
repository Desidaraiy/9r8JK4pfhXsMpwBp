<template>
    <f7-page name="settings">
        <f7-navbar :title="strings.settingsNavbar"></f7-navbar>
        <f7-block-title>{{strings.settingsGeneral}}</f7-block-title>
        <f7-list media>
            <f7-list-item>
                <div slot="media"><f7-icon f7="sun_max_fill"></f7-icon></div>
                <span>{{strings.settingsDarkTheme}}</span>
                <f7-toggle :checked="darkTheme" @change="toggleDarkTheme($event.target.checked)"></f7-toggle>
            </f7-list-item>
            <f7-list-item :title="strings.settingsUiLang" smart-select 
            :smart-select-params="{openIn: 'sheet', sheetCloseLinkText: strings.settingsDoneBtn, closeOnSelect: true}">
                <div slot="media"><f7-icon f7="globe"></f7-icon></div>
                <select name="language" :value="lang" @change="lang = $event.target.value; changeLang($event)">
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                </select>
            </f7-list-item>
        </f7-list>
        <f7-block-title>
            <f7-row>
                <f7-col>{{strings.settingsTags}}</f7-col>
                <f7-col class="text-align-right" @click="addChip()"><f7-link><f7-icon f7="plus"></f7-icon></f7-link></f7-col>
            </f7-row>
        </f7-block-title>
        <f7-block strong class="no-margin">
            <f7-chip v-for="tag in tags" 
            :key="tag.id" 
            media-bg-color="primary"
            @click="selectedTag = tag; actionsOpened = true">
                {{tag.title}}
            <span slot="media">{{tag.priority > 0 ? tag.priority : ''}}</span>
            <f7-icon v-if="tag.priority == 0" f7="tag_fill" slot="media"></f7-icon>
            </f7-chip>
        </f7-block>
        <f7-block-title>
            <f7-row>
                <f7-col>{{strings.settingsMyStats}}</f7-col>
                <f7-col class="text-align-right"><f7-link href="/stat_settings/"><f7-icon f7="plus"></f7-icon></f7-link></f7-col>
            </f7-row>            
        </f7-block-title>
        <f7-list v-if="stats.length == 0">
            <f7-list-item>{{strings.settingsStatsEmpty}}</f7-list-item>
        </f7-list>
        <f7-list v-else strong class="no-margin">
            <f7-list-item v-for="stat in stats" :key="stat.id" @click="setCurrentStats(stat.id)">
                <span>{{stat.name}}</span>
            <f7-link @click="deleteStats(stat)"><f7-icon f7="xmark"></f7-icon></f7-link>
            </f7-list-item>
        </f7-list>
        <f7-actions :opened="actionsOpened" @actions:closed="actionsOpened = false" >
            <f7-actions-group>
                <f7-actions-label>
                    {{selectedTag.title}}
                </f7-actions-label>
                <f7-actions-label>
                    Приоритет:&nbsp;&nbsp;
                    <f7-stepper
                        small
                        :value="selectedTag.priority"
                        :min="0" :max="5"
                        @input="selectedTag.priority = parseInt($event.target.value); setPriority(selectedTag)"                        
                    ></f7-stepper>
                </f7-actions-label>
                <f7-actions-label>1 - наиболее важный, 5 - наименее важный</f7-actions-label>
                <f7-actions-button @click="deleteChip(selectedTag.id)">{{strings.uiTaskListDelete}}</f7-actions-button>
                <f7-actions-button @click="renameChip(selectedTag)">{{strings.settingsRenameChip}}</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button color="red">{{strings.uiTaskListCancel}}</f7-actions-button>
            </f7-actions-group>
        </f7-actions>
    </f7-page>
</template>

<script>
import moment from 'moment';
export default { 
    name: "settings",
    components: {

    },
    data(){
        const db = this.$root.db;
        const lang = this.$store.getters.getCurrentLang;
        const darkTheme = this.$store.getters.getDarkTheme;
        const tags = this.$store.getters.getAllTags;
        const stats = this.$store.getters.getStats;
        return{
            db,
            lang,
            darkTheme,
            tags,
            stats,
            actionsOpened: false,
            selectedTag: '',
        }
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
    mounted(){
        this.init();
    },
    methods: {
        init(){
            const self = this;
            const app = self.$f7;
            const $ = self.$$;

        },
        setCurrentStats(id){
            const self = this;
            const app = self.$f7;
            const $ = self.$$;      
            self.$store.commit('setCurrentStats', id);
            self.$f7router.navigate('/stat_settings/'); 
        },
        toggleDarkTheme(checked){
            const self = this;
            self.darkTheme = checked;
            self.$store.commit('setDarkTheme', checked);
            let newvalue = checked == true ? 1 : 0;
            let q = 'UPDATE plannerSettings SET value = ? WHERE setting = ?';
            let a = [newvalue, 'darktheme'];

            self.writeChanges(q, a);
        },
        changeLang(e){
            this.$store.commit('setCurrentLang', e.target.value);
            let q = 'UPDATE plannerSettings SET value = ? WHERE setting = ?';
            let a = [e.target.value, 'lang'];
            this.writeChanges(q, a);            
            e.preventDefault();
        },
        deleteStats(title){
            const self = this;
            const app = self.$f7;
            app.dialog.confirm(self.strings.settingsMyStatsDelete, self.strings.appTitle, function(){
                self.db.transaction(function(tx){
                    tx.executeSql('DELETE FROM statsTable WHERE stat_name = ?', [title]);
                });
                self.$store.commit('deleteStats', title);
            });

        },
        addStats(){
            const self = this;
            const app = self.$f7;
            let today = moment().format('YYYY-MM-DD');
            app.dialog.prompt(self.strings.settingsMyStatsAdd, self.strings.appTitle, function(response){
                self.db.transaction(function(tx){
                    tx.executeSql('INSERT INTO statsTable(stat_name, date, value, plan) VALUES(?,?,?,?)', [newStatsTitle, today, 0, 0]);
                });
                self.$store.commit('addStats', response);
            });                   
        },
        addChip(){
            const self = this;
            const app = self.$f7;
            let newTagTitle = '';
            app.dialog.prompt(self.strings.settingsAddChip, self.strings.appTitle, function(response){
                if(response.startsWith('#') == true){
                    newTagTitle = response;
                }else{
                    newTagTitle = '#'+response;
                }
                let newTagObj = {
                    id: false,
                    title: newTagTitle
                };
                self.db.transaction(function(tx){
                    tx.executeSql('INSERT INTO tagsTable(title, priority) VALUES(?, ?)', [newTagTitle, 0], function(tx, rs){
                        newTagObj.id = response.insertId;
                        
                    });
                });
                self.$store.commit('addTag', newTagObj);
            });
        },
        renameChip(tag){
            const self = this;
            const app = self.$f7;
            app.dialog.prompt(self.strings.settingsRenameChip, self.strings.appTitle, function(response){
                let newTagTitle = '';
                if(response.startsWith('#') == true){
                    newTagTitle = response;
                }else{
                    newTagTitle = '#'+response;
                }
                let payload = [tag.id, response];
                self.$store.commit('renameTag', payload);
                let query = 'UPDATE tagsTable SET title = ? WHERE id = ?';
                let arr = [newTagTitle, tag.id];
                self.writeChanges(query, arr);       
            }, function(){
                console.log('canceled');
            }, tag.title);
        },
        deleteChip(id){
            const self = this;
            const app = self.$f7;
            app.dialog.confirm(self.strings.settingsDeleteChip, self.strings.appTitle, function(){
                self.$store.commit('deleteTag', id);
                let query = 'DELETE FROM tagsTable WHERE id = ?';
                let arr = [id];
                self.writeChanges(query, arr);
            });
        },
        setPriority(tag){
            const self = this;
            let arr = [tag.priority, tag.id];
            self.$store.commit('setTagPriotity', arr);
            let query = 'UPDATE tagsTable SET priority = ? WHERE id = ?';
            self.writeChanges(query, arr);
        },
        writeChanges(query, arr){
            const self = this;
            if(self.db !== null){
                self.db.transaction(function(tx){
                    tx.executeSql(query, arr);
                });
            }
        },
    }

}
</script>
