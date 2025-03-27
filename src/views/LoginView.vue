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

      <div class="text-subtitle-1 text-medium-emphasis">{{ this.$t("message.email") }}</div>

      <v-text-field
          v-model="email"
          :error="hasError"
          density="compact"
          :placeholder="this.$t('message.enter_email')"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          @keyup.enter="submitForm"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        {{ this.$t("message.password") }}
      </div>

      <v-text-field
          v-model="password"
          :error="hasError"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          :placeholder="this.$t('message.enter_password')"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          @keyup.enter="submitForm"
      ></v-text-field>

      <v-alert
          class="mb-5"
          v-if="errorMessage"
          type="error"
          dense
      >
        {{ errorMessage }}
      </v-alert>

      <div id="myRecaptcha"></div>

      <v-btn
          @click="submitForm"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          class="mb-8 mt-4"
          color="black"
          size="large"
          variant="tonal"
          style="text-transform: none"
          block
          type="submit"
      >
        {{ this.$t("message.sign_in") }}
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
    isSubmitting: false,
    captchaToken: '',
  }),
  computed: {
    isFormValid() {
      return this.email.trim() !== '' && this.password.trim() !== '';
    }
  },
  methods: {
    ...mapActions(['login']),

    handleCaptchaVerified(token) {
      this.captchaToken = token;
    },

    submitForm() {
      if (this.isSubmitting) return;

      if (!this.captchaToken) {
        this.errorMessage = this.$t('message.captcha_required');
        return
      }

      if (!this.isFormValid) {
        this.errorMessage = this.$t('message.email_and_password_required');
        this.hasError = true;
        return;
      }

      this.isSubmitting = true;
      this.clearErrors();

      apiClient.post("/login", {
        email: this.email,
        password: this.password,
        captcha_token: this.captchaToken
      })
          .then(response => {
            this.login(response.data.data.access_token, response.data.data.user_id);
            this.$router.push({ name: 'home' });
          })
          .catch(error => {
            console.error('Login error:', error);
            this.errorMessage = this.$t('message.sign_in_error');
            this.hasError = true;
            this.password = '';
          })
          .finally(() => {
            this.isSubmitting = false;
          });
    },

    clearErrors() {
      this.hasError = false;
      this.errorMessage = '';
    }
  },
  mounted() {
    if (window.grecaptcha && window.grecaptcha.enterprise) {
      window.grecaptcha.enterprise.render("myRecaptcha", {
        sitekey: "6LdA7P4qAAAAAD0GgK_zyal2L3jWRi54wplxKUR0",
        callback: this.handleCaptchaVerified
      });
    }
  },
}
</script>
<style>
#myRecaptcha {
  display: flex;
  justify-content: center;
}
</style>
