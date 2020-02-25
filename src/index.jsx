import * as React from 'react'
import { Cascader, Input, Icon, Button } from 'antd';
import RcCascader from 'rc-cascader';
import { getFileItem } from 'antd/lib/upload/utils';
import './style/index.less'


const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
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
      value: [],
      inputValue: '',
      count: 0,
    }
  }


  handlePopupVisibleChange(visible) {
    console.log(visible);
  }

  handleChange(value) {
    const stateValue = this.state.value;
    stateValue.push(value);
    this.setState({
      value: stateValue
    })
  }

  handleContentKeyDown(e) {
    e.stopPropagation();
    let {count, value} = this.state;
    // let max = value.length;
    console.log(value.length)
    let max = Math.floor(this.refs.content.childNodes.length / 2);
    console.log('max', max)
    console.log(e.keyCode)
    if(e.keyCode == '37' || e.keyCode == '39') {
      if(e.keyCode == '37') {
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
      console.log('count:', count)
      var selection = getSelection();
      selection.extend(this.refs.content, count * 2);
    } else if(e.keyCode == 8) {
      e.preventDefault();
      // 退格删除
      count = count == 0 ? 0 : count - 1;
      let idx = count;
      // console.log('count==', count)
      value.splice(count, 1);
      this.setState({
        count,
        value
      });
      var selection = getSelection();
      selection.extend(this.refs.content, ((idx == 0) ? 0 : idx) * 2);
      selection.collapseToEnd();
    }
  }
  // 输入框change事件
  handleInputChange(e) {
    console.log(e.target.value);
    if(e.target.value != '') {
      this.setState({
        inputValue: e.target.value,
        value: []
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
    console.log("删除的索引", idx)
    let { value } = this.state;
    value.splice(idx, 1);
    this.setState({
      value
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
      // var lastEditRange;
      console.log(selection)
      this.refs.content.focus();
      selection.selectAllChildren(this.refs.content);
      // selection.collapseToEnd();
      selection.collapseToStart();
  }

  render() {
    console.log(this.state.value)
    const getFileItem = () => {
      const values = this.state.value;
      if(values.length) {
        return values.map((value, idx) => {
          // return <div className="ant-mutiple-selected-div">
          //   {
          //     (value instanceof Array) && <li key={idx} className="ant-multiple-selected" contentEditable="false">
          //     {/* 使用input而不是直接文本的目的：文本无法控制块级内容禁止编辑修改,保持删除时整块删除，而不是一个个删除文本内容 */}
          //       {/* <Input disabled value={this.defaultDisplayRender(value)} /> */}
          //       <span className="w10"></span>
          //       <span>{this.defaultDisplayRender(value)}</span>
          //       <span className="w20"></span>
          //       {/* <span ref="Span">{this.defaultDisplayRender(value)}</span> */}
          //       {this.closeIcon(idx)}
          //     </li>
          //   }
          //   <li className="ant-multiple-selected  ant-multiple-selected-placeholder"><span>&nbsp;</span></li>
          // </div>
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

    return <Cascader options={options} changeOnSelect="true" onChange={this.handleChange} onPopupVisibleChange={this.handlePopupVisibleChange}>
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
          {/* 目的，div模拟编辑，最后一个图标无法显示，加一个空的li显示出最后一个图标 */}
          {/* <li className="ant-multiple-selected ant-multiple-selected-placeholder">
            <input className="ant-multiple-selected-input" />
            <span>&nbsp;</span>
          </li> */}
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