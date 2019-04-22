import { locale as ja } from '@/plugins/validator/dictionary'
import { fistEMail } from '@/plugins/validator/rules'
import { hiragana } from '@/plugins/validator/rules'
import VeeValidate, { Validator } from 'vee-validate'
import Vue from 'vue'

/**
 * プラグインを引き当てる
 * @param ctx
 */
export default function useVeeValidate(ctx = Vue) {
  // ローカライズ
  Validator.localize('ja', ja)

  // カスタムバリデーションルール
  Validator.extend('fist_email', fistEMail)
  Validator.extend('hiragana', hiragana)

  return ctx.use(VeeValidate, {
    locale: 'ja',
    events: 'blur',
    delay: 200
  })
}
