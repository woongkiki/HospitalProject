import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { ScrapFolderData } from '../Utils/DummyData';

const {width} = Dimensions.get('window');

const AcountInfo = ( props ) => {

    const {navigation} = props;

    const [logOutModal, setLogOutModal] = useState(false);

    const LogoutHandler = () => {
        Alert.alert('로그아웃합니다.');
    }

    const [memberLeave, setMemberLeave] = useState(false);

    const memberLeaveHandler = () => {
        Alert.alert('회원탈퇴처리..');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='계정설정' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <TouchableOpacity style={[styles.mypageButton, {marginTop:0}]} onPress={()=>navigation.navigate('AcountInfoChange')}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='회원정보 변경' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>navigation.navigate('PasswordChange')}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='비밀번호 변경' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>setLogOutModal(true)}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='로그아웃' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mypageButton]} onPress={()=>setMemberLeave(true)}>
                        <HStack alignItems='center' height='43px' justifyContent='space-between'>
                            <DefText text='탈퇴하기' style={styles.mypageButtonText} />
                            <Image source={require('../images/buttonArrRight.png')} alt='바로가기' />
                        </HStack>
                    </TouchableOpacity>
                </Box>
            </ScrollView>
            <Modal isOpen={logOutModal} onClose={() => setLogOutModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='로그아웃 하시겠습니까?' style={{textAlign:'center'}}/>
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity style={styles.logoutButton} onPress={LogoutHandler}>
                                <DefText text='확인' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={()=>setLogOutModal(false)}>
                                <DefText text='취소' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={memberLeave} onClose={() => setMemberLeave(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='정말 회원을 탈퇴하시겠습니까?' style={{textAlign:'center'}}/>
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity style={styles.logoutButton} onPress={memberLeaveHandler}>
                                <DefText text='확인' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={()=>setMemberLeave(false)}>
                                <DefText text='취소' style={styles.logoutButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    mypageButton: {
        height:43,
        backgroundColor:'#F1F1F1',
        borderRadius:43,
        paddingLeft:20,
        paddingRight:10,
        marginTop:10
    },
    mypageButtonText: {
        fontSize:16,
        color:'#000'
    },
    logoutButton : {
        height:45,
        width:(width-80) *0.47,
        borderRadius:10,
        backgroundColor:'#696968',
        alignItems:'center',
        justifyContent:'center'
    },
    logoutButtonText: {
        fontSize:15,
        color:'#fff'
    }
})

export default AcountInfo;