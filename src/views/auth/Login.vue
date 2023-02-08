<template>
  <!-- eslint-disable -->
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CAlert color="danger" :visible="ShowError" dismissible @close="() => { ShowError = false }">
                   {{ errorMgs }}
                </CAlert>
                <CForm @submit="onSubmit">
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model.trim="form.email"
                      @input="setTouched('email')"
                      type="email"
                      placeholder="Email"
                      autocomplete="email"
                      feedback="Please provide a valid email."
                      :invalid="v$.form.email.$error"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model.trim="form.password"
                      @input="setTouched('password')"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      feedback="Please provide a valid password."
                      :invalid="v$.form.password.$error"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <SubmitButton
                      title="Login"
                      :isSendingForm="isSendingForm"
                      />
                 
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <router-link color="link" class="px-0" :to="{ name: 'ForgetPassword'}">
                        Forgot password?
                      </router-link>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
               
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
export default {
  name: 'Login',
  setup() {
    return { v$: useVuelidate() }
  },
  components:{SubmitButton},
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      errorMgs: '',
      ShowError: false,
      show: true,
      isSendingForm: false,
    }
  },
  validations() {
    return {
      form: {
        email: {
          required,
          email,
        },
        password: {
          required,
        },
      },
    }
  },
  methods: {
    setTouched(theModel) {
      if(theModel == 'email' || theModel == 'all' ){this.v$.form.email.$touch()}
      if(theModel == 'password' || theModel == 'all'){this.v$.form.password.$touch()} 
    },
    onSubmit(event) {
      event.preventDefault()
      this.setTouched('all');
      if (!this.v$.$invalid) 
      {
       this.isSendingForm = true;
       axios.post(
        this.$store.state.backendUrl+'/login',this.form, 
        {
          headers: {"Content-Type": "application/json",}
        })
        .then((response) => {
          console.log(response);
      
          this.$store.commit('saveLogin',
          {
            "token":response.data.token,
            "name":response.data.name,
            "image":response.data.image,
          });
          this.$router.push('/')
          this.isSendingForm = false;
       
        })
        .catch( (error) => {
          console.log(error);
          this.ShowError=true;
          this.errorMgs = error.response.data.error;
          this.isSendingForm = false;
        });
      
      }
    },
  },
}
</script>
