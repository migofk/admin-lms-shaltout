import { createStore } from 'vuex'
/* eslint-disable */
export default createStore({
  state: {
    // I did
    token:'',
    name:'',
    backendUrl: process.env.VUE_APP_BACKEND_URL,
    
    //theme settings
    sidebarVisible: '',
    sidebarUnfoldable: false,
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    /***** */
    initialiseStore(state) {
         if(localStorage.getItem('token')){
          state.token = localStorage.getItem('token');
         }
         if(localStorage.getItem('name')){
          state.name = localStorage.getItem('name');
         }
         if(localStorage.getItem('image')){
          state.image = localStorage.getItem('image');
         }
         if(state.token == ""){
           return false;
         }
         return true;
    },
    saveLogin(state,LoginData){
      state.token =LoginData.token;
      state.name =LoginData.name;
      state.image =LoginData.image;

      localStorage.setItem('token', LoginData.token);
      localStorage.setItem('name', LoginData.name);
      localStorage.setItem('image', LoginData.image);
    
    },

    Logout(state){
      state.token ="";
      state.name ="";
      state.image ="";
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('image');
    }
  },
  actions: {},
  modules: {},
})
