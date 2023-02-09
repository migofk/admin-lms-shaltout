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
                    <strong> {{$t('Add')+ ' ' + $t('Information') }} </strong>
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
                        <!-- -->
                        <div v-if="showSharedInputs">
                       <div  v-if="!previewlogo" class="my-3">
                        <CFormInput 
                          :label="$t('Logo')"
                          type="file" 
                          @change="onFileChange($event,'logo')"
                          id="editinfo_formFile1" 
                          accept="image/jpeg, image/png, image/gif,image/webp"
                        />
                      </div>
                      <div class="my-3" v-else>
                          <br/>
                            <img :src="previewlogo" style="max-height: 200px;"  class="img-fluid"/> 
                          <br/>
                          <CButton color="primary" @click="removeImage('logo')">X</CButton>
                          <div v-if="errorsBack.logo">
                            <div class="text-danger small pt-1" v-for="backError in errorsBack.logo" :key="backError"> {{backError}} </div>
                          </div>
                      </div>
                       <!-- -->
                      <div  v-if="!previewlogo_white" class="my-3">
                        <CFormInput 
                          :label="$t('logo_white')"
                          type="file" 
                          @change="onFileChange($event,'logo_white')"
                          id="editinfo_formFile2" 
                          accept="image/jpeg, image/png, image/gif,image/webp"
                        />
                      </div>
                      <div class="my-3" v-else>
                          <br/>
                            <img :src="previewlogo_white" style="max-height: 200px;"  class="img-fluid"/> 
                          <br/>
                          <CButton color="primary" @click="removeImage('logo_white')">X</CButton>
                          <div v-if="errorsBack.logo_white">
                            <div class="text-danger small pt-1" v-for="backError in errorsBack.logo_white" :key="backError"> {{backError}} </div>
                          </div>
                      </div>
                       <!-- -->
                       <div  v-if="!previewlogo_black" class="my-3">
                        <CFormInput 
                          :label="$t('logo_black')"
                          type="file" 
                          @change="onFileChange($event,'logo_black')"
                          id="editinfo_formFile3" 
                          accept="image/jpeg, image/png, image/gif,image/webp"
                        />
                      </div>
                      <div class="my-3" v-else>
                          <br/>
                            <img :src="previewlogo_black" style="max-height: 200px;"  class="img-fluid"/> 
                          <br/>
                          <CButton color="primary" @click="removeImage('logo_black')">X</CButton>
                          <div v-if="errorsBack.logo_black">
                            <div class="text-danger small pt-1" v-for="backError in errorsBack.logo_black" :key="backError"> {{backError}} </div>
                          </div>
                      </div>
                     <!-- -->
                      <!-- -->
                      <div  v-if="!previewfavicon" class="my-3">
                        <CFormInput 
                          :label="$t('favicon')"
                          type="file" 
                          @change="onFileChange($event,'favicon')"
                          id="editinfo_formFile4" 
                          accept="image/jpeg, image/png, image/gif,image/webp"
                        />
                      </div>
                      <div class="my-3" v-else>
                          <br/>
                            <img :src="previewfavicon" style="max-height: 200px;"  class="img-fluid"/> 
                          <br/>
                          <CButton color="primary" @click="removeImage('favicon')">X</CButton>
                          <div v-if="errorsBack.favicon">
                            <div class="text-danger small pt-1" v-for="backError in errorsBack.favicon" :key="backError"> {{backError}} </div>
                          </div>
                      </div>
                    </div>
                     <!-- -->
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
  <CFormLabel for="AddInfo_description">{{ $t('Decription') }}*</CFormLabel>
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
    logo:null,
    logo_white:null,
    logo_black:null,
    favicon:null,
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
    previewlogo:null,
    previewlogo_white:null,
    previewlogo_black:null,
    previewfavicon:null,
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
    this.previewlogo = Thedata.logo;
    this.previewlogo_white = Thedata.logo_white;
    this.previewlogo_black = Thedata.logo_black;
    this.previewfavicon = Thedata.favicon;
    this.form.lang_id == this.$store.state.localLang? this.showSharedInputs = true : this.showSharedInputs = false
    },
    getCreateData(){
        let query = ''
        this.main_id? query = '?id='+this.main_id :  query = ''
        axios
        .get(this.$store.state.backendUrl+'/admin/info_edit'+query  , {
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
            this.infos = response.data.data;
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
            this.$router.push({ name: 'Info', query: { lang_id: lang_id,id:editId,ref_id:this.ref_id }});
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
            this.$store.state.backendUrl + '/admin/info_update/'+this.main_id,
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
                name: 'Info',
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
    onFileChange(e,image) {
        console.log(image)
      var files = e.target.files ;
      if (!files.length)
        return;
        if(image == "logo"){
       this.form.logo = files[0];
       this.createImage(files[0],"logo");
        }
        if(image == "logo_white"){
       this.form.logo_white = files[0];
       this.createImage(files[0],"logo_white");
        }
        if(image == "logo_black"){
       this.form.logo_black = files[0];
       this.createImage(files[0],"logo_black");
        }
        if(image == "favicon"){
       this.form.favicon = files[0];
       this.createImage(files[0],"favicon");
        }
      },
      createImage(file,image) {
     // var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        if(image == "logo"){
       vm.previewlogo = e.target.result;
        }
        if(image == "logo_white"){
        vm.previewlogo_white = e.target.result;
        }
        if(image == "logo_black"){
        vm.previewlogo_black = e.target.result;
        }
        if(image == "favicon"){
        vm.previewfavicon = e.target.result;
        }
       
      };
      reader.readAsDataURL(file);
    },
    removeImage (image) {
      if(image == "logo"){
      this.previewlogo = ''
      this.form.logo = ''
      }
      if(image == "logo_white"){
      this.previewlogo_white = ''
      this.form.logo_white = ''
      }
      if(image == "logo_black"){
      this.previewlogo_black = ''
      this.form.logo_black = ''
      }
      if(image == "favicon"){
      this.previewfavicon = ''
      this.form.favicon = ''
      }
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