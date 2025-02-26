import { createI18n } from 'vue-i18n'

// Messages object containing translations
const messages = {
    AZ: {
        message: {
            exit: 'Çıxış',
            homepage: 'Ana Səhifə',
            orders: 'Sifarişlər',
            my_cart: 'Səbətim',
            product_search: 'Məhsul Axtarışı',
            product_type: 'Məhsul növü',
            brand: 'Brend',
            category: 'Kateqoriya',
            car_brand: 'Avtomobilin markası',
            car_model: 'Avtomobilin modeli',
            search: 'Axtar',
            campaign: 'Aksiya',
            new_products: 'Yeni Məhsullar',
            available: 'Mövcuddur',
            slider_not_found: 'Slayder məlumatları tapılmadı',
            loading_please_wait: 'Yüklənir... Zəhmət olmasa gözləyin',
            information_not_found: 'Məlumat tapılmadı',
            product_image: 'Məhsulun şəkli',
            close: 'Bağla',
            product_added_to_cart: 'Məhsul səbətə əlavə olundu!',
            all_rights_reserved: 'Bütün hüquqları qorunur.',
            code: 'Kod',
            name: 'Ad',
            oem_code: 'OEM No',
            image: 'Şəkil',
            price: 'Qiymət',
            discounted_price: 'Endirimli qiymət',
            quantity: 'Say',
            add_to_cart: 'Səbətə at',
            all: 'Hamısı'
        }
    },
    RU: {
        message: {
            exit: 'Bыход',
            homepage: 'Домашняя страница',
            orders: 'Заказы',
            my_cart: 'Моя корзина',
            product_search: 'Поиск продукта',
            product_type: 'Тип продукта',
            brand: 'Бренд',
            category: 'Категория',
            car_brand: 'Марка автомобиля',
            car_model: 'Модель автомобиля',
            search: 'Поиск',
            campaign: 'Kампания',
            new_products: 'Новые продукты',
            available: 'Доступный',
            slider_not_found: 'Данные слайдера не найдены',
            loading_please_wait: 'Загрузка... Пожалуйста, подождите.',
            information_not_found: 'Информация не найдена',
            product_image: 'Изображение продукта',
            close: 'Закрывать',
            product_added_to_cart: 'Продукт добавлен в корзину!',
            all_rights_reserved: 'Все права защищены.',
            code: 'Код',
            name: 'Имя',
            oem_code: 'OEM No',
            image: 'Kартина',
            price: 'Цена',
            discounted_price: 'Цена со скидкой',
            quantity: 'Число',
            add_to_cart: 'В корзину',
            all: 'Все'
        }
    }
};

// Create i18n instance with options
const i18n = createI18n({
    legacy: false, // you must specify 'legacy: false' option
    locale: 'AZ', // set locale
    fallbackLocale: 'AZ', // set fallback locale
    messages, // set locale messages
});

export default i18n;
