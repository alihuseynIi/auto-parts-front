import { createStore } from 'vuex';
import apiClient from "@/services/apiClient";
import router from "@/router";

function getToken() {
    return localStorage.getItem('authToken');
}

export default createStore({
    state: {
        isLoggedIn: !!getToken(),
        userData: null,
        categories: [],
        loadingCategories: true,
        carModels: [],
        isDisabled: true,
        loadingForCarModel: false,
    },
    mutations: {
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
    },
    actions: {
        login({ commit, dispatch }, token) {
            localStorage.setItem('authToken', token);
            commit('setLoginState', true);
            dispatch('fetchUserData');
        },
        logout({ commit, state }) {
            apiClient.post('/logout', {"user_id": state.userData.id})
                .then(response => {
                    console.log('Logged out:', response.data);
                })
                .catch(error => {
                    console.error('Logout failed:', error);
                })
                .finally(() => {
                    localStorage.removeItem('authToken');
                    commit('setLoginState', false);
                    router.push('/login');
                });
        },
        fetchUserData({ commit, dispatch}) {
            apiClient.get("users/me")
                .then(response => {
                    commit('setUserData', response.data);
                })
                .catch(error => {
                    dispatch('logout');
                    console.error('Error fetching user data:', error);
                });
        },
        getCategories({ commit }) {
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
        getCarModels({ commit }, id) {
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
        }
    },

    getters: {
        isLoggedIn: state => state.isLoggedIn,
        userData: state => state.userData,
        categories: state => state.categories,
        loadingCategories: state => state.loadingCategories,
        carModels: state => state.carModels,
        isDisabled: state => state.isDisabled,
        loadingForCarModel: state => state.loadingForCarModel,
    }
});