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
                  <router-link :to="props.item.href">{{
                    props.item.text
                  }}</router-link>
                </template>
              </VBreadcrumbs>

              <VLayout row wrap>
                <VFlex v-for="imgSrc in imageList" :key="imgSrc" xs4 d-flex>
                  <VCard flat tile class="d-flex">
                    <router-link :to="`/tkgs/${getImageIdBySrc(imgSrc)}`">
                      <VImg
                        :src="imgSrc"
                        aspect-ratio="1"
                        class="grey lighten-2"
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
                    </router-link>
                  </VCard>
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
export default class List extends Vue {
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
    }
  ]

  getImageIdBySrc(src: string) {
    const id = src.replace(/.*\/(\d+)\.jpg$/, '$1')
    return id
  }
}
</script>
