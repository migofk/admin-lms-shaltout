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
                    <strong> {{$t('Add')+ ' ' + $t('Product') }} </strong>
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
                        <DeleteButton
                            class="mt-3 mx-2"
                            :url="'/admin/product/'+this.main_id"
                            redirectTo="Products"
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
import DeleteButton from '@/components/DeleteButton.vue'
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
components: { SubmitButton, Multiselect, QuillEditor,DeleteButton },
data() {
return {
    form: {
    name: '',
    lang_id:null,
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
    statuses: [   
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
    showSharedInputs: true,
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
        required,
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
    this.form.short_decription = Thedata.short_decription;
    this.form.keywords = Thedata.keywords;
    this.form.description = Thedata.description;
    this.form.alt_image = Thedata.alt_image;
    this.previewImage = Thedata.image;
    this.form.slug = Thedata.slug;
    this.form.parent_id = Thedata.parent_id;
    this.form.price = Thedata.price;
    this.form.discount = Thedata.discount;
    this.form.discount_start = Thedata.discount_start;
    this.form.discount_end = Thedata.discount_end;
    this.previewGallery = Thedata.gallery;
    this.form.lang_id == this.$store.state.localLang? this.showSharedInputs = true : this.showSharedInputs = false
    },
    getCreateData(){
        axios
        .get(this.$store.state.backendUrl+'/admin/product/'+this.main_id+'/edit' , {
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
            this.translations = response.data.product.translations;
            this.cate_options = fixingOptions (response.data.categories.data,'name','ref_id');
            this.cate_selected = fixingOptions (response.data.product.categories,'name','ref_id');
            this.products = response.data.product.data;
                this.fillForm(response.data.product);
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
            this.sanitizeTitle();
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
            this.$router.push({ name: 'Add Product', query: { lang_id: lang_id,ref_id:this.ref_id }});
        }
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
                if(this.showSharedInputs){
                if(key == 'discount_end' || key == 'discount_start'){
                    value = moment(value).format("Y-MM-DD H:mm:ss")
                }
                }
                formData.append(key,value)
            }
        }
        axios
            .post(
            this.$store.state.backendUrl + '/admin/product/'+this.main_id+'?_method=PUT',
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
    ResetForm() {
    
    // Reset our form values
    
    this.form.name = null,
    this.form.short_decription = null,
        this.form.keywords = null,
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
    this.main_id = this.$route.params.id;
    this.getCreateData();
}
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>