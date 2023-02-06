import React, {useEffect, useState, useRef} from "react";
import { useDispatch, useSelector } from 'react-redux';
import checkoutArrow from '../../assets/images/png/checkout-arrow.png';
import { sellYear } from '../../data/initialDetails';
import Select, {components} from 'react-select';
import {Loading}  from '../SharedComponents/Loader/Loader';
import { getModelsInfo, saveSellerAdInfo,getTrimInfo ,getMyAdsLists} from "../../actions/brands";
import Axios from 'axios';
import {useLocation, useParams} from 'react-router-dom'

  const BasicInformation = ({locationdata, modeldata, branddata, saveCarData, changeTab,trimdata}) => { 
    const [activeBrandTab, setActiveBrandTab] = useState(false);    
    const [activeYearTab, setActiveYearTab] = useState(false);    
    const [activeModelTab, setActiveModelTab] = useState(false);
    const [activeTrimTab, setActiveTrimTab] = useState(false);
    const [activeKmTab, setActiveKmTab] = useState(false);  
    const [activePriceTab, setActivePriceTab] = useState(false);  
    const [activePhoneTab, setActivePhoneTab] = useState(false);      
    const [open, setOpen] = useState(true);
    const [stylePlaceHolder, setStylePlaceHolder] = useState("brandPlaceHold");    
    const [styleLocation, setStyleLocation] = useState("locationPlaceHold");
    const [styleYear, setstyleYear] = useState("YearPlaceHold");
    const [styleModel, setstyleModel] = useState("ModelPlaceHold");
    const [styleTrim, setstyleTrim] = useState("TrimPlaceHold");
    const [styleKm, setstyleKm] = useState("KmPlaceHold");
    const [stylePrice, setstylePrice] = useState("PricePlaceHold");
    const [stylePhone, setstylePhone] = useState("PhonePlaceHold");
    const [holderBrand, setholderBrand] = useState("");
    const [holderLocation, setholderLocation] = useState("");
    const [holderYear, setholderYear] = useState("");
    const [holderModel, setholderModel] = useState("");
    const [holderTrim, setholderTrim] = useState("");
    const [holderKm, setholderKm] = useState("");
    const [holderPrice, setholderPrice] = useState("");
    const [holderPhone, setholderPhone] = useState("");
    const loading = useSelector((state) => state.selleradinfo.loading);
    const dispatch = useDispatch();
    const {id} =useParams()
    //bazilCode_startsHere
    const sellerAdEdit = useSelector(state => state.selleradinfo.sellerAdEditbyUserPrev);
    //bazilCode_endHere
    console.log("loading-seller"+loading)
    //For Place Holder Assigning  
    const { ValueContainer, Placeholder } = components;
    const CustomValueContainer = ({ children, ...props }) => {
      return (
        <ValueContainer {...props}>
          <Placeholder {...props} isFocused={props.isFocused}>
            {props.selectProps.placeholder}
          </Placeholder>
          {React.Children.map(children, child =>
            child && child.type !== Placeholder ? child : null
          )}
        </ValueContainer>
      );
    };

    //Custom Styles
    const customStyles = {

      menu: styles => ({ ...styles,                 
       width: '180px',
       borderRadius:'0px',
      }),

      option: (base, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...base,
          backgroundColor: isFocused ? "#D9D9D9" : "",
          backgroundColor: isSelected ? "#D9D9D9" : "",
          color: "#858585"
        };
      }                 
  
    };
  //bazilCode_startsHere
  ///toPrepopulate_data_forEdit
  const settingDefaultValue=()=>{
    setStylePlaceHolder("brandPlaceHoldActive");
    setholderBrand({label: sellerAdEdit?.adBasicInfo?.brandName, value: sellerAdEdit?.adBasicInfo?.brandId})
    setstyleYear("YearPlaceHoldActive");
    setholderYear(sellerAdEdit?.adBasicInfo?.year) 
    setstyleModel("ModelPlaceHoldActive");
    setholderModel({
      label : sellerAdEdit?.adBasicInfo?.modelName,
      value : sellerAdEdit?.adBasicInfo?.modelId
    })
    setstyleKm("KmPlaceHoldActive");
    setholderKm(sellerAdEdit?.adBasicInfo?.km)  
    setstylePrice("PricePlaceHoldActive");
    setholderPrice(sellerAdEdit?.adBasicInfo?.price)
    setstylePhone("PhonePlaceHoldActive");
    setholderPhone(sellerAdEdit?.adBasicInfo?.phoneNo)
    setStyleLocation("locationPlaceHoldActive");
    setholderLocation({ 
      value : sellerAdEdit?.adBasicInfo?.locationId, label : sellerAdEdit?.adBasicInfo?.locationName
    })
    setstyleTrim("TrimPlaceHoldActive");
    setholderTrim({
      value: sellerAdEdit?.adBasicInfo?.variantId,
      label: sellerAdEdit?.adBasicInfo?.variantName
    });
    dispatch(getModelsInfo(sellerAdEdit?.adBasicInfo?.modelId));
    dispatch(getTrimInfo(sellerAdEdit?.adBasicInfo?.modelId));
  }
  useEffect(()=>{
    if(id && sellerAdEdit?.adBasicInfo){
      settingDefaultValue()
    }
  },[sellerAdEdit?.adBasicInfo , id])
  //bazilCode_endHere 

    useEffect(()=>{
      saveData();
    },[holderLocation,holderBrand,holderTrim,holderYear ,holderModel,holderKm,holderPrice,holderPhone])

    const saveData = () =>{
      saveCarData({
        location: holderLocation.value,
        brand: holderBrand.value,
        trim: holderTrim.value,
        year: holderYear,
        model: holderModel.value,
        km: holderKm,
        price: holderPrice,
        phone: holderPhone
      })
    }

    const handleChangeLocation = (e) => {
      if(e.label !=""){
        setholderLocation(e);
        setStyleLocation("locationPlaceHoldActive");
     }
    }
    const handleChangeBrand = (e) => {
      if(e.label !=""){
      setholderBrand(e);
      dispatch(getModelsInfo(e.value));
      setStylePlaceHolder("brandPlaceHoldActive");
      setActiveBrandTab(!activeBrandTab) 
     }
    }
    const handleChangeYear = (e) => { 
      if(e.label !=""){
        setholderYear(e.label);
        setstyleYear("YearPlaceHoldActive");
        setActiveYearTab(!activeYearTab)
     }
    }
    const handleChangeModel = (e) => {
      if(e.label !=""){
        let modelLabel = e.label;
        modelLabel = modelLabel.substring(0, modelLabel.length - 5);
        setholderModel(e);
        dispatch(getTrimInfo(e.value));
        setstyleModel("ModelPlaceHoldActive");
        setActiveModelTab(!activeModelTab);
     }
    }

    const handleChangeTrim = (e) => {
      if(e.label !=""){
        setholderTrim(e);
        setstyleTrim("TrimPlaceHoldActive");
        setActiveTrimTab(!activeTrimTab);
     }
    }

    const handleChangeKm = (e) => {
      if(e.target.value !=""){
        setholderKm(e.target.value);
        setstyleKm("KmPlaceHoldActive");
        setActiveKmTab(!activeKmTab) 
     }
    }
    const handleChangePrice = (e) => {
      if(e.target.value !=""){
        setholderPrice(e.target.value);
        setstylePrice("PricePlaceHoldActive");
        setActivePriceTab(!activePriceTab) 
     }
    }
    const handleChangePhone = (e) => {
      if(e.target.value !=""){
        setholderPhone(e.target.value);
        setstylePhone("PhonePlaceHoldActive");
        setActivePhoneTab(!activePhoneTab) 
     }
    }
    const locationList = locationdata.map(ele =>{
    return { value: ele.locationId , label: ele.locationName }
    }); 
    const yearList = sellYear.map(ele =>{
    return { value: ele.year , label: ele.year }
    }); 
    const brandList = branddata?.map(ele =>{
      return { value: ele.brandId , label: ele.brandName, image: ele.brandImage }
    });
    const modelList = modeldata?.map(ele =>{
    return { value: ele.modelId , label: ele.modelName }
    }); 
    const trimList = trimdata?.map(ele =>{
      return { value: ele.variantId , label: ele.variantName }
    }); 

    const handleBrands = () => {
        setOpen(true);
        setActiveBrandTab(!activeBrandTab)
        setActiveYearTab(false) 
        setActiveModelTab(false)
        setActiveKmTab(false) 
        setActiveTrimTab(false)    
        setActivePriceTab(false) 
        setActivePhoneTab(false)         
    }    
    const handleYears = () => {
       setOpen(true);
        setActiveYearTab(!activeYearTab)  
        setActiveBrandTab(false) 
        setActiveModelTab(false)
        setActiveKmTab(false) 
        setActivePriceTab(false) 
        setActivePhoneTab(false)    
        setActiveTrimTab(false)    
    } 
    const handleModel = () => {
       setOpen(true);
        setActiveModelTab(!activeModelTab) 
        setActiveBrandTab(false) 
        setActiveYearTab(false)
        setActiveKmTab(false) 
        setActivePriceTab(false) 
        setActivePhoneTab(false)   
        setActiveTrimTab(false)        
    } 

    const handleTrim = () => {
       setOpen(true);
       setActiveModelTab(false) 
       setActiveTrimTab(!activeTrimTab) 
       setActiveBrandTab(false) 
       setActiveYearTab(false)
       setActiveKmTab(false) 
       setActivePriceTab(false) 
       setActivePhoneTab(false)          
   } 
    const handleKm = () => {
      //setOpen(true);
      setActiveKmTab(!activeKmTab)
      setActiveTrimTab(false)     
      setActiveBrandTab(false) 
      setActiveYearTab(false)
      setActiveModelTab(false) 
      setActivePriceTab(false) 
      setActivePhoneTab(false)       
  } 
  const handlePrice = () => {
    //setOpen(true);
    setActivePriceTab(!activePriceTab)
    setActiveBrandTab(false) 
    setActiveYearTab(false)
    setActiveModelTab(false) 
    setActiveTrimTab(false)    
    setActiveKmTab(false) 
    setActivePhoneTab(false)        
} 
const handlePhone = () => {
  setOpen(true);
  setActivePhoneTab(!activePhoneTab)  
  setActiveBrandTab(false) 
  setActiveYearTab(false)
  setActiveModelTab(false) 
  setActiveTrimTab(false)    
  setActiveKmTab(false) 
  setActivePriceTab(false)      
} 
const handleLocation = () => {
  setActivePhoneTab(!activePhoneTab)  
  setActiveBrandTab(false) 
  setActiveYearTab(false)
  setActiveModelTab(false) 
  setActiveTrimTab(false)    
  setActiveKmTab(false) 
  setActivePriceTab(false)      
} 


