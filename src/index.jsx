import * as React from 'react'
import { Cascader, Input, Icon, Button } from 'antd';
import RcCascader from 'rc-cascader';
import { getFileItem } from 'antd/lib/upload/utils';
import './style/index.less'


const options = [{
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

let currentValue = [];

class MultipleCascader extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleContentKeyDown = this.handleContentKeyDown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.defaultDisplayRender = this.defaultDisplayRender.bind(this);
    this.handlePopupVisibleChange = this.handlePopupVisibleChange.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleContentClick = this.handleContentClick.bind(this);
    
    this.state = {
      values: [],
      inputValue: '',
      count: 0,
      cascaderValue: [],
      activeObj: {},
      currentValue: []
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(JSON.stringify(prevState.activeObj) !== JSON.stringify(this.state.activeObj)) {
      // this.getClassActive(0, this.state.activeObj.level1);
    }
  }

  // add active className
  getClassActive(level, ary = []) {
    if(isNaN(level)  || typeof level != 'number') return;
    const parentDOM = document.querySelector('.ant-cascader-menus');
    if(parentDOM == null) return;
    const parentUl = parentDOM.querySelectorAll('.ant-cascader-menu')[level];
    if(parentUl == null) return;
    const LiItems = parentUl.querySelectorAll('li');
    const actyCls = 'multiple-cascader-menu-item-active'
    LiItems.forEach(LiItem => {
      const clsList = Array.from(LiItem.classList);
      if(clsList.indexOf(actyCls) !== -1) {
        clsList.splice(clsList.indexOf(actyCls), 1);
      }
      LiItem.className = clsList.join(' ');
    });
    setTimeout(function() {
      ary.forEach(_ => {
        let LiItem = parentUl.querySelectorAll('li')[_];
        if(LiItem && !Array.from(LiItem.classList).includes(actyCls)) {
          LiItem.className += (' ' + actyCls);
        }
      });
    }, 0);
  }

  handlePopupVisibleChange(visible) {
    // 当选项显示时,选中已选的选项
    if(visible) {
      const {values: stateValues} = this.state;
      this.handleActiveOption(stateValues, options);
    } else {
      currentValue = [];
    }
  }

  /**
   * 
   * @param {string[][]} stateValues 
   * @param {object[]} options 
   */
  handleActiveOption(stateValues, options) {
    this.getChildActiveIndexs(options, stateValues, currentValue.length ? currentValue : this.state.cascaderValue);
  }

  getChildIndexs(stateValues, options, level = 0) {
    const indexs = [];
    for(let i = 0; i < stateValues.length; i++) {
      const value = stateValues[i][level]; // 默认查找一级
      const index = options.findIndex(option => value == option.value);
      if( index !== -1) {
        indexs.push(index);
      }
    }
    return indexs;
  }

  // 获取已选中的索引
  getChildActiveIndexs(options = [], stateValues = [], cascaderValue = []) {
    let _this = this;

    function findActiveIndex(options = [], stateValue = [], cascaderValue = []) {
      if(stateValue.length < 1) {
        return;
      }
      let [firstName, secName, thirdName] = cascaderValue;
      let firstObj = {}, secObj = {};
      let firstIdxs = [];
      stateValue.forEach(values => {
        let idx = options.findIndex(o => o.value == values[0]);
        if(!firstIdxs.includes(idx) && idx !== -1) {
          firstIdxs.push(idx);
        }
        if(firstName && values[0] == firstName && values[1]) {
          // 找到下级的选中索引
          firstObj.index = idx;
          if(firstObj.children == undefined) {
            firstObj.children = [];
          }
          firstObj.children.push(values[1]);
        }
      });
      // console.log(firstObj)
      // 二级
      let {index, children} = firstObj;
      if(index !== undefined) {
        options[index].children.forEach((o, idx) => {
          if(children.includes(o.value)) {
            if(firstObj.childrenIndex == undefined) {
              firstObj.childrenIndex = [];
            }
            firstObj.childrenIndex.push(idx);
          }
        });
        // 三级
        let {childrenIndex} = firstObj;
        options[index].children[childrenIndex[0]].children.forEach((o, idx) => {
          stateValue.forEach(values => {
            if(values[2] == o.value) {
              if(secObj.childrenIndex == undefined) {
                secObj.childrenIndex = [];
              }
              secObj.childrenIndex.push(idx);
            }
          });
        });
      }
      console.log(firstIdxs)
      console.log(firstObj.childrenIndex)
      console.log(secObj.childrenIndex)
      // 加上样式
      _this.getClassActive(0, firstIdxs);
      _this.getClassActive(1, firstObj.childrenIndex);
      _this.getClassActive(2, secObj.childrenIndex);
      return {
        firstIdxs,
        secIdxs: firstObj.childrenIndex,
        thirdIdxs: secObj.childrenIndex
      }
    }

    cascaderValue = cascaderValue.length > 0 ? cascaderValue :
               stateValues.length > 0 ? stateValues[0] : [];
    // 根据cascaderValue的值找到下级所有被选中的索引
    findActiveIndex(options, stateValues, cascaderValue);
  }

  handleChange(value) {
    console.log(value);
    const stateValues = this.state.values;
    let isMultiple = true;
    let isChange   = true;
    // 用于判断当前点击的位置
    currentValue = value;
    // 只能三级可多选
    for(let i = 0; i < stateValues.length; i++) {
      const stateValue = stateValues[i];
      if(JSON.stringify(stateValue) === JSON.stringify(value) || stateValue.length < 3) {
        isMultiple  = false;
        isChange = !(JSON.stringify(stateValue) === JSON.stringify(value))
        break;
      }
    }
    let values = [];
    if(isMultiple) {
      // 一二三级禁止混合多选
      if(stateValues.length && value.length < 3) return;
      stateValues.push(value);
      values = stateValues;
      this.setState({
        values,
        cascaderValue: values[0]
      });
    } else {
      if(isChange) {
        values = [value];
        this.setState({
          values,
          cascaderValue: value
        });
      }
    }
  }


  handleContentKeyDown(e) {
    e.stopPropagation();
    let {count, values} = this.state;
    let { keyCode } = e;
    let max = values.length;
    if(keyCode == '37' || keyCode == '39') {
      if(keyCode == '37') {
        // 左移
        count = count == 0 ? 0 : count - 1;
        this.setState({
          count
        })

      } else {
        // 右移
        count = count == max ? max : count + 1;
        this.setState({
          count
        })
      }
      var selection = getSelection();
      selection.extend(this.refs.content, count * 2);
    } else if(keyCode == 8 || keyCode == 46) {
      e.preventDefault();
      if(keyCode == 8 && count == 0 || keyCode == 46 && count >= max) return;
      count = keyCode == 8 ? count - 1 : count;
      values.splice(count, 1);
      this.setState({
        count,
        values
      });
      var selection = getSelection();
      selection.extend(this.refs.content, count * 2);
      keyCode == 8 ? selection.collapseToStart() : selection.collapseToEnd();
    }
    this.forceUpdate();
  }
  // 输入框change事件
  handleInputChange(e) {
    if(e.target.value != '') {
      this.setState({
        inputValue: e.target.value,
        values: []
      });
    } else {
      this.setState({
        inputValue: '',
      });
    }
  }

  defaultDisplayRender(label) {
    return label.join(' / ');
  }

  handleRemoveClick(idx) {
    let { values } = this.state;
    values.splice(idx, 1);
    // if(values.length <= 1) {
    //   this.setState({
    //     cascaderValue: values.length ? values[0] : []
    //   })
    // }
    let cascaderValue = values.length ? values[0] : [];
    this.setState({
      values,
      cascaderValue
    });
    this.getChildActiveIndexs(options, values, cascaderValue);
  }

  closeIcon(idx) {
    return <span className="ant-multiple-icon-remove" onClick={this.handleRemoveClick.bind(null, idx)}>
      <Icon type="close" />
    </span>
  }

  handleContentClick() {
    var selection = getSelection()
      // 设置最后光标对象
      this.refs.content.focus();
      selection.selectAllChildren(this.refs.content);
      // selection.collapseToEnd();
      selection.collapseToStart();
  }

  PopupContainer() {
    return () => document.getElementById('abcd')
  }

  render() {
    const getFileItem = () => {
      const values = this.state.values;
      if(values.length) {
        return values.map((value, idx) => {
          return [
            <div className="ant-multiple-selected  ant-multiple-selected-placeholder" key={value + 'placehodler'}></div>,
            <div className="ant-multiple-selected" contentEditable="false" suppressContentEditableWarning="true" key={value}>
              <span className="ant-multiple-prefix"></span>
              <span>{this.defaultDisplayRender(value)}</span>
              <span className="ant-multiple-suffix"></span>
              {this.closeIcon(idx)}
            </div>
          ]
        })
      }
    }

    return <Cascader
      options={options}
      changeOnSelect={true}
      onChange={this.handleChange}
      value={this.state.cascaderValue}
      onPopupVisibleChange={this.handlePopupVisibleChange}
    >
      <div className="ant-multiple-cascader">
        <div 
          className="ant-multiple-selected-wrap"
          contentEditable="true"
          suppressContentEditableWarning="true"
          onKeyDown={this.handleContentKeyDown}
          data-placeholder="请选择"
          onClick={this.handleContentClick}
          ref="content"
          >
          {getFileItem()}
          <div className="ant-multiple-selected  ant-multiple-selected-placeholder"></div>
        </div>
        {/* <input 
          className={this.state.value.length ? 'none mul-ant-input': 'mul-ant-input'}
          placeholder={this.state.value.length ? '' : '请选择'}
          onChange={this.handleInputChange}
          onKeyDown={this.handleContentKeyDown}
        /> */}
      </div>
    </Cascader>
  }
}

export default MultipleCascader