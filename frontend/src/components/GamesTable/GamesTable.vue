<template>
  <div class="games-table" v-if="games.length > 0 || invalidUrls.length > 0">
    <div class="games-table__header">
      <h3 class="games-table__title">Результат</h3>
      <div class="games-table__summary">
        Найдено {{ games.length }} 
        <br>
        Неверные ссылки {{ invalidUrls.length }} 
      </div>
    </div>
    
    <div v-if="invalidUrls.length > 0" class="games-table__invalid">
      <h4 class="games-table__invalid-title">Invalid URLs:</h4>
      <ul class="games-table__invalid-list">
        <li v-for="(url, index) in invalidUrls" :key="index" class="games-table__invalid-item">
          {{ url }}
        </li>
      </ul>
    </div>
    
    <div class="games-table__container">
      <table class="games-table__table">
        <thead class="games-table__thead">
          <tr class="games-table__tr">
            <th class="games-table__th">Изображение</th>
            <th class="games-table__th">Название</th>
            <th class="games-table__th">Создатель</th>
            <th class="games-table__th">Игроков</th>
            <th class="games-table__th">Посетителей</th>
            <th class="games-table__th">Создано</th>
            <th class="games-table__th">Жанр</th>
            <th class="games-table__th">В избранном</th>
          </tr>
        </thead>
        <tbody class="games-table__tbody">
          <tr v-for="(game, index) in games" :key="`${game.id}-${index}`" class="games-table__tr">
            <td class="games-table__td games-table__td--thumbnail">
              <img 
                :src="game.thumbnailUrl" 
                :alt="game.name" 
                class="games-table__thumbnail"
                @error="handleImageError"
              >
            </td>
            <td class="games-table__td games-table__td--name">
              <a 
                :href="`https://www.roblox.com/games/${game.rootPlaceId}`" 
                target="_blank"
                class="games-table__link"
              >
                {{ game.name }}
              </a>
              <div class="games-table__description">
                {{ truncateDescription(game.description) }}
              </div>
            </td>
            <td class="games-table__td games-table__td-user">
              <span v-if="game.creator.type === 'User'">👤</span>
              <span v-else>👥</span>
              {{ game.creator.name }}
              <span v-if="game.creator.hasVerifiedBadge" title="Verified">✓</span>
            </td>
            <td class="games-table__td games-table__td--players">
              {{ game.playing.toLocaleString("en-US") }}
            </td>
            <td class="games-table__td games-table__td--visits">
              {{ game.visits.toLocaleString("en-US") }}
            </td>
            <td class="games-table__td">
              {{ formatDate(game.created) }}
            </td>
            <td class="games-table__td">
              {{ game.genre }} {{game.genre_l1 != ''? '&' : ''}} {{game.genre_l1}} {{game.genre_l2 != ''? '&' : ''}} {{game.genre_l2}}
            </td>
            <td class="games-table__td">
            	{{game.favoritedCount.toLocaleString("en-US")}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGamesStore } from '@/stores/gamesStore'

const gamesStore = useGamesStore()
const { games, invalidUrls } = storeToRefs(gamesStore)

const truncateDescription = (text) => {
  if (!text) return ''
  return text.length > 100 ? text.substring(0, 100) + '...' : text
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const handleImageError = (e) => {
  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
}
</script>


<style lang="scss" scoped>
.games-table {
  max-width: 1200px;
  margin: 30px auto;
  background: var(--color-background-light);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &__header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 20px;
    color: var(--color-primary);
  }

  &__summary {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  &__invalid {
    margin-bottom: 20px;
    padding: 15px;
    background: var(--color-error-bg);
    border-radius: 4px;
  }

  &__invalid-title {
    font-size: 16px;
    margin-bottom: 8px;
    color: var(--color-error);
  }

  &__invalid-list {
    margin: 0;
    padding-left: 20px;
  }

  &__invalid-item {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin-bottom: 4px;
  }

  &__container {
    overflow-x: auto;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
  }

  &__thead {
    background: var(--color-background);
  }

  &__th {
    padding: 12px 15px;
    text-align: left;
    font-weight: 500;
    color: var(--color-text-secondary);
    border-bottom: 2px solid var(--color-border);
  }

  &__tbody {
    .games-table__tr:nth-child(even) {
      background: var(--color-background);
    }
  }

  &__tr {
    transition: background 0.2s;

    &:hover {
      background: var(--color-background-light) !important;
    }
  }

  &__td {
    padding: 12px 15px;
    vertical-align: top;
    border-bottom: 1px solid var(--color-border);

    &--thumbnail {
      width: 100px;
    }

    &--name {
      min-width: 250px;
    }

    &--players, &--visits {
      text-align: right;
      font-family: monospace;
    }
  }

  &__td-user {
  	text-wrap: nowrap;
  }

  &__thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
  }

  &__link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  &__description {
    margin-top: 5px;
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }
}
</style>