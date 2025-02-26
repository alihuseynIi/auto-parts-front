<template>
  <div>
    <v-img
        class="mx-auto my-6"
        max-width="228"
        src="/images/logo.svg"
    ></v-img>

    <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
    >

      <div class="text-subtitle-1 text-medium-emphasis">E-poçta</div>

      <v-text-field
          v-model="email"
          :error="hasError"
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Şifrə
      </div>

      <v-text-field
          v-model="password"
          :error="hasError"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-alert
          class="mb-5"
          v-if="errorMessage"
          type="error"
          dense
      >
        {{ errorMessage }}
      </v-alert>

      <v-btn
          @click="submitForm"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          class="mb-8"
          color="black"
          size="large"
          variant="tonal"
          style="text-transform: none"
          block
          type="submit"
      >
        Daxil ol
      </v-btn>

    </v-card>
  </div>
</template>

<script>
import apiClient from '@/services/apiClient.js';
import { mapActions } from 'vuex';

export default {
  data: () => ({
    visible: false,
    email: '',
    password: '',
    errorMessage: '',
    hasError: false,
    isSubmitting: false
  }),
  computed: {
    isFormValid() {
      return this.email.trim() !== '' && this.password.trim() !== '';
    }
  },
  methods: {
    ...mapActions(['login']),
    submitForm() {
      if (!this.isFormValid) {
        this.errorMessage = "E-poçta ve şifrə boş qoyula bilməz.";
        this.hasError = true;
        return;
      }

      this.isSubmitting = true;
      this.clearErrors();

      apiClient.post("/login", {
        email: this.email,
        password: this.password
      })
          .then(response => {
            this.login(response.data.data.access_token, response.data.data.user_id);
            this.$router.push({name: 'home'});
            this.isSubmitting = false;
          })
          .catch(error => {
            console.error('Login error:', error);
            this.errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : "System Error. Please try again later.";
            this.hasError = true;
            this.isSubmitting = false;
          });
    },
    clearErrors() {
      this.hasError = false;
      this.errorMessage = '';
    }
  }
}
</script>

