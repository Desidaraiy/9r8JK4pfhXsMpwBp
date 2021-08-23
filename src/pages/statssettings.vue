<template>
    <f7-page name="statSettings">
        <f7-navbar title="Редактировать статистику" back-link>
            <f7-nav-right>
                <f7-link href="/settings/" @click="saveStats()"><f7-icon f7="checkmark"></f7-icon></f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-list class="no-margin">
            <f7-list-input 
                label="Название статистики" 
                value=""
                clear-button
                placeholder="Напр. Тренировка"
                type="text"
                ></f7-list-input>
            <f7-list-item 
                title="Единица измерения" 
                smart-select 
                :smart-select-params="{openIn: 'sheet', sheetCloseLinkText: strings.settingsDoneBtn, closeOnSelect: true}">
                <select name="measurement_unit" id="m_unit" value="hours">
                    <option value="hours">Час</option>
                    <option value="dollar">$</option>
                    <option value="ruble">₽</option>
                </select>
            </f7-list-item>
            <f7-list-input
                label="План на день" 
                value=""
                clear-button
                placeholder="Напр. 200"
                type="number"
            ></f7-list-input>
        </f7-list>
    </f7-page>
</template>

<script>
  import { f7, f7ready } from 'framework7-vue';
  import moment from 'moment';
  import Vue       from 'vue';

  export default {
    name: "stat_settings",
    components: {

    },
    data(){

        return{

        }
    },
    watch: {
        strings: function(newCurrent, oldCurrent){
            return this.$store.getters.getStrings;
        },
        currentStats: function(newCurrent){
            return this.$store.getters.getCurrentStats;
        }
    },
    computed: {
        strings: function(){
            return this.$store.getters.getStrings;
        },
        currentStats: function(){
            return this.$store.getters.getCurrentStats;
        }
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){

        },
        saveStats(){
            console.log('saved');
        }
    }
  };
</script>
