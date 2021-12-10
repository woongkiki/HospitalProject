import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert, SafeAreaView } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack, Select } from 'native-base';
import { DefText, DefInput, Button } from '../common/BOOTSTRAP';
import {email_check, phoneFormat} from '../common/dataFunction';
import HeaderComponents from '../components/HeaderComponents';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Postcode from '@actbase/react-daum-postcode';

const {width} = Dimensions.get('window');
    const halfWidth = (width - 40) * 0.48;
    

const AcountInfoChange = (props) => {

    const {navigation, route, member_update, member_info, userInfo} = props;

 

    console.log(userInfo);

    const [userInfoState, setUserInfoState] = useState('');
    useEffect(()=>{
        if(userInfo){
            setUserInfoState(userInfo);
        }
    },[])



   //console.log('회원정보',userInfoState);

    //이메일
    const [emailInput, setEmailInput] = useState('');
    const emailChange = (email) =>{
        setEmailInput(email);
    }

    //이름
    const [nameInput, setNameInput] = useState('test');
    const nameChange = (name) => {
        setNameInput(name);
    }

    //비밀번호
    const [passwordInput, setPasswordInput] = useState('');
    const passwordChange = (password) => {
        setPasswordInput(password);
    }

    const [rePasswordInput, setRePasswordInput] = useState('');
    const rePasswordChange = (password) => {
        setRePasswordInput(password);
    }

    //휴대폰번호
    const [phoneNumber, setPhoneNumber] = useState('010-1234-5678');
    const phoneNumberChange = (number) => {
        setPhoneNumber(phoneFormat(number));
    }

    //생년월일 입력
    const [birthDay, setBirthDay] = useState('19910101');
    const birthDayChange = (year) => {
        setBirthDay(year);
    }

    //성별
    const [gender, setGender] = useState('남자');

    //프로필 이미지
    const [profileImgs, setProfileImgs] = useState('');
    const [profileImgAll, setProfileImgAll] = useState('');
    const _changeProfileImg = () =>{
        //console.log('이미지 변경');
        ImagePicker.openPicker({
            width: 110,
            height: 110,
            cropping: true,
            cropperCircleOverlay: true
          }).then(image => {
            //console.log(image);

            const my_photo = {
                idx : 1,
                uri : image.path,
                type : image.mime,
                data : image.data,
                name : 'profile_img.jpg'
            }

            setProfileImgs(my_photo.uri);
            setProfileImgAll(my_photo);
          });
    }


    //const [counselNumbers, setCounserNumbers] = useState('');

    //자문번호
    const [counselNumber, setCounselNumber] = useState('');
    const counselNumberChange = (number) => {
        setCounselNumber(number);
    }

    //주소 
    const [baesongInfo, setBaesongInfo] = useState('');
    const baesongChange = (baesong) => {
        setBaesongInfo(baesong);
    }

    //주소정보
    const [addrText, setAddrText] = useState('');
    const addrChange = (addr) => {
        setAddrText(addr);
    }

    //추가주소정보
    const [addrText2, setAddrText2] = useState('');
    const addrTextChange2 = (addr2) => {
        setAddrText2(addr2);
    }


    const [addrModal, setAddrModal] = useState(false);

    const addrSumits = (addrZip, addr1) => {
        setBaesongInfo(addrZip);
        setAddrText(addr1);
        //setAddrText2(addr2);
    }

    


    useEffect(()=>{
        setEmailInput(userInfoState.email);
        setNameInput(userInfoState.name);
        setPhoneNumber(userInfoState.hphone);
        setBirthDay(userInfoState.birthday);
        setProfileImgs(userInfoState.photo);
        setCounselNumber(userInfoState.passwd2);
        setBaesongInfo(userInfoState.post);
        setBaesongInfo(userInfoState.post);
        setAddrText(userInfoState.address1);
        setAddrText2(userInfoState.address2);

        if(userInfoState.sex == 'M'){
            setGender('남자');
        }else{
            setGender('여자');
        }
        
    }, [userInfoState])

    //이미지 확인
   // console.log('profileImgs::::::',profileImgs); 

    
    const _RegisterCompleteButton = async () => {

        
         const formData = new FormData();
         formData.append('method', 'member_update');
         formData.append('id', emailInput)
         formData.append('token', userInfoState.appToken)
         formData.append('nameInput', nameInput);

         if(passwordInput && rePasswordInput){
            formData.append('password', passwordInput);
            formData.append('password2', rePasswordInput);
         }
        
         formData.append('phoneNumber', phoneNumber);
         formData.append('birthDay', birthDay);
         formData.append('gender', gender);
         formData.append('counselNumber', counselNumber);

         formData.append('photo', profileImgAll);

         formData.append('post', baesongInfo);
         formData.append('address1', addrText);
         formData.append('address2', addrText2);

        
        const update = await member_update(formData);
         if (update.result) {
            // ToastMessage(update.msg);

            //console.log(update)
           member_info_handle();
           
            navigation.dispatch(
                 StackActions.replace('AcountInfo', {
                     msg:'회원정보가 수정되었습니다.'
                    }
                )
             );
             ToastMessage(update.msg);
             //console.log(update)
         } else {
             //console.log(update.msg);
             ToastMessage(update.msg);
         }
        // navigation.replace('AcountInfo');
        //ToastMessage('회원정보 수정 완료');
    }


    //회원정보 조회
    const member_info_handle = () => {
        AsyncStorage.getItem('flex_id').then(async (response) => {

            const formData = new FormData();
            formData.append('method', 'member_info');
            formData.append('id', response);
            formData.append('token', userInfoState.appToken);
            const member_info_list = await member_info(formData);

            console.log('회원정보를 조회', member_info_list);
           // console.log(response)

        });
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='회원정보 변경' />
            <ScrollView>
                <Box p={5}>    
                    <VStack>
                        {/* <Box>
                            <HStack>
                                <DefText text='이메일' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <DefInput 
                                placeholderText='이메일을 입력해주세요.'
                                inputValue = {emailInput}
                                onChangeText = {emailChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                            />
                        </Box> */}
                        <Box>
                            <HStack>
                                <DefText text='프로필 이미지' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <Box justifyContent='center' alignItems='center' mt={5}>
                                <TouchableOpacity  onPress={_changeProfileImg}>
                                    <Box alignItems='center'>
                                        {
                                            profileImgs ?
                                            <Image source={{uri:profileImgs}} alt='이미지 선택' style={{width:100, height:100, borderRadius:100}} resizeMode='contain' />
                                            :
                                            <Image source={require('../images/noImage.png')} alt='이미지 선택' />
                                        }
                                        
                                    </Box>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                        <Box>
                            <HStack>
                                <DefText text='이름' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <DefInput 
                                placeholderText='이름을 입력해주세요.'
                                inputValue = {nameInput}
                                onChangeText = {nameChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                            />
                        </Box>
                        {
                            userInfo.sns == '' &&
                            <>
                                <Box mt={5}>
                                    <HStack>
                                        <DefText text='비밀번호' style={{fontSize:14}} />
                                        <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                                    </HStack>
                                    <Box mt='15px'>
                                        <DefInput 
                                            placeholderText='비밀번호를 입력해주세요.'
                                            inputValue = {passwordInput}
                                            onChangeText = {passwordChange}
                                            multiline = {false}
                                            secureTextEntry={true}
                                        />
                                        <Box style={{height:48, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                            <Image 
                                                source={require('../images/eyes.png')} 
                                                alt='암호화'
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box mt={5}>
                                    <HStack>
                                        <DefText text='비밀번호 확인' style={{fontSize:14}} />
                                        <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                                    </HStack>
                                    <Box mt='15px'>
                                        <DefInput 
                                            placeholderText='비밀번호를 다시 입력해주세요.'
                                            inputValue = {rePasswordInput}
                                            onChangeText = {rePasswordChange}
                                            multiline = {false}
                                            secureTextEntry={true}
                                        />
                                        <Box style={{height:48, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                            <Image 
                                                source={require('../images/eyes.png')} 
                                                alt='암호화'
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                        }
                        

                        <Box mt={5}>
                            <HStack>
                                <DefText text='주소' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <HStack justifyContent='space-between' mt={2.5}>
                                <DefInput
                                    placeholderText='지번'
                                
                                    multiline = {false}
                                    inputValue={baesongInfo}
                                    onChangeText={baesongChange}
                                        inputStyle={{width:(width-40)*0.6}}
                                />
                                <TouchableOpacity onPress={() => setAddrModal(true)} style={{width:(width-40)*0.37, height:45, alignItems:'center', justifyContent:'center', borderRadius:5, borderWidth:1,borderColor:'#999'}}>
                                    <DefText text='주소찾기' style={{fontSize:14}} />
                                </TouchableOpacity>
                            </HStack>
                            <Box mt={2.5}>
                            <DefInput 
                                placeholderText='상세주소를 입력하세요.'
                                multiline = {false}
                                inputValue={addrText}
                                onChangeText={addrChange}
                                
                            />
                            </Box>
                            <Box mt={2.5}>
                            <DefInput 
                                placeholderText='추가주소를 입력하세요.'
                                multiline = {false}
                                inputValue={addrText2}
                                onChangeText={addrTextChange2}
                                
                            />
                            </Box>
                        </Box>
                        
                        <Box mt={5}>
                            <HStack>
                                <DefText text='휴대폰번호' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <DefInput 
                                placeholderText='휴대폰번호를 입력해주세요. (-를 빼고 입력하세요.)'
                                inputValue = {phoneNumber}
                                onChangeText = {phoneNumberChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                                maxLength={13}
                                keyboardType='phone-pad'
                            />
                        </Box>
                        <HStack mt={5} justifyContent='space-between'>
                            <Box width={halfWidth + 'px'}>
                                <HStack>
                                    <DefText text='생년월일' style={{fontSize:14}} />
                                    <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                                </HStack>
                                <DefInput 
                                    placeholderText='Ex) 19790324'
                                    inputValue = {birthDay}
                                    onChangeText = {birthDayChange}
                                    multiline = {false}
                                    inputStyle={{marginTop:15}}
                                    maxLength={8}
                                    keyboardType='phone-pad'
                                />
                            </Box>
                            <Box width={halfWidth + 'px'}>
                                <HStack>
                                    <DefText text='성별' style={{fontSize:14}} />
                                    <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                                </HStack>
                                <Select
                                    selectedValue={gender}
                                    height='48px'
                                    mt='15px'
                                    fontSize={14}
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                >
                                    <Select.Item label='남자' value='남자' />
                                    <Select.Item label='여자' value='여자' />
                                </Select>
                            </Box>
                        </HStack>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='자문코드' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <Box mt='15px'>
                                <DefInput 
                                    placeholderText='자문요청시 본인확인을 위한 코드를 입력하세요.'
                                    inputValue = {counselNumber}
                                    onChangeText = {counselNumberChange}
                                    multiline = {false}
                                    //secureTextEntry={true}
                                />
                                
                            </Box>
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
            <Box mt={5} px={12} py={2.5}>
                <Button onPress={_RegisterCompleteButton} text='회원정보 수정하기' buttonStyle={{borderRadius:8}} textStyle={{fontSize:14}} />
            </Box>
            <Modal isOpen={addrModal} onClose={() => setAddrModal(false)} flex={1}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3', backgroundColor:'#fff'}} >
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setAddrModal(false)}}>
                            <Image source={require('../images/map_close.png')} alt='닫기' />
                        </TouchableOpacity>
                        <DefText text='다음주소찾기' style={{fontSize:20, lineHeight:23}} />
                        <DefText text='' style={{width:40}} />
                    </HStack>

                    <Postcode
                    style={{ width: width, height: 320, flex:1 }}
                    jsOptions={{ animation: true, hideMapBtn: true }}
                    onSelected={data => {
                        console.log(data);
                        addrSumits(data.zonecode, data.address)
                        setAddrModal(false);
                    }}
                    onError={e=>console.log(e)}
                    />

                </SafeAreaView>

            </Modal>
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
    })
)(AcountInfoChange);