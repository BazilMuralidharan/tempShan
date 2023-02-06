import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import demoCarImg  from '../../../assets/images/jpg/sports-car.jpg';
import gasIcon  from '../../../assets/images/png/gas-icon.png';
import gearIcon  from '../../../assets/images/png/gear-icon.png';
import speedometerIcon  from '../../../assets/images/png/speedometer-icon.png';
import calendarIcon  from '../../../assets/images/png/calendar.png';
import likeIcon  from '../../../assets/images/png/like-icon.png';
import ShareIcon  from '../../../assets/images/png/share-icon.png';
import locationIcon  from '../../../assets/images/png/location-icon.png';
import { RWebShare } from "react-web-share";
import {Button} from 'react-bootstrap';
import Favicon from 'react-favicon';
import { addWishlist, removeWishlist } from '../../../actions/brands'
// bazilCode_start
import {useNavigate} from 'react-router-dom'
// bazilCode_end

const Card = ({adBasicInfo, adDetailedInfo, adImages, wishListed, handleClick, selectedCardDetails}) => {
const dispatch = useDispatch();
// bazilCode_start
const navigate = useNavigate()
// bazilCode_end

  let detailedCardInfo = {
    ...adBasicInfo,
    ...adDetailedInfo,
    ...adImages,
    wishListed
  };

console.log('detailedCardInfo', detailedCardInfo)

  const [toggleHeartIcon, setToggleHeartIcon] = useState(true);

  const addRemoveWishlist = (detailedCardInfo) => {
    console.log('detailedCardInfo', detailedCardInfo.wishListed, toggleHeartIcon)
    if(detailedCardInfo.wishListed == true) { 
    dispatch({
      type: 'REMOVE_WISHLIST',
      payload: {
        userId: detailedCardInfo.userId,
        advertisementId: detailedCardInfo.advertisementId,
        wishListed: false
      }
    })
  }else{
    dispatch({
      type: 'ADDTO_WISHLIST',
      payload: {
        userId: detailedCardInfo.userId,
        advertisementId: detailedCardInfo?.advertisementId,
        wishListed: true
      }
    })
  }
    setToggleHeartIcon(!toggleHeartIcon)
  }

  //bazilCode_start
  const editSellInfo=(editadBasicInfo, editadDetailedInfo)=>{
    dispatch({
      type:'EDIT_SELLERAD',
      payload: {...editadBasicInfo, ...editadDetailedInfo}
    })
    navigate(`/sellinfo/editsellad/${adBasicInfo?.advertisementId}`)
  }

  const restrictCarInfoClick=(adBasicInfo, detailedCardInfo)=>{
    if(adBasicInfo?.status==="draft") return 
    handleClick(detailedCardInfo)
  }
  //bazilCode_end
  return(  
   <>
    <div 
      // bazilCode_start
      className={`shanuunCards col-12 col-md-12 col-lg-4 col-xl-4 clearfix ${((adBasicInfo?.status === 'draft')|| (adBasicInfo?.status === "expired"))?'editResell':''}`}
      // bazilCode_end
    >
      <div className='buySell-img'>

        <div className='round-icon-bg' onClick={(e)=> addRemoveWishlist(detailedCardInfo)}>
          {/* <img alt={adBasicInfo.brandName} src={likeIcon}  className="round-icon" /> */}
          <i alt={adBasicInfo?.brandName} className={detailedCardInfo.wishListed == toggleHeartIcon ? "fa-sharp fa-solid fa-heart heart-red" : "fa-sharp fa-solid fa-heart heart-grey"}></i>

        </div>
        <img alt={adBasicInfo?.brandName} src={detailedCardInfo.thumbLocation?? demoCarImg}  className="buySellCards img-fluid" onClick={()=>restrictCarInfoClick(adBasicInfo, detailedCardInfo)}/>
      </div>
      <div className='buySell-content' onClick={()=>restrictCarInfoClick(adBasicInfo, detailedCardInfo)}>

        <h5>{adBasicInfo?.brandName} {adBasicInfo?.modelName}</h5>

          <ul>
           { adBasicInfo?.year ? <li className='year-icon' style={{backgroundImage: `url('${calendarIcon}')`}}>{adBasicInfo?.year}</li>: ''}
           { adBasicInfo?.km ? <li className='speedometer-icon'  style={{backgroundImage: `url('${speedometerIcon}')`}}>{adBasicInfo?.km} KM</li>: ''}
           { adDetailedInfo?.transmission ? <li className='transmission-icon' style={{backgroundImage: `url('${gearIcon}')`}}>{adDetailedInfo?.transmission}</li>: ''}  
          </ul>
          <ul>
          { adDetailedInfo?.fuelType ? <li className='gas-icon'  style={{backgroundImage: `url('${gasIcon}')`}}>{adDetailedInfo?.fuelType}</li>: ''}
          { adBasicInfo?.locationName ? <li className='location-icon'  style={{backgroundImage: `url('${locationIcon}')`}}>{adBasicInfo?.locationName}</li>: ''}
          </ul>

        </div>
        <div>
          <Button variant="danger">AED {adBasicInfo?.price}</Button>{' '}
          {/* bazilCode_start */}
            {
          (adBasicInfo?.status === 'draft') && 
            <Button className='editResellBtn'
            onClick={()=>editSellInfo(adBasicInfo, adDetailedInfo)}>EDIT</Button>
          }
           {
          (adBasicInfo?.status === 'expired') && 
            <Button className='editResellBtn'
            onClick={()=>{}}>RESELL</Button>
          }
          {/* bazilCode_end */}
          <div className='round-icon-bg position-static'>
          <RWebShare
                    data={{
                      text: "Dear Customer, Please find the details in below link",
                      url: "http://localhost:8080",
                      title: "Car Details- Shannun",
                    }}
                    onClick={() => console.log("shared successfully!")}
                    >

                    <img alt={adBasicInfo?.brandName} src={ShareIcon}  className="round-icon shareIcon" />

                  </RWebShare>  
          </div>
        </div>
    </div> 
  </>  
  );
}

export default Card;