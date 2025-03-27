<template>
  <div style="background: #f5f5f5">
    <header-component/>
    <v-container>
      <v-row class="cart-page">
        <v-col cols="12"><h2 class="search-title">{{ this.$t('message.my_cart') }}</h2></v-col>
        <v-col cols="12" lg="9">
          <v-card>
            <v-data-table-server
                class="search-table"
                :headers="headers"
                :items="cartItems.cart_products"
                :loading="cartItemsLoading"
                :loading-text="$t('message.loading_please_wait')"
                :no-data-text="$t('message.information_not_found')"
                :items-length="cartItems.cart_products?.length ?? 0"
                hide-default-footer
            >
              <template v-slot:[`item.price`]="{ item }">
                <div class="price-cell text-center">
                  {{ item.stock ? item.price?.toFixed(2) : '0.00' }} ₼
                </div>
              </template>

              <template v-slot:[`item.discounted_price`]="{ item }">
                <div class="price-cell text-center">
                  {{ item.stock ? ((item.price - item.discounted_price) * item.quantity).toFixed(2) : '0.00' }} ₼
                </div>
              </template>

              <template v-slot:[`item.total_amount`]="{ item }">
                <div class="price-cell">
                  {{ item.stock ? item.total_amount?.toFixed(2) : '0.00' }} ₼
                </div>
              </template>

              <template v-slot:[`item.quantity`]="{ item }">
                <div class="m-w-60">
                  <v-number-input
                      :disabled="!item.stock || disabledInput"
                      :min="1"
                      :max="item.stock"
                      v-model="item.quantity"
                      variant="solo"
                      control-variant="stacked"
                      @update:modelValue="updateQuantity(item)"
                  >
                  </v-number-input>
                </div>
              </template>

              <template v-slot:[`item.stock`]="{ item }">
                <span style="color: green" v-if="item.stock > 0">{{ item.stock }}</span>
                <span style="color: red" v-else>
                <font-awesome-icon :icon="['fas', 'xmark']"/>
              </span>
              </template>

              <template v-slot:[`item.remove`]="{item}">
                <div class="remove-icon">
                  <font-awesome-icon @click="removeProduct(item.product_id)" :icon="['fas', 'trash']"/>
                </div>
              </template>
            </v-data-table-server>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3"  class="order-select">
          <div class="right-part">
            <div class="price-box">
              <span class="price-titles">{{ this.$t('message.total') }} :</span>
              <span>
                <v-progress-circular
                    v-if="cartItemsLoading"
                    indeterminate
                    color="success"
                    size="20"
                    class="mx-auto"
                ></v-progress-circular>
                <span v-else>{{ cartItems.total_price?.toFixed(2) ?? 0 }} ₼</span>
              </span>
            </div>
            <div class="price-box">
              <span class="price-titles">{{ this.$t('message.sale') }} :</span>
              <span>
                <v-progress-circular
                    v-if="cartItemsLoading"
                    indeterminate
                    color="success"
                    size="20"
                    class="mx-auto"
                ></v-progress-circular>
                <span v-else>{{ cartItems.discount?.toFixed(2) ?? 0 }} ₼</span>
              </span>
            </div>
            <div class="price-box">
              <span class="price-titles">{{ this.$t('message.total2') }} :</span>
              <span>
                <v-progress-circular
                    v-if="cartItemsLoading"
                    indeterminate
                    color="success"
                    size="20"
                    class="mx-auto"
                ></v-progress-circular>
                <span v-else>{{ cartItems.total_amount?.toFixed(2) ?? 0 }} ₼</span>
              </span>
            </div>
          </div>

          <custom-select
              v-model="selectedOrderDetails.address"
              :label="$t('message.address')"
              :items="userData.addresses"
          ></custom-select>

          <custom-select
              v-model="selectedOrderDetails.delivery_time"
              :label="$t('message.delivery_time')"
              :items="times"
          ></custom-select>

          <v-btn
              class="order-btn text-none"
              color="success"
              :loading="orderLoading"
              :disabled="
              selectedOrderDetails.address == null ||
              selectedOrderDetails.delivery_time == null ||
              cartItems.cart_products.length === 0 ||
              !cartItems.cart_products.some(product => product.stock > 0) ||
              orderLoading"
              @click="order()"
          >
            {{ this.$t('message.place_an_order') }}
          </v-btn>
        </v-col>
      </v-row>

      <v-dialog persistent v-model="warningModal" max-width="600px">
        <v-card>
          <v-card-text>
            <div class="info-modal">
              <font-awesome-icon :icon="['fas', 'circle-info']" />
              <p class="mt-5">
                <span> {{ this.$t('message.attention') }}! </span>{{this.$t('message.out_of_stock_message')}}
              </p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" @click="warningModal = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent v-model="successModal" max-width="600px">
        <v-card>
          <v-card-text>
            <div class="info-modal">
              <font-awesome-icon style="color: green" :icon="['fas', 'circle-check']" />
              <div class="mt-5">
                <h2 class="mb-2">{{ this.$t('message.order_registered') }}</h2>
                <i18n-t keypath="message.order_status_info" tag="p">
                  <template #order_link>
                    <router-link to="/orders">
                      <strong>{{ $t('message.my_orders') }}</strong>
                    </router-link>
                  </template>
                </i18n-t>
                <p class="mt-2"><strong>{{ this.$t('message.thanks') }}</strong> 😊</p>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" @click="successModal = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <footer-component/>

    <v-snackbar timeout="2000" color="error" v-model="toaster">
      {{ $t('message.product_deleted_from_cart') }}
    </v-snackbar>

    <v-snackbar timeout="5000" color="error" v-model="toasterError">
      {{ $t('message.error') }}
    </v-snackbar>
  </div>
