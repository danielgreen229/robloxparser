<template>
  <div class="app">
    <AppAlert 
      v-if="error" 
      :message="error" 
      type="error" 
      @dismiss="clearError"
    />
    
    <GameInput />
    <GamesTable />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGamesStore } from '@/stores/gamesStore'
import GameInput from '@/components/GameInput/GameInput.vue'
import GamesTable from '@/components/GamesTable/GamesTable.vue'
import AppAlert from '@/components/AppAlert/AppAlert.vue'

const gamesStore = useGamesStore()
const { error } = storeToRefs(gamesStore)

const clearError = () => {
  gamesStore.error = null
}
</script>

<style lang="scss">
@import '@/styles/main';
</style>