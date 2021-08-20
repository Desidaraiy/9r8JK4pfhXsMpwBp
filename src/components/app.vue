<template>
  <f7-app :params="f7params" :theme-dark="darkTheme">
  <f7-views tabs class="safe-areas">
    <f7-toolbar id="tool-tab" tabbar labels bottom>
      <f7-link tab-link="#view-home" tab-link-active>
        <f7-icon ios="f7:house_fill" md="material:home">
          <f7-badge color="red" v-show="taskCount !== 0">{{taskCount}}</f7-badge>
        </f7-icon>
        <span class="tabbar-label">{{strings.uiMainInterfaceHome}}</span>
      </f7-link>
      <f7-link tab-link="#view-catalog" id="productivity" icon-ios="f7:chart_bar_fill" icon-md="material:equalizer" :text="strings.uiMainInterfaceCharts"></f7-link>
      <f7-link tab-link="#view-settings" id="settings" icon-ios="f7:gear" icon-md="material:settings" :text="strings.uiHomePageSettings"></f7-link>
    </f7-toolbar>
    <f7-view id="view-home" main tab tab-active url="/"></f7-view>
    <f7-view id="view-catalog" name="catalog" tab url="/catalog/"></f7-view>
    <f7-view id="view-settings" name="catalog" tab url="/settings/"></f7-view>
  </f7-views>
  </f7-app>
</template>
<script>
  import { Device }  from 'framework7/framework7-lite.esm.bundle.js';
  import cordovaApp from '../js/cordova-app.js';
  import routes from '../js/routes.js';

  export default {
    data() {
      return {
        // Framework7 Parameters
        
        f7params: {
          id: 'com.pushmobile.statist', // App bundle ID
          // name: this.appTitle, // App name
          theme: 'auto', // Automatic theme detection

          // App root data
          data: function () {
            return {
              
            };
          },
          
          // App routes
          routes: routes,

          // Register service worker
          serviceWorker: Device.cordova ? {} : {
            path: '/service-worker.js',
          },
          // Input settings
          input: {
            scrollIntoViewOnFocus: Device.cordova && !Device.electron,
            scrollIntoViewCentered: Device.cordova && !Device.electron,
          },
          // Cordova Statusbar settings
          statusbar: {
            iosOverlaysWebView: true,
            androidOverlaysWebView: false,
          },
        },
        // Login screen data
      }
    },
    methods: {

    },
    computed:{
      taskCount: function(){
        return this.$store.getters.getCountTasks;
      },
      darkTheme: {
        get: function(){
          return this.darkTheme = this.$store.getters['getDarkTheme'];
        },
        set: function(newValue){
          this.$store.commit('setDarkTheme', newValue);
        }
      },
      strings: function(){
        return this.$store.getters.getStrings;
      },
    },
    watch: {
      taskCount: function(newCount, oldCount){
        return this.$store.getters.getCountTasks;
      },
      strings: function(newCurrent, oldCurrent){
        return this.$store.getters.getStrings;
      },
    },
    mounted() {
      this.$f7ready((f7) => {
        // Init cordova APIs (see cordova-app.js)
        if (Device.cordova) {
          cordovaApp.init(f7);
        }
        // Call F7 APIs here
      });
    }
  }
</script>