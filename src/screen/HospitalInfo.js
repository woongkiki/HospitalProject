import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, Linking, SafeAreaView, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderHospital from '../components/HeaderHospital';
import { hospitalInfoCategory, hospitalDoctorList } from '../Utils/DummyData';
import { WebView } from 'react-native-webview';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { BASE_URL } from '../Utils/APIConstant';
import { ActivityIndicator } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import Font from '../common/Font';

const { width, height } = Dimensions.get('window');

const hospitalButtonWidth = (width - 40) * 0.19;
const hospitalButtonHeight= (width - 40) * 0.22;

const hospitalButtonWidth2 = (width-40) * 0.27;


const HospitalInfo = ( props ) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    //const {users} = params;

    console.log('12321312312',userInfo.m_hcode);

    const [hospitalLoading, setHospitalLoading] = useState(false);
    const [hopistalImage, setHospitalImage] = useState('');

    const [hospitalInfos, setHospitalInfos] = useState('');

    const [hospitalPhoto, setHospitalPhoto] = useState([]);
    const hospitatlInfoSend = async () => {

        await setHospitalLoading(false);

        await Api.send('hospital_info', {'id':userInfo.id, 'hcode':userInfo.m_hcode}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('병원 정보: ', arrItems);

                setHospitalInfos(arrItems);
                setHospitalImage(arrItems.upfile)

                setHospitalPhoto(arrItems.photo)
                // ToastMessage(resultItem.message);
                // navigation.goBack();
                //setMemberInfos(arrItems);
    
            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });

        await setHospitalLoading(true);
    }

    
    useEffect(()=>{
       
        hospitatlInfoSend();
        return(
            setHospitalTab(1)

        )
     
    },[])


   

    const [hospitalAllCategory, setHospitalAllCategory] = useState([]);
    const [hosipitalMemberList, setHospitalMemberList] = useState([]);

    useEffect(()=>{
        if(hospitalInfos.category_list){
            setHospitalAllCategory(hospitalInfos.category_list);
        }else{
            setHospitalAllCategory([]);
        }

        if(hospitalInfos.member){
            setHospitalMemberList(hospitalInfos.member);
        }else{
            setHospitalMemberList([]);
        }

    },[hospitalInfos]);



    const [hospitalTab, setHospitalTab] = useState(1);

    const [mapPopVisible, setMapPopVisible] = useState(false);

    const _hospitalTabButton = (button) => {
       if(button==5){
            navigation.navigate('Tab_Navigation', {
                screen: 'ChatingList',
                
            });
       }else{

            setHospitalTab(button);
       }
    }

    
 
    
    //병원정보 카테고리
    const HospitalCategory = hospitalAllCategory.map((category, index)=>{
        return(
            <Box 
                key={index}
                style={
                    [
                        styles.hospitalInfoCategory,
                        index != 0 && {marginLeft:5 }
                    ]
                }
            >
                <DefText 
                    text={category}
                    style={styles.hospitalInfoCategoryText}
                />
            </Box>
        )
    });

    //의료진 정보
    const HospitalDoctor = hosipitalMemberList.map((item, index)=>{
        return(
            <Box
                key={index}
                style={
                    index != 0 && {marginTop:10}
                }
            >
                <HStack alignItems='center' flexWrap='wrap'>
                    <Image 
                        source={{uri:item.upfile}}
                        alt={item.upfile_name}
                        width={hospitalButtonWidth}
                        height={hospitalButtonWidth}
                        style={{borderRadius:10, overflow:'hidden'}}
                        resizeMode='stretch'
                    />
                    <Box ml={5}>
                        <HStack alignItems='center'>
                            <Text style={[styles.DoctorName, {marginRight:10}]}>{item.name}</Text>
                            <Text style={styles.DoctorSubject}>진료과목 : {item.category}</Text>
                        </HStack>
                        <Text style={styles.DoctorContent}>
                            {item.history}
                        </Text>
                    </Box>
                </HStack>
            </Box>
        )
    });


    const phoneCall = (phone) => {
        
        //console.log(phone.length)
        if(hospitalInfos.tel){
            Linking.openURL(`tel:`+phone);
        }else{
            ToastMessage('전화연결을 지원하지 않습니다.');
        }
        //Linking.openURL(`tel:010-1234-5678`)
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderHospital navigation={navigation} headerTitle='병원소개' />
            {
                hospitalLoading ?
                <ScrollView>
                    <VStack pb={5}>
                        {
                            hospitalPhoto != '' &&
                            <Swiper loop={true}
                                height={width/1.78}
                                dot={
                                    <View
                                    style={{
                                        backgroundColor: 'transparent',
                                        width: 5,
                                        height: 5,
                                        borderRadius: 5,
                                        marginLeft: 10,
                                    }}
                                    />
                                }
                                activeDot={
                                <View
                                    style={{
                                    backgroundColor: 'transparent',
                                    width: 5,
                                    height: 5,
                                    borderRadius: 5,
                                    marginLeft: 10,
                                    }}
                                />
                                }
                                paginationStyle={{
                                    bottom: '10%',
                                    
                                }}
                            >
                                {
                                    hospitalPhoto != '' &&
                                 
                                    hospitalPhoto.map((item, index)=> {
                                        return (
                                            <Box key={index}>
                                                <Image source={{uri:item}} style={{width:width, height:width/1.78, resizeMode:'stretch'}} alt={'슬라이드 번호' + (index + 1)} />
                                            </Box>
                                        )
                                    })
                                }
                            </Swiper>
                        }
                        {/* <Box>
                            {
                                hospitalInfos.upfile ?
                                <Image source={{uri:hospitalInfos.upfile}} alt='병원정보이미지' width={width} height='200px' resizeMode='cover' />
                                :
                                <Image source={require('../images/hospital_info_img.png')} alt='병원정보이미지' />
                            }
                            
                        </Box> */}
                        <HStack px={5} py={5} pb={2.5} justifyContent='space-between'>
                            <TouchableOpacity
                                onPress={()=>_hospitalTabButton(1)}
                                style={{marginLeft:-5, marginTop:-5}}
                            >
                                {
                                    hospitalTab === 1 ?
                                    <ImageBackground
                                        source={require('../images/blackShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/infoTabImgW01.png')} style={{width:37, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='병원정보'/>
                                        <DefText text='병원정보' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                    
                                    :
                                    <ImageBackground
                                        source={require('../images/grayShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/infoTabImgB01.png')} style={{width:37, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='병원정보'/>
                                        <DefText text='병원정보' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#696969', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                }
                                
                            </TouchableOpacity>
                            <TouchableOpacity
                               style={{marginLeft:-5, marginTop:-5}}
                                onPress={()=>_hospitalTabButton(2)}
                            >
                                {
                                    hospitalTab === 2 ?
                                    <ImageBackground
                                        source={require('../images/blackShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/infoTabImgW02.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='위치정보'/>
                                        <DefText text='위치정보' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                    
                                    :
                                    <ImageBackground
                                        source={require('../images/grayShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/infoTabImgB02.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='위치정보'/>
                                        <DefText text='위치정보' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#696969', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                }
                            </TouchableOpacity>
  
                            <TouchableOpacity
                                style={{marginLeft:-5, marginTop:-5}}
                                onPress={()=> phoneCall(hospitalInfos.tel)}
                            >
                                <ImageBackground
                                        source={require('../images/grayShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                    
                                    <Image source={require('../images/infoTabImgB03.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='전화걸기'/>
                                    <DefText text='전화걸기' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#696969', marginLeft:-5, marginTop:5}} />
                                </ImageBackground>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={{marginLeft:-5, marginTop:-5}}
                                onPress={()=>{ setHospitalTab(1); navigation.navigate('ReservationAdd')}}
                            >
                                <ImageBackground
                                        source={require('../images/grayShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                    
                                    <Image source={require('../images/infoTabImgB04.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='병원예약'/>
                                    <DefText text='병원예약' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#696969', marginLeft:-5, marginTop:5}} />
                                </ImageBackground>
                            </TouchableOpacity>

                            
                            
                            {/* <TouchableOpacity
                                style={[{
                                        backgroundColor:'#D2D2D2',
                                        width:hospitalButtonWidth,
                                        height:hospitalButtonHeight,
                                        borderRadius:10,
                                        justifyContent:'center'
                                    },
                                    hospitalTab === 5 && {backgroundColor:'#696968'}
                                ]}
                                onPress={()=>_hospitalTabButton(5)}
                            >
                                <Box alignItems='center'>
                                    <Image
                                        source={require('../images/requestIcon.png')}
                                        alt='자문요청'
                                        style={{width:24}}
                                        resizeMode='contain'
                                    />
                                    <DefText text='자문요청' style={{fontSize:13, color:'#fff'}} />
                                </Box>
                            </TouchableOpacity> */}
                        </HStack>

                        <Box px={5} pt={0}>
                            {
                                hospitalTab === 1 &&
                                <Box>
                                    <Box mb={5}>
                                        <DefText text='진료과목' style={styles.hospitalInfoTitle} />
                                        <HStack flexWrap={'wrap'}>
                                            {
                                                hospitalAllCategory.length > 0 ?
                                                HospitalCategory
                                                :
                                                <DefText text='등록된 진료과목이 없습니다.' />
                                            }
                                        </HStack>
                                    </Box>
                                    <Box mb={5}>
                                        <DefText text='진료시간' style={styles.hospitalInfoTitle} />
                                        <Text style={[styles.hospitalGreeting]}>
                                            {
                                                hospitalInfos.htime ?
                                                hospitalInfos.htime
                                                :
                                                '등록된 진료시간기록이 없습니다.'
                                            }
                                        </Text>
                                    </Box>
                                    <Box mb={5}>
                                        <DefText text='인사말' style={styles.hospitalInfoTitle} />
                                        <Text style={[styles.hospitalGreeting]}>
                                            {
                                                hospitalInfos.intro ?
                                                hospitalInfos.intro
                                                :
                                                '등록된 인사말이 없습니다.'
                                            }
                                        </Text>
                                    </Box>
                                    <Box>
                                        <DefText text='의료진 소개' style={styles.hospitalInfoTitle} />
                                        {
                                            hosipitalMemberList.length > 0 ?
                                            HospitalDoctor
                                            :
                                            <Box>
                                                <DefText text='등록된 의료진이 없습니다.' />
                                            </Box>
                                        }
                                    </Box>
                                </Box>
                            }
                            {
                                hospitalTab === 2 &&
                                <Box>
                                    <Box>
                                        <DefText text='주소 정보' style={styles.hospitalInfoTitle} />
                                        {
                                            hospitalInfos.address1 ?
                                            <>
                                                <DefText text={hospitalInfos.address1 + ' ' + hospitalInfos.address2} style={styles.hospitalGreeting} />
                                                <Box height={300} mt={2.5}>
                                                    {
                                                        hospitalInfos &&
                                                        <WebView
                                                            source={{
                                                                uri:BASE_URL+'/hospitalMap.php?address='+hospitalInfos.address1+'&hospitalName='+hospitalInfos.name
                                                            }}
                                                            style={{
                                                                opacity:0.99,
                                                                minHeight:1,
                                                            }}
                                                        />
                                                    }


                                                    <TouchableOpacity activeOpacity={1} style={{position:'absolute',width:width-40, height:300, backgroundColor:'transparent'}} onPress={()=>{setMapPopVisible(true)}}>

                                                    </TouchableOpacity>
                                                </Box>
                                            </>
                                            :
                                            <Box height='300px' justifyContent='center' alignItems='center'>
                                                <DefText text='등록된 병원주소정보가 없습니다.' style={styles.hospitalGreeting} />
                                            </Box>
                                        }
                                        
                                    </Box>
                                    {
                                        hospitalInfos.parking &&
                                        <Box mt={5}>
                                            <DefText text='주차정보' style={styles.hospitalInfoTitle} />
                                            <DefText text={hospitalInfos.parking} style={styles.hospitalGreeting} />
                                        </Box>
                                    }
                                    
                                </Box>
                            }
                            {
                                hospitalTab === 3 &&
                                <Box height={300} justifyContent='center' alignItems='center'>
                                    <DefText text='예약시스템 연결' />
                                </Box>
                            }
                            {
                                hospitalTab === 4 &&
                                <Box>
                                    <DefText text='전화걸기' />
                                </Box>
                            }
                        
                        </Box>
                    </VStack>
                </ScrollView>
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
            
            <Modal isOpen={mapPopVisible} style={{flex:1, backgroundColor:'#fff'}} onClose={() => setMapPopVisible(false)}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                <Box >
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setMapPopVisible(false)}}>
                            <Image source={require('../images/map_close.png')} alt='닫기' />
                        </TouchableOpacity>
                        <DefText text={hospitalInfos.name} style={{fontSize:15}} />
                        <DefText text='' style={{width:40}} />
                    </HStack>
                    <Box height={height-50}>
                        <WebView
                            source={{
                                uri:BASE_URL+'/hospitalMap.php?address='+hospitalInfos.address1+"&hospitalName="+hospitalInfos.name
                            }}
                        />
                    </Box>
                </Box>
                </SafeAreaView>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    hospitalInfoTitle:{
        fontSize:16,
        color:'#696969',
        marginBottom:10,
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
    },
    hospitalInfoCategory:{
        backgroundColor:'#696969',
        height:30,
        borderRadius:10,
        justifyContent:'center',
        paddingHorizontal:10
    },
    hospitalInfoCategoryText:{
        fontSize:14,
        color:'#fff'
    },
    hospitalInfoTimeText:{
        fontSize:13,
        lineHeight:20
    },
    hospitalGreeting:{
        fontSize:13,
        color:'#090909',
        lineHeight:20
    },
    DoctorName : {
        fontSize:15,
        color:'#000000',
        fontWeight:'bold'
    },
    DoctorSubject : {
        fontSize : 13
    },
    DoctorContent: {
        fontSize:13,
        lineHeight:20,
        marginTop:5
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
  )(HospitalInfo);