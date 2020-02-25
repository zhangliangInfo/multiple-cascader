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
}];

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
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevState.values)
  //   console.log(this.state.values)
  //   if(this.state.values.length == prevState.values.length) return false;
  // }


  handlePopupVisibleChange(visible) {
    // 当选项显示时,选中已选的选项
    if(visible) {
      const stateValues = this.state.values;
      this.handleActiveOption(stateValues, options);
    }
  }

  // 设置已选项状态
  handleActiveOption(stateValues, options) {
    for(let i = 0; i < stateValues.length; i++) {
      const stateValue = stateValues[i];
      if(stateValue.length < 3) {
        this.setState({
          cascaderValue: stateValue
        });
        return;
      }
      for(let j = 0; j < options.length; j++) {
        if(stateValues[i].includes(options[j].value)) {
          for(let k = 0; k < options[j].children.length; k++) {
            if(stateValues[i].includes(options[j].children[k])) {
              this.setState(() => ({
                cascaderValue: stateValues[i]
              }));
            }
          }
        }
      }
    }
  }

  handleChange(value) {
    console.log(value);
    const stateValues = this.state.values;
    let isMultiple = true;
    // 只能三级可多选
    for(let i = 0; i < stateValues.length; i++) {
      const stateValue = stateValues[i];
      if(JSON.stringify(stateValue) === JSON.stringify(value) || stateValue.length < 3) {
        isMultiple  = false;
        break;
      }
    }
    if(isMultiple) {
      if(stateValues.length && value.length < 3) return;
      stateValues.push(value);
      this.setState({
        values: stateValues
      });
    } else {
      this.setState({
        values: [value]
      });
    }
    
  }

  increment(state, props) {
    return {
      values: state.values
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
    this.setState({
      values
    });
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

  render() {
    const getFileItem = () => {
      const values = this.state.values;
      if(values.length) {
        return values.map((value, idx) => {
          return [
            <div className="ant-multiple-selected  ant-multiple-selected-placeholder" key={idx}></div>,
            <div className="ant-multiple-selected" contentEditable="false" key={idx}>
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
      changeOnSelect="true"
      onChange={this.handleChange}
      value={this.state.cascaderValue}
      onPopupVisibleChange={this.handlePopupVisibleChange}
    >
      <div className="ant-multiple-cascader">
        <div 
          className="ant-multiple-selected-wrap"
          contentEditable="true"
          suppressContentEditableWarning
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