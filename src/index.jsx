import * as React from 'react'
import { Cascader, Badge, Icon } from 'antd';
import omit from 'omit.js';
// import renderEmpty from 'antd/lib/config-provider/renderEmpty'
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
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.generateFilteredOptions = this.generateFilteredOptions.bind(this);
    this.handleHasInputChange = this.handleHasInputChange.bind(this);
    this.handleHasInputKeyDown = this.handleHasInputKeyDown.bind(this);
    this.handlePlaceClick = this.handlePlaceClick.bind(this);
    
    this.state = {
      values: [],
      labels: [],
      isModify: false,
      inputValue: '',
      count: 0,
      options: props.options,
      cascaderValue: [],
      currentValue: [],
      flattenOptions: flattenTree(props.options, props),
      visiblePopup: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.isModify != this.state.isModify) {
      let {onChange} = this.props;
      typeof onChange == 'function' && onChange(this.state.values);
    }
  }

  // add active className
  getClassActive(level, ary = []) {
    const {index, popupClassName} = this.props;
    if(index == undefined) return;
    if(isNaN(level)  || typeof level != 'number') return;
    let parentDOM = null;
    if(popupClassName) {
      parentDOM = document.querySelector('.' + popupClassName);
    } else {
      parentDOM = document.querySelectorAll('.ant-cascader-menus')[index];
    }
    if(parentDOM == null) return;
    const parentUl = parentDOM.querySelectorAll('.ant-cascader-menu')[level];
    if(parentUl == null) return;
    const LiItems = parentUl.querySelectorAll('li');
    const actyCls = 'multiple-cascader-menu-item-active';
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
    this.setState({
      visiblePopup: visible
    });
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
        // 若点击选中当前二级,查询三级是否有已选项
        let curClickSecdIdx, curClickSecdNodes = [];
        if(!thirdName && secName) {
          curClickSecdIdx = options[index].children.findIndex(o => o.value == secName);
          curClickSecdNodes = options[index].children[curClickSecdIdx].children;
        } else {
          let {childrenIndex} = firstObj;
          curClickSecdNodes = options[index].children[childrenIndex[0]].children;
        }
        curClickSecdNodes.forEach((o, idx) => {
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

  handleChange(value, selectedOptions) {
    let selectedLabels = [];
    for(let i = 0; i<selectedOptions.length; i++) {
      selectedLabels.push(selectedOptions[i].label)
    }
    const {state, props} = this;
    const {values: stateValues, labels, isModify} = state;
    const {selectChange} = props;
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
      if(props.selectMax && stateValues.length > props.selectMax - 1) {
        typeof selectChange == 'function' && selectChange(true, false);
        return;
      }
      if(stateValues.length && value.length < 3) {
        typeof selectChange == 'function' && selectChange(false, true);
        return;
      }
      stateValues.push(value);
      labels.push(selectedLabels);
      values = stateValues;
      typeof selectChange == 'function' && selectChange(false, false);
      this.setState({
        values,
        labels,
        isModify: !isModify,
        cascaderValue: values[0],
        inputValue: ''
      });
    } else {
      if(isChange) {
        values = [value];
        this.setState({
          values,
          labels: [selectedLabels],
          isModify: !isModify,
          cascaderValue: value,
          inputValue: ''
        });
      }
    }
    let {refContentWrap, refContent, inputObj} = this.refs;
    inputObj.focus();
    setTimeout(function(){
      refContentWrap.scrollTo(refContent.clientWidth, 0);
    }, 0);
  }


  handleContentKeyDown(e) {
    let { keyCode } = e;
    if(keyCode != 38 && keyCode != 40) {
      e.stopPropagation();
    }
    if(keyCode == 37 || keyCode == 39 || keyCode == 8 || keyCode == 46) {
      let {count, values, labels, isModify} = this.state;
      let max = values.length;
      let {refContent, inputObj} = this.refs;
      // 37 left, 39 right
      if(keyCode == 37 || keyCode == 39) {
        // 更新光标位置信息
        count = keyCode == 37 ? count == 0 ? 0 : count - 1:
        count == max ? max : count + 1;
      } else {
        // 8 backspace, 46 delete
        if(keyCode == 8) {
          count = count - 1;
        }
        if(count < 0) return;
        if(count < max) {
          values.splice(count, 1);
          labels.splice(count, 1);
          isModify = !isModify;
        }
        e.preventDefault();
      }
      this.setState({
        count,
        values,
        labels,
        isModify,
        cascaderValue: values[0] || []
      });
      if(count == max || (max - count == 1) && keyCode == 46) {
        inputObj.focus();
      } else {
        var selection = getSelection();
        selection.extend(refContent, count * 2);
        keyCode == 8 && selection.collapseToStart();
        this.getChildActiveIndexs(this.props.options, values, values[0]);
      }
    } else {
      e.preventDefault();
    }
  }


  // 输入框change事件
  handleInputChange(e) {
    let value = e.target.value;
    this.setState({
      inputValue: value
    });
  }
  // 
  handleHasInputChange(e) {
    e.stopPropagation();
    let {value} = e.target;
    let width = Math.ceil((getComputedStyle(this.refs.saveInputValue).width && getComputedStyle(this.refs.saveInputValue).width.split('px')[0] || 0)) + 10;
    this.refs.inputObj.style.width = (value != '' ? width > 15 ? width : 15 : 5) + 'px';
    this.setState({
      inputValue: value
    });
    if(value) {
      this.setState({
        visiblePopup: true
      });
    }
  }
  
  handleHasInputKeyDown(e) {
    let {keyCode} = e;
    if(keyCode != 38 && keyCode != 40) {
      e.stopPropagation();
    }
    if(keyCode == 37 || keyCode == 8) {
      let { count, values, labels, isModify } = this.state;
      let refContent = this.refs.refContent;
      let inputObj = this.refs.inputObj;
      let max = values.length;
      let markPos = inputObj.selectionStart;
      if(max == 0) return;
      if(markPos != 0) return;
      // 更新光标位置信息
      count = max - 1;
      if(keyCode == 37) {
        this.setState({
          count
        });
        const selection = getSelection();
        selection.extend(refContent, count * 2);
        selection.collapseToStart();
        e.preventDefault();
      } else {
        values.splice(count, 1);
        labels.splice(count, 1);
        this.setState({
          count,
          values,
          labels,
          isModify: !isModify,
          cascaderValue: values[0] || []
        });
        this.getChildActiveIndexs(this.props.options, values, values[0]);
      }
    }
  }

  handleInputKeyDown(e) {
    let {keyCode} = e;
    if(keyCode != 38 && keyCode != 40) {
      e.stopPropagation();
    }
  }

  handleInputBlur(e) {
    e.stopPropagation();
    this.setState({
      inputValue: ''
    })
  }

  defaultDisplayRender(label) {
    return label.join(' / ');
  }

  handleRemoveClick(idx, e) {
    e.stopPropagation();
    let { values, labels, isModify } = this.state;
    values.splice(idx, 1);
    labels.splice(idx, 1);
    let cascaderValue = values.length ? values[0] : [];
    this.setState({
      values,
      labels,
      isModify: !isModify,
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
    let { values } = this.state;
    let {refContentWrap, refContent, inputObj} = this.refs;
    inputObj.focus();
    refContentWrap.scrollTo(refContent.clientWidth, 0);
    // if(values.length) {
    //   var selection = getSelection()
    //   // 设置最后光标对象
    //   refContent.focus();
    //   selection.selectAllChildren(refContent);
    //   // selection.collapseToEnd();
    //   selection.collapseToStart();
    //   refContentWrap.scrollTo(0, 0);
    // } else {
    //   inputObj.focus();
    // }
  }

  handlePlaceClick() {
    this.refs.inputObj.focus();
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
        // [names.label]: notFoundContent || renderEmpty('Cascader'),
        [names.label]: 'Not Found',
        disabled: true,
        isEmptyNode: true,
      },
    ];
  }

  render() {
    const getFileItem = () => {
      const {labels} = this.state;
      if(labels.length) {
        return labels.map((value, idx) => {
          return [
            <div className="ant-multiple-selected-placeholder" key={value + 'placehodler'}></div>,
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
    let cascaderOptions = options;
    if (cascaderOptions && cascaderOptions.length > 0) {
      if (state.inputValue) {
        cascaderOptions = this.generateFilteredOptions();
      }
    } else {
      cascaderOptions = [
        {
          // [names.label]: notFoundContent || renderEmpty('Cascader'),
          [names.label]: 'Not Found',
          [names.value]: 'ANT_CASCADER_NOT_FOUND',
          disabled: true,
        },
      ];
    }
    const CascaderProps = omit(props, [
      'onChange',
      'value',
      'onPopupVisibleChange',
      'options'
    ]);

    let placeholder = props.placeholder || '请选择';

    return <Cascader
      options={cascaderOptions}
      onChange={this.handleChange}
      value={state.cascaderValue}
      onPopupVisibleChange={this.handlePopupVisibleChange}
      popupClassName={props.popupClassName}
      popupVisible={state.visiblePopup}
      {...CascaderProps}
    >
      <div className={state.visiblePopup ? 'ant-multiple-cascader ant-multiple-cascader-focus' : 'ant-multiple-cascader'}>
        <div className="ant-multiple-selected-wraper"
          onClick={this.handleContentClick}
          ref="refContentWrap"
        >
          <div 
            className="ant-multiple-selected-wrap"
            contentEditable="true"
            suppressContentEditableWarning="true"
            onKeyDown={this.handleContentKeyDown}
            ref="refContent"
            >
            {getFileItem()}
            <div className="ant-multiple-selected-placeholder"></div>
          </div>
          <div className="multiple-ant-cascader-text-wrap">
            <input 
              className="multiple-ant-cascader-text"
              onChange={this.handleHasInputChange}
              onKeyDown={this.handleHasInputKeyDown}
              value={state.inputValue}
              ref="inputObj"
              />
            <div ref="saveInputValue" className="multiple-ant-cascader-text-save">{state.inputValue}</div>
          </div>
          <div className={(state.values.length || state.inputValue.length) ? 'none multiple-ant-input-place-text': 'multiple-ant-input-place-text'} onClick={this.handlePlaceClick}>{placeholder}</div>
        </div>
        <Icon type="down" className={state.visiblePopup ? 'ant-cascader-picker-arrow ant-cascader-picker-arrow-expand' : 'ant-cascader-picker-arrow'} />
        {/* <Badge count={state.values.length} /> */}
      </div>
    </Cascader>
  }
}

export default MultipleCascader