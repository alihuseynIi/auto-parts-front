<template>
  <div class="all-footer">
    <v-container class="brand-slider">
      <v-row>
        <v-col cols="12">
          <SliderComponent :images="brand_sliders"/>
        </v-col>
      </v-row>
    </v-container>
    <footer class="footer">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="copyright">
              Copyright © {{ new Date().getFullYear() }}, {{ $t('message.all_rights_reserved') }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </footer>
  </div>
</template>

<script>
import SliderComponent from "@/components/SliderComponent.vue";
import apiClient from "@/services/apiClient";

export default {
  name: "FooterComponent",
  components: {SliderComponent},
  data() {
    return {
      brand_sliders: [],
      slidersLoading: true,
    }
  },
  methods: {
    fetchBrandSliders() {
      this.slidersLoading = true;

      apiClient.get('/brand-sliders', {
        params: {user_id: this.$store.getters.userData.id}
      })
          .then(response => {
            this.brand_sliders = response.data.data;
          })
          .catch(error => {
            console.error('An error occurred while fetching brand-sliders.:', error);
          })
          .finally(() => {
            this.slidersLoading = false;
          });
    },
  },
  mounted() {
    this.fetchBrandSliders();
  }
}
</script>

<style scoped>
.footer {
  background: #252525;
  color: white;
  padding: 10px 0;
}

.brand-slider {
  margin-top: 50px;
  margin-bottom: 40px;
}

@media screen and (max-width: 1279px) {
  .brand-slider {
    margin-top: 35px;
    margin-bottom: 25px;
  }
}
</style>
