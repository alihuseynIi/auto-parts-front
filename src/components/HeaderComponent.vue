<template>
  <div>
    <v-navigation-drawer
        v-model="drawer"
        temporary
        left
    >

      <div class="drawer-logo">
          <v-img src="@/assets/images/logo.svg"></v-img>
      </div>

      <v-list>
        <v-list-item class="mobile-menu">
          <router-link to="/">
            <v-list-item-title>{{ this.$t('message.homepage') }}</v-list-item-title>
          </router-link>
          <router-link to="/orders">
            <v-list-item-title>{{ this.$t('message.orders') }}</v-list-item-title>
          </router-link>
          <router-link to="/cart">
            <v-list-item-title>{{ this.$t('message.my_cart') }}</v-list-item-title>
          </router-link>
          <v-list-item-title @click="handleLogout()" class="drawer-exit">{{ this.$t('message.exit') }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <div class="mobile-lang">
        <v-select
            v-model="currentLocale"
            :items="['AZ', 'RU']"
            variant="solo"
        ></v-select>
      </div>
    </v-navigation-drawer>

    <header class="pt-3 pb-4 pl-5 pr-5">
      <v-row>
        <v-col cols="5" sm="3">
          <div class="mt-1 phone-icon">
            <font-awesome-icon :icon="['fas', 'phone']"/>
            <span class="header-phone">050 427 77 45</span>
          </div>
        </v-col>
        <v-col cols="7" sm="9" class="d-inline-block lang-select m-none">
          <ul>
            <li>
              <router-link class="customer-bag" to="/cart">
                <font-awesome-icon :icon="['fas', 'cart-shopping']"/>
                <small>
                  {{ cartCount }}
                </small>
              </router-link>
            </li>
            <li>
              <v-select
                  v-model="currentLocale"
                  :items="['AZ', 'RU']"
                  variant="solo"
              ></v-select>
            </li>
          </ul>
        </v-col>

        <v-col class="p-none" cols="7" sm="9">
          <div class="mobile-name">
            {{ userName }}
          </div>
        </v-col>
      </v-row>
    </header>

    <div class="bg-white header-pc">
      <v-container class="pt-2 pb-2">
        <v-row align="start" no-gutters>
          <v-col cols="2">
            <router-link to="/">
              <v-img class="header-logo" src="@/assets/images/logo.svg"></v-img>
            </router-link>
          </v-col>

          <v-col cols="7">
            <ul class="header-menu">
              <li>
                <router-link to="/">
                  {{ $t('message.homepage') }}
                </router-link>
              </li>
              <li>
                <router-link to="/orders">
                  {{ $t('message.orders') }}
                </router-link>
              </li>
              <li>
                <router-link to="/cart">
                  {{ $t('message.my_cart') }}
                </router-link>
              </li>
            </ul>
          </v-col>

          <v-col align="end" cols="3">
            <ul class="top-menu">
              <li class="mr-4 user-name">
                {{ userName }}
              </li>
              <li @click="handleLogout()" class="exit">{{ $t('message.exit') }}</li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="bg-white mobile-pc">
      <v-container class="pt-2 pb-2">
        <v-row class="align-center">
          <v-col cols="3" class="d-flex justify-start menu">
            <font-awesome-icon @click="toggleDrawer" :icon="['fas', 'bars']" class="menu-icon"/>
          </v-col>

          <v-col cols="6" class="d-flex justify-center">
            <router-link to="/">
              <v-img class="header-logo" src="@/assets/images/logo.svg"></v-img>
            </router-link>
          </v-col>

          <v-col cols="3" class="d-flex justify-end">
            <router-link class="customer-bag mobile-cart" to="/cart">
              <font-awesome-icon :icon="['fas', 'cart-shopping']"/>
              <small>
                {{ cartCount }}
              </small>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "HeaderComponent",
  data() {
    return {
      currentLocale: this.getInitialLocale(),
      drawer: false,
    };
  },
  computed: {
    cartCount() {
      return this.$store.getters.userData?.cart_items_count ?? 0;
    },
    userName() {
      return this.$store.getters.userData?.name;
    },
  },
  methods: {
    ...mapActions(["logout"]),
    getInitialLocale() {
      return localStorage.getItem('userLocale') || this.$i18n.locale;
    },
    handleLogout() {
      this.logout().then(() => {
        this.$router.push('/login');
      }).catch(error => {
        console.error('Logout failed:', error);
      });
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  },
  watch: {
    currentLocale(newLocale) {
      this.$i18n.locale = newLocale;
      localStorage.setItem('userLocale', newLocale);
    },
  }
};
</script>

<style>
.lang-select .v-input {
  display: inline-block;
}

.lang-select .v-input--density-default {
  --v-input-control-height: 0 !important;
  --v-input-padding-top: 0 !important;
}

.lang-select .v-input__control {
  width: 72px;
}

.lang-select .v-field__input {
  padding-top: 3px;
  padding-bottom: 3px;
}

.lang-select .v-input__control .v-field {
  padding: 0;
  box-shadow: none;
}

.lang-select ul {
  display: flex;
  justify-content: flex-end;
  list-style: none;
}
</style>

<style scoped>
header {
  background-color: #f5f5f5;
  height: 56px;
}

.phone-icon {
  color: black;
}

.header-phone {
  margin-left: 10px;
}

.customer-bag svg {
  margin-right: 3px;
  font-size: 19px;
  color: black;
  margin-left: 14px;
  margin-top: 6px;
}

.customer-bag {
  background: white;
  color: white;
  border-radius: 4px;
  transition: 500ms;
  font-size: 14px;
  position: relative;
  margin-right: 16px;
  display: inline-block;
  text-decoration: none;
  width: 50px;
  height: 30px;
}

.customer-bag small {
  position: absolute;
  left: -13px;
  background: #eb0f2a;
  width: 20px;
  color: white;
  height: 20px;
  text-align: center;
  padding-top: 2px;
  border-radius: 29px;
  top: -1px;
}

.customer-bag svg {
  margin-right: 3px;
}

.header-logo {
  width: 150px;
  height: 100px;
}

.header-menu {
  display: flex;
  justify-content: space-evenly;
  list-style: none;
  margin-top: 35px;
  font-weight: 500;
}

.header-menu a {
  color: black;
}

.top-menu li svg {
  padding-top: 4px;
  margin-right: 7px;
}

.top-menu {
  margin-top: 30px;
}

.top-menu li {
  display: inline-block;
}

.user-name {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.exit {
  background: #eb0f2a;
  color: white;
  padding: 4px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.mobile-pc {
  display: none;
}

.menu svg {
  font-size: 30px;
  cursor: pointer;
}

.mobile-cart {
  background: #f5f5f5;
  margin-right: 0;
  height: 40px;
}

.mobile-cart svg {
  margin-top: 11px;
}

.mobile-cart small {
  top: -5px;
  left: -8px;
}

.mobile-lang {
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 100%;
  padding: 10px;
}

.mobile-menu .v-list-item-title{
  font-size: 14px;
  font-weight: 400;
}

.mobile-menu a {
  color: black;
  display: block;
  margin-bottom: 10px;
  border-bottom: 1px solid gainsboro;
  padding-bottom: 10px;
}

.drawer-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  padding: 10px 0;
}

.drawer-exit {
  cursor: pointer;
}

.mobile-name {
  margin-top: 3px;
  text-align: right;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-size: 13px;
}

.p-none {
  display: none;
}

@media screen and (max-width: 1279px) {
  .header-pc {
    display: none;
  }

  .mobile-pc {
    display: block;
  }

  .m-none {
    display: none !important;
  }

  .p-none {
    display: block;
  }

  .header-phone {
    font-size: 13px;
  }
}
</style>
