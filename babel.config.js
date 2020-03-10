module.exports = {
  presets: [
    '@vue/app',
    ['env',            //添加 babel-preset-env 配置
      {
        'modules': false
      }
    ]
  ],
  plugins: [        // element按需加載
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ]
  ]

}
