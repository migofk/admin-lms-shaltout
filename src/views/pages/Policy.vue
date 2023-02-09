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
                    <strong> {{$t('Add')+ ' ' + $t('Policy') }} </strong>
                </CCardHeader>
                <CCardBody> 
                    <CAlert color="danger" :visible="ShowError" dismissible @close="() => { ShowError = false }">
                    {{ errorMgs }}
                    </CAlert>
                    <CForm @submit="onSubmit">
                        <CFormInput
                            type="text"
                            :label="$t('Name')+'*'"
                            v-model.trim="form.name"
                            @input="setTouched('name')"
                            feedback="Please provide a valid name."
                            :invalid="v$.form.name.$error"
                        />

                        <div  v-if="!previewImage" class="my-3">
                        <CFormInput 
                          :label="$t('Image')"
                          type="file" 
                          @change="onFileChange" 
                          id="AddPolicy_formFile" 
                          accept="image/jpeg, image/png, image/gif,image/webp"
                        />
                      </div>
                      <div class="my-3" v-else>
                          <br/>
                          <img :src="previewImage" style="max-height: 200px;"  class="img-fluid"/> 
                          <br/>
                          <CButton color="primary" @click="removeImage">X</CButton>
                          <div v-if="errorsBack.image">
                          <div class="text-danger small pt-1" v-for="backError in errorsBack.image" :key="backError"> {{backError}} </div>
                          </div>
                      </div>
              
                        <div class="my-3">
                        <CFormInput
                            type="text"
                            :label="$t('short_description')+'*'"
                            v-model.trim="form.short_decription"
                            @input="setTouched('short_decription')"
                            feedback="Please maximum 1."
                            :invalid="v$.form.short_decription.$error"
                        />
                      </div>
                        <div class="my-3">
                        <CFormInput
                            type="text"
                            :label="$t('keywords')+'*'"
                            v-model.trim="form.keywords"
                            @input="setTouched('keywords')"
                            feedback="Please maximum 1."
                            :invalid="v$.form.keywords.$error"
                        />
                      </div>




 <!-- input -->
 <CCol :md="12"> 
  <CFormLabel for="AddPolicy_description">{{ $t('Decription') }}*</CFormLabel>
  <div dir="ltr" class="bg-white">
 <QuillEditor  toolbar="full" theme="snow" v-model:content="form.description" contentType="html" />
  </div>
  <div v-if="errorsBack.description">
    <div class="text-danger small pt-1" v-for="backError in errorsBack.description" :key="backError"> {{backError}} </div>
     </div>
  </CCol> 

<!-- input -->
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
import { required, maxLength } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
setup() {
return { v$: useVuelidate() }
},
name: 'ForgetPassword',
components: { SubmitButton, QuillEditor,},
data() {
return {
    form: {
    name: '',
    lang_id:null,
    image:null,
    short_decription:null,
    keywords:null,
    robot:null,
    description:'',
    alt_image:null,
    alt_cover:null,
    },
    statuses: [   
                { label: 'active', value: 'active' },
                { label: 'deactivated', value: 'deactivated' },
                { label: 'waiting review', value: 'waiting review' },
            ],
    previewImage:null,
    ref_id: null,
    main_id:'',
    translations :[],
    errorsBack:{},
    errorMgs: '',
    ShowError: false,
    show: true,
    isSendingForm: false,
    showSharedInputs: true,
}
},
validations() {
return {
    form: {
    name: {
        required,
    },
    short_decription: {
        required,
        maxLength: maxLength(350),
    },
    keywords: {
        required,
        maxLength: maxLength(350),
    },
    },
}
},
methods: {
    fillForm(Thedata){
    this.form.name = Thedata.name;
    this.main_id= Thedata.id;
    this.form.lang_id= Thedata.lang_id;
    this.ref_id= Thedata.ref_id;
    this.form.short_decription = Thedata.short_decription;
    this.form.keywords = Thedata.keywords;
    this.form.description = Thedata.description;
    this.form.alt_image = Thedata.alt_image;
    this.previewImage = Thedata.image;
    this.form.lang_id == this.$store.state.localLang? this.showSharedInputs = true : this.showSharedInputs = false
    },
    getCreateData(){
        let query = ''
        this.main_id? query = '?id='+this.main_id :  query = ''
        axios
        .get(this.$store.state.backendUrl+'/admin/policy_edit'+query  , {
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
            this.translations = response.data.data.translations;
            this.policys = response.data.data;
                this.fillForm(response.data.data);
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
        if (theModel === 'short_decription' || theModel === 'all') {
            this.v$.form.short_decription.$touch()
        }
        if (theModel === 'keywords' || theModel === 'all') {
            this.v$.form.keywords.$touch()
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
            this.$router.push({ name: 'Policy', query: { lang_id: lang_id,id:editId,ref_id:this.ref_id }});
        }
    },
    onSubmit(event) {
        event.preventDefault()
        this.setTouched('all')
        if (!this.v$.$invalid) {
        this.isSendingForm = true
        const formData = new FormData();
        for (let [key, value] of Object.entries(this.form)) {
            if(value != null){
                formData.append(key,value)
            }
        }
        axios
            .post(
            this.$store.state.backendUrl + '/admin/policy_update/'+this.main_id,
            formData,
            { headers: { 
                'Authorization': 'Bearer ' + this.$store.state.token, 
                'Content-Type': 'multipart/form-data',
            } },
            )
            .then((response) => {
            toast.success(this.$t('savedSuccess'), {
                autoClose: 1000,
            })
            console.log(response)
            this.$router.push({
                name: 'Policy',
                params: { id: response.data.data.id },
            })
            this.isSendingForm = false
            })
            .catch((error) => {
            console.log(error)
            this.ShowError = true
            this.errorMgs = error.response.data.message
            this.isSendingForm = false
            if(error){
                this.errorsBack = error.response.data.errors;       
            }
            })
        }
    },
    ResetForm() {
    
    // Reset our form values
    
    this.form.name = null,
    this.form.short_decription = null,
    this.form.keywords = null,
    this.form.robot = null,
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
    onFileChange(e) {
      var files = e.target.files ;
      if (!files.length)
        return;
       this.form.image = files[0];
       this.createImage(files[0]);
    },
    createImage(file) {
     // var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage () {
      this.previewImage = '';
      this.form.image = '';
    },
},
mounted() {
    if(this.$route.query.id){
        this.main_id = this.$route.query.id;
    }
    this.getCreateData();
}
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>