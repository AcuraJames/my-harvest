import { createStore } from 'vuex'
import { authModule } from '@/store/modules/auth'
import { storageModule } from '@/store/modules/storage'
import { commonModule } from '@/store/modules/common'
import { weigherModule } from '@/store/modules/weigher'
import { storekeeperModule } from '@/store/modules/storekeeper'
import { managerModule } from '@/store/modules/manager'

export default createStore({
  modules: {
    authModule,
    storageModule,
    commonModule,
    weigherModule,
    storekeeperModule,
    managerModule
  }
})
