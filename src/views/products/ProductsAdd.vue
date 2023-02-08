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
                    <strong> {{$t('Add')+ ' ' + $t('Product') }} </strong>
                </CCardHeader>
                <CCardBody> 
                    <CAlert color="danger" :visible="ShowError" dismissible @close="() => { ShowError = false }">
                    {{ errorMgs }}
                    </CAlert>
                    <CForm @submit="onSubmit"  enctype="multipart/form-data">
                        <CFormInput
                            type="text"
                            :label="$t('Name')+'*'"
                            v-model.trim="form.name"
                            @input="setTouched('name')"
                            feedback="Please provide a valid name."
                            :invalid="v$.form.name.$error"
                        />
                        <CFormInput
                            type="text"
                            :label="$t('Slug')+'*'"
                            v-model.trim="form.slug"
                            @input="setTouched('slug')"
                            feedback="Please provide a valid slug."
                            :invalid="v$.form.slug.$error"
                        />
                        <div v-if="errorsBack.slug">
                            <div class="text-danger small pt-1" v-for="backError in errorsBack.slug" :key="backError"> {{backError}} </div>
                        </div>
                        <div class="my-3" v-if="showSharedInputs">
                        <CFormLabel for="exampleFormControlInput1">{{ $t('Categories') }}*</CFormLabel>
                        <multiselect
                          :input="setTouched('cate_selected')"
                          v-model="cate_selected"
                          :options="cate_options"
                          :multiple="true"
                          :close-on-select="true"
                          label="label"
                          track-by="value"
                          feedback="Please provide a valid name."
                        >
                        </multiselect>
                        <div class="text-danger small pt-1" v-if="v$.cate_selected.$error"> Please select a category. </div>
                        </div>
                        <CFormSelect
                          :label="$t('Status')+'*'"
                          v-model="form.status"
                          @input="setTouched('status')"
                          feedback="Please select a valid status."
                          :invalid="v$.form.status.$error"
                          :options="statuses">
                        </CFormSelect>
                      
                        <div  v-if="!previewImage" class="my-3">
                        <CFormInput 
                          :label="$t('Image')"
                          type="file" 
                          @change="onFileChange" 
                          id="AddProduct_formFile" 
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
<div class="col-md-6 mt-3" v-if="showSharedInputs">
   <div class="mb-3">
    <label for="editporduct_price" class="form-label">{{$t('Price')}}</label>
    <input v-model.trim="form.price"  type="text"  class="form-control" id="editporduct_price" :class="{ 'is-invalid': errorsBack.price}" >
      <div v-if="errorsBack.price">
    <div class="text-danger small pt-1" v-for="backError in errorsBack.price" :key="backError"> {{backError}} </div>
     </div>
     </div>
</div>
  <!-- input ************-->

  <!-- input ************-->

<div class="col-md-6 mt-3" v-if="showSharedInputs">
   <div class="mb-3">
    <label for="editporduct_discount" class="form-label">{{$t('Discount')}}</label>
    <input v-model.trim="form.discount"  type="text"  class="form-control" id="editporduct_discount" :class="{ 'is-invalid': errorsBack.discount}" >
      <div v-if="errorsBack.discount">
    <div class="text-danger small pt-1" v-for="backError in errorsBack.discount" :key="backError"> {{backError}} </div>
     </div>
     </div>
</div>

  <!-- input ************-->

<div class="col-md-6 mt-3" v-if="showSharedInputs">
   <div class="mb-3">
    <label for="editporduct_discount_start" class="form-label">{{$t('discount_start')}}</label>
    <input v-model.trim="form.discount_start"  type="datetime-local"  class="form-control" id="editporduct_discount" :class="{ 'is-invalid': errorsBack.discount_start}" >
      <div v-if="errorsBack.discount_start">
    <div class="text-danger small pt-1" v-for="backError in errorsBack.discount_start" :key="backError"> {{backError}} </div>
     </div>
     </div>
</div>
  <!-- input ************-->

