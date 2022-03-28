import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import Api from '../Api';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Font from '../common/Font';

const {width} = Dimensions.get('window');


const HeaderDefault = ( props ) => {

    const {navigation, headerTitle, userInfo} = props;

    const [pushStatus, setPushStatus] = useState(false);

    const PushChecks = async () => {

       

        await Api.send('push_check', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('병원 정보: ', arrItems.name);
                console.log('push check::::',arrItems, resultItem);
                
                setPushStatus(arrItems.push_check);
            }else{
                console.log('결과 출력 실패 Hcode!', resultItem,arrItems);
               //ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        PushChecks();
    }, []);

    useEffect(()=>{
        const unsubscribe = () => {
            navigation.addListener('focus', async () => {
                //member_info_handle()
                PushChecks();
            });
        };
        unsubscribe();
    },[]);

    return (
        <Box height='50px' px={5} shadow={5} backgroundColor='#fff' >
            <HStack justifyContent='space-between' alignItems='center' height='50px'>

                <Box width={width - 40 + 'px'}  alignItems='center' position='absolute' left={0}>
                <DefText text={headerTitle} style={{fontSize:20, lineHeight:50, fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                </Box>
                <TouchableOpacity onPress={()=>{navigation.navigate('AlarmList')}}>
                    <Image
                        source={require('../images/noticeIconNew.png')}
                        alt='알림'
                        style={{width:27, height:30, resizeMode:'contain'}}
                    />
                    {
                        pushStatus &&
                        <Box style={{width:12, height:12,backgroundColor:'#FFC400', borderRadius:12, position:'absolute', bottom:3, right:-3}} >
                        </Box>
                    }
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
  )(HeaderDefault);