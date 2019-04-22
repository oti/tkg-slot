const ja = require('vee-validate/dist/locale/ja.js')

/**
 * エラーメッセージ
 */
export const messages = {
  requiredOne: 'いずれかの項目が必須です',
  alpha_dash: 'パスワードは半角英数とハイフン、アンダーバーのみ使用できます'
}

/**
 * 項目名
 */
export const attributes = {
  last_name: '姓',
  first_name: '名',
  last_name_kana: '姓（ふりがな）',
  first_name_kana: '名（ふりがな）',
  birthday: '生年月日',
  postal_code: '郵便番号',
  prefecture: '都道府県',
  city: '市区町村',
  tel: '電話番号',
  sex_type: '性別',
  password: 'パスワード',
  password_confirmation: 'パスワードの確認',
  university_name: '学校名',
  school_year: '学年',
  mail_address: 'メールアドレス',
  teacher_code: '教師ID',
  need_support: '理由',
  year: '年',
  month: '月',
  date: '日'
}

/**
 * 言語設定
 */
export const locale = {
  name: ja.name,
  messages: {
    ...ja.messages,
    ...messages
  },
  attributes: {
    ...ja.attributes,
    ...attributes
  }
}
