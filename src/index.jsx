import * as React from 'react'
import { Cascader, Input, Icon, Button } from 'antd';
import RcCascader from 'rc-cascader';
import { getFileItem } from 'antd/lib/upload/utils';
import renderEmpty from 'antd/lib/config-provider/renderEmpty'
import './style/index.less'

const defaultLimit = 50;

function defaultRenderFilteredOption(
  inputValue,
  path
) {
  return path.map((option, index) => {
    const label = option['label'];
    const node =
    label.indexOf(inputValue) > -1
        ? highlightKeyword(label, inputValue, 'ant-cascader')
        : label;
    return index === 0 ? node : [' / ', node];
  });
}

function highlightKeyword(str, keyword, prefixCls) {
  return str.split(keyword).map((node, index) =>
    index === 0
      ? node
      : [
          <span className={`${prefixCls}-menu-item-keyword`} key="seperator">
            {keyword}
          </span>,
          node,
        ],
  );
}

function defaultFilterOption(
  inputValue,
  path,
) {
  return path.some(option => (option.label).indexOf(inputValue) > -1);
}

function defaultSortFilteredOption(
  a,
  b,
  inputValue,
  names,
) {
  function callback(elem) {
    return (elem[names.label]).indexOf(inputValue) > -1;
  }

  return a.findIndex(callback) - b.findIndex(callback);
}

function getFieldNames({ fieldNames }) {
  return fieldNames;
}

function getFilledFieldNames(props) {
  const fieldNames = getFieldNames(props) || {};
  const names = {
    children: fieldNames.children || 'children',
    label: fieldNames.label || 'label',
    value: fieldNames.value || 'value',
  };
  return names;
}

function flattenTree(
  options,
  props,
  ancestor = [],
) {
  const names = getFilledFieldNames(props);
  let flattenOptions = [];
  const childrenName = names.children;
  options.forEach(option => {
    const path = ancestor.concat(option);
    if (props.changeOnSelect || !option[childrenName] || !option[childrenName].length) {
      flattenOptions.push(path);
    }
    if (option[childrenName]) {
      flattenOptions = flattenOptions.concat(flattenTree(option[childrenName], props, path));
    }
  });
  return flattenOptions;
}

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
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.generateFilteredOptions = this.generateFilteredOptions.bind(this);
    
    this.state = {
      values: [],
      inputValue: '',
      count: 0,
      options: props.options,
      cascaderValue: [],
      currentValue: [],
      flattenOptions: props.showSearch ? flattenTree(props.options, props) : undefined,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    
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
      this.handleActiveOption(stateValues, this.props.options);
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
        values,
        cascaderValue: values[0] || []
      });
      var selection = getSelection();
      selection.extend(this.refs.content, count * 2);
      keyCode == 8 ? selection.collapseToStart() : selection.collapseToEnd();
    }
  }
  // 输入框change事件
  handleInputChange(e) {
    let value = e.target.value;
    this.setState({
      inputValue: value
    });
  }

  handleInputKeyDown(e) {
    e.stopPropagation();
  }

  defaultDisplayRender(label) {
    return label.join(' / ');
  }

  handleRemoveClick(idx) {
    let { values } = this.state;
    values.splice(idx, 1);
    let cascaderValue = values.length ? values[0] : [];
    this.setState({
      values,
      cascaderValue
    });
    this.getChildActiveIndexs(this.props.options, values, cascaderValue);
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

  generateFilteredOptions(prefixCls = 'ant-cascader') {
    const { showSearch = {}, notFoundContent } = this.props;
    const names = {
      'label': 'label',
      'value': 'value'
    };
    const {
      filter = defaultFilterOption,
      render = defaultRenderFilteredOption,
      sort = defaultSortFilteredOption,
      limit = defaultLimit,
    } = showSearch;
    const { flattenOptions = [], inputValue } = this.state;
  
    // Limit the filter if needed
    let filtered;
    if (limit > 0) {
      filtered = [];
      let matchCount = 0;

      // Perf optimization to filter items only below the limit
      flattenOptions.some(path => {
        const match = filter(this.state.inputValue, path);
        if (match) {
          filtered.push(path);
          matchCount += 1;
        }
        return matchCount >= limit;
      });
    } else {
      warning(
        typeof limit !== 'number',
        'Cascader',
        "'limit' of showSearch should be positive number or false.",
      );
      filtered = flattenOptions.filter(path => filter(this.state.inputValue, path, names));
    }

    filtered.sort((a, b) => sort(a, b, inputValue, names));

    if (filtered.length > 0) {
      return filtered.map((path) => {
        return {
          __IS_FILTERED_OPTION: true,
          path,
          [names.value]: path.map((o) => o[names.value]),
          [names.label]: render(inputValue, path, prefixCls, names),
          disabled: path.some((o) => !!o.disabled),
          isEmptyNode: true,
        };
      });
    }
    return [
      {
        [names.value]: 'ANT_CASCADER_NOT_FOUND',
        [names.label]: notFoundContent || renderEmpty('Cascader'),
        disabled: true,
        isEmptyNode: true,
      },
    ];
  }

  render() {
    const getFileItem = () => {
      const values = this.state.values;
      if(values.length) {
        return values.map((value, idx) => {
          return [
            <div className="ant-multiple-selected ant-multiple-selected-placeholder" key={value + 'placehodler'}></div>,
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
    let { props, state } = this;
    let { options } = props;
    const names = getFilledFieldNames(this.props);
    if (options && options.length > 0) {
      if (state.inputValue) {
        options = this.generateFilteredOptions();
      }
    } else {
      options = [
        {
          [names.label]: notFoundContent || renderEmpty('Cascader'),
          [names.value]: 'ANT_CASCADER_NOT_FOUND',
          disabled: true,
        },
      ];
    }

    return <Cascader
      options={options}
      changeOnSelect={true}
      onChange={this.handleChange}
      value={this.state.cascaderValue}
      onPopupVisibleChange={this.handlePopupVisibleChange}
      {...props}
    >
      <div className="ant-multiple-cascader">
        <div 
          className="ant-multiple-selected-wrap"
          contentEditable="true"
          suppressContentEditableWarning="true"
          onKeyDown={this.handleContentKeyDown}
          onClick={this.handleContentClick}
          ref="content"
          >
          {getFileItem()}
          <div className="ant-multiple-selected  ant-multiple-selected-placeholder"></div>
        </div>
        <Input 
          className={this.state.values.length ? 'none mul-ant-input': 'mul-ant-input'}
          placeholder="请选择"
          onChange={this.handleInputChange}
          onKeyDown={this.handleInputKeyDown}
          value={this.state.inputValue}
        />
      </div>
    </Cascader>
  }
}

export default MultipleCascader