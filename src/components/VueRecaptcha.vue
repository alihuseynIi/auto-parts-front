<template>
  <VueRecaptcha
      :sitekey="siteKey"
      :load-recaptcha-script="true"
      @verify="handleSuccess"
      @error="handleError"
  ></VueRecaptcha>
</template>

<script lang="js">
import { computed, defineComponent } from 'vue';
import { VueRecaptcha } from 'vue-recaptcha';

export default defineComponent({
  name: 'ReCaptcha',
  components: {
    VueRecaptcha
  },
  setup() {
    const siteKey = computed(() => {
      return '6LeDqdEqAAAAAHp3z3YmqDo4YEYsHDdN0RVGfKok';
    });

    const handleError = () => {
      // Do some validation
    };

    const handleSuccess = () => {
      // Do some validation
    };

    return {
      handleSuccess,
      handleError,
      siteKey,
    };
  }
});
</script>