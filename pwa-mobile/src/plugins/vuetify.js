import { h } from 'vue'

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

import MainLogoIcon from '@/components/icons/MainLogo'
import ArrowBackIcon from '@/components/icons/ArrowBack'
import ChevronBack from '@/components/icons/ChevronBack'
import ChevronIcon from '@/components/icons/ChevronIcon'
import PhoneIcon from '@/components/icons/PhoneIcon'
import EmailIcon from '@/components/icons/EmailIcon'
import PhoneLargeIcon from '@/components/icons/PhoneLargeIcon'
import EmailLargeIcon from '@/components/icons/EmailLargeIcon'
import SuccessIcon from '@/components/icons/SuccessIcon'
import EyeHideIcon from '@/components/icons/EyeHideIcon'
import EyeShowIcon from '@/components/icons/EyeShowIcon'
import FooterHarvestIcon from '@/components/icons/FooterHarvestIcon'
import FooterHomeIcon from '@/components/icons/FooterHomeIcon'
import FooterTareIcon from '@/components/icons/FooterTareIcon'
import FooterAnalyticsIcon from '@/components/icons/FooterAnalyticsIcon'
import FooterAddIcon from '@/components/icons/FooterAddIcon'
import FooterHistoryIcon from '@/components/icons/FooterHistoryIcon'
import FooterMessengerIcon from '@/components/icons/FooterMessengerIcon'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon'
import ClockIcon from '@/components/icons/ClockIcon'
import CloseIcon from '@/components/icons/CloseIcon'
import InfoOneIcon from '@/components/icons/InfoOneIcon'
import InfoTwoIcon from '@/components/icons/InfoTwoIcon'
import CameraIcon from '@/components/icons/CameraIcon'
import TruckIcon from '@/components/icons/TruckIcon'
import TrailIcon from '@/components/icons/TrailIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import ImgDummy from '@/components/icons/ImgDummy'
import KgIcon from '@/components/icons/KgIcon'
import GaIcon from '@/components/icons/GaIcon'
import PercentIcon from '@/components/icons/PercentIcon'
import AlertIcon from '@/components/icons/AlertIcon'
import LogoutIcon from '@/components/icons/LogoutIcon'
import AnalyticsOneIcon from '@/components/icons/AnalyticsOneIcon'
import AnalyticsTwoIcon from '@/components/icons/AnalyticsTwoIcon'
import AnalyticsThreeIcon from '@/components/icons/AnalyticsThreeIcon'
import TabTodayIcon from '@/components/icons/TabTodayIcon'
import TabYesterdayIcon from '@/components/icons/TabYesterdayIcon'
import TabAllTimeIcon from '@/components/icons/TabAllTimeIcon'
import CalendarIcon from '@/components/icons/CalendarIcon'
import TractorIcon from '@/components/icons/TractorIcon'
import GearIcon from '@/components/icons/GearIcon'
import SendButtonIcon from '@/components/icons/SendButtonIcon'

const aliases = {
  mainLogo: MainLogoIcon,
  arrowBack: ArrowBackIcon,
  chevronBack: ChevronBack,
  chevron: ChevronIcon,
  phone: PhoneIcon,
  email: EmailIcon,
  phoneLarge: PhoneLargeIcon,
  emailLarge: EmailLargeIcon,
  success: SuccessIcon,
  show: EyeHideIcon,
  hide: EyeShowIcon,
  footerHarvest: FooterHarvestIcon,
  footerHome: FooterHomeIcon,
  footerTare: FooterTareIcon,
  footerAnalytics: FooterAnalyticsIcon,
  footerAdd: FooterAddIcon,
  footerHistory: FooterHistoryIcon,
  footerMessenger: FooterMessengerIcon,
  arrowRight: ArrowRightIcon,
  clock: ClockIcon,
  close: CloseIcon,
  infoOneIcon: InfoOneIcon,
  infoTwoIcon: InfoTwoIcon,
  camera: CameraIcon,
  truck: TruckIcon,
  trail: TrailIcon,
  trash: TrashIcon,
  imgDummy: ImgDummy,
  kg: KgIcon,
  ga: GaIcon,
  percent: PercentIcon,
  alertIcon: AlertIcon,
  logout: LogoutIcon,
  analyticsOneIcon: AnalyticsOneIcon,
  analyticsTwoIcon: AnalyticsTwoIcon,
  analyticsThreeIcon: AnalyticsThreeIcon,
  tabToday: TabTodayIcon,
  tabYesterday: TabYesterdayIcon,
  tabAllTime: TabAllTimeIcon,
  calendar: CalendarIcon,
  tractor: TractorIcon,
  gear: GearIcon,
  send: SendButtonIcon
}

const lightTheme = {
  dark: 'false',
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    white: '#FFFFFF',
    primary: '#0075D7',
    black: '#232426',
    grey: '#909090',
    'light-grey': '#D1D1D1',
    'dark-grey': '#3D3D3D',
    input: '#F4F4F4',
    error: '#C80000',
    success: '#07C168',
    'success-bg': '#CFF8E4',
    'footer-bg': '#FFFFFF',
    card: '#0075D7'
  }
}

const darkTheme = {
  colors: {
    background: '#000000',
    surface: '#000000',
    white: '#FFFFFF',
    primary: '#0075D7',
    black: '#232426',
    grey: '#909090',
    'light-grey': '#D1D1D1',
    'dark-grey': '#3D3D3D',
    input: '#333333',
    error: '#C80000',
    success: '#07C168',
    'success-bg': '#CFF8E4',
    'footer-bg': '#3D3D3D',
    card: '#333333'
  }
}

export default createVuetify({
  theme: {
    options: {
      customOptions: true
    },
    defaultTheme: 'lightTheme',
    themes: {
      lightTheme,
      darkTheme
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      custom: {
        component: (props) => h(props.tag, { class: props.icon })
      }
    }
  },
  defaults: {
    VBtn: {
      style: [{ height: '48px', textTransform: 'none', borderRadius: '8px', fontWeight: 600 }]
    }
  }
})
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
