import {createStore} from 'vuex';
import apiClient from "@/services/apiClient";
import router from "@/router";

function getToken() {
    return localStorage.getItem('authToken');
}

export default createStore({
    state: {
        url: "https://backend.auto555.az/storage/",
        isLoggedIn: !!getToken(),
        userData: null,
        categories: [],
        loadingCategories: true,
        carModels: [],
        isDisabled: true,
        loadingForCarModel: false,
        logoutInProgress: false,
        cartItems: [],
        cartItemsLoading: false,
        loading: false
    },
    mutations: {
        setLoading(state, status) {
            state.loading = status;
        },
        setLoginState(state, status) {
            state.isLoggedIn = status;
        },
        setUserData(state, userData) {
            state.userData = userData.data;
            state.userData.cart_items_count = userData.data.cart_items_count ?? 0;
        },
        updateCartCount(state, newCount) {
            state.userData.cart_items_count = newCount;
        },
        setCategories(state, categories) {
            state.categories = categories;
        },
        setCarModels(state, categories) {
            state.carModels = categories;
        },
        setLoadingCategories(state, status) {
            state.loadingCategories = status;
        },
        setDisabled(state, status) {
            state.isDisabled = status;
        },
        setLoadingForCarModel(state, status) {
            state.loadingForCarModel = status;
        },
        setLogoutInProgress(state, status) {
            state.logoutInProgress = status;
        },
        setCartItems(state, items) {
            state.cartItems = items;
        },
        cartItemsLoading(state, status) {
            state.cartItemsLoading = status;
        },
    },
    actions: {
        async login({commit, dispatch}, token) {
            localStorage.setItem('authToken', token);
            commit('setLoginState', true);
            if (this.state.userData) {
                await dispatch('fetchUserData');
            }
        },
        async logout({ commit, state }) {
            if (state.logoutInProgress) {
                return;
            }

            commit('setLogoutInProgress', true);

            try {
                await apiClient.post('/logout');
                console.log('Logged out');
            } catch (error) {
                console.error('Logout failed:', error);
            } finally {
                localStorage.removeItem('authToken');
                commit('setLoginState', false);
                commit('setLogoutInProgress', false);
                router.push('/login');
            }
        },
        async fetchUserData({commit, dispatch}) {
            commit('setLoading', true);
            if (this.state.userData) return;
            try {
                const response = await apiClient.get("users/me");
                commit('setUserData', response.data);
            } catch (error) {
                dispatch('logout');
                console.error('Error fetching user data:', error);
            } finally {
                commit('setLoading', false);
            }
        },
        getCategories({commit}) {
            commit('setLoadingCategories', true);
            apiClient.get("/categories")
                .then(response => {
                    commit('setCategories', response.data.data);
                    commit('setLoadingCategories', false);
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                    commit('setLoadingCategories', false);
                });
        },
        getCartItems({state, commit}, overlayLoading = false) {
            if (overlayLoading) {
                commit('setLoading', true);
            }
            commit('cartItemsLoading', true);
            apiClient.get("/cart/products", {
                params: {
                    user_id: state.userData.id,
                }
            }).then(res => {
                commit('setCartItems', res.data.data);
                commit('updateCartCount', res.data.data.cart_products.length);
            }).catch(error => {
                console.error('Error fetching cart items:', error);
            }).finally(() => {
                commit('cartItemsLoading', false);
                if (overlayLoading) {
                    commit('setLoading', false);
                }
            });
        },
        getCarModels({commit}, id) {
            commit('setDisabled', true);
            commit('setLoadingForCarModel', true);
            apiClient.get(`/categories/${id}`)
                .then(response => {
                    commit('setCarModels', response.data.data);
                    commit('setDisabled', false);
                    commit('setLoadingForCarModel', false);
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                    commit('setDisabled', false);
                    commit('setLoadingForCarModel', false);
                });
        },
        removeProductFromCart({ state, commit, dispatch }, productId) {
            if (state.cartItemsLoading) return Promise.resolve(); // Prevent multiple calls

            commit('cartItemsLoading', true);

            return apiClient.delete(`/cart/remove`, {
                params: {
                    user_id: state.userData.id,
                    product_id: productId
                }
            })
                .then(() => dispatch('getCartItems')) // Ensure this is returned
                .finally(() => commit('cartItemsLoading', false));
        }
    },

    getters: {
        url: state => state.url,
        isLoggedIn: state => state.isLoggedIn,
        userData: state => state.userData,
        categories: state => state.categories,
        loadingCategories: state => state.loadingCategories,
        carModels: state => state.carModels,
        isDisabled: state => state.isDisabled,
        loadingForCarModel: state => state.loadingForCarModel,
        cartItems: state => state.cartItems,
        cartItemsLoading: state => state.cartItemsLoading,
        loading: state => state.loading,
    }
});