<template>
    <!-- eslint-disable -->
   <CButton color="danger" type="button" class="px-4" @click="deleteAc()">
      <div v-if="isSendingForm" class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
      </div> 
      {{$t('Delete')}}
   </CButton>
  </template>
  
  <script>
  /* eslint-disable */ 
  import axios from 'axios'
  export default{
    name: "DeleteButton",
    props: ['url'],
    data(){
        return {
            isSendingForm:false,
            redirectTo,
        }
    },
    methods:{
        deleteAc(){
            if (confirm(this.$t('removeConfirmation'))) {
                // Save it!
                this.isSendingForm = true;
                axios
                .post(
                this.$store.state.backendUrl + this.url,
                {_method:'delete', all:'true'},
                { headers: { 
                    'Authorization': 'Bearer ' + this.$store.state.token, 
                    'Content-Type': 'multipart/form-data',
                } 
                },
                )
                .then((response) => {
                alert(this.$t('removedSuccess'));
                this.$router.push({
                    name: this.redirectTo,
                })
                this.isSendingForm = false
                })
                .catch((error) => {
                this.errorMgs = error.response.data.message
                alert(this.errorMgs);
                this.isSendingForm = false
                })
            }
        }
    }
  }
  
  </script>