<template>
  <div v-if="message" class="app-alert" :class="`app-alert--${type}`">
    <div class="app-alert__content">
      <span class="app-alert__icon">
        <template v-if="type === 'error'">⚠️</template>
        <template v-else-if="type === 'success'">✅</template>
        <template v-else>ℹ️</template>
      </span>
      <span class="app-alert__message">{{ message }}</span>
    </div>
    <button v-if="dismissible" class="app-alert__close" @click="$emit('dismiss')">
      &times;
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'error', 'warning'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: true
  }
})

defineEmits(['dismiss'])
</script>


<style lang="scss" scoped>
.app-alert {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;

  &--info {
    background: var(--color-info-bg);
    color: var(--color-info);
  }

  &--success {
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  &--error {
    background: var(--color-error-bg);
    color: var(--color-error);
  }

  &--warning {
    background: var(--color-warning-bg);
    color: var(--color-warning);
  }

  &__content {
    display: flex;
    align-items: center;
  }

  &__icon {
    margin-right: 10px;
    font-size: 16px;
  }

  &__message {
    flex: 1;
  }

  &__close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    margin-left: 15px;
    opacity: 0.7;
    padding: 0 5px;

    &:hover {
      opacity: 1;
    }
  }
}
</style>