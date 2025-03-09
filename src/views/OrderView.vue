<template>
  <div style="background: #f5f5f5">
    <header-component/>
    <v-container>
      <v-row class="order-page">
        <v-col cols="12"><h2 class="search-title">{{ this.$t("message.my_orders") }}</h2></v-col>
        <v-col cols="12">
          <v-card>
            <v-col cols="12" class="text-right mb-2">
              <v-btn color="success" @click="exportOrders">Export</v-btn>
            </v-col>
            <v-data-table-server
                class="search-table"
                :headers="headers"
                :items="items"
                :loading="ordersLoading"
                :loading-text="$t('message.loading_please_wait')"
                :no-data-text="$t('message.information_not_found')"
                :items-length="totalItems"
                v-model:page="pagination.page"
                :items-per-page="pagination.itemsPerPage"
                @pagination="handleSearch"
            >
              <template v-slot:[`item.id`]="{ item }">
                <div class="width-75 text-center">
                  {{ item.id }}
                </div>
              </template>

              <template v-slot:[`item.created_at`]="{ item }">
                <div class="width-90 text-center">
                  {{ item.created_at }}
                </div>
              </template>

              <template v-slot:[`item.product_price`]="{ item }">
                <div class="price-cell text-center">
                  {{ Number(item.product_price).toFixed(2) + ' ₼' }}
                </div>
              </template>

              <template v-slot:[`item.total_price`]="{ item }">
                <div class="price-cell text-center">
                  {{ Number(item.total_price).toFixed(2) + ' ₼' }}
                </div>
              </template>

              <template v-slot:[`item.status`]="{ item }">
                <div class="width-110 text-center">
                  <div v-if="item.status.trim().toLowerCase() === 'pending'">{{ this.$t("message.waiting") }}</div>
                  <div v-else-if="item.status.trim().toLowerCase() === 'accepted'">{{ this.$t("message.accepted") }}</div>
                  <div v-else-if="item.status.trim().toLowerCase() === 'completed'">{{ this.$t("message.completed") }}</div>
                  <div v-else-if="item.status.trim().toLowerCase() === 'canceled'">{{ this.$t("message.cancelled") }}</div>
                </div>
              </template>

            </v-data-table-server>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <footer-component/>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import apiClient from "@/services/apiClient";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default {
  name: "OrderView",
  components: {FooterComponent, HeaderComponent},
  data() {
    return {
      items: [],
      ordersLoading: false,
      pagination: {
        page: 1,
        itemsPerPage: 10
      },
      totalItems: 0,
    }
  },
  computed: {
    headers() {
      return [
        { title: this.$t("message.name"), value: "name", align: "start" },
        { title: this.$t("message.order_no"), value: "id", align: "center" },
        { title: this.$t("message.price"), value: "product_price", align: "center" },
        { title: this.$t("message.quantity"), value: "quantity", align: "center" },
        { title: this.$t("message.total"), value: "total_price", align: "center" },
        { title: this.$t("message.status"), value: "status", align: "center" },
        { title: this.$t("message.date"), value: "created_at", align: "center" },
      ];
    },
    userData() {
      return this.$store.getters.userData;
    },
  },
  methods: {
    handleSearch() {
      if (!this.ordersLoading) {
        this.getOrders();
      }
    },
    getOrders() {
      this.ordersLoading = true;
      apiClient.get('/orders', {
        params: {
          "user_id": this.userData.id,
          "page": this.pagination.page,
          "limit": this.pagination.itemsPerPage,
        }
      }).then(response => {
        this.items = response.data.data.order_items
        this.totalItems = response.data.data.total;
      }).catch(error => {
        console.error('An error occurred while getting the orders:', error)
      }).finally(() => {
        this.ordersLoading = false;
      })
    },
    async exportOrders() {
      try {
        if (!this.items || this.items.length === 0) return;

        this.ordersLoading = true;

        const response = await apiClient.get('/orders', {
          params: {
            user_id: this.userData.id
          }
        });

        const orders = response.data.data.order_items;

        const exportData = orders.map(order => ({
          'Ad': order.name,
          'Sifariş No': order.id,
          'Qiymət (₼)': Number(order.product_price).toFixed(2),
          'Say': order.quantity,
          'Cəm (₼)': Number(order.total_price).toFixed(2),
          'Status': this.getStatusText(order.status),
          'Tarix': order.created_at
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sifarislerim");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "sifarislerim.xlsx");

      } catch (error) {
        console.error('Error occured when export orders:', error);
      } finally {
        this.ordersLoading = false;
      }
    },

    getStatusText(status) {
      switch (status.trim().toLowerCase()) {
        case 'pending':
          return 'Gözləmədə';
        case 'accepted':
          return 'Qəbul edildi';
        case 'completed':
          return 'Tamamlandı';
        case 'canceled':
          return 'Ləğv edildi';
        default:
          return status;
      }
    },
  },
  watch: {
    'pagination.page'() {
      this.handleSearch();
    },
  },
  mounted() {
    this.getOrders();
  }
}
</script>

<style scoped>
.width-75 {
  min-width: 75px;
}

.width-90 {
  min-width: 90px;
}

.width-110 {
  min-width: 110px;
}

.order-page {
  margin-top: 25px;
  margin-bottom: -40px;
}

@media screen and (max-width: 576px) {
  .order-page {
    margin-top: 10px;
  }
}
</style>