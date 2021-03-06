import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDefault from '../components/HeaderDefault';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Font from '../common/Font';

const Mypage = (props) => {

    const { navigation, userInfo } = props;

    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDefault headerTitle='마이페이지' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <TouchableOpacity style={[styles.mypageButton, {marginTop:0}]} onPress={()=>{navigation.navigate('HealthReport')}}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between' >
                            <DefText text='건강기록부' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('Notice')}}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='공지사항' style={styles.mypageButtonText} />
                            {/* <Image source={require('../images/buttonArrRight.png')} alt='바로가기' /> */}
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('Scrap')}} >
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='스크랩' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('AcountInfo', {'userInfo':userInfo})}} >
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='계정 설정' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>
                    
                    {/* <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('Reservation')}}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='병원 예약 내역' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('OrderList')}}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='주문 내역' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>



                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('Point')}}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='포인트 내역' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('Content')}}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='약관 및 정책 보기' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>{navigation.navigate('ServiceQa')}}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='서비스 문의' style={styles.mypageButtonText} />
                            <Image source={require('../images/mypageArrs.png')} alt='바로가기' style={{width:28, height:28}} />
                        </HStack>
                    </TouchableOpacity>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    mypageButton: {
        height:45,
        backgroundColor:'#F1F1F1',
        borderRadius:10,
        paddingLeft:20,
        paddingRight:10,
        marginTop:10
    },
    mypageButtonText: {        
        color:'#000',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium
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
)(Mypage);