const handleCheckOut = () =>{

  if(holderLocation && holderBrand && holderTrim && holderYear && holderModel && holderKm && holderPrice && holderPhone){
    dispatch({
      type: 'CAR_DETAILS',
      payload: {
        location: holderLocation.value,
        brand: holderBrand.value,
        year: holderYear,
        model: holderModel.value,
        trim: holderTrim.value,
        km: holderKm,
        price: holderPrice,
        phone: holderPhone
      }
    })
    dispatch(saveSellerAdInfo());
    changeTab();
  }
}

  return (
    <div className="basic-information">
      <ul className="d-flex col-12">
      
        <li onClick={handleBrands} className={stylePlaceHolder}>Brand<span>{holderBrand.label}</span></li>
        <li onClick={handleModel} className={styleModel}>Model<span>{holderModel.label}</span></li>
        <li onClick={handleTrim} className={styleTrim}>Trim<span>{holderTrim.label}</span></li>
        <li onClick={handleYears} className={styleYear}>Year<span>{holderYear}</span></li>
        <li onClick={handleKm} className={styleKm}>KM<span>{holderKm}</span></li>
        <li onClick={handlePrice} className={stylePrice}>Price<span>{holderPrice}</span></li>
        <li onClick={handlePhone} className={stylePhone}>Phone<span>{holderPhone}</span></li>
        <li className="nopadding">
        <div className="location-tab">
          <Select
            onClick={handleLocation}
            options={locationList} 
            displayValue="name" 
            placeholder="City"
            classNamePrefix="select-location"
            className={styleLocation}
            onChange={(e) => handleChangeLocation(e)}
            components={{ValueContainer: CustomValueContainer}}
            isSearchable={false}
            styles={customStyles}
            //bazilCode_startsHere
            value={holderLocation}
            //bazilCode_endHere
          />
        </div>
      </li>
      </ul>
     
      <div className="brand-tab" >
      
          {activeBrandTab?  
            <Select 
                options={brandList} 
                tabSelectsValue='2'
                classNamePrefix="select-brand"
                styles={customStyles}
                placeholder= {<div><i className="fa fa-search  position-absolute"></i> Search for your Brand</div>} 
                onChange={(e) => handleChangeBrand(e)}
                menuIsOpen={true}
                maxlength={14}
                onMenuOpen={() => setOpen(true)}
                onMenuClose={() => setOpen(false)}
                formatOptionLabel={option => (
                  <div>
                      {/* {option.image ? <img src={option.image} /> : ''} */}
                      <span title={option.label}>{option.label}</span>
                  </div>
                
              )}
              />: ''}
      </div>
      <div className="year-tab"> 
      {activeYearTab?  
            <Select 
                options={yearList} 
                tabSelectsValue='3'
                classNamePrefix="select-year select-brand"
                styles={customStyles}
                placeholder={<div><i className="fa fa-search  position-absolute"></i>Enter Year</div>}
                onChange={(e) => handleChangeYear(e)}
                menuIsOpen={open}
                maxlength={4}
                onMenuOpen={() => setOpen(true)}
                onMenuClose={() => setOpen(false)}
              />: ''}
        </div>
      <div className="model-tab">
        {activeModelTab?  
            <Select 
                options={modelList} 
                classNamePrefix="select-model select-brand"
                styles={customStyles}
                placeholder={<div><i className="fa fa-search  position-absolute"></i>Search for your Model</div>}
                onChange={(e) => handleChangeModel(e)}
                menuIsOpen={open}
                maxlength={14}
                onMenuOpen={() => setOpen(true)}
                onMenuClose={() => setOpen(false)}
              />: ''}
        </div> 
        <div className="trim-tab">
        {activeTrimTab?  
            <Select 
                options={trimList} 
                classNamePrefix="select-model select-brand"
                styles={customStyles}
                placeholder={<div><i className="fa fa-search  position-absolute"></i>Search for your Trim</div>}
                onChange={(e) => handleChangeTrim(e)}
                menuIsOpen={open}
                maxlength={14}
                onMenuOpen={() => setOpen(true)}
                onMenuClose={() => setOpen(false)}
              />: ''}
        </div> 
        <div className="km-tab">
        {activeKmTab?  
            <input placeholder="Enter Kilometer" maxlength={14} onBlur={(e) => handleChangeKm(e)} />: ''}
        </div> 
        <div className="price-tab">
        {activePriceTab?  
            <input placeholder="Enter Price"  maxlength={14} onBlur={(e) => handleChangePrice(e)} />: ''}
        </div>
        <div className="phone-tab">
        {activePhoneTab?  
            <input placeholder="Enter Phone Number" maxlength={12} onBlur={(e) => handleChangePhone(e)} />: ''}
        </div>  
      <div className="checkout-button" onClick={handleCheckOut} style={{backgroundImage: `url('${checkoutArrow}')`}}></div>
    </div>
    
  );
};
export default BasicInformation;