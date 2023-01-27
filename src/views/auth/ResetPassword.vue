<template>
  <!-- eslint-disable -->
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CAlert
                color="success"
                :visible="ShowSuccess"
                dismissible
                @close="
                  () => {
                    ShowSuccess = false
                  }
                "
              >
                {{successMgs}}
               -  <router-link :to="{ name: 'Login'}">
                  Login
                </router-link>
              </CAlert>
              <CAlert
                color="danger"
                :visible="ShowError"
                dismissible
                @close="
                  () => {
                    ShowError = false
                  }
                "
              >
                {{errorMgs}}
              </CAlert>
              <CForm v-if="show" @submit="onSubmit">
                <h1>Reset Password</h1>
                <p class="text-medium-emphasis">Use the OTP code that was sent to your email to reset your password
                  -  <CButton @click="resendReset" color="link" class="px-0">
                        Resend  
                        <div v-if="isResendingEmail" class="spinner-border spinner-border-sm" role="status"> </div> 
                       
                      </CButton>
                </p>
                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
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
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-shield-alt" />
                  </CInputGroupText>
                  <CFormInput
                    v-model.trim="form.otp"
                    @input="setTouched('otp')"
                    type="number"
                    placeholder="OTP Code"
                    feedback="Please provide a valid otp."
                    :invalid="v$.form.otp.$error"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    v-model.trim="form.password"
                    @input="setTouched('password')"
                    type="password"
                    placeholder="New password"
                    feedback="Please provide a password at least 6 characters"
                    :invalid="v$.form.password.$error"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                     v-model.trim="form.confirmPassword"
                    @input="setTouched('confirmPassword')"
                    type="password"
                    placeholder="Re-enter new password"
                    feedback="Please repeat your password correctly."
                    :invalid="v$.form.confirmPassword.$error"
                  />
                </CInputGroup>
                <div class="d-grid">
                  <SubmitButton
                    title="Submit"
                    :isSendingForm="isSendingForm"
                  />
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required, email, sameAs, minLength } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  name: 'ForgetPassword',
  components: { SubmitButton },
  data() {
    return {
      form: {
        email: this.$route.params.email,
        otp: '',
        password: '',
        confirmPassword: '',
      },
      errorMgs: '',
      ShowError: false,
      show: true,
      isSendingForm: false,
      isResendingEmail: false,
      ShowSuccess:false,
      successMgs: 'Your password has been reset successful',
    }
  },
  validations() {
    return {
      form: {
        email: {
          required,
          email,
        },
        otp: {
          required,
        },
        password: {
          required,
          minLength: minLength(6),
        },
        confirmPassword: {
          sameAsPassword: sameAs(this.form.password),
        },
      },
    }
  },
  methods: {
    setTouched(theModel) {
      if (theModel === 'email' || theModel === 'all') {
        this.v$.form.email.$touch()
      }
      if (theModel === 'otp' || theModel === 'all') {
        this.v$.form.otp.$touch()
      }
      if (theModel === 'password' || theModel === 'all') {
        this.v$.form.password.$touch()
      }
      if (theModel === 'confirmPassword' || theModel === 'all') {
        this.v$.form.confirmPassword.$touch()
      }
    },
    onSubmit(event) {
      event.preventDefault()
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        axios
          .post(
            this.$store.state.backendUrl + '/password/reset',
             this.form, 
            { headers: { 'Content-Type': 'application/json' } },
          )
          .then((response) => {
            console.log(response)
            this.show = false
            this.ShowSuccess = true
            this.isSendingForm = false
          })
          .catch((error) => {
            console.log(error)
            this.ShowError = true
            this.errorMgs = error.response.data.error.message
            this.isSendingForm = false
          })
      }
    },
    resendReset(event) {
      event.preventDefault()
        this.isResendingEmail = true
        axios
          .post(
            this.$store.state.backendUrl + '/password/forgot-password',
            this.form,
            { headers: { 'Content-Type': 'application/json' } },
          )
          .then((response) => {
            console.log(response)
            this.isResendingEmail = false
          })
          .catch((error) => {
            console.log(error)
            this.ShowError = true
            this.errorMgs = error.response.data.message
            this.isResendingEmail = false
          })
      }
    },
  
}
</script>
