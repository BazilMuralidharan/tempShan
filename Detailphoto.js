import React, {useState, useEffect} from "react";
import { Button, Form, Dropdown, DropdownButton} from 'react-bootstrap';
import checkoutArrow from '../../assets/images/png/checkout-arrow.png';
import ImageUploadPreview from '../../modules/SharedComponents/ImageUploadPreview/ImageUploadPreview';
import Select from 'react-select';
import Axios from 'axios';
import {useParams} from 'react-router-dom'
import { 
  fuelOptions, 
  bodyConditionOptions, 
  mecConditionOptions, 
  colorOptions, 
  doorsOptions, 
  cylinderCountOptions,
  bodyTypeOptions,
  horsePowerOptions,
  streeingSideOptions,
  ownerOptions,
  transmissionOptions, 
  featureExtraCheckBoxOption
 } from '../../data/dataOptions'; 
import ImageUploading from 'react-images-uploading';
import Slider from "react-slick";
import remove from '../../assets/images/png/remove.png'
import { createDispatchHook, useDispatch, useSelector } from "react-redux";
import { saveImages,saveSellerAdDetailsInfo } from "../../actions/brands";

const DetailsWithPhotos = (props) => {
    const [featuresOption, setFeatureOption] = useState([...featureExtraCheckBoxOption])
    const extrasCheckBoxList = ["Leather Seats", "Parking Sensors", "Navigation", "Front wheel drive", "Rear View Cameras", "4 Wheel Drive", "Keyless Entry", "Anti-Theft System", "All Wheel Drive","Bluetooth System","Fog Lights","Anti-Lock Brakes/ABS","Heated Seats","Keyless Start", "Cruise Control", "Sunroof","Moonroof"];
    const [checked, setChecked] = useState([]);
    const [description, setDescription] = useState('');
    const [titleName, setTitleName] = useState('');
    const [selectedFuelOption, setSelectedFuelOption] = useState('');
    const [selectedBodyConditionOption, setSelectedBodyConditionOption] = useState('');
    const [selectedMecConditionOption, setSelectedMecConditionOption] = useState('');
    const [selectedColorOption, setSelectedColorOption] = useState('');
    const [selectedDoorsOption, setSelectedDoorsOption] = useState('');
    const [selectedCylinderOption, setSelectedCylinderOption] = useState('');
    const [selectedBodyTypeOption, setSelectedBodyTypeOption] = useState('');
    const [selectedHorsepowerOption, setSelectedHorsepowerOption] = useState('');
    const [selectedStreeingSideOption, setSelectedStreeingSideOption] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [selectedOwnerOption, setSelectedOwnerOption] = useState('');
    const [selectedTransmissionOptions, setSelectedTransmissionOption] = useState('');
    const [images, setImages] = useState([]);
    const [uploadImages, setUploadedImages] = useState([]);
    const [finalImages, setFinalImages] = useState([]);
    const [intial, setIntial] = useState(0);
    const {id} = useParams()
    const dispatch = useDispatch();
    const carData = useSelector(state => state.selleradinfo.car_details);
    const adId = useSelector(state => state.selleradinfo?.createAdData?.adStatus?.adId);
    //bazilCode_startsHere
    const [metaTextInputFields, setMetaTextInputFields] = useState({
      titleName:'',
      description:''
    })
    const [metaSelectDropDown, setMetaSelectDropDown] = useState({
      selectedFuelOption:'',
      selectedBodyConditionOption:'',
      selectedColorOption:'',
      selectedDoorsOption:'',
      selectedCylinderOption:'',
      selectedBodyTypeOption:'',
      selectedHorsepowerOption:'',
      selectedStreeingSideOption:'',
      selectedOwnerOption:'',
      selectedTransmissionOptions:''
    })
    const sellerAdEdit = useSelector(state => state.selleradinfo.sellerAdEditbyUserPrev);
    //bazilCode_endHere
    //bazilCode_startsHere
     const selectDropDownChangeEvent=(value, action)=>{    
      setMetaSelectDropDown(prevVal=>({
        ...prevVal,
        [action.name]: value
      }))
    }
    const textTypeFieldChange =(e)=>{
      const {name, value} = e.target
      setMetaTextInputFields(prevValue=>({
        ...prevValue,
        [name]:value
      }))
    }
    useEffect(()=>{
      if(id && sellerAdEdit?.adDetails){
      setMetaSelectDropDown({
          selectedFuelOption:createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.fuelType),
          selectedBodyConditionOption: createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.carCondition),
          selectedColorOption: createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.color),
          selectedDoorsOption: createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.noOfDoors),
          selectedCylinderOption: createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.noOfCylinders),
          selectedBodyTypeOption: createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.bodyType),
          selectedHorsepowerOption: createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.horsePower),
          selectedStreeingSideOption: createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.steeringSide),
          selectedOwnerOption: createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.owner),
          selectedTransmissionOptions:createOptionToSetDefaultValue(sellerAdEdit?.adDetails?.transmission)
      })
      setMetaTextInputFields({
        titleName:sellerAdEdit?.adDetails?.carName,
        description: sellerAdEdit?.adDetails?.description
      })
      setlingFeatureByDefault()
    }
  },[id, sellerAdEdit?.adDetails])
  //bazilCode_endHere
    const createOptionToSetDefaultValue =(labelValue)=>{ 
    return {
      value: labelValue ,
      label : labelValue
    }
  }
  const setlingFeatureByDefault=()=>{
    //bazilCode_startHere
    const defaultFeatureSchema = (Object.keys(Object.fromEntries((Object.entries(sellerAdEdit?.adDetails)).filter(el =>(el[1] === true)))))
    const defValue = featuresOption.map((el)=>{
      if(defaultFeatureSchema.includes(el.item)){
        return ({
          ...el, 
          value: true
        })
      }else{
        return ({...el})
      }
    })
    setFeatureOption(defValue)
    const pushingToValidateChecked = defValue.map(el=> el.label)
    setChecked(pushingToValidateChecked)
    //bazilCode_endHere
  }
    const onChange = (imageList, addUpdateIndex) => {
      // data for submit
      console.log(imageList, addUpdateIndex);
      let tobeUploaded = [];
      setImages(imageList);
      for(let i=0;i<imageList.length;i++){
        let uploaded = false;
        for(let j=0;j<uploadImages.length;j++){
          if(uploadImages[j].file.name==imageList[i].file.name){
            uploaded = true
          }
        }
        if(uploaded === false){
          tobeUploaded.push(imageList[i]);
        }
      }

      if(imageList.length>0){
        tobeUploaded.forEach((data)=>{
          let formData = new FormData();
          formData.append('file', data.file);
  
          Axios.post('http://localhost:5000/upload-file-to-cloud-storage?adId='+adId,formData, {
            headers:{
              'Content-Type': 'multipart/form-data',
            }
          })
          .then(res => {
            console.log(res);
            setUploadedImages(imageList)
            let images = []
            imageList.forEach((img)=>{
              images.push('https://storage.googleapis.com/dizitalpods-storage/Shanuun/1/'+adId+'/'+img.file.name)
            })
            setFinalImages(images)
          }).catch((err) =>{
            console.log(err);
          })
        })
      }
    };
    
    const createAd = () =>{
      dispatch({
        type: 'CAR_DETAILS',
        payload: {
          ...carData,
          name: metaTextInputFields.titleName,
          images: finalImages,
          description: metaTextInputFields.description,
          fuel: metaSelectDropDown.selectedFuelOption.value,
          bodyCondition: metaSelectDropDown.selectedBodyConditionOption.value,
          mecCondition: selectedMecConditionOption.value,
          color: metaSelectDropDown.selectedColorOption.value,
          history: '',
          doors: metaSelectDropDown.selectedDoorsOption.value,
          cylinders: metaSelectDropDown.selectedCylinderOption.value,
          bodyType: metaSelectDropDown.selectedBodyTypeOption.value,
          horsePower: metaSelectDropDown.selectedHorsepowerOption.value,
          streeingSide: metaSelectDropDown.selectedStreeingSideOption.value,
          registrationNo,
          owner:metaSelectDropDown.selectedOwnerOption.value,
          transmission: metaSelectDropDown.selectedTransmissionOptions.value,
          leatherSeats: checked.includes('Leather Seats'),
          climateControl: checked.includes('Climate Control'),
          dvdPlayer: checked.includes('DVD Player'),
          keylessEntry:checked.includes('Keyless Entry'),
          soundSystem:checked.includes('Sound System'),
          parkingSensors: checked.includes('Parking Sensors'),
          "regionalSpecs": "GCC",
         "navigation": checked.includes("Navigation"),
         "frontWheelDrive": checked.includes('Front wheel drive'),
         "rearViewCameras": checked.includes('Rear View Cameras'),
         "fourWheelDrive": checked.includes('4 Wheel Drive'),
         //bazilCode_startHere //// just modified the caseSensitive
         "antiTheftSystem": checked.includes('Anti theft system'),
         //bazilCode_endHere //// just modified the caseSensitive accordingly. 
         "allWheelDrive": checked.includes('All Wheel Drive'),
         "bluetoothSystem": checked.includes('Bluetooth System'),
         "fogLight": checked.includes('Fog Lights'),
         "antiLockBrake": checked.includes('Anti-Lock Brakes/ABS'),
         "heatedSeat": checked.includes('Heated Seats'),
         "cruiseControl": checked.includes('Cruise Control'),
         "sunRoof": checked.includes('Sunroof'),
         "moonRoof": checked.includes('Moonroof'),
          
        } 
      })
      dispatch(saveImages());
      dispatch(saveSellerAdDetailsInfo())
      props.changeTab();
    }
    
    const handleExtrasCheck = (event) => {
        var updatedList = [...checked];
        if (event.target.checked) {
        updatedList = [...checked, event.target.value];
        } else {
        updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        setChecked(updatedList);
    };

    // Generate string of checked items
    const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
        })
    : "";

    const settings = {
      variableWidth: true,
      slidesToShow: 8,
      swipeToSlide: true,
      infinite:false,
      dots: false,
      arrows: false
    };

    // Return classes based on whether item is checked
    const isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";
    
    const changeVision =(index)=>{
      ////bazilCodeStart 
        let data = [...featuresOption];
        data[index].value = !data[index].value;
        setFeatureOption(data);
        const pushingToValidateChecked = data.filter(el=> el.value).map(el=> el.label)
        setChecked(pushingToValidateChecked)
    ////bazilCodeend
    }
    return (
    <div className="details-with-photos">
      {/* Second  tab content will go here */}
      <div className="photos-uploaded">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={15}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <Slider {...settings} className={`photos-slider`}>
            {imageList.map((image, index) => (
              <div onClick={()=>{setIntial(index)}} className={`${index===intial ? 'active-photo' : ''} image-item`} key={index}>
                <img src={image['data_url']} alt="" width="100" />
                <button className={`${index===intial ? 'show' : ''} remove-icon`} onClick={() => {
                  if(index === imageList ){
                    setIntial(0);
                  }
                  onImageRemove(index)
                  }}><img src={remove}></img></button>
                {index===0  && <div className="heading">Main Photo</div>}
              </div>
            ))}
            </Slider>
            {imageList.length > 0 && <div className="photos-count">{imageList.length}/15</div>}
            <Button variant="primary" size="lg" active onClick={onImageUpload}
              {...dragProps}>
               Add Photos 
            </Button>
          </div>
        )}
      </ImageUploading>
      </div>
      {' '}
      <Form className="car-details">
      <div className="col-lg-5 col-12 m-auto">
      <Form.Control 
        type="text" 
        placeholder="Title/Car name" 
        value={ metaTextInputFields.titleName}
        name="titleName"
        onChange={textTypeFieldChange}
        />
      <br />
      <Form.Control 
        as="textarea" 
        placeholder="Description/ History" 
        value={metaTextInputFields.description}
        name="description"
        onChange={textTypeFieldChange}
      />
      <br />
      
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedFuelOption} 
        options={fuelOptions}
        name="selectedFuelOption"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='Fuel Type'
      />
      <br />
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedBodyConditionOption}
        options={bodyConditionOptions}
        name="selectedBodyConditionOption"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='Car Condition'
      />
      <br />
      {/* <Select
        classNamePrefix='dropdown'
        value={selectedMecConditionOption} 
        options={mecConditionOptions}
        onChange={setSelectedMecConditionOption}
        placeholder='Mechanical Condition'
      />    <br /> */}
      
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedColorOption}
        options={colorOptions}
        name="selectedColorOption"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='Color'
      />
      <br />
      {/* <Select
        classNamePrefix='dropdown'
        // value={selectedColorOption} 
        // options={colorOptions}
        // onChange={setSelectedColorOption}
        placeholder='History'
      />
      <br /> */}
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedDoorsOption}
        options={doorsOptions}
        name="selectedDoorsOption"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='Doors'
      />
      <br />     
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedCylinderOption}
        options={cylinderCountOptions}
        name="selectedCylinderOption"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='No. of Cylinder'
      />
      <br />
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedBodyTypeOption}
        options={bodyTypeOptions}
        name="selectedBodyTypeOption"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='Body Type'
      />
      <br />
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedHorsepowerOption}
        options={horsePowerOptions}
        name="selectedHorsepowerOption"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='Horsepower'
      />
      <br />
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedStreeingSideOption} 
        options={streeingSideOptions}
        name="selectedStreeingSideOption"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='Streeing Side'
      />
      <br />
      {/* <Form.Control 
        type="text" 
        placeholder="Registration no" 
        value={registrationNo}
        onChange={e => setRegistrationNo(e.target.value)}
        />
      <br /> */}
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedOwnerOption}
        options={ownerOptions}
        name="selectedOwnerOption"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='Owner'
      />
      <br />
      <Select
        classNamePrefix='dropdown'
        value={metaSelectDropDown.selectedTransmissionOptions}
        options={transmissionOptions}
        name="selectedTransmissionOptions"
        onChange={(value, action)=>selectDropDownChangeEvent(value, action)}
        placeholder='Transmission'
      />      
      </div>
      <div className="checkList">
        <div className="title">Extras</div>
        <div className="list-container d-inline-block col-lg-8 col-12 m-auto">
          {/* bazilCode_Modification starthere */}
    {/* bazilCode --> comment the exrtrasChecboxList and use featuresOption 👇below at bazilCode */}
        {/* {extrasCheckBoxList.map((item, index) => (
            <div key={index} className='col-12  col-lg-4 float-start'>
            <input value={item} type="checkbox" onChange={handleExtrasCheck}/>
            <span className={isChecked(item)}>{item}</span>
            </div>
        ))} */}
        {/* bazilCode_Modification endhere*/}

{/* bazilCode_startsHere */}
        {featuresOption.map((item, index) => (
            <div key={index} className='col-12  col-lg-4 float-start'>
            <input value={item.item} type="checkbox" 
              onChange={()=>changeVision(index)}
              checked={item.value}
            />
            <span className={isChecked(item)}>{item.label}</span>
            </div>
        ))}
{/* bazilCode_endHere */}
        </div>
    </div>
    <div className="checkout-button" style={{backgroundImage: `url('${checkoutArrow}')`}} onClick={createAd}></div>
    </Form>
    </div>
  );
};
export default DetailsWithPhotos;
