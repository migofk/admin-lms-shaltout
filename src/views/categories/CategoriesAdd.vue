<template>
<!-- eslint-disable --> 
<CRow>
    <CCol :md="12">
        <div class="float-start mb-3">
            {{$t('Language')}} : {{this.form.lang_id}} 
        </div>
        <div v-if="ref_id" class="float-end mb-3">
            {{$t('translation')}} :
            <div class="btn-group" role="group" aria-label="Basic example">
              <CButton v-for="translation in translations" :key="translation.id+'5sdd'" @click="getTranslation(translation.id)" >{{translation.lang_id}}</CButton>
            </div>
        </div>
    </CCol>  
</CRow>
<CRow>
        <CCol :md="12">
            <CCard class="mb-4">
                <CCardHeader>
                    <strong> {{$t('Add')+ ' ' + $t('Category') }} </strong>
                </CCardHeader>
                <CCardBody> 
                    <CAlert color="danger" :visible="ShowError" dismissible @close="() => { ShowError = false }">
                    {{ errorMgs }}
                    </CAlert>
                    <CForm @submit="onSubmit">
                        <CFormInput
                            type="test"
                            :label="$t('Name')"
                            v-model.trim="form.name"
                            @input="setTouched('name')"
                            feedback="Please provide a valid name."
                            :invalid="v$.form.name.$error"
                        />
                        <CFormSelect
                            :label="$t('Status')"
                            v-model="form.status"
                            @input="setTouched('status')"
                            feedback="Please select a valid status."
                            :invalid="v$.form.status.$error"
                            :options="statuses">
                        </CFormSelect>
                        <SubmitButton
                            class="mt-3"
                            :title="$t('Save')"
                            :isSendingForm="isSendingForm"
                        />
                    </CForm> 
                </CCardBody>
            </CCard>
        </CCol>  
    </CRow>
</template>

<script>
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  name: 'ForgetPassword',
components: { SubmitButton },
  data() {
    return {
      form: {
        name: '',
        lang_id:this.$store.state.localLang,
        status:null,
        slug :null,
      },
      statuses: [   { label: '', value: '' },
                    { label: 'active', value: 'active' },
                    { label: 'deactivated', value: 'deactivated' },
                    { label: 'waiting review', value: 'waiting review' },
                ],
      ref_id: null,
      main_id:null,
      translations :[],
      errorMgs: '',
      ShowError: false,
      show: true,
      isSendingForm: false,
    }
  },
  validations() {
    return {
      form: {
        name: {
          required,
        },
        status: {
          required,
        },
      },
    }
  },
  methods: {
    getCreateData(){
    axios
    .get(this.$store.state.backendUrl+'/admin/category/create' , {
        params: {
          lang_id: this.form.lang_id
        },
        headers: {
        'Authorization': 'Bearer ' + this.$store.state.token,
        "Content-Type": "application/json",
        }
    })
    .then((response) => {
        console.log(response);
        if(response.Error){this.ShowError=true;}
        else{
          this.translations = response.data.translations;
          this.categories = response.data.categories.data;
          this.form.sort = response.data.sort;
          this.showForm=true;
        }
    })
    .catch( (error) => {
        console.log(error);
        this.ShowError=true;
        this.errorMgs = error;       
    });    
    } , 
    getTranslation(theId){
      this.main_id = theId;
      this.showForm = false,
      this.ResetForm(); 
      this.$router.push({ name: 'Catalog.Category.edit', params: { id: this.main_id}})
    },
    setTouched(theModel) {
      if (theModel === 'name' || theModel === 'all') {
        this.v$.form.name.$touch()
      }
      if (theModel === 'status' || theModel === 'all') {
        this.v$.form.status.$touch()
      }
    },
    onSubmit(event) {
      event.preventDefault()
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        const formData = new FormData();
        for (const [key, value] of Object.entries(this.form)) {
              if(value != null){
            formData.append(key,value)
          //   console.log(key, value);
              }
          }
        if(this.ref_id){formData.append("ref_id",this.ref_id)}
        axios
          .post(
            this.$store.state.backendUrl + '/admin/category',
            formData,
            { headers: { 'Content-Type': 'application/json','Authorization': 'Bearer ' + this.$store.state.token, } },
          )
          .then((response) => {
            console.log(response)
            toast.success(this.$t('savedSuccess'), {
                autoClose: 1000,
            })
            this.$router.push({
              name: 'Edit Category',
              params: { id: response.data.data.id },
            })
            this.isSendingForm = false
          })
          .catch((error) => {
            console.log(error)
            this.ShowError = true
            this.errorMgs = error.response.data.message
            this.isSendingForm = false
          })
      }
    },
    sanitizeTitle: function(title) {
      var slug = "";
      // Change to lower case
      var titleLower = title.toLowerCase();
      // Trim the last whitespace
      slug = titleLower.replace(/\s*$/g, '');
      // Change whitespace to "-"
      slug = slug.replace(/\s+/g, '-');
      this.form.slug =slug;
      return slug;
    }
  },
  mounted() {
      if(this.$route.query.lang_id){
         this.form.lang_id =this.$route.query.lang_id;
      }
      if(this.$route.query.ref_id){
         this.ref_id =this.$route.query.ref_id;
      }
      this.getCreateData();
  }
}
</script>