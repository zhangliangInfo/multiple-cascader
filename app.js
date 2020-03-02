import * as React from 'react'
import ReactDOM from 'react-dom'
import MultipleCascader from './src/index.jsx'

let options = [{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }, {
    value: 'suzhou',
    label: '苏州',
    children: [{
      value: 'yuanlin',
      label: '园林',
    }, {
      value: 'bowuyuan',
      label: '博物院',
    },{
      value: 'yulin',
      label: '画廊',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}, {
  value: 'beijing',
  label: '北京',
  children: [{
    value: 'haidian',
    label: '海淀',
    children: [{
      value: 'shangdi',
      label: '上地',
    }, {
      value: 'ruanjianyuan',
      label: '软件园',
    }, {
      value: 'xierqi',
      label: '西二旗',
    },{
      value: 'zhongguancun',
      label: 'zhongguancun',
    }],
  }, {
    value: 'fengtai',
    label: '丰台',
    children: [{
      value: 'muxiyuan',
      label: '木樨园',
    }, {
      value: 'beijingnanzhan',
      label: '北京南站',
    }, {
      value: 'xiaohongmen',
      label: '小红门',
    },{
      value: 'dahongmen',
      label: '大红门',
    }],
  }, {
    value: 'daxing',
    label: '大兴',
    children: [{
      value: 'zaoyuan',
      label: '枣园',
    }, {
      value: 'qingyuanlu',
      label: '清源路',
    }, {
      value: 'huangcun',
      label: '黄村',
    },{
      value: 'tiangongyuan',
      label: '天宫院',
    }],
  }],
}];

function handleChange(value) {
  console.log(value)
}

/**
 * 
 * @param {Boolean} isCeil : 已达到上限
 * @param {Boolean} notAllow ： 触发非法操作
 */
function handleSelectedChange(isCeil, notAllow) {
  console.log(isCeil)
  console.log(notAllow)
}


ReactDOM.render(
  <MultipleCascader
    onChange={handleChange}
    options={options}
    changeOnSelect={true}
    selectMax="3"
    selectChange={handleSelectedChange}
    index={0}
  />,
  document.getElementById('app')
)