<div class="col-md-6 mt-3" v-if="showSharedInputs">
   <div class="mb-3">
    <label for="editporduct_discount_end" class="form-label">{{$t('discount_end')}}</label>
    <input v-model.trim="form.discount_end"  type="datetime-local"  class="form-control" id="editporduct_discount_end" :class="{ 'is-invalid': errorsBack.discount_end}" >
      <div v-if="errorsBack.discount_end">
    <div class="text-danger small pt-1" v-for="backError in errorsBack.discount_end" :key="backError"> {{backError}} </div>
     </div>
     </div>
</div>
<!-- input -->
 <!-- input -->
 <CCol :md="12"> 
  <CFormLabel for="AddProduct_description">{{ $t('Decription') }}*</CFormLabel>
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
import { required, maxLength,requiredIf } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
import Multiselect from 'vue-multiselect'
import {fixingOptions} from '../../commen/fixingSelectOption'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import moment from 'moment';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  name: 'ForgetPassword',
components: { SubmitButton, Multiselect, QuillEditor },
  data() {
    return {
      form: {
        name: '',
        lang_id:this.$store.state.localLang,
        status:null,
        slug :null,
        image:null,
        short_decription:null,
        keywords:null,
        robot:null,
        description:'',
        alt_image:null,
        alt_cover:null,
      },
      statuses: [   { label: '', value: '' },
                    { label: 'active', value: 'active' },
                    { label: 'deactivated', value: 'deactivated' },
                    { label: 'waiting review', value: 'waiting review' },
                ],   
      categories:[],
      cate_selected:null,
      cate_options:[],
      previewImage:null,     
      ref_id: null,
      main_id:null,
      translations :[],
      errorsBack:{},
      errorMgs: '',
      ShowError: false,
      show: true,
      isSendingForm: false,
      showSharedInputs: true
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
        slug: {
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
      cate_selected: {
        required: requiredIf(function() {
                return this.showSharedInputs;
            })
      },
    }
  },
  methods: {
    getCreateData(){
    axios
    .get(this.$store.state.backendUrl+'/admin/product/create' , {
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
          this.cate_options = fixingOptions (response.data.categories.data,'name','ref_id');
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
      this.$router.push({ name: 'Catalog.Product.edit', params: { id: this.main_id}})
    },
    setTouched(theModel) {
      if (theModel === 'name' || theModel === 'all') {
        this.sanitizeTitle(this.form.name)
        this.v$.form.name.$touch()
      }
      if (theModel === 'status' || theModel === 'all') {
        this.v$.form.status.$touch()
      }
      if (theModel === 'cate_selected' || theModel === 'all') {
        this.v$.cate_selected.$touch()
      }
      if (theModel === 'short_decription' || theModel === 'all') {
        this.v$.form.short_decription.$touch()
      }
      if (theModel === 'keywords' || theModel === 'all') {
        this.v$.form.keywords.$touch()
      }
      if (theModel === 'slug' || theModel === 'all') {
        this.v$.form.slug.$touch()
      }
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
    onSubmit(event) {
      event.preventDefault()
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        const formData = new FormData();
        if(this.showSharedInputs){
        for( let value of this.cate_selected){
          formData.append('categories[]',value.value)
        }
        }
        for (let [key, value] of Object.entries(this.form)) {
          if(value != null){
           if(key == 'discount_end' || key == 'discount_start'){
              value = moment(value).format("Y-MM-DD H:mm:ss")
           }

          formData.append(key,value)
          }
        }
        if(this.ref_id){formData.append("ref_id",this.ref_id)}
        axios
          .post(
            this.$store.state.backendUrl + '/admin/product',
            formData,
            { headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': 'multipart/form-data',
             } },
          )
          .then((response) => {
            console.log(response)
            toast.success(this.$t('savedSuccess'), {
                autoClose: 1000,
            })
            this.$router.push({
              name: 'Edit Product',
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
    sanitizeTitle: function() {
      var slug = "";
      // Change to lower case
      var titleLower = this.form.name.toLowerCase();
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
         this.form.lang_id == this.$store.state.localLang? this.showSharedInputs = true : this.showSharedInputs = false
      }
      if(this.$route.query.ref_id){
         this.ref_id =this.$route.query.ref_id;
      }
      
      this.getCreateData();
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>