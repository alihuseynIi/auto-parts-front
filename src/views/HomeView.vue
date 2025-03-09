<template>
  <div style="background: #f5f5f5">
    <header-component/>

    <main class="body-part">
      <v-container>
        <v-row>
          <v-col cols="12" lg="6" class="order-md-1 order-lg-3 sliders">
            <div v-if="slidersLoading" class="loading-container">
              <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
            </div>

            <v-carousel
                v-else-if="sliders.length > 0"
                style="border-radius: 4px"
                cycle
                hide-delimiters
                height="270"
                show-arrows="hover"
            >
              <v-carousel-item
                  v-for="(slider, index) in sliders"
                  :key="index"
                  :src="url + slider"
                  cover
              ></v-carousel-item>
            </v-carousel>

            <p v-else style="text-align: center;">{{ $t('message.slider_not_found') }}</p>
          </v-col>
          <v-col cols="12" class="order-md-2 order-lg-1"><h2 class="search-title">{{ $t('message.product_search') }}</h2></v-col>
          <v-col cols="12" lg="6" class="order-md-3 order-lg-2">
            <v-row>
              <v-col class="pb-0 mb--13" cols="12" sm="4">
                <custom-select
                    :loading="loadingCategories"
                    v-model="selectedCategories.product_type"
                    :label="$t('message.product_type')"
                    :items="productTypeOptions"
                ></custom-select>
              </v-col>

              <v-col class="pb-0 mb--13" cols="12" sm="4">
                <custom-select
                    :loading="loadingCategories"
                    v-model="selectedCategories.brand"
                    :label="$t('message.brand')"
                    :items="brandOptions"
                ></custom-select>
              </v-col>

              <v-col class="pb-0" cols="12" sm="4">
                <custom-select
                    :loading="loadingCategories"
                    v-model="selectedCategories.product_category"
                    :label="$t('message.category')"
                    :items="productCategoryOptions"
                ></custom-select>
              </v-col>

              <v-col class="pt-0 pb-0" cols="6">
                <custom-select
                    :loading="loadingCategories"
                    v-model="selectedCategories.car_brand"
                    :label="$t('message.car_brand')"
                    :items="carBrandOptions"
                ></custom-select>
              </v-col>

              <v-col class="pt-0 pb-0" cols="6">
                <custom-select
                    :loading="loadingForCarModel"
                    :disabled="isDisabled"
                    v-model="selectedCategories.car_model"
                    :label="$t('message.car_model')"
                    :items="carModelOptions"
                ></custom-select>
              </v-col>

              <v-col class="pt-0 pb-0" cols="12">
                <v-text-field
                    v-model="selectedCategories.query"
                    @keyup.enter="handleSearch()"
                    :label="$t('message.search') + '..'"
                    variant="solo"
                ></v-text-field>
              </v-col>

              <v-col class="pt-0 pb-md-0" cols="12" lg="9">
                <div class="search-filters">
                  <v-checkbox v-model="selectedCategories.campaign" :label="$t('message.campaign')"/>
                  <v-checkbox v-model="selectedCategories.new_product" :label="$t('message.new_products')"/>
                  <v-checkbox v-model="selectedCategories.availability" :label="$t('message.available')"/>
                </div>
              </v-col>

              <v-col class="pt-0 search-btn" cols="12" lg="3">
                <v-btn :disabled="loading || loadingCategories" :loading="loading" @click="handleSearch()" block>
                  {{ $t('message.search') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <v-row>
        <v-col cols="12 pb-0">
          <v-data-table-server
              class="search-table"
              :headers="headers"
              :items="items"
              :loading="loading"
              :loading-text="$t('message.loading_please_wait')"
              :no-data-text="$t('message.information_not_found')"
              :items-length="totalItems"
              v-model:page="pagination.page"
              :items-per-page="pagination.itemsPerPage"
              @pagination="handleSearch"
          >
            <template v-slot:[`item.image`]="{item}">
              <template v-if="item.image">
                <font-awesome-icon class="cursor-pointer" :icon="['fas', 'eye']" @click="showModal(item.image)"/>
              </template>
              <template v-else>-</template>
            </template>

            <template v-slot:[`item.discounted_price`]="{item}">
              <div>
                {{ item.discounted_price ? item.discounted_price.toFixed(2) + " ₼" : '-' }}
              </div>
            </template>

            <template v-slot:[`item.stock`]="{ item }">
              <span style="color: green" v-if="item.stock > 0">{{ item.stock }}</span>
              <span style="color: red" v-else>
                <font-awesome-icon :icon="['fas', 'xmark']"/>
              </span>
            </template>

            <template v-slot:[`item.availability`]="{ item }">
              <div class="m-w-60">
                <v-number-input
                    :disabled="item.stock === 0"
                    :min="1"
                    :max="item.stock"
                    v-model="item.quantity"
                    variant="solo"
                    control-variant="stacked"
                >
                </v-number-input>
              </div>
            </template>

            <template v-slot:[`item.price`]="{item}">
              <div class="price-cell">
                {{ item.price?.toFixed(2) }} ₼
              </div>
            </template>

            <template v-slot:[`item.name`]="{item}">
              <div style="max-width: 200px">
                {{ item.name }}
              </div>
            </template>

            <template v-slot:[`item.add_to_cart`]="{item}">
              <td v-if="item.stock > 0" class="m-w-100">
                <font-awesome-icon
                    v-if="!item.isAddingToCart"
                    @click="addToCart(item)"
                    class="cart-icon"
                    :icon="['fas', 'cart-plus']"
                />

                <font-awesome-icon
                    v-else
                    class="cart-icon spinner-icon"
                    :icon="['fas', 'spinner']"
                    spin
                />
              </td>
              <td v-else class="m-w-100">-</td>
            </template>

          </v-data-table-server>

        </v-col>
      </v-row>
    </main>

    <footer-component/>

    <v-dialog v-model="isModalOpen" max-width="600px">
      <v-card>
        <v-card-title>
          {{ $t('message.product_image') }}
        </v-card-title>
        <v-card-text>
          <v-img :src="imageUrl"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" @click="isModalOpen = false">{{ $t('message.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar timeout="2000" color="success" v-model="addedToCart">
      {{ $t('message.product_added_to_cart') }}
    </v-snackbar>
  </div>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {mapActions} from "vuex";
import CustomSelect from '@/components/CustomSelect.vue';
import apiClient from "@/services/apiClient";
import {VNumberInput} from 'vuetify/labs/VNumberInput'
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: 'HomeView',
  data() {
    return {
      url: "http://127.0.0.1:8000/storage/",
      isModalOpen: false,
      imageUrl: '',
      addedToCart: false,
      sliders: [],
      slidersLoading: true,
      selectedCategories: {
        query: null,
        product_type: null,
        brand: null,
        product_category: null,
        car_brand: null,
        car_model: null,
        campaign: false,
        new_product: false,
        availability: false
      },
      items: [],
      totalItems: 0,
      loading: false,
      pagination: {
        page: 1,
        itemsPerPage: 10
      },
      tableButtonLoading: false
    };
  },
  components: {
    FooterComponent,
    HeaderComponent,
    FontAwesomeIcon,
    CustomSelect,
    VNumberInput,
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
    loadingCategories() {
      return this.$store.getters.loadingCategories;
    },
    carModels() {
      return this.$store.getters.carModels;
    },
    isDisabled() {
      return this.$store.getters.isDisabled;
    },
    loadingForCarModel() {
      return this.$store.getters.loadingForCarModel;
    },
    userData() {
      return this.$store.getters.userData;
    },
    headers() {
      return [
        {title: this.$t("message.name"), value: 'name', align: 'start'},
        {title: this.$t("message.code"), value: 'code', align: 'center'},
        {title: this.$t("message.oem_code"), value: 'oem_code', align: 'center'},
        {title: this.$t("message.car_brand"), value: 'car_brand', align: 'center'},
        {title: this.$t("message.car_model"), value: 'car_model', align: 'center'},
        {title: this.$t("message.brand"), value: 'brand', align: 'center'},
        {title: this.$t("message.image"), value: 'image', align: 'center'},
        {title: this.$t("message.price"), value: 'price', align: 'center'},
        {title: this.$t("message.discounted_price"), value: 'discounted_price', align: 'center'},
        {title: this.$t("message.available"), value: 'stock', align: 'center'},
        {title: this.$t("message.quantity"), value: 'availability', align: 'center'},
        {title: this.$t("message.add_to_cart"), value: 'add_to_cart', align: 'center'}
      ];
    },
    defaultOption() {
      return this.$t('message.all');
    },
    productTypeOptions() {
      return [this.defaultOption, ...(this.categories.product_type || [])];
    },
    brandOptions() {
      return [this.defaultOption, ...(this.categories.brand || [])];
    },
    productCategoryOptions() {
      return [this.defaultOption, ...(this.categories.product_category || [])];
    },
    carBrandOptions() {
      return [this.defaultOption, ...(this.categories.car_brand || [])];
    },
    carModelOptions() {
      return [this.defaultOption, ...(this.carModels.car_model || [])];
    }
  },
  methods: {
    ...mapActions([
      "getCategories", "getCarModels"
    ]),
    showModal(path) {
      this.imageUrl = `${this.url}${path}`;
      this.isModalOpen = true;
    },
    fetchData() {
      this.loading = true;
      apiClient.get('/products/search', {
        params: {
          user_id: this.$store.getters.userData.id,
          page: this.pagination.page,
          limit: this.pagination.itemsPerPage,
          query: this.selectedCategories.query,
          product_type: this.selectedCategories.product_type,
          brand: this.selectedCategories.brand,
          product_category: this.selectedCategories.product_category,
          car_brand: this.selectedCategories.car_brand,
          car_model: this.selectedCategories.car_model,
          campaign: this.selectedCategories.campaign ? 1 : 0,
          new_product: this.selectedCategories.new_product ? 1 : 0,
          availability: this.selectedCategories.availability ? 1 : 0,
        }
      }).then(response => {
        this.items = response.data.data.data.map(item => {
          return {
            ...item,
            quantity: 1,
            isAddingToCart: false
          }
        });
        this.totalItems = response.data.data.total;
        this.loading = false;
      }).catch(error => {
        console.error("An error occurred while searching for data:", error);
        this.loading = false;
      });
    },
    handleSearch() {
      if (!this.loading) {
        this.fetchData();
      }
    },
    addToCart(item) {
      if (this.tableButtonLoading) return;
      this.tableButtonLoading = true;
      item.isAddingToCart = true
      apiClient.post('/cart/add', {
        user_id: this.$store.getters.userData.id,
        product_id: item.id,
        quantity: item.quantity,
      }).then((response) => {
        this.$store.commit("updateCartCount", response.data.data.cart_items_count);
        this.addedToCart = true
      }).catch(error => {
        console.error('An error occurred while adding the product to the cart:', error)
      }).finally(() => {
        item.isAddingToCart = false
        this.tableButtonLoading = false;
      })
    },
    fetchSliders() {
      this.slidersLoading = true;

      apiClient.get('/sliders', {
        params: {user_id: this.$store.getters.userData.id}
      })
          .then(response => {
            this.sliders = response.data.data;
          })
          .catch(error => {
            console.error('An error occurred while fetching sliders.:', error);
          })
          .finally(() => {
            this.slidersLoading = false;
          });
    },
    resetDefaultSelections() {
      const defaultVal = this.defaultOption;
      this.selectedCategories.product_type = defaultVal;
      this.selectedCategories.brand = defaultVal;
      this.selectedCategories.product_category = defaultVal;
      this.selectedCategories.car_brand = defaultVal;
      this.selectedCategories.car_model = defaultVal;
    },
  },
  watch: {
    defaultOption(newVal, oldVal) {
      // Dil değişikliğinde yalnızca select alanlarını güncelle
      const selectFields = [
        'product_type',
        'brand',
        'product_category',
        'car_brand',
        'car_model'
      ];

      selectFields.forEach(key => {
        if (this.selectedCategories[key] === oldVal || this.selectedCategories[key] === null) {
          this.selectedCategories[key] = newVal;
        }
      });
    },
    "selectedCategories.car_brand"(newData, oldData) {
      if(newData !== oldData && newData !== this.defaultOption){
        this.selectedCategories.car_model = this.defaultOption;
        this.getCarModels(newData);
      } else if(newData === this.defaultOption) {
        this.carModels.car_model = [];
        this.selectedCategories.car_model = this.defaultOption;
      }
    },
    'pagination.page'() {
      this.handleSearch();
    },
  },

  mounted() {
    this.getCategories();
    this.fetchSliders();
    this.resetDefaultSelections();
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

body {
  font-family: "Roboto", serif;
  background: #f5f5f5;
  font-size: 14px;
  letter-spacing: 0.5px;
}

a {
  text-decoration: none;
}

.customer-not small {
  position: absolute;
  background: red;
  color: white;
  width: 17px;
  height: 17px;
  font-size: 12px;
  text-align: center;
  border-radius: 30px;
  right: -9px;
  top: 1px;
}

.search-filters {
  display: flex;
  justify-content: space-evenly;
  margin-top: -9px;
}

.search-btn button {
  width: 100%;
  background: #eb0f2a;
  color: white;
}

.search-title {
  background: white;
  padding-top: 10px;
  padding-bottom: 10px;
  border-left: 4px solid #eb0f2a;
  padding-left: 15px;
  border-radius: 4px;
  font-weight: 500;
}

.body-part {
  margin-top: 35px;
}

.search-table {
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 20px;
}

.search-table .v-data-table__td .v-number-input--stacked {
  padding-top: 17px !important;
}

.search-table .v-data-table__td .v-number-input__control {
  width: 25px;
}

.search-table .v-data-table__td .v-field__field {
  height: 45px;
}

.search-table .v-field--variant-outlined, .search-table .v-field--single-line, .search-table .v-field--no-label {
  --v-field-padding-top: -10px;
}

.search-table .v-field__field input {
  padding-left: 5px;
  width: 50px;
  text-align: center;
}

.cart-icon {
  color: #eb0f2a;
  font-size: 25px;
  cursor: pointer;
  border-radius: 4px;
  transition: 500ms;
}

.v-data-table-footer__items-per-page {
  display: none;
}

.search-table .price-cell {
  min-width: 105px;
}

.m-w-60 {
  min-width: 60px !important;
}

.m-w-100 {
  min-width: 100px;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 270px;
}

@media screen and (max-width: 1279px) {
  .search-btn {
    margin-top: -10px;
    margin-bottom: 20px;
  }

  .sliders {
    margin-bottom: 20px;
  }

  .body-part {
    margin-top: 20px;
  }

  .search-title {
    margin-top: 10px;
    margin-bottom: 15px;
  }

  .search-filters {
    margin-top: -5px;
  }

  .search-table {
    margin-top: 5px;
  }
}

@media screen and (max-width: 576px) {
  .search-title {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 17px;
  }

  .sliders {
    margin-bottom: 15px;
  }

  .mb--13 {
    margin-bottom: -13px;
  }

  .search-filters .v-selection-control .v-label {
    font-size: 13px;
  }
  .search-btn {
    margin-top: -20px;
  }

  .v-field__input, .v-table__wrapper {
    font-size: 13px;
  }

  .search-table .price-cell {
    min-width: 115px;
  }

  .copyright {
    font-size: 13px;
  }

  .lang-select .v-field__input {
    font-size: 16px;
  }
}

</style>