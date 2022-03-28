import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Modal, Input, CheckIcon } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View, Linking, Platform, Text, Alert, TouchableWithoutFeedback } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderMain from '../components/HeaderMain';
import { mainIconData, communityData, boardDatas } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import Font from '../common/Font';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Shadow, version } from 'react-native-shadow-2';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

const {width, height} = Dimensions.get('window');
const iconButtonWidth = width * 0.27;


const boxWidths = width - 20;
const boxHeights = boxWidths / 3.5;

const  heightHome = height - 55;
//console.log(height, heightHome);

//console.log('dsad', boxHeights);
const deviceWidths = Dimensions.get('window');

const Home = (props) => {

    const {navigation, userInfo, route, member_info} = props;

    const {params} = route;

    useEffect(()=>{
        const unsubscribe = () => {
            navigation.addListener('focus', async () => {
                member_info_handle();
                HospitalReceive();
            });
        };
        unsubscribe();
    },[]);

    useEffect(()=>{
        if(params.msg){
            ToastMessage(params.msg);   
        }
    },[]);

    const [userInfoCont, setUserInfoCont] = useState('');
    const [memberInfos, setMemberInfos] =useState('');

    const memberInfoBtn = () => {
        Api.send('member_info', {'id':userInfo.email, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('회원 정보: ', arrItems);
                // ToastMessage(resultItem.message);
                // navigation.goBack();
                setMemberInfos(arrItems);
    
            }else{
                console.log('결과 출력 실패66666!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        memberInfoBtn();

      
    },[])
   
    useEffect(()=>{
        setUserInfoCont(memberInfos)
    },[memberInfos])

 

    const imageBackground1 = {uri:'http://cnj06.cafe24.com/images/mainIconYellow_11.png'};
    const imageBackground2 = {uri:'http://cnj06.cafe24.com/images/mainIconSkyBlue_11.png'};
    const imageBackground3 = {uri:'http://cnj06.cafe24.com/images/mainIconGreen_11.png'};
    const imageBackground4 = {uri:'http://cnj06.cafe24.com/images/mainIconGray_11.png'};

    const MainNavButton = (idx) => {
        if(idx==1){
            navigation.navigate('Inbody');
        }

        if(idx==2){
            navigation.navigate('FoodDiary');
        }

        if(idx==3){
            navigation.navigate('Medicine');
        }

        if(idx==4){
            navigation.navigate('BloodSugar');
        }

        if(idx==5){
            navigation.navigate('BloodPressure');
        }

        if(idx == 6){
            navigation.navigate('CustomCommunity');
        }
    }

    const mainIconList = mainIconData.map((item, index)=>{
        return(
            <TouchableOpacity 
                key={item.idx} 
                style={[
                    styles.mainIconButtonWrap,
                    { overflow:'hidden', borderRadius:10,  },
                    item.idx !== 1 && {marginLeft:-10}
                ]}
                onPress={()=>{MainNavButton(index+1)}}
            >
                
                <ImageBackground
                    source={
                        item.idx === 1 ? imageBackground1 :
                        item.idx === 2 ? imageBackground2 : 
                        item.idx === 3 ? imageBackground3 :
                        item.idx === 4 ? imageBackground4 :
                        item.idx === 5 ? imageBackground1 :
                        item.idx === 6 ? imageBackground2 : imageBackground1
                    }
                    resizeMode='contain'
                    style={{width:iconButtonWidth, height:iconButtonWidth, justifyContent:'center', alignItems:'center'}}
                >
                    <Box style={[styles.mainIconButton]}>
                        {
                            width > 360 ?
                            <Image source={{uri:item.imageUrl}} alt={item.title} style={{width:(width-40) * 0.1, height:(width-40) * 0.1, marginLeft:-5, marginTop:-5}} resizeMode='contain' />
                            :
                            <Image source={{uri:item.imageUrl}} alt={item.title} style={{width:30, height:30, marginLeft:-5, marginTop:-5}} resizeMode='contain' />
                        }

                        <DefText text={item.title} style={[styles.mainIconTitle, {marginLeft:-5}, item.idx === 6 && {fontSize:12}]} />
                    </Box>
                </ImageBackground>
                
            </TouchableOpacity>
        )
    });

    const [hospitalNotice, setHospitalNotice] = useState('');


    const [hospitalBanners, setHospitalBanners] = useState('');


    const HospitalBannerReceive = () => {


        Api.send('member_info', {'id':userInfo.email, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                let hcodes = arrItems.m_hcode;

                //병원 홈 배너 가져오기...
                Api.send('hospital_banner', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':hcodes}, (args)=>{
                    let resultItem = args.resultItem;
                    let arrItems = args.arrItems;

                    if(resultItem.result === 'Y' && arrItems) {
                    // console.log('병원 정보: ', arrItems);

                        
                        //console.log('홈 화면 배너정보:::', arrItems);
                        //console.log(resultItem.message);
                        setHospitalBanners(arrItems);

                    }else{
                        console.log('결과 출력 실패123123!', resultItem);
                    //ToastMessage(resultItem.message);
                    }
                });
            }
        });

        
    }

    useEffect(()=>{
        HospitalBannerReceive();
    }, [])
    
    const HospitalReceive = () => {
        Api.send('member_info', {'id':userInfo.email, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {


                let hcodes = arrItems.m_hcode;

                Api.send('hospital_mainBBS', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':hcodes}, (args2)=>{
                    let resultItemHospital = args2.resultItem;
                    let arrItemsHospital = args2.arrItems;

                    if(resultItemHospital.result === 'Y' && arrItemsHospital){

                       //console.log('병원게시판::', arrItemsHospital)
                        setHospitalNotice(arrItemsHospital);

                    }else{
                        console.log('실패', resultItemHospital)
                    }

                });
                
            }else{
                console.log('결과 출력 실패45555!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }


    useEffect(()=>{
        HospitalReceive();
    }, [])

 


    const [counselModal, setCounselModal] = useState(false);
    const counselModalClosed = () => {
        setCounselModal(false);
        setCounselPage('1');
    }

    const [qaList1, setQaList1] = useState('');
    const qaListChange = (qa) => {
        if(qa == qaList1){
            setQaList1('')
        }else{
            setQaList1(qa)
        }
        
    }

    const [counselPage, setCounselPage] = useState('1');
    const counselPageChange = async (qa) => {
        // if(!qaList1){
        //    // ToastMessage('상담유형을 선택하세요.');
        //    Alert.alert('상담유형을 선택하세요.');
        //     return false;
        // }

        setQaList1(qa);

        await setCounselModal(false);
        await setCounselModalPwd(true)

        // if(qaList1 == '1'){
        //     setCounselPage('2');
        // }else{
        //     await setCounselModal(false);
        //      await setCounselModalPwd(true)
        // }

        
    }

    const [counselModalPwd, setCounselModalPwd] = useState(false);

    const [counselPwd, setCounselPwd] = useState('');
    const counselChange = (text) => {
        setCounselPwd(text)
    }

    const qaNavigation = async () => {

        await setCounselPage('1'); 
        await setCounselModal(false);
        await setCounselModalPwd(true)

    }

    const qaNavigationGo = () => {

        console.log('counselPwd', counselPwd);

        if(!privacyAgree){
            setCounselModalPwd(false);
            ToastMessage('개인정보 수집이용에 대하여 동의를 체크해주세요');
            return false;
        }

        if(!healthAgree){
            setCounselModalPwd(false);
            ToastMessage('건강상담 이용에 대하여 동의를 체크해주세요');
            return false;
        }

        if(userInfo.passwd2 != counselPwd){
            setCounselModalPwd(false);
            ToastMessage('자문 비밀번호가 올바르지 않습니다.');
            return false;
        }

        setCounselPwd('');

        setCounselModalPwd(false);
        navigation.navigate('HealthCheckList', {'qaList1':qaList1});
    }


    const [hospitalChange, setHospitalChange] = useState(false);



    const hospitalChangeButtonVisible = () => {
        setHospitalChange(!hospitalChange);
    }

    const hospitalChangeBtn = (hcode) => {

        if(userInfo != undefined){
            if(userInfo.m_hcode == hcode){
                ToastMessage('이미 선택된 병원입니다.');
                setHospitalChange(false);
                return false;
            }
        }


        Api.send('member_hcode', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':hcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('병원 정보: ', arrItems);

                member_info_handle();
                navigation.dispatch(
                    StackActions.replace('Tab_Navigation', {
                            screen: 'Home',
                            params: {
                                msg : resultItem.message
                            }
                       }
                   )
                );
                setHospitalChange(false);
                
         

            }else{
                console.log('결과 출력 실패123123!', resultItem);
         
            }
        });
    }


     const [memberHcode, setMemberHcode] = useState('');

    // //회원정보 조회
    const member_info_handle = async () => {
        

            const formData = new FormData();
            formData.append('method', 'member_info');
            formData.append('id', userInfo.email);
            formData.append('token', userInfo.appToken);
            const member_info_list = await member_info(formData);

            console.log('회원정보:::::',member_info_list);
            setMemberHcode(member_info_list.result.m_hcode);

    };


    const [checkListStatus, setCheckListStatus] = useState('');
    const [checkListSaveModal, setCheckListSaveModal] = useState(false);

    const RequestSend = () => {
        Api.send('checklist_check', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('임시저장?: ', arrItems);


                if(arrItems != ''){
                    setCheckListStatus(arrItems);
                    setCheckListSaveModal(true);
                }else{
                    setCounselModal(true);
                }
               
            }else{
                //console.log('결과 출력 실패!', resultItem);
               // ToastMessage(resultItem.message);
            }
        });
    }


    //임시저장된 값 받아오기
    const saveCheckListReceive = () => {
        console.log('임시저장된 리스트...', checkListStatus);
        setCheckListSaveModal(false);
        navigation.navigate('HealthCheckList', {'qaList1':checkListStatus.ctype, checkListStatus})
    }


    //임시저장된 체크리스트 삭제..
    const CheckListSaveEmpty = () => {
       
                //await setHospitalCode(member_info_list.result.membership[0]['hcode']);
        Api.send('checklist_empty', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('임시저장?: ', arrItems);
                //setCheckListStatus(arrItems);

                ToastMessage(resultItem.message);
                setCheckListSaveModal(false);
                setCounselModal(true);
                
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
  
    }

    const [privacyAgree, setPrivacyAgree] = useState(false);
    const [privacyAgreeModal, setPrivacyAgreeModal] = useState(false);
    const [healthAgree, setHealthAgree] = useState(false);
    const [healthAgreeModal, setHealthAgreeModal] = useState(false);

    const [personalData, setPersonalData] = useState('');
    const [bioData, setBioData] = useState('')

    const PersonalRecieve = (page) => {
        Api.send('service_personalPage', {'page':page}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('개인정보보호방침::::: ', arrItems);
                setPersonalData(arrItems);
                if(arrItems != ''){
                    setPrivacyAgreeModal(true);
                }
               
            }else{
                console.log('개인정보보호방침 출력 실패!', resultItem);
               // ToastMessage(resultItem.message);
            }
        });
    }

    const BioRecieve = () => {
        Api.send('service_bio', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('건강상담이용::::: ', arrItems);

                setBioData(arrItems);
               
            }else{
                console.log('건강상담이용 출력 실패!', resultItem);
               // ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=> {
       // PersonalRecieve();
        BioRecieve()

        //console.log(Platform.OS, width);
    }, [])
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderMain navigation={navigation} hospitalCode={memberHcode} hospitalLogo={userInfo?.m_logo ? userInfo?.m_logo : ''} hospitalName={userInfo?.m_name ? userInfo?.m_name : ''} hospitalChangeBtn={hospitalChangeButtonVisible} />
            
            <ScrollView>
                <Box>
                    
                    <Box  >
                        {
                            userInfo?.m_main &&
                            <Box  justifyContent={'center'} alignItems={'center'} >
                                <Image source={{uri:userInfo.m_main}} alt='메인배너' width={width} height={width/1.78} resizeMode='stretch'/>
                            </Box>
                        }
                        <Box position='absolute' bottom={'15px'} left={'25px'}>
                            <TouchableOpacity
                                style={{
                                    width:100,
                                    height:30,
                                    backgroundColor:'#090A73',
                                    borderRadius:10,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    marginTop:10 
                                }}
                                onPress={RequestSend}
                            >
                                <Box shadow={8} >
                                    <DefText text='상담요청' style={{color:'#fff', fontSize:18, lineHeight:30, fontFamily:Font.NotoSansDemiLight}} />
                                </Box>
                            </TouchableOpacity>
                        </Box>
                        {/* <Box position='absolute' top={2.5} left={0}>
                            <DefText text={'안녕하세요 ' + memberInfos.name+'님'} style={{fontSize:15, color:'#000', marginBottom:10}} />
                            
                            <DefText text={'건강을 지켜드리는'+`\n`+'주치의원 더힐링입니다.'} style={{fontSize:18, lineHeight:26, color:'#000'}} />
                            <TouchableOpacity
                                style={{borderRadius:8, overflow:'hidden', width:100, height:30, marginTop:15, backgroundColor:"#696968", alignItems:'center', justifyContent:'center' }}
                                onPress={RequestSend}
                            >
                                <Box shadow={8} >
                                    <DefText text='상담요청' style={{fontSize:15, color:'#FFFFFF'}} />
                                </Box>
                            </TouchableOpacity>
                        </Box> */}
                    </Box>
                        
                
                    {/* 메인 버튼 */}
                    <VStack pl='15px'>
                        <Box mt={5}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                
                            >
                                <HStack pr={'10px'}>
                                   {/* {mainIconList} */}
                                   <TouchableOpacity onPress={()=>navigation.navigate('Inbody')}>
                                        <ImageBackground
                                            source={{uri:'https://khict0107.cafe24.com/images/yellowBoxNew.png'}}
                                            resizeMode='contain'
                                            style={{
                                                width:iconButtonWidth, height:iconButtonWidth, justifyContent:'center', alignItems:'center'
                                            }}
                                        >   
                                            <Box style={{marginTop:-5}}>
                                                <Image source={require('../images/inbodyImageNew.png')} alt='인바디' style={{width:48, height:48, resizeMode:'contain', marginLeft:-5}} />
                                                <DefText text='인바디' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginTop:5}} />
                                            </Box>
                                        </ImageBackground>
                                   </TouchableOpacity>

                                   <TouchableOpacity onPress={()=>navigation.navigate('FoodDiary')} style={{marginLeft:-7}}>
                                        <ImageBackground
                                            source={{uri:'https://khict0107.cafe24.com/images/blueBoxNew.png'}}
                                            resizeMode='contain'
                                            style={{
                                                width:iconButtonWidth, height:iconButtonWidth, justifyContent:'center', alignItems:'center'
                                            }}
                                        >   
                                            <Box style={{marginTop:-5, alignItems:'center'}}>
                                                <Image source={require('../images/foodImageNew.png')} alt='인바디' style={{width:48, height:48, resizeMode:'contain', marginLeft:-5}} />
                                                <DefText text='식단' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginTop:5, marginLeft:-5}} />
                                            </Box>
                                        </ImageBackground>
                                   </TouchableOpacity>

                                   <TouchableOpacity onPress={()=>navigation.navigate('Medicine')} style={{marginLeft:-7}}>
                                        <ImageBackground
                                            source={{uri:'https://khict0107.cafe24.com/images/greenBoxNew.png'}}
                                            resizeMode='contain'
                                            style={{
                                                width:iconButtonWidth, height:iconButtonWidth, justifyContent:'center', alignItems:'center'
                                            }}
                                        >   
                                            <Box style={{marginTop:-5, alignItems:'center'}}>
                                                <Image source={require('../images/medicineImageNew.png')} alt='복약' style={{width:48, height:48, resizeMode:'contain', marginLeft:-5}} />
                                                <DefText text='복약' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginTop:5, marginLeft:-5}} />
                                            </Box>
                                        </ImageBackground>
                                   </TouchableOpacity>
                                   
                                   <TouchableOpacity onPress={()=>navigation.navigate('BloodSugar')} style={{marginLeft:-7}}>
                                        <ImageBackground
                                            source={{uri:'https://khict0107.cafe24.com/images/bloodPBoxNew.png'}}
                                            resizeMode='contain'
                                            style={{
                                                width:iconButtonWidth, height:iconButtonWidth, justifyContent:'center', alignItems:'center'
                                            }}
                                        >   
                                            <Box style={{marginTop:-5, alignItems:'center'}}>
                                                <Image source={require('../images/bloodPImageNew.png')} alt='혈당' style={{width:48, height:48, resizeMode:'contain', marginLeft:-5}} />
                                                <DefText text='혈당' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginTop:5, marginLeft:-5}} />
                                            </Box>
                                        </ImageBackground>
                                   </TouchableOpacity>

                                   <TouchableOpacity onPress={()=>navigation.navigate('BloodPressure')} style={{marginLeft:-7}}>
                                        <ImageBackground
                                            source={{uri:'https://khict0107.cafe24.com/images/yellowBoxNew.png'}}
                                            resizeMode='contain'
                                            style={{
                                                width:iconButtonWidth, height:iconButtonWidth, justifyContent:'center', alignItems:'center'
                                            }}
                                        >   
                                            <Box style={{marginTop:-5, alignItems:'center'}}>
                                                <Image source={require('../images/bloodPBoxNews.png')} alt='혈압' style={{width:59, height:48, resizeMode:'contain', marginLeft:-5}} />
                                                <DefText text='혈압' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginTop:5, marginLeft:-5}} />
                                            </Box>
                                        </ImageBackground>
                                   </TouchableOpacity>

                                   <TouchableOpacity onPress={()=>navigation.navigate('CustomCommunity')} style={{marginLeft:-7}}>
                                        <ImageBackground
                                            source={{uri:'https://khict0107.cafe24.com/images/blueBoxNew.png'}}
                                            resizeMode='contain'
                                            style={{
                                                width:iconButtonWidth, height:iconButtonWidth, justifyContent:'center', alignItems:'center'
                                            }}
                                        >   
                                            <Box style={{marginTop:-5, alignItems:'center'}}>
                                                <Image source={require('../images/customComImageNew.png')} alt='맞춤건강정보' style={{width:44, height:48, resizeMode:'contain', marginLeft:-5}} />
                                                <DefText text='맞춤건강정보' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginTop:5, marginLeft:-5}} />
                                            </Box>
                                        </ImageBackground>
                                   </TouchableOpacity>
                                </HStack>
                            </ScrollView>
                        </Box>
                    </VStack>
                    {/* 메인 버튼 */}
                    {/* 빠른 예약 */}
                    <Box px={5} mt={5}>
                        <TouchableOpacity onPress={()=>navigation.navigate('Reservation')}>
                            <ImageBackground 
                                source={require('../images/mainShadowBox_11.png')}
                                style={{ width:boxWidths, height:boxHeights,  marginLeft:-10, marginTop:-20, alignItems:'center', justifyContent:'center'}}
                                resizeMode='stretch'
                            >
                                <Box
                                    width={width-40}
                                    height={100}
                                    //backgroundColor='#ff0'
                                    alignItems='center'
                                    justifyContent='center'
                                    mt={-2.5}
                                >
                                    <HStack alignItems='center' justifyContent='space-between' width={width-40} px='25px' >
                                        <VStack>
                                            <DefText text='병원예약' style={{fontSize: width > 360 ? 17 : 15, lineHeight:25}} />
                                            <DefText text='해피콜로 예약을 도와드립니다.' style={{ marginTop:10}} />
                                        </VStack>
                                        <Image source={require('../images/TelephoneHomeNew.png')} alt='빠른예약' style={{width:48, height:48, resizeMode:'contain'}} />
                                    </HStack>
                                </Box>
                            </ImageBackground>
                        </TouchableOpacity>
                    </Box>
                    {/* 빠른 예약 */}
                    {/* 병원 소개 */}
                    <Box px={5} mt={2.5}>
                        
                        <TouchableOpacity 
                            onPress={()=>{navigation.navigate('HospitalInfo', {'users':memberInfos})}}
                          >
                            <ImageBackground 
                                source={require('../images/mainShadowBox_11.png')}
                                style={{ width:boxWidths, height:boxHeights,  marginLeft:-10, marginTop:-15, alignItems:'center', justifyContent:'center'}}
                                resizeMode='stretch'
                            >
                                <Box
                                    width={width-40}
                                    height={100}
                                    //backgroundColor='#ff0'
                                    alignItems='center'
                                    justifyContent='center'
                                    mt={-2.5}
                                >
                                    <HStack alignItems='center' justifyContent='space-between' width={width-40} px='25px'>
                                        <VStack>
                                            <DefText text='병원소개' style={{fontSize:width > 360 ? 17 : 15, lineHeight:25}} />
                                            <DefText text='병원,의료진, 진료시간안내' style={{marginTop:10}} />
                                        </VStack>
                                        <Box widht={60} height={60} alignItems='center' justifyContent={'center'} mr='10px'>
                                            <Image source={require('../images/MedicalNew.png')} alt='빠른예약' style={{width:37, height:48, resizeMode:'contain'}} />
                                        </Box>
                                    </HStack>
                                </Box>
                            </ImageBackground>
                        </TouchableOpacity>
                        
                    </Box>
                    {/* 병원 소개 */}

                    {/* 클리닉 소개 */}
                    <Box px={5} mt={2.5} >
                        <TouchableOpacity onPress={()=>{navigation.navigate('Clinic')}} style={{width:width-40, height:110, backgroundColor:'#fff', borderRadius:10}}>
                            <ImageBackground 
                                source={require('../images/mainShadowBox_11.png')}
                                style={{ width:boxWidths, height:boxHeights,  marginLeft:-10, marginTop:-15, alignItems:'center', justifyContent:'center'}}
                                resizeMode='stretch'
                            >
                                <Box
                                    width={width-40}
                                    height={100}
                                    //backgroundColor='#ff0'
                                    alignItems='center'
                                    justifyContent='center'
                                    mt={-2.5}
                                >
                                    <HStack alignItems='center' justifyContent='space-between' width={width-40} px='25px'>
                                        
                                        <VStack>
                                            <DefText text='클리닉 소개' style={{fontSize:width > 360 ? 17 : 15, lineHeight:25}} />
                                            <DefText text='건강을 챙기는 클리닉안내' style={{marginTop:10, }} />
                                        </VStack>
                                        <Box widht={60} height={60} alignItems='center' justifyContent={'center'}>
                                            <Image source={require('../images/ClinicNew.png')} style={{width:55, height:55}} alt='클리닉' />
                                        </Box>
                                    </HStack>
                                </Box>
                            </ImageBackground>
                        </TouchableOpacity>
                    </Box>
                    {/* 클리닉 소개 */}


                    {/* 당뇨 관리 */}
                    {
                        hospitalBanners != '' &&
                        <Box px={5} mb={5} mt={ width > 390 ? -2.5 : '-20px'}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('ClinicViews', hospitalBanners)}} style={{width:width-40, height:110, backgroundColor:'#fff', borderRadius:10}}>
                                <Image source={{uri:hospitalBanners.upfile}} style={{width:width - 40, height:110, resizeMode:'contain'}} alt={hospitalBanners.prdcode}  />
                            </TouchableOpacity>
                        </Box>
                    }
                    
                    {/* 당뇨 관리 */}

                    
                    {/* 안내 */}
                    <Box px={5} mt={2} mb={2.5}>
                       
                        <ImageBackground 
                            source={require('../images/mainShadowBoxBig_11.png')}
                            style={{ width:boxWidths-5, height:boxHeights,  marginLeft:-5, marginTop:-20, alignItems:'center', justifyContent:'center'}}
                            resizeMode='stretch'
                        >
                            <Box
                                width={width-40}
                                height={100}
                                //backgroundColor='#ff0'
                                alignItems='center'
                                justifyContent='center'
                                mt={-2.5}
                            >
                                <HStack justifyContent='space-between' alignItems='center' width={width-40} px='25px'>
                                    <VStack alignItems='center' width={(width-80) * 0.18} >
                                        <TouchableOpacity onPress={()=>navigation.navigate('Board')} style={{alignItems:'center'}}>
                                            <DefText text='안내' style={{fontSize: width > 360 ? 17 : 15, lineHeight:26, marginBottom:10}} />
                                            {
                                                width > 360 ?
                                                <Image source={require('../images/infomationIcon.png')} alt='안내' height='42px' resizeMode='contain' /> 
                                                :
                                                <Image source={require('../images/infomationIcon.png')} alt='안내' height='32px' resizeMode='contain' /> 
                                            }
                                           
                                        </TouchableOpacity>
                                    </VStack>
                                    {
                                        hospitalNotice != '' &&
                                        hospitalNotice.length > 0 ?
                                        <VStack width={(width-80) * 0.75} justifyContent='space-between'>
                                            {
                                                hospitalNotice.map((item, index)=> {
                                                    return(
                                                        <TouchableOpacity key={index} onPress={()=>navigation.navigate('BoardView', item)}>
                                                            <DefText text={textLengthOverCut(item.subject, 20)} style={[{fontSize:13, lineHeight:19,  color:'#000'}, index !== 0 && {marginTop:5} ]} />
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </VStack>
                                        :
                                        <Box width={(width-80) * 0.75} alignItems='center'>
                                            <DefText text='등록된 게시글이 없습니다.' style={{color:'#666'}}  />
                                        </Box>
                                    }
                                </HStack>
                            </Box>
                        </ImageBackground>
                       
                    </Box>
                    {/* 안내 */}
                </Box>
            </ScrollView>

            <Modal isOpen={counselModal} style={{flex:1}} onClose={counselModalClosed}>
                <Box p={5} py={'25px'} pb={Platform.OS === 'ios' ? '40px' : 5} backgroundColor='#fff' position='absolute' bottom={0} left={0} width={width} borderTopLeftRadius={20} borderTopRightRadius={20}>
                    {
                        counselPage == '1' &&
                        <>
                            <DefText text='어떤 상담을 원하시나요?' style={{color:'#333', fontWeight:'700', marginBottom:10, fontFamily:Font.NotoSansBold, fontSize:18, lineHeight:22}} />
                            <HStack flexWrap='wrap'>
                                <Box>
                                    <TouchableOpacity onPress={()=>counselPageChange('1')} style={[styles.counselButton , qaList1 == '1' && {backgroundColor:'#696969'}]}>
                                        {/* <DefText text='몸이 안좋아요. 왜 그럴까요?' style={[styles.counselButtonText, qaList1 == '1' && {color:'#fff'}]} /> */}
                                        <DefText text='진료전 아프거나 불편한 점이 있어요.' style={[styles.counselButtonText, qaList1 == '1' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                </Box>
                            </HStack>
                            <HStack flexWrap='wrap'>
                                <Box>
                                    <TouchableOpacity onPress={()=>counselPageChange('2')} style={[styles.counselButton, qaList1 == '2' && {backgroundColor:'#696969'}]}>
                                        {/* <DefText text='병원 다녀왔는데도 여전히 안 좋아요.' style={[styles.counselButtonText, qaList1 == '2' && {color:'#fff'}]} /> */}
                                        <DefText text='진료후 아프거나 문의사항이 있어요.' style={[styles.counselButtonText, qaList1 == '2' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                </Box>
                            </HStack>
                            <HStack flexWrap='wrap'>
                                <Box>
                                    <TouchableOpacity onPress={()=>counselPageChange('3')} style={[styles.counselButton, qaList1 == '3' && {backgroundColor:'#696969'}]}>
                                        <DefText text='건강상식에 관해 궁금한 점이 있어요.' style={[styles.counselButtonText, qaList1 == '3' && {color:'#fff'}]} />
                                        {/* <DefText text='건강상식, 이게 맞는 건가요?' style={[styles.counselButtonText, qaList1 == '3' && {color:'#fff'}]} /> */}
                                    </TouchableOpacity>
                                </Box>
                            </HStack>
                            <HStack flexWrap='wrap'>
                                <Box>
                                    <TouchableOpacity onPress={()=>counselPageChange('4')} style={[styles.counselButton, qaList1 == '4' && {backgroundColor:'#696969'}]}>
                                        <DefText text='예약이나 가격에 관한 기타 문의사항이 있습니다.' style={[styles.counselButtonText, qaList1 == '4' && {color:'#fff'}]} />
                                        {/* <DefText text='그냥 궁금한게 있어요.' style={[styles.counselButtonText, qaList1 == '4' && {color:'#fff'}]} /> */}
                                    </TouchableOpacity>
                                </Box>
                            </HStack>
                           
                            {/* <HStack justifyContent='flex-end' mt={2.5}>
                                <TouchableOpacity onPress={counselPageChange} style={[styles.counselButton]}>
                                    <DefText text='다음' />
                                </TouchableOpacity>
                            </HStack> */}
                        </>
                    }
                    {
                        counselPage == '2' && 
                        <>
                            <Text style={{fontSize:15, color:'#333', fontWeight:'bold', marginBottom:10}}>
                                상담을 위해 문진이 필요합니다. 문진을{'\n'}진행하시겠습니까?
                            </Text>
                            <HStack justifyContent='flex-end'>
                                <TouchableOpacity onPress={qaNavigation} style={[styles.counselButton]}>
                                    <DefText text='예' style={[styles.counselButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                            <HStack justifyContent='flex-end'>
                                <TouchableOpacity onPress={counselModalClosed} style={[styles.counselButton]}>
                                    <DefText text='아니오' style={[styles.counselButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                        </>
                    }
                    
                </Box>
            </Modal>
            
            <Modal isOpen={counselModalPwd} onClose={()=>setCounselModalPwd(false)}>
                <Box p={5} backgroundColor='#fff' borderTopLeftRadius={20} borderTopRightRadius={20} position={'absolute'} bottom={0} width={width}>

                <DefText text={"건강을 위한 개인정보 수집과 건강상담이용 \n안내를 확인하고 동의해주세요."} style={{fontSize:18, fontWeight:'700', fontFamily:Font.NotoSansBold, lineHeight:28}} />

                <HStack alignItems={'center'} mt={'15px'}>
                    <TouchableOpacity onPress={()=>setPrivacyAgree(!privacyAgree)}>
                        <HStack>
                            <Box style={[{width:20, height:20, borderRadius:40, borderWidth:1, borderColor:'#f1f1f1', alignItems:'center', justifyContent:'center', marginRight:10}, privacyAgree && {borderColor:'#696969'}]}>
                                <CheckIcon width={11} color={ privacyAgree ? '#696969' : '#f1f1f1'} />
                            </Box>
                            <DefText text='개인(민감)정보 수집 및 이용약관' style={{color:'#696969'}}  />
                        </HStack>
                    </TouchableOpacity>
                   
                    <TouchableOpacity style={{marginLeft:10, marginTop:-4}} onPress={()=>PersonalRecieve('personal2')}>
                        <Box borderBottomWidth={1} borderBottomColor='#696969'>
                            <DefText text='자세히' style={{fontSize:13,color:'#696969'}} />
                        </Box>
                    </TouchableOpacity>
                </HStack>

                <HStack alignItems={'center'} mt={2.5}>
                    <TouchableOpacity onPress={()=>setHealthAgree(!healthAgree)}>
                        <HStack>
                            <Box style={[{width:20, height:20, borderRadius:40, borderWidth:1, borderColor:'#f1f1f1', alignItems:'center', justifyContent:'center', marginRight:10}, healthAgree && {borderColor:'#696969'}]}>
                                <CheckIcon width={11} color={ healthAgree ? '#696969' : '#f1f1f1'} />
                            </Box>
                            <DefText text='건강상담 이용규정' style={{color:'#696969'}}  />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft:10, marginTop:-4}} onPress={()=>PersonalRecieve('bio')}>
                        <Box borderBottomWidth={1} borderBottomColor='#696969'>
                            <DefText text='자세히' style={{fontSize:13,color:'#696969'}} />
                        </Box>
                    </TouchableOpacity>
                </HStack>
                <DefText text='자문 비밀번호' style={{fontSize:18, color:'#000', fontWeight:'bold', fontFamily:Font.NotoSansBold, lineHeight:22, marginTop:15}} />
                    
                    <Input 
                        value={counselPwd}
                        onChangeText={counselChange}
                        _focus='transparent'
                        height='45px'
                        placeholder='자문 비밀번호 입력'
                        placeholderTextColor={'#a3a3a3'}
                        secureTextEntry={true}
                        onSubmitEditing={qaNavigationGo}
                        keyboardType={'number-pad'}
                        borderWidth={1}
                        borderColor='#f1f1f1'
                        borderRadius={10}
                        style={[{marginTop:10, fontWeight:'bold', fontFamily:Font.NotoSansBold}, counselPwd.length > 0 && {backgroundColor:'#F1F1F1'}]}
                    />
                    <HStack justifyContent='space-between' mt={'15px'}>
                        <TouchableOpacity onPress={()=>qaNavigationGo()} style={{width:(width-40)*0.47, height:45, borderRadius:10, alignItems:'center', justifyContent:'center', backgroundColor:'#696969'}}>
                            <DefText text='동의' style={[styles.counselButtonText, {color:'#fff'}]} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={{width:(width-40)*0.47, height:45,  borderRadius:10, alignItems:'center', justifyContent:'center', backgroundColor:'#696969'}} onPress={()=>setCounselModalPwd(false)} >
                            <DefText text='취소' style={[styles.counselButtonText, , {color:'#fff'}]} />
                        </TouchableOpacity>
                
                    </HStack>
                </Box>
                
            </Modal>
            <Modal isOpen={privacyAgreeModal} onClose={()=>setPrivacyAgreeModal(false)}>
                <Modal.Content maxWidth={width-40} backgroundColor='#fff'>
                    <Modal.Body>
                        <DefText text={personalData.title} style={{fontWeight:'bold', fontFamily:Font.NotoSansBold}} />
                        <Box mt={5}>
                            {
                                personalData != '' &&
                                <HTML 
                                    ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'br']}
                                    ignoredTags={['head', 'script', 'src']}
                                    imagesMaxWidth={Dimensions.get('window').width - 90}
                                    source={{html: personalData.content}} 
                                    tagsStyles={StyleHtml}
                                    containerStyle={{ flex: 1, }}
                                    contentWidth={Dimensions.get('window').width}  
                                />
                            }
                            
                        </Box>
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity onPress={()=>setPrivacyAgreeModal(false)} style={{width:width-90, height:45, backgroundColor:'#696969', justifyContent:'center', alignItems:'center', borderRadius:10}}>
                                <DefText text='확인' style={{color:'#fff'}} />
                            </TouchableOpacity>
                            
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            {/* <Modal isOpen={healthAgreeModal} onClose={()=>setHealthAgreeModal(false)}>
                <Modal.Content maxWidth={width-40} backgroundColor='#fff'>
                    <Modal.Body>
                        <DefText text='건강상담 이용 안내' style={{fontWeight:'bold', fontFamily:Font.NotoSansBold}} />
                        <Box mt={5}>
                            {
                                bioData != '' && 
                                <HTML 
                                    ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'br']}
                                    ignoredTags={['head', 'script', 'src']}
                                    imagesMaxWidth={Dimensions.get('window').width - 90}
                                    source={{html: bioData.content}} 
                                    tagsStyles={StyleHtml}
                                    containerStyle={{ flex: 1, }}
                                    contentWidth={Dimensions.get('window').width}  
                                />
                            }

                        </Box>
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity onPress={()=>setHealthAgreeModal(false)} style={{width:width-90, height:45, backgroundColor:'#696969', justifyContent:'center', alignItems:'center', borderRadius:10}}>
                                <DefText text='확인' style={{color:'#fff'}} />
                            </TouchableOpacity>
                            
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal> */}
            <Modal isOpen={checkListSaveModal} backgroundColor='rgba(255,255,255,0.7)' onClose={()=>setCheckListSaveModal(false)}>
                <Modal.Content maxWidth={width-40} backgroundColor='#fff'>
                    <Modal.Body>
                        <DefText text='임시저장된 체크리스트가 존재합니다.' />
                        <DefText text='불러올까요?' />
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity onPress={saveCheckListReceive} style={{width:(width-80) * 0.47, height:35, backgroundColor:'#f1f1f1', justifyContent:'center', alignItems:'center', borderRadius:5}}>
                                <DefText text='예' />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={CheckListSaveEmpty} style={{width:(width-80) * 0.47, height:35, backgroundColor:'#f1f1f1', justifyContent:'center', alignItems:'center', borderRadius:5}}>
                                <DefText text='아니오' />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            {
                hospitalChange &&
                <Box backgroundColor='rgba(255,255,255,0.78)' height={heightHome} width={width} position='absolute' top='50px' zIndex='99'>
                    {
                        userInfo != undefined && 
                        <>
                            <HStack px={5} height='100px' backgroundColor='#fff' alignItems='center'>
                                {
                                    userInfo.membership.map((item, index)=> {
                                        return(
                                            <TouchableOpacity onPress={()=>hospitalChangeBtn(item.hcode)}  key={index} style={[ {justifyContent:'center', alignItems:'center'}, index != 0 && {marginLeft:20} ]}>
                                                <Image 
                                                    source={{uri:item.logo}} 
                                                    //source={{uri:memberInfosHeader.photo}} 
                                                    alt='hospital logo'
                                                    style={{marginRight:10, width:40, height:40, resizeMode:'cover', borderRadius:20, overflow:'hidden'}}
                                                />
                                                <DefText text={ textLengthOverCut(item.hname, 5) } style={{marginTop:10}} />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </HStack>
                            <TouchableWithoutFeedback onPress={()=>setHospitalChange(false)}>
                                <Box height={height - 175} />
                            </TouchableWithoutFeedback>
                        </>
                    }
                </Box>
            }
        </Box>
    );
};

const styles = StyleSheet.create({

    mainIconButton:{
        
        alignItems:'center', 
        justifyContent:'center', 
        
    },
    mainIconTitle:{
        fontSize: width > 360 ? 14 : 12,
        lineHeight:17,
        color:'#FFFFFF', 
        marginTop:10
    },

    counselButton: {
        paddingHorizontal:10,
        borderRadius:10,
        marginTop:15,
        width:'auto',
        height:45,
        justifyContent:'center',
        backgroundColor:'#f1f1f1',
        width:'auto'
    },
    counselButtonText: {
        color:'#000',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
        
    },
    buttonShadow: {
        marginLeft:-7,
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_hospital : User.user_hospital // 병원회원권정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_hospital: (user) => dispatch(UserAction.member_hospital(user)), //회원 정보 조회
    })
  )(Home);