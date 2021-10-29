import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, Linking, SafeAreaView } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderHospital from '../components/HeaderHospital';
import { hospitalInfoCategory, hospitalDoctorList } from '../Utils/DummyData';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const hospitalButtonWidth = (width - 40) * 0.19;
const hospitalButtonHeight= (width - 40) * 0.22;

let addr = "경기도 부천시 길주로 272";
let hospitalName = "더 힐링 병원";

const HospitalInfo = ( props ) => {

    const {navigation} = props;

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
    const HospitalCategory = hospitalInfoCategory.map((category, index)=>{
        return(
            <Box 
                key={category.idx}
                style={
                    [
                        styles.hospitalInfoCategory,
                        index != 0 && {marginLeft:5 }
                    ]
                }
            >
                <DefText 
                    text={category.category}
                    style={styles.hospitalInfoCategoryText}
                />
            </Box>
        )
    });

    //의료진 정보
    const HospitalDoctor = hospitalDoctorList.map((item, index)=>{
        return(
            <Box
                key={item.idx}
                style={
                    index != 0 && {marginTop:10}
                }
            >
                <HStack alignItems='center' flexWrap='wrap'>
                    <Image 
                        source={{uri:item.imgUrl}}
                        alt={item.title}
                        width={hospitalButtonWidth}
                        height={hospitalButtonWidth}
                        resizeMode='contain'
                    />
                    <Box ml={5}>
                        <HStack alignItems='center'>
                            <Text style={[styles.DoctorName, {marginRight:10}]}>{item.title}</Text>
                            <Text style={styles.DoctorSubject}>진료과목 : {item.subject}</Text>
                        </HStack>
                        <Text style={styles.DoctorContent}>
                            {item.content}
                        </Text>
                    </Box>
                </HStack>
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderHospital navigation={navigation} headerTitle='병원소개' />
            <ScrollView>
                <VStack pb={5}>
                    <Box>
                        <Image source={require('../images/hospital_info_img.png')} alt='병원정보이미지' />
                    </Box>
                    <HStack px={5} py={5} justifyContent='space-between'>
                        <TouchableOpacity
                            style={[{
                                    backgroundColor:'#D2D2D2',
                                    width:hospitalButtonWidth,
                                    height:hospitalButtonHeight,
                                    borderRadius:10,
                                    justifyContent:'center',
                                    alignItems:'center'
                                },
                                hospitalTab === 1 && {backgroundColor:'#696968'}
                            ]}
                            onPress={()=>_hospitalTabButton(1)}
                        >
                            <Box alignItems='center'>
                                <Image
                                    source={require('../images/hospitalIcon.png')}
                                    alt='병원정보'
                                    style={{width:24}}
                                    resizeMode='contain'
                                />
                                <DefText text='병원정보' style={{ fontSize:13, color:'#fff'}} />
                            </Box>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[{
                                    backgroundColor:'#D2D2D2',
                                    width:hospitalButtonWidth,
                                    height:hospitalButtonHeight,
                                    borderRadius:10,
                                    justifyContent:'center'
                                },
                                hospitalTab === 2 && {backgroundColor:'#696968'}
                            ]}
                            onPress={()=>_hospitalTabButton(2)}
                        >
                            <Box alignItems='center'>
                                <Image
                                    source={require('../images/positionIcon.png')}
                                    alt='위치정보'
                                    style={{width:24}}
                                    resizeMode='contain'
                                />
                                <DefText text='위치정보' style={{fontSize:13, color:'#fff'}} />
                            </Box>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[{
                                    backgroundColor:'#D2D2D2',
                                    width:hospitalButtonWidth,
                                    height:hospitalButtonHeight,
                                    borderRadius:10,
                                    justifyContent:'center'
                                },
                                hospitalTab === 3 && {backgroundColor:'#696968'}
                            ]}
                            onPress={()=>_hospitalTabButton(3)}
                        >
                            <Box alignItems='center'>
                                <Image
                                    source={require('../images/reservationIcons.png')}
                                    alt='병원예약'
                                    style={{width:24}}
                                    resizeMode='contain'
                                />
                                <DefText text='병원예약' style={{fontSize:13, color:'#fff'}} />
                            </Box>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[{
                                    backgroundColor:'#D2D2D2',
                                    width:hospitalButtonWidth,
                                    height:hospitalButtonHeight,
                                    borderRadius:10,
                                    justifyContent:'center'
                                },
                                hospitalTab === 4 && {backgroundColor:'#696968'}
                            ]}
                            onPress={()=> Linking.openURL(`tel:010-1234-5678`)}
                        >
                            <Box alignItems='center'>
                                <Image
                                    source={require('../images/TelephoneIconNew.png')}
                                    alt='전화걸기'
                                    style={{width:24}}
                                    resizeMode='contain'
                                />
                                <DefText text='전화걸기' style={{fontSize:13, color:'#fff'}} />
                            </Box>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
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
                        </TouchableOpacity>
                    </HStack>

                    <Box px={5}>
                        {
                            hospitalTab === 1 &&
                            <Box>
                                <Box mb={5}>
                                    <DefText text='진료과목' style={styles.hospitalInfoTitle} />
                                    <HStack>
                                        {HospitalCategory}
                                    </HStack>
                                </Box>
                                <Box mb={5}>
                                    <DefText text='진료시간' style={styles.hospitalInfoTitle} />
                                    <Text style={[styles.hospitalGreeting]}>
                                    평일 : 09:00~18:00{'\n'}
                                    수요일 : 09:00~20:00 (야간연장){'\n'}
                                    토요일 : 09:00~13:00{'\n'}
                                    일요일/공휴일 : 09:00~13:00
                                    </Text>
                                </Box>
                                <Box mb={5}>
                                    <DefText text='인사말' style={styles.hospitalInfoTitle} />
                                    <Text style={[styles.hospitalGreeting]}>
                                    질병중심이 아닌 건강중심, 의사중심이 아닌 환자중심,{'\n'}
                                    증상 만이 아닌 근본적 원인, 조기진단 보다는 예방,{'\n'}
                                    획일화된 치료보다는 개인 맞춤치료,{'\n'}
                                    전문화된 치료보다는 전인적인 진료를 추구합니다.
                                    </Text>
                                </Box>
                                <Box>
                                    <DefText text='의료진 소개' style={styles.hospitalInfoTitle} />
                                    {
                                        hospitalDoctorList.length > 0 ?
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
                            <>
                                <DefText text='주소 정보' style={styles.hospitalInfoTitle} />
                                <DefText text='경기도 부천시 길주로 272' style={styles.hospitalGreeting} />
                                <Box height={300} mt={2.5}>
                                    <WebView
                                        source={{
                                            uri:'https://cnj06.cafe24.com/hospitalMap.php?address='+addr+'&hospitalName='+hospitalName
                                        }}
                                    />

                                    <TouchableOpacity activeOpacity={1} style={{position:'absolute',width:width-40, height:300, backgroundColor:'transparent'}} onPress={()=>{setMapPopVisible(true)}}>

                                    </TouchableOpacity>
                                </Box>
                            </>
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
            <Modal isOpen={mapPopVisible} style={{flex:1, backgroundColor:'#fff'}} onClose={() => setMapPopVisible(false)}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                <Box >
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setMapPopVisible(false)}}>
                            <Image source={require('../images/map_close.png')} alt='닫기' />
                        </TouchableOpacity>
                        <DefText text={hospitalName} style={{fontSize:15}} />
                        <DefText text='' style={{width:40}} />
                    </HStack>
                    <Box height={height-50}>
                        <WebView
                            source={{
                                uri:'https://cnj06.cafe24.com/hospitalMap.php?address='+addr+"&hospitalName="+hospitalName
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
        fontSize:14,
        color:'#696968',
        marginBottom:10
    },
    hospitalInfoCategory:{
        backgroundColor:'#696968',
        height:26,
        borderRadius:5,
        justifyContent:'center',
        paddingHorizontal:10
    },
    hospitalInfoCategoryText:{
        fontSize:12,
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

export default HospitalInfo;