import { defineStore } from 'pinia'

export const useGamesStore = defineStore('games', {
  state: () => {
    const savedData = localStorage.getItem('gamesData')
    const initialState = {
      games: [],
      loading: false,
      error: null,
      invalidUrls: []
    }
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        return {
          ...initialState,
          games: parsedData.games || [],
          invalidUrls: parsedData.invalidUrls || []
        }
      } catch (e) {
        console.error('Ошибка', e)
        return initialState
      }
    }
    
    return initialState
  },
  actions: {
    async fetchGamesInfo(urls) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('http://localhost:3000/games/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            games: urls.map(url => ({ url }))
          }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Просто добавляем новые игры без проверки дублей
          this.games = [...data.games, ...this.games]
          
          // Добавляем невалидные URL
          this.invalidUrls = [...this.invalidUrls, ...data.invalidUrls]
          
          // Сохраняем обновленные данные
          localStorage.setItem('gamesData', JSON.stringify({
            games: this.games,
            invalidUrls: this.invalidUrls
          }))
        } else {
          throw new Error(data.message || 'Ошибка парсинга')
        }
      } catch (err) {
        this.error = err.message
        console.error('Ошибка парсинга:', err)
      } finally {
        this.loading = false
      }
    },
    clearGames() {
      this.games = []
      this.invalidUrls = []
      localStorage.removeItem('gamesData')
    }
  }
})