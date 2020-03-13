import * as React from "react";
import PropTypes from "prop-types";

/**
 * 行政區
 *
 * @author Chris Tsai
 */
export default class District extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.value !== this.props.value) {
      this.setState({value: this.props.value})
    }
  }

  componentDidMount() {
    this.setState({value: this.props.value})
  }

  handleChange = (e) =>{
    let value = e.target.value;
    this.setState({value}, () => {
      let {onChange} = this.props;
      if(typeof (onChange) == 'function'){
        onChange(value);
      }
    });
  };

  render() {
    const {dataOptions, fieldName, districtClass, districtStyle, displayType,
    } = this.props;

    const districts = !!dataOptions && dataOptions.map((op) =>
        <option key={ op } value={ op }>{op}</option>);
    return (
        <>
          {!!displayType && displayType === 'text' ?
              <select name={fieldName}
                      className={districtClass}
                      style={districtStyle}
                      onChange={this.handleChange}
                      value={this.state.value}
              >
                {districts}
              </select>
              :
              <>
              <span className={districtClass}
                    style={districtStyle}
                    readOnly={true}
                    disabled={true}
              >{this.state.value}</span>
              <input type="hidden" name={fieldName} value={this.state.value}/>
              </>
          }
        </>
    );
  }
}

District.propTypes = {

  /**
   * 顯示樣式
   */
  displayType: PropTypes.oneOf(['text', 'display']),
  /**
   * 欄位名稱
   */
  fieldName: PropTypes.string.isRequired,

  /**
   * 欄位值
   */
  value: PropTypes.string,

  /**
   * onChange callback function
   */
  onChange: PropTypes.func,

  /**
   * dataOptions
   */
  dataOptions: PropTypes.arrayOf(PropTypes.string),

  /**
   * class
   */
  districtClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),

  /**
   * style
   */
  districtStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
};