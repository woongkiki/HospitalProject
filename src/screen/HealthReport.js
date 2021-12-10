import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Box, Image, HStack, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { NoticeData, medicineDatas, dnaReport } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';


const {width} = Dimensions.get('window');
const hospitalButtonWidth = (width-40) * 0.23;

const HealthReport = ( props ) => {

    const {navigation, userInfo} = props;

    //console.log(userInfo);

    //console.log(props);
    const [reportLoading, setReportLoading] = useState(true);

    const [buttonIdx, setButtonIdx] = useState(1);

    const reportButton = (idx) => {
        setButtonIdx(idx);
    }

    const [disLoading, setDisLoading] = useState(true);
    const [diseaseDatas, setDiseaseDatas] = useState(['노년백내장', '치질 및 치핵', '담석증','1년전에 교통사고로 오른쪽 다리를 다쳤음']);

    const disDataDelete = (name) => {

        console.log(name);


        Api.send('member_disease', {'id':userInfo.id, 'token':userInfo.appToken, 'disease':name}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               //console.log('내 정보123: ', resultItem);
               ToastMessage(resultItem.message);
               //navigation.navigation('HealthReport');

               HealthReportDatas()

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });

    }



    const [myInfo, setMyInfo] = useState('');
    const [names, setNames] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [profile, setProfile] = useState('');
    const [profileAbdFat, setProfileAbdFat] = useState('');
    const [diseaseInfo, setDiseaseInfo] = useState('');
    const [drugInfo, setDrugInfo] = useState('');
    const [familyInfo, setFamilyInfo] = useState('');

    //건강리포트 받아오기
    const HealthReportDatas = async () => {

        await setReportLoading(true)

        await Api.send('member_profile', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 정보123: ', arrItems);

                setMyInfo(arrItems);
                setNames(arrItems.name);
                setAge(arrItems.age);
                setGender(arrItems.sex);
                setProfile(arrItems.profile);
                setProfileAbdFat(arrItems.profile.abdFat)
                setDiseaseInfo(arrItems.disease);
                setDrugInfo(arrItems.drug);
                setFamilyInfo(arrItems.family);

               // console.log('복약정보', arrItems.drug);

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });

        await setReportLoading(false)
    }

    useEffect(()=>{
        HealthReportDatas();
    }, [])

    const isFocused = useIsFocused();
 
    useEffect(() => {
      
      if (isFocused){
        //console.log('포커스온ㅇㅇㅇㅇㅇ::::::::',props.route.params);
             HealthReportDatas()
      } 
        
    }, [isFocused]);



    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='건강기록부' navigation={navigation} />
            {
                reportLoading ?
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p={5}>
                        <HStack alignItems='center' pb={2.5} borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                            
                            {
                                myInfo != '' &&
                                <>
                                    <Image source={{uri:myInfo.upfile}} alt='건강기록부 이미지' style={{width:90, height:90, marginRight:20, resizeMode:'contain', borderRadius:8}} />
                                    <VStack>
                                        <DefText text={names} style={styles.myInfoName} />
                                        <DefText text={'나이 : 만 '+age+'세'} style={styles.myInfoAge} />
                                        
                                        <DefText text={'성별 : ' + (gender=='M' ? '남자' : '여자')} style={styles.myInfoGender} />
                                    </VStack>
                                </>
                            }
                            
                        </HStack>
                        <Box mt={10}>
                            <DefText text='건강기록부' style={[styles.reportLabel]} />
                            <HStack mt={2.5} justifyContent='space-between'>
                                <TouchableOpacity
                                    onPress={()=>{reportButton(1)}}
                                    style={[{
                                            backgroundColor:'#D2D2D2',
                                            width:hospitalButtonWidth,
                                            height:hospitalButtonWidth,
                                            borderRadius:10,
                                            justifyContent:'center',
                                            alignItems:'center'
                                        },
                                        buttonIdx === 1 && {backgroundColor:'#696968'}
                                    ]}
                                    
                                >
                                    <Box alignItems='center'>
                                        <Image
                                            source={require('../images/healthReportIcon1.png')}
                                            alt='병원정보'
                                            style={{width:40}}
                                            resizeMode='contain'
                                        />
                                        <DefText text='병원정보' style={{ fontSize:13, color:'#fff'}} />
                                    </Box>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>{reportButton(2)}}
                                    style={[{
                                            backgroundColor:'#D2D2D2',
                                            width:hospitalButtonWidth,
                                            height:hospitalButtonWidth,
                                            borderRadius:10,
                                            justifyContent:'center',
                                            alignItems:'center'
                                        },
                                        buttonIdx === 2 && {backgroundColor:'#696968'}
                                    ]}
                                    
                                >
                                    <Box alignItems='center'>
                                        <Image
                                            source={require('../images/healthReportIcon2.png')}
                                            alt='질환기록'
                                            style={{width:40}}
                                            resizeMode='contain'
                                        />
                                        <DefText text='질환기록' style={{ fontSize:13, color:'#fff'}} />
                                    </Box>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>{reportButton(3)}}
                                    style={[{
                                            backgroundColor:'#D2D2D2',
                                            width:hospitalButtonWidth,
                                            height:hospitalButtonWidth,
                                            borderRadius:10,
                                            justifyContent:'center',
                                            alignItems:'center'
                                        },
                                        buttonIdx === 3 && {backgroundColor:'#696968'}
                                    ]}
                                    
                                >
                                    <Box alignItems='center'>
                                        <Image
                                            source={require('../images/healthReportIcon3.png')}
                                            alt='복약기록'
                                            style={{width:40}}
                                            resizeMode='contain'
                                        />
                                        <DefText text='복약기록' style={{ fontSize:13, color:'#fff'}} />
                                    </Box>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>{reportButton(4)}}
                                    style={[{
                                            backgroundColor:'#D2D2D2',
                                            width:hospitalButtonWidth,
                                            height:hospitalButtonWidth,
                                            borderRadius:10,
                                            justifyContent:'center',
                                            alignItems:'center'
                                        },
                                        buttonIdx === 4 && {backgroundColor:'#696968'}
                                    ]}
                                    
                                >
                                    <Box alignItems='center'>
                                        <Image
                                            source={require('../images/healthReportIcon4.png')}
                                            alt='유전기록'
                                            style={{width:40}}
                                            resizeMode='contain'
                                        />
                                        <DefText text='유전기록' style={{ fontSize:13, color:'#fff'}} />
                                    </Box>
                                </TouchableOpacity>
                            </HStack>
                            {
                                buttonIdx === 1 &&
                                <>
                                    <Box p={5} backgroundColor='#F1F1F1' borderRadius={10} mt={5}>
                                        <DefText text='김건강님의 건강프로필입니다.' />
                                    </Box>
                                    <Box mt={5}>
                                        <HStack>
                                            <DefText text='건강리포트' style={styles.reportDataText} />
                                            <TouchableOpacity onPress={()=>navigation.navigate('Inbody')}>
                                                <Box borderBottomWidth={1} borderBottomColor='#666' ml={1}>
                                                    <DefText text='체성분데이터' style={[styles.reportDataText, {fontWeight:'bold'}]} />
                                                </Box>
                                            </TouchableOpacity>
                                            <DefText text='와 연동됩니다.' style={[styles.reportDataText]} />
                                        </HStack>
                            
                                    </Box>
                                    <Box>
                                        <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={5}>
                                            <HStack width={(width-60)*0.25} >
                                                <DefText text='신장' style={[styles.reportDataText]} />
                                                <DefText text='(cm)' style={[styles.reportDataText]} />
                                            </HStack>
                                            {
                                                myInfo != '' &&
                                                <Box width={(width-60)*0.7} alignItems='center' >
                                                    <DefText text={profile.height} style={[styles.reportDataText]} />
                                                </Box>
                                            }
                                        </HStack>
                                        <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={2.5}>
                                            <HStack width={(width-60)*0.25} >
                                                <DefText text='체중' style={[styles.reportDataText]} />
                                                <DefText text='(kg)' style={[styles.reportDataText]} />
                                            </HStack>
                                            {
                                                myInfo != '' &&
                                                <Box width={(width-60)*0.7} alignItems='center' >
                                                    <DefText text={profile.weight} style={[styles.reportDataText]} />
                                                </Box>
                                            }
                                        </HStack>
                                        <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={2.5}>
                                            <HStack width={(width-60)*0.25} >
                                                <DefText text='체지방량' style={[styles.reportDataText]} />
                                                <DefText text='(kg)' style={[styles.reportDataText]} />
                                            </HStack>
                                            {
                                                myInfo != '' &&
                                                <Box width={(width-60)*0.7} alignItems='center' >
                                                    <DefText text={profile.fat} style={[styles.reportDataText]} />
                                                </Box>
                                            }
                                            
                                        </HStack>
                                        <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={2.5}>
                                            <HStack width={(width-60)*0.25} >
                                                <DefText text='골격근량' style={[styles.reportDataText]} />
                                                <DefText text='(kg)' style={[styles.reportDataText]} />
                                            </HStack>
                                            {
                                                myInfo != '' &&
                                                <Box width={(width-60)*0.7} alignItems='center' >
                                                    <DefText text={profile.muscle} style={[styles.reportDataText]} />
                                                </Box>
                                            }
                                        
                                        </HStack>
                                        <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={2.5}>
                                            <HStack width={(width-60)*0.25} >
                                                <DefText text='복부지방수치' style={[styles.reportDataText]} />
                                                <DefText text='(%)' style={[styles.reportDataText]} />
                                            </HStack>
                                            {
                                                myInfo != '' &&
                                                profileAbdFat != null &&
                                                <Box width={(width-60)*0.7} alignItems='center' >
                                                    <DefText text={profileAbdFat[0]} style={[styles.reportDataText]} />
                                                </Box>
                                            }
                                            
                                        </HStack>
                                    </Box>
                                </>
                            }
                            {
                                buttonIdx === 2 && 
                                <>
                                    <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10} mt={5}>
                                        <DefText text='과거 앓았던 질환에 대한 기록을 남겨주세요.' style={{fontWeight:'bold'}} />
                                        <DefText text='최신 데이터는 추가를 통해 업데이트 가능합니다.' style={{fontSize:13, color:'#666', marginTop:5}} />
                                    </Box>
                                    <Box mt={5}>
                                        <DefText text='질환기록' style={[styles.reportLabel]} />
                                        {
                                            myInfo != '' &&
                                            diseaseInfo != '' ?
                                            <HStack flexWrap='wrap'>
                                            {
                                                diseaseInfo.map((item, index)=> {
                                                    return (
                                                        <Box key={index} px={2.5} py={2.5} backgroundColor='#f1f1f1' mt={2.5} borderRadius={15} mr={2.5}>
                                                            <HStack alignItems='center'>
                                                                <DefText text={item} style={{marginRight:10, fontSize:14, fontWeight:'bold'}} />
                                                                <TouchableOpacity onPress={()=>{disDataDelete(item)}}>
                                                                    <Image source={require('../images/closeDis.png')} alt='삭제' />
                                                                </TouchableOpacity>
                                                            </HStack>
                                                        </Box>
                                                    )
                                                })
                                            }
                                            </HStack>
                                            :
                                            <Box height='140px' alignItems='center' justifyContent='center'>
                                                <DefText text='등록된 질환기록이 없습니다.' style={{color:'#666'}} />
                                            </Box>
                                        }
                                    </Box>
                                    
                                </>
                            }
                        
                        </Box>
                        {
                            buttonIdx === 3 && 
                            <>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10} mt={5}>
                                    <DefText text='드시는 약에 대한 기록입니다.' style={{fontWeight:'bold'}} />
                                    <DefText text='복약관리에서 입력하시면 자동으로 기록됩니다.' style={{fontSize:13, color:'#666', marginTop:5}} />
                                </Box>
                                <Box mt={5}>
                                    <HStack>
                                        <DefText text='복약관리' style={styles.reportDataText} />
                                        <TouchableOpacity onPress={()=>navigation.navigate('Medicine')}>
                                            <Box borderBottomWidth={1} borderBottomColor='#666' ml={1}>
                                                <DefText text='복약기록데이터' style={[styles.reportDataText, {fontWeight:'bold'}]} />
                                            </Box>
                                        </TouchableOpacity>
                                        <DefText text='와 연동됩니다.' style={[styles.reportDataText]} />
                                    </HStack>
                                    {
                                        myInfo != '' &
                                        drugInfo.length > 0 ?
                                        <Box mt={5}>
                                        {

                                            drugInfo.map((item, index)=> {
                                                return (
                                                    <Box key={index} style={[{backgroundColor:'#f1f1f1', marginBottom:20, borderRadius:10}]}>
                                                    
                                                        <HStack alignItems='center' p={5}>
                                                            <Box width='10%' height='100%' mr={5} >
                                                                {
                                                                    item.dtype == 'P' ?
                                                                    <Image
                                                                        source={require('../images/medicineLIstIcon1.png')} 
                                                                        alt='조제약 아이콘'
                                                                        
                                                                    />
                                                                    :
                                                                    <Image
                                                                        source={require('../images/medicineLIstIcon2.png')} 
                                                                        alt='조제약 아이콘'
                                                                        
                                                                    />
                                                                }
                                                                
                                                            </Box>
                                                            <Box width='65%' >
                                                                
                                                                <DefText text={item.dtype == 'P' ? '조제약' : '영양제'} style={{fontSize:13, color:'#000'}} />
                                                                <DefText text='2형 당뇨병' style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                                                                <HStack mt={2.5}>
                                                                    <HStack alignItems='center' mr={2.5}>
                                                                        <DefText text='복약순응도' style={{fontSize:14, color:'#000', marginRight:10}} />
                                                                        <DefText text={item.percent + '%'} style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                                                                    </HStack>
                                                                    <HStack alignItems='center'>
                                                                        <DefText text='복약기간' style={{fontSize:14, color:'#000', marginRight:10}} />
                                                                        <DefText text={item.cdate + '일차'} style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                                                                    </HStack>
                                                                </HStack>
                                                                <Text style={{fontSize:14, marginTop:10}}>
                                                                    {item.subinfo}
                                                                </Text>
                                                            </Box>
                                                        </HStack>
                                    
                                                    </Box>
                                                )
                                            })
                                        }
                                        </Box>
                                        :
                                        <Box height='140px' alignItems='center' justifyContent='center'>
                                            <DefText text='등록된 복약기록이 없습니다.' style={{color:'#666'}} />
                                        </Box>
                                    }                             
                                </Box>
                            </>
                        }
                        {
                            buttonIdx === 4 &&
                            <>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10} mt={5}>
                                    <DefText text='질환중 가족력이 있는 여부를 체크해주세요.' style={{fontWeight:'bold'}} />
                                    <DefText text='건강은 가족력과 밀접한 관련이 있습니다.' style={{fontSize:13, color:'#666', marginTop:5}} />
                                </Box>
                                <Box mt={5} pb={5}>
                                    <DefText text='가족력 질환' style={styles.reportDataText} />
                                    {
                                        myInfo != '' &&
                                        familyInfo.length > 0 ?
                                        <VStack>
                                            {
                                                familyInfo.map((item, index)=> {
                                                    return(
                                                        <Box key={index} mt={2.5}>
                                                            <HStack justifyContent='space-between' alignItems='center' px={2.5} pl={4} style={styles.dnaDisName}>
                                                                <DefText text={item.key} style={styles.dnaTitle} />
                                                                <HStack>
                                                                    <Box style={[styles.dnaSelectButton, {marginRight:5}, item.value.includes('1') && {backgroundColor:'#666'}]}>
                                                                        <DefText text='조부모' style={[styles.dnaSelectButtonText]} />
                                                                    </Box>
                                                                    <Box style={[styles.dnaSelectButton, {marginRight:5}, item.value.includes('2') && {backgroundColor:'#666'}]}>
                                                                        <DefText text='부' style={[styles.dnaSelectButtonText]} />
                                                                    </Box>
                                                                    <Box style={[styles.dnaSelectButton, {marginRight:5}, item.value.includes('3') && {backgroundColor:'#666'}]}>
                                                                        <DefText text='모' style={[styles.dnaSelectButtonText]} />
                                                                    </Box>
                                                                    <Box style={[styles.dnaSelectButton, {marginRight:5}, item.value.includes('4') && {backgroundColor:'#666'}]}>
                                                                        <DefText text='형제자매' style={[styles.dnaSelectButtonText]} />
                                                                    </Box>
                                                                </HStack>
                                                            </HStack>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </VStack>
                                        :
                                        <Box height='140px' alignItems='center' justifyContent='center'>
                                            <DefText text='등록된 유전기록이 없습니다.' style={{color:'#666'}} />
                                        </Box>
                                    }
                                </Box>
                            </>
                        }
                    </Box>
                </ScrollView>
            }
            
            {
                buttonIdx === 2 && 
     
                 <Box p={2.5} px={5}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('MyDiseaseReport')}} style={[styles.buttonDef]}>
                        <DefText text='질환기록 추가' style={styles.buttonDefText} />
                    </TouchableOpacity>
                </Box>
            }
            {
                buttonIdx === 4 && 
                <Box p={2.5} px={5}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('DnaSelect')}} style={[styles.buttonDef]}>
                        <DefText text='유전기록 추가' style={styles.buttonDefText} />
                    </TouchableOpacity>
                </Box>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    myInfoName : {
        fontSize:15,
        color:'#333',
        fontWeight:'bold',
        marginBottom:10
    },
    myInfoAge : {
        fontSize:14,
        color:'#666'
    },
    myInfoGender:{
        fontSize:14,
        color:'#666'
    },
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportDataText: {
        fontSize:15,
        color:'#333'
    },
    dnaDisName:{
        height:40,
        backgroundColor:'#f1f1f1',
        borderRadius:10
    },
    dnaTitle:{
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
    },
    dnaSelectButton:{
        height:30,
        backgroundColor:'#D2D2D2',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        paddingHorizontal:10
    },
    dnaSelectButtonText: {
        fontSize:13,
        color:'#fff',
    },
    buttonDef:{
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#666',
        borderRadius:5
    },
    buttonDefText:{
        fontSize:14,
        color:'#fff'
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
    })
)(HealthReport);