import * as React from "react";
import PropTypes from "prop-types";
import District from "./District";
import County from "./County";
import ZipCode from "./ZipCode";
import RawData from '../data/RawData';
import RawDataSort from '../data/RawDataSort';

/**
 * 組合元件
 *
 * @author Chris Tsai
 */
export default class ZipCodeTW extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      countyFieldName: 'county',
      districtFieldName: 'district',
      zipCodeFieldName: 'zipCode',
      county: '',
      counties: [],
      district: '',
      districts: [],
      zipCode: '',
      zipCodePlaceholder: ''
    };
    this.rowData = props.rowData ? props.rowData : RawData;
    this.rowDataSort = props.countySort ? props.countySort : RawDataSort;
  }

  componentDidUpdate(prevProps) {
    const {
      countyValue,
      districtValue,
      zipCodeValue
    } = this.props;
    if(prevProps.countyValue !== countyValue
        || prevProps.districtValue !== districtValue
        || prevProps.zipCodeValue !== zipCodeValue) {
      this.initData();
    }
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    const counties = Object.keys(this.rowData);
    const {
      countyValue,
      districtValue,
      zipCodeValue,
      countyFieldName,
      districtFieldName,
      zipCodeFieldName,
    } = this.props;
    counties.sort((a, b) => {
      return this.rowDataSort[a] - this.rowDataSort[b];
    });

    let county;
    let zipCode;
    let district;
    let districts;
    let countyRaw;
    if (zipCodeValue) {
      // 優先判斷郵遞區號, 若有則直接完成城市與區的選擇
      zipCode = zipCodeValue;
      let result = this.findCountyAndDistrictByZipCode(zipCode);
      county = result.countyN || counties[0];
      countyRaw = this.rowData[county];
      districts = typeof(countyRaw) === 'object' ? Object.keys(countyRaw).map((d) => d, []) : [];
      // 但是新竹市裡面各區的郵遞區號都相同, 因此還是要先參考區的選擇
      district = districtValue || result.districtN || districts[0];
    } else {
      // 有城市的情況, 順便處理區, 並完成郵遞區號的選擇
      // 或者是什麼都沒有的情況直接用預設值
      county = countyValue || counties[0];
      countyRaw = this.rowData[county];
      districts = typeof(countyRaw) === 'object' ? Object.keys(countyRaw).map((d) => d, []) : [];
      // 選擇郵遞區號
      if (typeof(countyRaw) === 'string') {
        district = '';
        zipCode = countyRaw;
      } else if(districts.length > 0){
        if (districts.indexOf(districtValue) > -1) {
          district = districtValue;
        } else {
          district = districts[0];
        }
        zipCode = this.rowData[county][district];
      }
    }

    const nowCountyFieldName = typeof (countyFieldName) != 'undefined' && countyFieldName !== '' ? countyFieldName: 'county';
    const nowDistrictFieldNam = typeof (districtFieldName) != 'undefined' && districtFieldName !== '' ? districtFieldName: 'district';
    const nowZipCodeFieldName = typeof (zipCodeFieldName) != 'undefined' && zipCodeFieldName !== '' ? zipCodeFieldName: 'zipCode';

    this.setState({
      county, district, zipCode,
      counties, districts,
      countyFieldName: nowCountyFieldName,
      districtFieldName: nowDistrictFieldNam,
      zipCodeFieldName: nowZipCodeFieldName
    }, () => {
      let {onInited} = this.props;
      if(typeof (onInited) == 'function'){
        onInited({'countyValue': county, 'districtValue': district, 'zipValue':zipCode});
      }
    });
  };

  handleChangeCounty = (county) => {
    let countyRaw = this.rowData[county];
    const districts = typeof(countyRaw) === 'object' ? Object.keys(countyRaw).map((d) => d, []) : [];
    let district, zipCode;

    if (typeof(countyRaw) === 'string') {
      district = '';
      zipCode = countyRaw;
    } else {
      district = districts[0];
      zipCode = countyRaw[districts[0]];
    }

    let {handleChangeCounty} = this.props;
    let {countyFieldName, districtFieldName, zipCodeFieldName} = this.state;
    this.setState({
      county,
      districts,
      district,
      zipCode,
    }, () => {
      if(typeof (handleChangeCounty) == 'function'){
        handleChangeCounty({
          'countyFieldName':countyFieldName, 'countyValue': county,
          'districtFieldName':districtFieldName, 'districtValue': district,
          'zipFieldName':zipCodeFieldName,'zipValue':zipCode
        });
      }
    });
  };

  handleChangeDistrict = (district) =>{
    let zipCode = this.rowData[this.state.county][district];
    let {handleChangeDistrict} = this.props;
    let {countyFieldName, districtFieldName, zipCodeFieldName} = this.state;
    this.setState({
      district,
      zipCode,
    }, () => {
      if(typeof (handleChangeDistrict) == 'function'){
        handleChangeDistrict({
          'countyFieldName': countyFieldName, 'countyValue': this.state.county,
          'districtFieldName':districtFieldName, 'districtValue': district,
          'zipFieldName':zipCodeFieldName,'zipValue':zipCode
        });
      }
    });
  };

  handleChangeZipCode = (zipCode) =>{
    let {handleChangeZipCode} = this.props;
    let {zipCodeFieldName} = this.state;
    this.setState({
      zipCode: zipCode,
    }, () =>{
      if(typeof (handleChangeZipCode) == 'function'){
        handleChangeZipCode({
          'zipFieldName':zipCodeFieldName,'zipValue':zipCode
        });
      }
    });
  };

  handleBlurZipCode = (newZipCode) =>{
    const { countyN, districtN } = this.findCountyAndDistrictByZipCode(newZipCode);
    let {handleZipCodeNotExists, handleBlurZipCode} = this.props;
    let {countyFieldName, districtFieldName, zipCodeFieldName, zipCode, district} = this.state;
    if(typeof(countyN) != 'undefined' && typeof(districtN) != 'undefined'){
      const districts = Object.keys(this.rowData[countyN]).map((d) => d, []);
      let newDistrict = zipCode === newZipCode ? district || districtN : districtN;
      this.setState({
        county: countyN, district: newDistrict, districts: districts
      }, () =>{
        if(typeof (handleBlurZipCode) == 'function'){
          handleBlurZipCode({
            'countyFieldName':countyFieldName, 'countyValue': countyN,
            'districtFieldName':districtFieldName, 'districtValue': districtN,
            'zipFieldName':zipCodeFieldName,'zipValue':newZipCode
          });
        }
      });
    }else{
      this.setState({
        county: '', district: '', districts: [], zipCode: ''
      }, () =>{
        if(typeof (handleZipCodeNotExists) == 'function'){
          handleZipCodeNotExists({
            'countyFieldName':countyFieldName, 'countyValue': '',
            'districtFieldName':districtFieldName, 'districtValue': '',
            'zipFieldName':zipCodeFieldName,'zipValue':'', 'origZipValue': newZipCode
          });
        }
      });
    }
  };

  findCountyAndDistrictByZipCode = (zipCode) =>{
    let rtn = {};

    Object.keys(this.rowData).forEach((countyN) => {
      let countyRaw = this.rowData[countyN];
      if (typeof(countyRaw) === 'object') {
        Object.keys(countyRaw).forEach((districtN) => {
          if (this.rowData[countyN][districtN] === zipCode.toString()) {
            rtn = {
              countyN,
              districtN,
            };
          }
        });
      } else {
        if (countyRaw  === zipCode.toString()) {
          rtn = {
            countyN,
            districtN: '',
          };
        }
      }
    });
    return rtn;
  };

  render() {
    const {zipStyle, countyStyle, districtStyle, zipClass, countyClass, districtClass, displayType, zipCodePositionLast} = this.props;
    const {fullAddress, address, addressClass, addressStyle} = this.props;
    const displayTypeFlag = (displayType === 'display');
    const nowZipCodePositionLast = typeof (zipCodePositionLast) != 'undefined' ? zipCodePositionLast : true;
    const nowCountyStyle = typeof (countyStyle) != 'undefined' ? countyStyle: nowZipCodePositionLast ? {} : {marginLeft:'5px'};
    const nowDistrictStyle =
        typeof (districtStyle) != 'undefined' ? districtStyle: displayTypeFlag ? {} : {marginLeft:'5px', minWidth:'107px', paddingRight:'0px'};
    const nowZipStyle =
        typeof (zipStyle) != 'undefined' ? zipStyle: (!displayTypeFlag && !nowZipCodePositionLast) ? {width: '50px'} :  {marginLeft:'5px', width: '50px'};
    const nowCountyClass =
        typeof (countyClass) != 'undefined' ? countyClass: 'form-control';
    const nowDistrictClass =
        typeof (districtClass) != 'undefined' ? districtClass: 'form-control';
    const nowZipClass =
        typeof (zipClass) != 'undefined' ? zipClass: 'form-control';
    const nowAddressClass =
        typeof (addressClass) != 'undefined' ? addressClass: 'form-control';

    return (
        <>
          {displayTypeFlag || (!displayTypeFlag && !nowZipCodePositionLast)  ?
              <ZipCode fieldName={this.state.zipCodeFieldName}
                       value={this.state.zipCode}
                       zipClass={nowZipClass}
                       zipStyle={nowZipStyle}
                       placeholder={this.props.zipCodePlaceholder}
                       displayType={this.props.zipCodeReadonly ? 'display' : displayType}
                       onChange={this.handleChangeZipCode}
                       onBlur={this.handleBlurZipCode}
              /> : ''
          }

          {typeof (fullAddress) != 'undefined' && fullAddress !== '' && displayTypeFlag ?
              <span className={nowAddressClass} style={addressStyle}
                    readOnly={true}
                    disabled={true}
              >{fullAddress}</span> : <>
                <County fieldName={this.state.countyFieldName}
                        value={this.state.county}
                        countyClass={nowCountyClass}
                        countyStyle={nowCountyStyle}
                        dataOptions={this.state.counties}
                        displayType={this.props.countyReadonly ? 'display' : displayType}
                        onChange={this.handleChangeCounty}
                />
                <District fieldName={this.state.districtFieldName}
                          value={this.state.district}
                          districtClass={nowDistrictClass}
                          districtStyle={nowDistrictStyle}
                          displayType={this.props.districtReadonly ? 'display' : displayType}
                          dataOptions={this.state.districts}
                          onChange={this.handleChangeDistrict}
                />
                {!displayTypeFlag && nowZipCodePositionLast ?
                    <ZipCode fieldName={this.state.zipCodeFieldName}
                             value={this.state.zipCode}
                             zipClass={nowZipClass}
                             zipStyle={nowZipStyle}
                             placeholder={this.props.zipCodePlaceholder}
                             displayType={this.props.zipCodeReadonly ? 'display' : displayType}
                             onChange={this.handleChangeZipCode}
                             onBlur={this.handleBlurZipCode}
                    /> : ''
                }
                {typeof (address) != 'undefined' && address !== '' && displayTypeFlag ?
                    <span className={nowAddressClass} style={addressStyle}
                          readOnly={true}
                          disabled={true}>{address}</span> : ''
                }
              </>
          }
        </>
    );
  }
}

ZipCodeTW.propTypes = {
  displayType: PropTypes.oneOf(['text', 'display']).isRequired,
  fullAddress: PropTypes.string,
  zipCodePositionLast: PropTypes.bool,
  address: PropTypes.string,
  countyFieldName: PropTypes.string,
  countyValue: PropTypes.string,
  countyReadonly: PropTypes.bool,
  districtFieldName: PropTypes.string,
  districtValue: PropTypes.string,
  districtReadonly: PropTypes.bool,
  zipCodeFieldName: PropTypes.string,
  zipCodeValue: PropTypes.string,
  zipCodePlaceholder: PropTypes.string,
  zipCodeReadonly: PropTypes.bool,
  handleChangeCounty: PropTypes.func,
  handleChangeDistrict: PropTypes.func,
  handleChangeZipCode: PropTypes.func,
  handleBlurZipCode: PropTypes.func,
  handleZipCodeNotExists: PropTypes.func,
  onInited: PropTypes.func,
  countyClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  countyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  districtClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  districtStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  zipClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  zipStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  addressClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  addressStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  countySort: PropTypes.object,
  rowData: PropTypes.object,
};
