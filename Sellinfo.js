import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import BasicInformation from '../SellInfo/BasicInformation';
import DetailsWithPhotos from '../SellInfo/DetailsWithPhotos';
import Payment from '../SellInfo/Payment';
import SellBg  from '../../assets/images/jpg/sell-banner-bg.jpg';
import SellNav  from '../../assets/images/png/sell-nav.png';
import checkoutSuccess  from '../../assets/images/png/checkout-success.png';
import {Button, Container} from 'react-bootstrap';
import { getSellerAdInfo, getTrimInfo } from '../../actions/brands';
import successBg from '../../assets/images/png/sell-checkout-success-bg.png';
import {useParams} from 'react-router-dom'
import {getMyADs} from '../../sagas/apiUrls'
import Axios from 'axios'

const SellInfo = () => {
    const {id} = useParams()
    console.log(id)
    const dispatch = useDispatch();
    const locationlist = useSelector(state => state.selleradinfo.locationlist);
    const modellist = useSelector(state => state.selleradinfo.modellist);
    const brandlist = useSelector(state => state.selleradinfo.brandlist);
    const trimList = useSelector(state => state.selleradinfo.trimlist);

    const [activeTab, setActiveTab] = useState("basicinformation");    
    const [isAdPostedMsg, setAdPostedMsg] = useState(false);    
    const [carDetails, saveCarDetails] = useState({});
    // const [modelList, setModelList] = useState([modellist]); 
    
    ///// hardCoded once GET_REQUEST_specificItem_need /// take USERID_from sessionstorage_
    useEffect(()=>{
    //bazilCode_startHere
    //   let adStatus; 
    //   let User_Id = 3 // hardCode to get dev_END purpose_TEMP  
      let User_Id = sessionStorage.getItem('userId')  //// Accordding to userID, it will grab the specific ads from its draft...
      let editStatus = "draft" ;/// forEdit
        if(id){
            Axios.get(`${getMyADs}${User_Id}?status=${editStatus}`).then(res=>{
//    Axios.get(`https://shanuunbackend-gateway-a0i9bjo1.uc.gateway.dev/sell/viewAd/userId/3`).then(res=>{
                let rest = res?.data
//    let filterBasedOnEditID = rest?.find(el=> el.adBasicInfo.advertisementId === 6)  
            let filterBasedOnEditID = rest?.find(el=> el.adBasicInfo.advertisementId === +id)                
                dispatch({
                type:'EDIT_SELLERAD',
                payload: {...filterBasedOnEditID}
                })
                dispatch(getTrimInfo(filterBasedOnEditID?.adBasicInfo?.modelId))        
                console.log(filterBasedOnEditID,'filterBasedOnEditID')
            })   
        }
        // adStatus = User_Id+"?status="+editStatus
        // dispatch(getMyAdsLists(adStatus))
    //bazilCode_endHere
    },[id])
    
    useEffect(() => {
        dispatch(getSellerAdInfo());
      }, [dispatch])

    //  Functions to handle Tab Switching
    const handleBasicInformation = () => {
        // update the state to tab1
        console.log('locationlist',locationlist)
        setActiveTab("basicinformation");
    };
    
    const handleDetailsWithPhotos = () => {
        // update the state to tab2
        if(carDetails.location && carDetails.brand && carDetails.year && carDetails.model && carDetails.km && 
            carDetails.price && carDetails.phone ){
            dispatch({
                type: 'CAR_DETAILS',
                payload: {
                    location: carDetails.location,
                    brand: carDetails.brand,
                    year: carDetails.year,
                    model: carDetails.model,
                    km: carDetails.km,
                    price: carDetails.price,
                    phone: carDetails.phone
                }
            })
            setActiveTab("detailswithphotos");
        }
        
    };

    const handlePayments = () => {
        // update the state to tab3
        setActiveTab("payments");
    };

    const saveCarData=(data)=>{
        saveCarDetails(data)
    }
    return(
        <>
            <div className="sell-car-info" style={{backgroundImage: `url('${SellBg}')`}}>
                {isAdPostedMsg ? 
                <Container className='success-container'>
                <div className='success-bg col-10'  style={{backgroundImage: `url('${successBg}')`}}>
                    <div className='success-msg'>
                        <img src={checkoutSuccess}/>
                        <h3>Ad Posted Successfully</h3>
                        <p>You will be receiving a confirmation email</p>
                        <p>Thank You</p>
                        <div className='success-btn d-flex flex-column'>
                        <Link to="/myads">
                            <Button variant="primary">
                            View Ad Details
                            </Button>{' '}
                        </Link>
                        <Link to="/">
                            <Button variant="secondary">
                            Back To Home
                            </Button>
                        </Link>
                        </div>
                    </div>
                </div></Container> :
                <div className='sell container'>
                {/* Tab nav */}
                <ul className="nav sell-info-tab">
                <li
                    className={activeTab === "basicinformation" ? "active" : ""} 
                    onClick={handleBasicInformation}
                >
                    <h5>Basic Information</h5>
                    <span></span>
                    <div className='sell-car-nav'  style={{backgroundImage: `url('${SellNav}')`}}></div>
                    
                </li>
                <li
                    className={activeTab === "detailswithphotos" ? "active" : ""}
                    onClick={handleDetailsWithPhotos}
                >
                    <h5>Details With Photos</h5>
                    <span></span>
                    <div className='sell-car-nav' style={{backgroundImage: `url('${SellNav}')`}}></div>
                    
                </li>
                <li
                    className={activeTab === "payments" ? "active" : ""}
                    onClick={handlePayments}
                >
                    <h5>Payment & Post</h5>
                    <span></span>
                    <div className='sell-car-nav' style={{backgroundImage: `url('${SellNav}')`}}></div>
                </li>
                </ul>
                <div className="outlet">
                    {/* content will be shown here */}                    
                    {activeTab === "basicinformation" ? <BasicInformation locationdata={locationlist} modeldata={modellist} branddata={brandlist}
                    trimdata={trimList}
                    saveCarData={saveCarData} changeTab={()=>{
                        setActiveTab("detailswithphotos");
                    }}/> : (activeTab === "detailswithphotos") ? <DetailsWithPhotos changeTab={()=>{
                        setActiveTab("payments");
                    }}/> : <Payment isAdPostedMsg={isAdPostedMsg} setAdPostedMsg={setAdPostedMsg}/>}
                </div>            
            </div>}
        </div>
        </>
    )
}

export default SellInfo;