</template>

<script>
import FooterComponent from "@/components/FooterComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import {mapActions} from "vuex";
import {VNumberInput} from "vuetify/lib/labs/VNumberInput";
import CustomSelect from "@/components/CustomSelect.vue";
import apiClient from "@/services/apiClient";

export default {
  components: {CustomSelect, VNumberInput, FooterComponent, HeaderComponent},
  data() {
    return {
      selectedOption: null,
      selectedOrderDetails: {
        address: null,
        delivery_time: null,
      },
      toaster: false,
      orderLoading: false,
      warningModal: false,
      successModal: false,
      disabledInput: false,
      toasterError: false
    };
  },
  computed: {
    headers() {
      return [
        { title: this.$t('message.name'), value: "name", align: "start" },
        { title: this.$t('message.available'), value: "stock", align: "center" },
        { title: this.$t('message.pieces'), value: "quantity", align: "center" },
        { title: this.$t('message.price'), value: "price", align: "center" },
        { title: this.$t('message.sale'), value: "discounted_price", align: "center" },
        { title: this.$t('message.total'), value: "total_amount", align: "center" },
        { title: this.$t('message.remove'), value: "remove", align: "center" },
      ];
    },
    cartItems() {
      return this.$store.getters.cartItems;
    },
    cartItemsLoading() {
      return this.$store.getters.cartItemsLoading;
    },
    userData() {
      return this.$store.getters.userData;
    },
    times() {
      return [
        {id: 1, name: '09:00 - 15:00'},
        {id: 2, name: '15:00 - 18:00'}
      ]
    }
  },
  methods: {
    ...mapActions(['getCartItems', 'removeProductFromCart']),
    removeProduct(id) {
      this.removeProductFromCart(id).then(() => {
        this.toaster = !this.toaster;
      });
    },
    updateQuantity(item) {
      if (item.quantity <= 0) return;
      this.disabledInput = true;
      this.$store.commit("setLoading", true);
      apiClient.post('/cart/add', {
        user_id: this.$store.getters.userData.id,
        product_id: item.product_id,
        quantity: item.quantity,
      }).then(() => {
        this.getCartItems(true)
      }).catch(error => {
        console.error('An error occurred while adding the product to the cart:', error)
      }).finally(() => {
        this.disabledInput = false;
      })
    },
    order() {
      this.orderLoading = true;
      apiClient.post('/orders', {
        user_id: this.$store.getters.userData.id,
        address_id: this.selectedOrderDetails.address,
        date: this.selectedOrderDetails.delivery_time,
        total_price: this.cartItems.total_amount,
        products: this.cartItems.cart_products.filter(product => product.stock > 0)
      }).then(() => {
        this.getCartItems(true)
        this.selectedOrderDetails.address = null
        this.selectedOrderDetails.delivery_time = null
        this.successModal = true;
      }).catch(error => {
        if (error.status === 409) {
          this.getCartItems()
          this.warningModal = true
        } else {
          this.toasterError = true;
        }
        console.error('An error occurred while order the products:', error)
      }).finally(() => {
        this.orderLoading = false;
      })
    }
  },
  watch: {
    "cartItems.cart_products": {
      deep: true,
      handler(newCartProducts) {
        newCartProducts.forEach(item => {
          if (item.stock !== 0 && item.quantity > item.stock) {
            item.quantity = item.stock;
          }
        });
      }
    }
  },
  mounted() {
    this.getCartItems()
  }
};
</script>

<style scoped>
.right-part {
  background: white;
  border-radius: 4px;
  margin-bottom: 10px;
}

.price-box {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid gainsboro;
  padding: 15px;
}

.right-part .price-box:last-child {
  border: none;
}

.price-titles {
  font-weight: 500;
}

.order-btn {
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 45px;
}

.cart-page {
  margin-top: 25px;
  margin-bottom: -40px;
}

.remove-icon {
  color: #eb0f2a;
  cursor: pointer;
  font-size: 16px;
}

.search-table {
  margin-bottom: 20px;
  margin-top: 15px;
}

.search-table .v-data-table__td .v-number-input--stacked {
  padding-top: 17px !important;
}

.info-modal {
  text-align: center;
}

.info-modal svg {
  color: #eb0f2a;
  font-size: 45px;
  margin-top: 25px;
}

.info-modal p {
  line-height: 1.7;
}

.info-modal span {
  font-weight: bold;
  font-size: 16px;
  margin-right: 5px;
}

@media screen and (max-width: 576px) {
  .right-part {
    font-size: 13px;
  }
  .cart-page {
    margin-top: 10px;
  }
}
</style>

<style>
.order-select .v-field--appended, .order-select .v-field__field {
  height: 55px;
}

.order-select .v-field {
  margin-bottom: -10px;
}

.order-select .v-select__selection-text {
  font-size: 14px;
}

.order-select .v-select .v-field.v-field {
  box-shadow: none;
}

.order-select .v-label .order-select v-field-label {
  color: black !important;
  opacity: 1;
}
</style>