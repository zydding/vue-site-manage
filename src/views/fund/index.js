let tableCol= [
    {label: "日期", prop: "fillDate", width: 150, headerAlign: 'center', align: 'center',
        edit_render: {name: '$input', props: {type: 'date'}}
    },
    {label: "净值", prop: "netValue", headerAlign: 'center', align: 'right', width: 110,
        edit_render: {name: 'input', immediate: true, attrs: {type: 'text'}}
    },
    {label: "资金", prop: "money", headerAlign: 'center', align: 'right', width: 110,
        edit_render: {name: 'input', immediate: true, attrs: {type: 'text'}}
    },
]

export default tableCol