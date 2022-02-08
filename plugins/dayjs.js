import Vue from 'vue'
import dayjs from "dayjs"

Vue.filter('date', (vaule, format = 'YYYY-MM-DD HH:mm:ss') => dayjs(vaule).format(format))