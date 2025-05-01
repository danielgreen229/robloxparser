<template>
  <div class="game-input">
    <div class="game-input__header">
      <h2 class="game-input__title">Roblox</h2>
      <p class="game-input__description">
        Введите URL-адреса игр Roblox (по одному в строку или разделенные пробелами)
      </p>
    </div>
    
    <div class="game-input__field">
      <textarea
        class="game-input__textarea"
        v-model="inputUrls"
        placeholder="https://www.roblox.com/games/189707/Natural-Disaster-Survival"
        rows="5"
      ></textarea>
      
      <div v-if="inputError" class="game-input__error">
        {{ inputError }}
      </div>
    </div>
    
    <div class="game-input__actions">
      <button
        class="game-input__button game-input__button--submit"
        @click="processGames"
        :disabled="loading"
      >
        <span v-if="!loading">Получить</span>
        <span v-else>Загрузка...</span>
      </button>
      
      <button
        class="game-input__button game-input__button--clear"
        @click="clearInput"
        :disabled="loading"
      >
        Очистить
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFetchGames } from '@/composables/useFetchGames'
import { useGamesStore } from '@/stores/gamesStore'
import { storeToRefs } from 'pinia'

const gamesStore = useGamesStore()
const { loading } = storeToRefs(gamesStore)
const { inputUrls, inputError, processGames } = useFetchGames()

const clearInput = () => {
  inputUrls.value = ''
  gamesStore.clearGames()
  localStorage.removeItem('gamesData')
}
</script>


<style lang="scss" scoped>
.game-input {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: var(--color-background-light);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &__header {
    margin-bottom: 20px;
  }

  &__title {
    font-size: 24px;
    color: var(--color-primary);
    margin-bottom: 8px;
  }

  &__description {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  &__field {
    margin-bottom: 20px;
  }

  &__textarea {
    min-width: 100%;
    min-height: 360px;
    width: 100%;
    padding: 12px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  &__error {
    margin-top: 8px;
    color: var(--color-error);
    font-size: 13px;
  }

  &__actions {
    display: flex;
    gap: 10px;
  }

  &__button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &--submit {
      background: var(--color-primary);
      color: white;

      &:hover:not(:disabled) {
        background: var(--color-primary-dark);
      }
    }

    &--clear {
      background: var(--color-background);
      border: 1px solid var(--color-border);

      &:hover:not(:disabled) {
        background: var(--color-background-light);
      }
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}
</style>

