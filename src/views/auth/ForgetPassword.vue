<template>
  <!-- eslint-disable -->
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
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
              <CForm @submit="onSubmit">
                <h1>Forget Password</h1>
                <p class="text-medium-emphasis">Enter your E-mail</p>
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
                <div class="d-grid">
                  <SubmitButton
                    title="Send Reset Email"
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
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
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
        email: '',
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
      },
    }
  },
  methods: {
    setTouched(theModel) {
      if (theModel === 'email' || theModel === 'all') {
        this.v$.form.email.$touch()
      }
    },
    onSubmit(event) {
      event.preventDefault()
      this.setTouched('all')
      if (!this.v$.$invalid) {
        this.isSendingForm = true
        axios
          .post(
            this.$store.state.backendUrl + '/password/forgot-password',
            this.form,
            { headers: { 'Content-Type': 'application/json' } },
          )
          .then((response) => {
            console.log(response)
            this.$router.push({
              name: 'ResetPassword',
              params: { email: this.form.email },
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
  },
}
</script>
