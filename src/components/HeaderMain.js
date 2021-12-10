import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import Api from '../Api';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { textLengthOverCut } from '../common/dataFunction';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const  heightHome = height - 55;
//console.log(height, heightHome);

const HeaderMain = ( props ) => {

    const { navigation, userInfo, member_info, hospitalChangeBtn, hospitalCode } = props;

    //console.log('헤더,,,', userInfo.membership[0]);

    //console.log(userInfo.m_hcode);
    //console.log(userInfo.membership);
    //console.log('카카카카',hospitalCode);

    const [hospitalCodeSet, setHospitalCodeSet] = useState('0001')

    const [hospitalName, setHospitalName] = useState('');
    const [hospitalLogo, setHospitalLogo] = useState('');

    const HeadName = async () => {

        await member_info_handle();

        await Api.send('hospital_info', {'id':userInfo.id, 'token':userInfo.appToken, 'hcode':hospitalCodeSet}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('병원 정보: ', arrItems.name);

                setHospitalName(arrItems.name)
                setHospitalLogo(arrItems.logo)

            }else{
                console.log('결과 출력 실패123123!', resultItem);
               //ToastMessage(resultItem.message);
            }
        });
    }


    const member_info_handle = async () => {
        

        const formData = new FormData();
        formData.append('method', 'member_info');
        formData.append('id', userInfo.email);
        formData.append('token', userInfo.appToken);
        const member_info_list = await member_info(formData);

        console.log('회원정보를 조회1', member_info_list.result.m_hcode);
        if(member_info_list.state){
            setHospitalCodeSet(member_info_list.result.m_hcode);
        }

    };


    useEffect(()=>{
        console.log('변했어', hospitalCodeSet);
        HeadName();
    }, [hospitalCodeSet])

  // console.log(hospitalChangeBtn);

    //console.log('user::', users);
    //test4321@test.com

    return (
        <Box py={2.5} px={5} shadow={5} backgroundColor='#fff'>
            <HStack justifyContent='space-between' alignItems='center' height='55px'>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={hospitalChangeBtn}
                >
                    <HStack alignItems='center'>
                        {
                            userInfo != undefined &&
                            hospitalLogo != '' ?
                            <Image 
                                //source={require('../images/hospitalLogo.png')} 
                                source={{uri:hospitalLogo}} 
                                alt='hospital logo'
                                style={{marginRight:10, width:40, height:40, resizeMode:'cover', borderRadius:20, overflow:'hidden'}}
                            />
                            :
                            <Image 
                                source={require('../images/hospitalLogo.png')} 
                                //source={{uri:memberInfosHeader.photo}} 
                                alt='hospital logo'
                                style={{marginRight:10, width:40, height:40, resizeMode:'cover', borderRadius:20, overflow:'hidden'}}
                            />
                        }
                        
                        {
                            userInfo != undefined &&
                            hospitalName != '' ?
                        
                            <DefText text={hospitalName} style={{marginRight:10}} />
                            :
                            <DefText text='정보없음' style={{marginRight:10}} />
                         
                        }
                      
                           {
                               userInfo != undefined &&
                               userInfo.membership.length > 1 && 
                             
                                <Image 
                                    source={require('../images/mainHeadArr.png')}
                                    alt='아래로 내리기'         
                                />
                             
                           }
                      
                        {/* <Image 
                            source={require('../images/mainHeadArr.png')}
                            alt='아래로 내리기'
                            
                        /> */}
                        
                    </HStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.navigate('AlarmList')}}>
                    <Image
                        source={require('../images/appStatusIcon.png')}
                        alt='알림'
                    />
                </TouchableOpacity>
            </HStack>
           
            
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
  )(HeaderMain);