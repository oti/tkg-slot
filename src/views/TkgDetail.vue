<template>
  <VContent>
    <VContainer fluid grid-list-lg>
      <VLayout justify-center>
        <VFlex xs12 md8>
          <VCard class="ContentCard">
            <VToolbar card dark color="accent" class="darken-1">
              <VToolbarTitle>
                <h1 class="__title">
                  {{ this.$route.meta.title }}
                </h1>
              </VToolbarTitle>
            </VToolbar>

            <VContainer grid-list-sm fluid>
              <VBreadcrumbs :items="breadcrumbsItems" divider=">">
                <template v-slot:item="props">
                  <router-link
                    :to="props.item.disabled ? '' : props.item.href"
                    >{{ props.item.text }}</router-link
                  >
                </template>
              </VBreadcrumbs>

              <VLayout row wrap>
                <VFlex v-if="isValidImageId(this.$route.params.id)">
                  <VCard flat>
                    <VImg
                      :src="
                        `/tkg-slot/images/tkgs/${this.$route.params.id}.jpg`
                      "
                    >
                      <template v-slot:placeholder>
                        <VLayout fill-height align-center justify-center ma-0>
                          <VProgressCircular
                            indeterminate
                            color="grey lighten-5"
                          ></VProgressCircular>
                        </VLayout>
                      </template>
                    </VImg>
                  </VCard>
                </VFlex>
                <VFlex v-else>
                  <v-alert :value="true" type="error">
                    TKG IDが間違っています
                  </v-alert>
                </VFlex>
              </VLayout>
            </VContainer>
          </VCard>
        </VFlex>
      </VLayout>
    </VContainer>
  </VContent>
</template>

<script lang="ts">
import { TKGS } from '@/configs/tkgs'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Detail extends Vue {
  imageList: string[] = TKGS
  breadcrumbsItems: object[] = [
    {
      text: 'HOME',
      disabled: false,
      href: '/'
    },
    {
      text: 'TKG一覧',
      disabled: false,
      href: '/tkgs'
    },
    {
      text: 'TKG詳細',
      disabled: true,
      href: '/tkgs/:id'
    }
  ]

  isValidImageId(targetId: any) {
    return this.imageList.find(src => {
      const srcId = this.getImageIdBySrc(src)
      return targetId === srcId
    })
  }

  getImageIdBySrc(src: string) {
    const id = src.replace(/.*\/(\d+)\.jpg$/, '$1')
    return id
  }
}
</script>
