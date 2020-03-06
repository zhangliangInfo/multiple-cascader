"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/es/cascader/style/css");

var _cascader = _interopRequireDefault(require("antd/es/cascader"));

require("antd/es/icon/style/css");

var _icon = _interopRequireDefault(require("antd/es/icon"));

var React = _interopRequireWildcard(require("react"));

var _omit = _interopRequireDefault(require("omit.js"));

require("./style/index.less");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var defaultLimit = 50;

function defaultRenderFilteredOption(inputValue, path) {
  return path.map(function (option, index) {
    var label = option['label'];
    var node = label.indexOf(inputValue) > -1 ? highlightKeyword(label, inputValue, 'ant-cascader') : label;
    return index === 0 ? node : [' / ', node];
  });
}

function highlightKeyword(str, keyword, prefixCls) {
  return str.split(keyword).map(function (node, index) {
    return index === 0 ? node : [React.createElement("span", {
      className: "".concat(prefixCls, "-menu-item-keyword"),
      key: "seperator"
    }, keyword), node];
  });
}

function defaultFilterOption(inputValue, path) {
  return path.some(function (option) {
    return option.label.indexOf(inputValue) > -1;
  });
}

function defaultSortFilteredOption(a, b, inputValue, names) {
  function callback(elem) {
    return elem[names.label].indexOf(inputValue) > -1;
  }

  return a.findIndex(callback) - b.findIndex(callback);
}

function getFieldNames(_ref) {
  var fieldNames = _ref.fieldNames;
  return fieldNames;
}

function getFilledFieldNames(props) {
  var fieldNames = getFieldNames(props) || {};
  var names = {
    children: fieldNames.children || 'children',
    label: fieldNames.label || 'label',
    value: fieldNames.value || 'value'
  };
  return names;
}

function flattenTree(options, props) {
  var ancestor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var names = getFilledFieldNames(props);
  var flattenOptions = [];
  var childrenName = names.children;
  options.forEach(function (option) {
    var path = ancestor.concat(option);

    if (props.changeOnSelect || !option[childrenName] || !option[childrenName].length) {
      flattenOptions.push(path);
    }

    if (option[childrenName]) {
      flattenOptions = flattenOptions.concat(flattenTree(option[childrenName], props, path));
    }
  });
  return flattenOptions;
}

var currentValue = [];

