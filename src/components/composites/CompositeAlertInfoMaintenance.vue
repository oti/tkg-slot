<template>
  <BaseAlertInfo :value="true" type="info" outline class="--info-maintenance">
    <p class="mb-0">
      <strong>午前3:00〜3:30</strong
      >の間、サーバーメンテナンスのためサービスの利用ができなくなる場合があります。
    </p>
  </BaseAlertInfo>
</template>

<script lang="ts">
import BaseAlertInfo from '@/components/bases/BaseAlert.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    BaseAlertInfo
  }
})
export default class CompositeAlertInfoMaintenance extends Vue {}
</script>
