import { ref } from 'vue'
import { useGamesStore } from '@/stores/gamesStore'

export const useFetchGames = () => {
  const gamesStore = useGamesStore()
  const inputUrls = ref('')
  const inputError = ref('')
  
  const extractUrls = (text) => {
    const urlRegex = /https?:\/\/www\.roblox\.com\/games\/\d+/g
    return text.match(urlRegex) || []
  }
  
  const validateUrls = (urls) => {
    if (urls.length === 0) {
      inputError.value = 'Валидных ссылок не найдено'
      return false
    }
    
    inputError.value = ''
    return true
  }
  
  const processGames = async () => {
    const newUrls = extractUrls(inputUrls.value)
    
    if (!validateUrls(newUrls)) {
      return
    }
    
    await gamesStore.fetchGamesInfo(newUrls)
    inputUrls.value = ''
  }
  
  return {
    inputUrls,
    inputError,
    processGames
  }
}