var MultipleCascader =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MultipleCascader, _React$Component);

  function MultipleCascader(props) {
    var _this2;

    _classCallCheck(this, MultipleCascader);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(MultipleCascader).call(this, props));
    _this2.handleChange = _this2.handleChange.bind(_assertThisInitialized(_this2));
    _this2.handleContentKeyDown = _this2.handleContentKeyDown.bind(_assertThisInitialized(_this2));
    _this2.handleInputChange = _this2.handleInputChange.bind(_assertThisInitialized(_this2));
    _this2.defaultDisplayRender = _this2.defaultDisplayRender.bind(_assertThisInitialized(_this2));
    _this2.handlePopupVisibleChange = _this2.handlePopupVisibleChange.bind(_assertThisInitialized(_this2));
    _this2.handleRemoveClick = _this2.handleRemoveClick.bind(_assertThisInitialized(_this2));
    _this2.handleContentClick = _this2.handleContentClick.bind(_assertThisInitialized(_this2));
    _this2.handleInputKeyDown = _this2.handleInputKeyDown.bind(_assertThisInitialized(_this2));
    _this2.handleInputBlur = _this2.handleInputBlur.bind(_assertThisInitialized(_this2));
    _this2.generateFilteredOptions = _this2.generateFilteredOptions.bind(_assertThisInitialized(_this2));
    _this2.handleHasInputChange = _this2.handleHasInputChange.bind(_assertThisInitialized(_this2));
    _this2.handleHasInputKeyDown = _this2.handleHasInputKeyDown.bind(_assertThisInitialized(_this2));
    _this2.handlePlaceClick = _this2.handlePlaceClick.bind(_assertThisInitialized(_this2));
    _this2.state = {
      values: [],
      labels: [],
      isModify: false,
      inputValue: '',
      count: 0,
      options: props.options,
      cascaderValue: [],
      currentValue: [],
      flattenOptions: flattenTree(props.options, props),
      visiblePopup: false,
      timeoutIds: []
    };
    return _this2;
  }

  _createClass(MultipleCascader, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this3 = this;

      if (prevState.isModify != this.state.isModify) {
        var onChange = this.props.onChange;
        typeof onChange == 'function' && onChange(this.state.values);
      }

      var timeoutIds = this.state.timeoutIds;
      timeoutIds.forEach(function (_, id) {
        var clearId = _ - 1;
        clearTimeout(clearId);
        timeoutIds.splice(id, 1);

        _this3.setState({
          timeoutIds: timeoutIds
        });
      });
    } // add active className

  }, {
    key: "getClassActive",
    value: function getClassActive(level) {
      var ary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var _this$props = this.props,
          index = _this$props.index,
          popupClassName = _this$props.popupClassName;
      if (index == undefined) return;
      if (isNaN(level) || typeof level != 'number') return;
      var parentDOM = null;

      if (popupClassName) {
        parentDOM = document.querySelector('.' + popupClassName);
      } else {
        parentDOM = document.querySelectorAll('.ant-cascader-menus')[index];
      }

      if (parentDOM == null) return;
      var parentUl = parentDOM.querySelectorAll('.ant-cascader-menu')[level];
      if (parentUl == null) return;
      var LiItems = parentUl.querySelectorAll('li');
      var actyCls = 'multiple-cascader-menu-item-active';
      LiItems.forEach(function (LiItem) {
        var clsList = Array.from(LiItem.classList);

        if (clsList.indexOf(actyCls) !== -1) {
          clsList.splice(clsList.indexOf(actyCls), 1);
        }

        LiItem.className = clsList.join(' ');
      });
      var timeId = setTimeout(function () {
        ary.forEach(function (_) {
          var LiItem = parentUl.querySelectorAll('li')[_];

          if (LiItem && !Array.from(LiItem.classList).includes(actyCls)) {
            LiItem.className += ' ' + actyCls;
          }
        });
      }, 0);
      this.saveTimeoutHandler(timeId);
    }
  }, {
    key: "handlePopupVisibleChange",
    value: function handlePopupVisibleChange(visible) {
      // 当选项显示时,选中已选的选项
      this.setState({
        visiblePopup: visible
      });

      if (visible) {
        var stateValues = this.state.values;
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

  }, {
    key: "handleActiveOption",
    value: function handleActiveOption(stateValues, options) {
      this.getChildActiveIndexs(options, stateValues, currentValue.length ? currentValue : this.state.cascaderValue);
    }
  }, {
    key: "getChildIndexs",
    value: function getChildIndexs(stateValues, options) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var indexs = [];

      var _loop = function _loop(i) {
        var value = stateValues[i][level]; // 默认查找一级

        var index = options.findIndex(function (option) {
          return value == option.value;
        });

        if (index !== -1) {
          indexs.push(index);
        }
      };

      for (var i = 0; i < stateValues.length; i++) {
        _loop(i);
      }

      return indexs;
    } // 获取已选中的索引

  }, {
    key: "getChildActiveIndexs",
    value: function getChildActiveIndexs() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var stateValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var cascaderValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      var _this = this;

      function findActiveIndex() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var stateValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var cascaderValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        if (stateValue.length < 1) {
          return;
        }

        var _cascaderValue = _slicedToArray(cascaderValue, 3),
            firstName = _cascaderValue[0],
            secName = _cascaderValue[1],
            thirdName = _cascaderValue[2];

        var firstObj = {},
            secObj = {};
        var firstIdxs = [];
        stateValue.forEach(function (values) {
          var idx = options.findIndex(function (o) {
            return o.value == values[0];
          });

          if (!firstIdxs.includes(idx) && idx !== -1) {
            firstIdxs.push(idx);
          }

          if (firstName && values[0] == firstName && values[1]) {
            // 找到下级的选中索引
            firstObj.index = idx;

            if (firstObj.children == undefined) {
              firstObj.children = [];
            }

            firstObj.children.push(values[1]);
          }
        }); // 二级

        var index = firstObj.index,
            children = firstObj.children;

        if (index !== undefined) {
          options[index].children.forEach(function (o, idx) {
            if (children.includes(o.value)) {
              if (firstObj.childrenIndex == undefined) {
                firstObj.childrenIndex = [];
              }

              firstObj.childrenIndex.push(idx);
            }
          }); // 三级
          // 若点击选中当前二级,查询三级是否有已选项

          var curClickSecdIdx,
              curClickSecdNodes = [];

          if (!thirdName && secName) {
            curClickSecdIdx = options[index].children.findIndex(function (o) {
              return o.value == secName;
            });
            curClickSecdNodes = options[index].children[curClickSecdIdx].children;
          } else {
            var childrenIndex = firstObj.childrenIndex;
            curClickSecdNodes = options[index].children[childrenIndex[0]].children;
          }

          curClickSecdNodes.forEach(function (o, idx) {
            stateValue.forEach(function (values) {
              if (values[2] == o.value) {
                if (secObj.childrenIndex == undefined) {
                  secObj.childrenIndex = [];
                }

                secObj.childrenIndex.push(idx);
              }
            });
          });
        } // 加上样式


        _this.getClassActive(0, firstIdxs);

        _this.getClassActive(1, firstObj.childrenIndex);

        _this.getClassActive(2, secObj.childrenIndex);

        return {
          firstIdxs: firstIdxs,
          secIdxs: firstObj.childrenIndex,
          thirdIdxs: secObj.childrenIndex
        };
      }

      cascaderValue = cascaderValue.length > 0 ? cascaderValue : stateValues.length > 0 ? stateValues[0] : []; // 根据cascaderValue的值找到下级所有被选中的索引

      findActiveIndex(options, stateValues, cascaderValue);
    }
  }, {
    key: "handleChange",
    value: function handleChange(value, selectedOptions) {
      var selectedLabels = [];

      for (var i = 0; i < selectedOptions.length; i++) {
        selectedLabels.push(selectedOptions[i].label);
      }

      var state = this.state,
          props = this.props;
      var stateValues = state.values,
          labels = state.labels,
          isModify = state.isModify;
      var selectChange = props.selectChange;
      var isMultiple = true;
      var isChange = true; // 用于判断当前点击的位置

      currentValue = value; // 只能三级可多选

      for (var _i2 = 0; _i2 < stateValues.length; _i2++) {
        var stateValue = stateValues[_i2];

        if (JSON.stringify(stateValue) === JSON.stringify(value) || stateValue.length < 3) {
          isMultiple = false;
          isChange = !(JSON.stringify(stateValue) === JSON.stringify(value));
          break;
        }
      }

      var values = [];

      if (isMultiple) {
        // 一二三级禁止混合多选
        if (props.selectMax && stateValues.length > props.selectMax - 1) {
          typeof selectChange == 'function' && selectChange(true, false);
          return;
        }

        if (stateValues.length && value.length < 3) {
          typeof selectChange == 'function' && selectChange(false, true);
          return;
        }

        stateValues.push(value);
        labels.push(selectedLabels);
        values = stateValues;
        typeof selectChange == 'function' && selectChange(false, false);
        this.setState({
          values: values,
          labels: labels,
          isModify: !isModify,
          cascaderValue: values[0],
          inputValue: ''
        });
      } else {
        if (isChange) {
          values = [value];
          this.setState({
            values: values,
            labels: [selectedLabels],
            isModify: !isModify,
            cascaderValue: value,
            inputValue: ''
          });
        }
      }

      var _this$refs = this.refs,
          refContentWrap = _this$refs.refContentWrap,
          refContent = _this$refs.refContent,
          inputObj = _this$refs.inputObj;
      inputObj.focus();
      var timeId = setTimeout(function () {
        refContentWrap.scrollTo(refContent.clientWidth, 0);
      }, 0);
      this.saveTimeoutHandler(timeId);
    }
  }, {
    key: "handleContentKeyDown",
    value: function handleContentKeyDown(e) {
      var keyCode = e.keyCode;

      if (keyCode != 38 && keyCode != 40) {
        e.stopPropagation();
      }

      if (keyCode == 37 || keyCode == 39 || keyCode == 8 || keyCode == 46) {
        var _this$state = this.state,
            count = _this$state.count,
            values = _this$state.values,
            labels = _this$state.labels,
            isModify = _this$state.isModify;
        var max = values.length;
        var _this$refs2 = this.refs,
            refContent = _this$refs2.refContent,
            inputObj = _this$refs2.inputObj; // 37 left, 39 right

        if (keyCode == 37 || keyCode == 39) {
          // 更新光标位置信息
          count = keyCode == 37 ? count == 0 ? 0 : count - 1 : count == max ? max : count + 1;
        } else {
          // 8 backspace, 46 delete
          if (keyCode == 8) {
            count = count - 1;
          }

          if (count < 0) return;

          if (count < max) {
            values.splice(count, 1);
            labels.splice(count, 1);
            isModify = !isModify;
          }

          e.preventDefault();
        }

        this.setState({
          count: count,
          values: values,
          labels: labels,
          isModify: isModify,
          cascaderValue: values[0] || []
        });

        if (count == max || max - count == 1 && keyCode == 46) {
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
    } // 输入框change事件

  }, {
    key: "handleInputChange",
    value: function handleInputChange(e) {
      var value = e.target.value;
      this.setState({
        inputValue: value
      });
    } // 

  }, {
    key: "handleHasInputChange",
    value: function handleHasInputChange(e) {
      e.stopPropagation();
      var value = e.target.value;
      var width = Math.ceil(getComputedStyle(this.refs.saveInputValue).width && getComputedStyle(this.refs.saveInputValue).width.split('px')[0] || 0) + 10;
      this.refs.inputObj.style.width = (value != '' ? width > 15 ? width : 15 : 5) + 'px';
      this.setState({
        inputValue: value
      });

      var _this = this;

      if (value) {
        this.setState({
          visiblePopup: true
        });
        var timeId = setTimeout(function () {
          document.querySelector('.' + _this.props.popupClassName).querySelector('.ant-cascader-menu').style.width = _this.refs.refContentWrap.clientWidth + 'px';
        }, 0);
        this.saveTimeoutHandler(timeId);
      } else {
        var _timeId = setTimeout(function () {
          document.querySelector('.' + _this.props.popupClassName).querySelector('.ant-cascader-menu').style.width = 'auto';
        }, 0);

        this.saveTimeoutHandler(_timeId);
      }
    }
  }, {
    key: "saveTimeoutHandler",
    value: function saveTimeoutHandler(timeId) {
      var timeoutIds = this.state.timeoutIds;
      timeoutIds.push(timeId);
      this.setState({
        timeoutIds: timeoutIds
      });
    }
  }, {
    key: "handleHasInputKeyDown",
    value: function handleHasInputKeyDown(e) {
      var keyCode = e.keyCode;

      if (keyCode != 38 && keyCode != 40) {
        e.stopPropagation();
      }

      if (keyCode == 37 || keyCode == 8) {
        var _this$state2 = this.state,
            count = _this$state2.count,
            values = _this$state2.values,
            labels = _this$state2.labels,
            isModify = _this$state2.isModify;
        var refContent = this.refs.refContent;
        var inputObj = this.refs.inputObj;
        var max = values.length;
        var markPos = inputObj.selectionStart;
        if (max == 0) return;
        if (markPos != 0) return; // 更新光标位置信息

        count = max - 1;

        if (keyCode == 37) {
          this.setState({
            count: count
          });
          var selection = getSelection();
          selection.extend(refContent, count * 2);
          selection.collapseToStart();
          e.preventDefault();
        } else {
          values.splice(count, 1);
          labels.splice(count, 1);
          this.setState({
            count: count,
            values: values,
            labels: labels,
            isModify: !isModify,
            cascaderValue: values[0] || []
          });
          this.getChildActiveIndexs(this.props.options, values, values[0]);
        }
      }
    }
  }, {
    key: "handleInputKeyDown",
    value: function handleInputKeyDown(e) {
      var keyCode = e.keyCode;

      if (keyCode != 38 && keyCode != 40) {
        e.stopPropagation();
      }
    }
  }, {
    key: "handleInputBlur",
    value: function handleInputBlur(e) {
      e.stopPropagation();
      this.setState({
        inputValue: ''
      });
    }
  }, {
    key: "defaultDisplayRender",
    value: function defaultDisplayRender(label) {
      return label.join(' / ');
    }
  }, {
    key: "handleRemoveClick",
    value: function handleRemoveClick(idx, e) {
      e.stopPropagation();
      var _this$state3 = this.state,
          values = _this$state3.values,
          labels = _this$state3.labels,
          isModify = _this$state3.isModify;
      values.splice(idx, 1);
      labels.splice(idx, 1);
      var cascaderValue = values.length ? values[0] : [];
      this.setState({
        values: values,
        labels: labels,
        isModify: !isModify,
        cascaderValue: cascaderValue
      });
      this.getChildActiveIndexs(this.props.options, values, cascaderValue);
    }
  }, {
    key: "closeIcon",
    value: function closeIcon(idx) {
      return React.createElement("span", {
        className: "ant-multiple-icon-remove",
        onClick: this.handleRemoveClick.bind(null, idx)
      }, React.createElement(_icon["default"], {
        type: "close"
      }));
    }
  }, {
    key: "handleContentClick",
    value: function handleContentClick() {
      var values = this.state.values;
      var _this$refs3 = this.refs,
          refContentWrap = _this$refs3.refContentWrap,
          refContent = _this$refs3.refContent,
          inputObj = _this$refs3.inputObj;
      inputObj.focus();
      refContentWrap.scrollTo(refContent.clientWidth, 0); // if(values.length) {
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
  }, {
    key: "handlePlaceClick",
    value: function handlePlaceClick() {
      this.refs.inputObj.focus();
    }
  }, {
    key: "PopupContainer",
    value: function PopupContainer() {
      return function () {
        return document.getElementById('abcd');
      };
    }
  }, {
    key: "generateFilteredOptions",
    value: function generateFilteredOptions() {
      var _this4 = this,
          _ref3;

      var prefixCls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ant-cascader';
      var _this$props2 = this.props,
          _this$props2$showSear = _this$props2.showSearch,
          showSearch = _this$props2$showSear === void 0 ? {} : _this$props2$showSear,
          notFoundContent = _this$props2.notFoundContent;
      var names = {
        'label': 'label',
        'value': 'value'
      };
      var _showSearch$filter = showSearch.filter,
          filter = _showSearch$filter === void 0 ? defaultFilterOption : _showSearch$filter,
          _showSearch$render = showSearch.render,
          render = _showSearch$render === void 0 ? defaultRenderFilteredOption : _showSearch$render,
          _showSearch$sort = showSearch.sort,
          sort = _showSearch$sort === void 0 ? defaultSortFilteredOption : _showSearch$sort,
          _showSearch$limit = showSearch.limit,
          limit = _showSearch$limit === void 0 ? defaultLimit : _showSearch$limit;
      var _this$state4 = this.state,
          _this$state4$flattenO = _this$state4.flattenOptions,
          flattenOptions = _this$state4$flattenO === void 0 ? [] : _this$state4$flattenO,
          inputValue = _this$state4.inputValue; // Limit the filter if needed

      var filtered;

      if (limit > 0) {
        filtered = [];
        var matchCount = 0; // Perf optimization to filter items only below the limit

        flattenOptions.some(function (path) {
          var match = filter(_this4.state.inputValue, path);

          if (match) {
            filtered.push(path);
            matchCount += 1;
          }

          return matchCount >= limit;
        });
      } else {
        warning(typeof limit !== 'number', 'Cascader', "'limit' of showSearch should be positive number or false.");
        filtered = flattenOptions.filter(function (path) {
          return filter(_this4.state.inputValue, path, names);
        });
      }

      filtered.sort(function (a, b) {
        return sort(a, b, inputValue, names);
      });

      if (filtered.length > 0) {
        return filtered.map(function (path) {
          var _ref2;

          return _ref2 = {
            __IS_FILTERED_OPTION: true,
            path: path
          }, _defineProperty(_ref2, names.value, path.map(function (o) {
            return o[names.value];
          })), _defineProperty(_ref2, names.label, render(inputValue, path, prefixCls, names)), _defineProperty(_ref2, "disabled", path.some(function (o) {
            return !!o.disabled;
          })), _defineProperty(_ref2, "isEmptyNode", true), _ref2;
        });
      }

      return [(_ref3 = {}, _defineProperty(_ref3, names.value, 'ANT_CASCADER_NOT_FOUND'), _defineProperty(_ref3, names.label, 'Not Found'), _defineProperty(_ref3, "disabled", true), _defineProperty(_ref3, "isEmptyNode", true), _ref3)];
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var getFileItem = function getFileItem() {
        var labels = _this5.state.labels;

        if (labels.length) {
          return labels.map(function (value, idx) {
            return [React.createElement("div", {
              className: "ant-multiple-selected-placeholder",
              key: value + 'placehodler'
            }), React.createElement("div", {
              className: "ant-multiple-selected",
              contentEditable: "false",
              suppressContentEditableWarning: "true",
              key: value
            }, React.createElement("span", {
              className: "ant-multiple-prefix"
            }), React.createElement("span", null, _this5.defaultDisplayRender(value)), React.createElement("span", {
              className: "ant-multiple-suffix"
            }), _this5.closeIcon(idx))];
          });
        }
      };

      var props = this.props,
          state = this.state;
      var options = props.options;
      var names = getFilledFieldNames(this.props);
      var cascaderOptions = options;

      if (cascaderOptions && cascaderOptions.length > 0) {
        if (state.inputValue) {
          cascaderOptions = this.generateFilteredOptions();
        }
      } else {
        var _ref4;

        cascaderOptions = [(_ref4 = {}, _defineProperty(_ref4, names.label, 'Not Found'), _defineProperty(_ref4, names.value, 'ANT_CASCADER_NOT_FOUND'), _defineProperty(_ref4, "disabled", true), _ref4)];
      }

      var CascaderProps = (0, _omit["default"])(props, ['onChange', 'value', 'onPopupVisibleChange', 'options']);
      var placeholder = props.placeholder || '请选择';
      return React.createElement(_cascader["default"], _extends({
        options: cascaderOptions,
        onChange: this.handleChange,
        value: state.cascaderValue,
        onPopupVisibleChange: this.handlePopupVisibleChange,
        popupClassName: props.popupClassName,
        popupVisible: state.visiblePopup
      }, CascaderProps), React.createElement("div", {
        className: state.visiblePopup ? 'ant-multiple-cascader ant-multiple-cascader-focus' : 'ant-multiple-cascader'
      }, React.createElement("div", {
        className: "ant-multiple-selected-wraper",
        onClick: this.handleContentClick,
        ref: "refContentWrap"
      }, React.createElement("div", {
        className: "ant-multiple-selected-wrap",
        contentEditable: "true",
        suppressContentEditableWarning: "true",
        onKeyDown: this.handleContentKeyDown,
        ref: "refContent"
      }, getFileItem(), React.createElement("div", {
        className: "ant-multiple-selected-placeholder"
      })), React.createElement("div", {
        className: "multiple-ant-cascader-text-wrap"
      }, React.createElement("input", {
        className: "multiple-ant-cascader-text",
        onChange: this.handleHasInputChange,
        onKeyDown: this.handleHasInputKeyDown,
        value: state.inputValue,
        ref: "inputObj"
      }), React.createElement("div", {
        ref: "saveInputValue",
        className: "multiple-ant-cascader-text-save"
      }, state.inputValue)), React.createElement("div", {
        className: state.values.length || state.inputValue.length ? 'none multiple-ant-input-place-text' : 'multiple-ant-input-place-text',
        onClick: this.handlePlaceClick
      }, placeholder)), React.createElement(_icon["default"], {
        type: "down",
        className: state.visiblePopup ? 'ant-cascader-picker-arrow ant-cascader-picker-arrow-expand' : 'ant-cascader-picker-arrow'
      })));
    }
  }]);

  return MultipleCascader;
}(React.Component);

var _default = MultipleCascader;
exports["default"] = _default;
