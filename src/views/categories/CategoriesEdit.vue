<template>
    <!-- eslint-disable --> 
<CRow>
    <CCol :md="12">
        <div class="float-start mb-3">
            {{$t('Language')}} : {{this.form.lang_id}} 
        </div>
        <div  class="float-end mb-3">
            {{$t('translation')}} :
            <div class="btn-group" role="group" aria-label="Basic example">
                <span v-for="language in $store.state.languages" :key="language+'5sdd'">
                    <CButton color="primary" v-if="form.lang_id != language"  @click="getTranslation(language)">{{language}}</CButton>
                </span>
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
                        <DeleteButton
                            class="mt-3 mx-2"
                            :url="'/admin/categroy/'+this.main_id"
                            redirectTo="Categories"
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
import DeleteButton from '@/components/DeleteButton.vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
    setup() {
    return { v$: useVuelidate() }
    },
    name: 'ForgetPassword',
    components: { SubmitButton,DeleteButton },
    data() {
    return {
        form: {
        name: '',
        lang_id:null,
        status:null,
        },
        statuses: [   
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
        fillForm(Thedata){
        this.form.name = Thedata.name;
        this.form.status = Thedata.status;
        this.main_id= Thedata.id;
        this.form.lang_id= Thedata.lang_id;
        this.ref_id= Thedata.ref_id;
        },
        getCreateData(){
            axios
            .get(this.$store.state.backendUrl+'/admin/category/'+this.main_id+'/edit' , {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.token,
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                //console.log(response);
                if(response.Error){
                    this.ShowError=true;
                }
                else{
                this.translations = response.data.category.translations;
                this.categories = response.data.categories.data;
                    this.fillForm(response.data.category);
                    this.showForm=true;
                }
            })
            .catch( (error) => {
                console.log(error);
                this.ShowError=true;
                this.errorMgs = error;
                        
            });      
        } , 
        setTouched(theModel) {
            if (theModel === 'name' || theModel === 'all') {
            this.v$.form.name.$touch()
            }
            if (theModel === 'status' || theModel === 'all') {
            this.v$.form.status.$touch()
            }
        },
        getTranslation(lang_id){
            var toEdit = false;
            var editId = null
       
            for (let index = 0; index < this.translations.length; index++) {
                if(this.translations[index].lang_id == lang_id){
        
                    toEdit = true;
                    editId = this.translations[index].id
                    break;
                }
            }


            if(toEdit){
                this.main_id = editId;
                this.showForm = false,
                this.ResetForm(); 
                this.getCreateData();
            
            }else{
                this.$router.push({ name: 'Add Category', query: { lang_id: lang_id,ref_id:this.ref_id }});
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
            axios
                .post(
                this.$store.state.backendUrl + '/admin/category/'+this.main_id+'?_method=PUT',
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
        ResetForm() {
        
        // Reset our form values
       
        this.form.name = null,
        this.form.short_decription = null,
         this.form.key_words = null,
        this.form.robot = null,
        this.form.status = null,
        this.form.image = null,
        this.form.description = null,
        this.previewImage= "",
        this.previewCover= "",
        this.translations =[],
        this.form.lang_id = null,
        this.ref_id =null,
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      },
    },
    mounted() {
      this.main_id = this.$route.params.id;
      this.getCreateData();
    }
}
</script>