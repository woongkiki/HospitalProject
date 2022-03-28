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
import Font from '../common/Font';
import Api from '../Api';

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
    const [nameInput, setNameInput] = useState('');
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

    const [pwdStatus, setPwdStatus] = useState(true);
    const [pwdConfirmStatus, setPwdConfirmStatus] = useState(true);

    const [counselStatus, setCounselStatus] = useState(true);


    useEffect(()=>{
        setEmailInput(userInfoState.email);
        setNameInput(userInfoState.name);
        setPhoneNumber(userInfoState.hphone);
        setBirthDay(userInfoState.birthday);
        setProfileImgs(userInfoState.photo);
        //setCounselNumber(userInfoState.passwd2);
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
                                <DefText text='프로필 이미지' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
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
                        <Box mt={5}>
                            <HStack>
                                <DefText text='이름' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            
                            <Input 
                                placeholderText='이름을 입력해주세요.'
                                placeholderTextColor={'#a3a3a3'}
                                value={nameInput}
                                onChangeText = {nameChange}
                                height='45px'
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                borderRadius={10}
                                _focus='transparent'
                                style={[{fontFamily:Font.NotoSansMedium, marginTop:15}, nameInput?.length > 0 && {backgroundColor:'#f1f1f1'}]}
                            />
                        </Box>
                        {/* {
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
                                            secureTextEntry={pwdStatus}
                                        />
                                        <Box style={{height:48, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                            <TouchableOpacity onPress={() => setPwdStatus(!pwdStatus)}>
                                                {
                                                    pwdStatus ?
                                                    <Image 
                                                        source={require('../images/eyes.png')} 
                                                        alt='암호화'
                                                    />
                                                    :
                                                    <Image 
                                                        source={require('../images/eyes_yes.png')} 
                                                        alt='암호화'
                                                    />
                                                }
                                            </TouchableOpacity>
                                            
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
                                            secureTextEntry={pwdConfirmStatus}
                                        />
                                        <Box style={{height:48, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                            <TouchableOpacity onPress={() => setPwdConfirmStatus(!pwdConfirmStatus)}>
                                                {
                                                    pwdConfirmStatus ?
                                                    <Image 
                                                        source={require('../images/eyes.png')} 
                                                        alt='암호화'
                                                    />
                                                    :
                                                    <Image 
                                                        source={require('../images/eyes_yes.png')} 
                                                        alt='암호화'
                                                    />
                                                }
                                            </TouchableOpacity>
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                        } */}
                        

                        <Box mt={5}>
                            <HStack>
                                <DefText text='주소' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            <HStack justifyContent='space-between' mt={2.5}>
                                 {/* <DefInput
                                    placeholderText='지번'
                                
                                    multiline = {false}
                                    inputValue={baesongInfo}
                                    onChangeText={baesongChange}
                                    inputStyle={{width:(width-40)*0.6}}
                                />  */}
                                 <Input 
                                    placeholderText='지번'
                                    placeholderTextColor={'#a3a3a3'}
                                    value={baesongInfo}
                                    onChangeText = {baesongChange}
                                    height='45px'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    _focus='transparent'
                                    style={[{fontFamily:Font.NotoSansMedium, width:(width-40)*0.6}, baesongInfo?.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                />
                                 {/* <Box style={{width:(width-40)*0.6, height:45, justifyContent:'center', borderWidth:1, borderColor:'#f1f1f1', borderRadius:10, paddingLeft:15}}>
                                    {
                                        baesongInfo != '' ?
                                        <DefText text={baesongInfo} />
                                        :
                                        <DefText text='지번' style={{fontSize:14, color:'#ABB3BB'}} />
                                    }
                                </Box> */}
                                <TouchableOpacity onPress={() => setAddrModal(true)} style={{width:(width-40)*0.37, height:45, alignItems:'center', justifyContent:'center', borderRadius:10, backgroundColor:'#090A73'}}>
                                    <DefText text='주소찾기' style={{color:'#fff', fontWeight:'500', fontFamily:Font.NotoSansMedium}} />
                                </TouchableOpacity>
                            </HStack>
                            <Box mt={2.5}>
                                
                                 <Input 
                                    placeholderText='상세주소를 입력하세요.'
                                    placeholderTextColor={'#a3a3a3'}
                                    value={addrText}
                                    onChangeText = {addrChange}
                                    height='45px'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    _focus='transparent'
                                    style={[{fontFamily:Font.NotoSansMedium}, addrText?.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                />
                            </Box>
                            <Box mt={2.5}>
                                {/* <DefInput 
                                    placeholderText='추가주소를 입력하세요.'
                                    multiline = {false}
                                    inputValue={addrText2}
                                    onChangeText={addrTextChange2}
                                    
                                /> */}
                                <Input 
                                    placeholderText='추가주소를 입력하세요.'
                                    placeholderTextColor={'#a3a3a3'}
                                    value={addrText2}
                                    onChangeText = {addrTextChange2}
                                    height='45px'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    _focus='transparent'
                                    style={[{fontFamily:Font.NotoSansMedium}, addrText2?.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                />
                            </Box>
                        </Box>
                        
                        <Box mt={5}>
                            <HStack>
                                <DefText text='휴대폰번호' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            {/* <DefInput 
                                placeholderText='휴대폰번호를 입력해주세요. (-를 빼고 입력하세요.)'
                                inputValue = {phoneNumber}
                                onChangeText = {phoneNumberChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                                maxLength={13}
                                keyboardType='phone-pad'
                            /> */}
                            <Input 
                                placeholderText='추가주소를 입력하세요.'
                                placeholderTextColor={'#a3a3a3'}
                                value={phoneNumber}
                                onChangeText = {phoneNumberChange}
                                height='45px'
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                borderRadius={10}
                                _focus='transparent'
                                style={[{fontFamily:Font.NotoSansMedium, marginTop:15}, phoneNumber?.length > 0 && {backgroundColor:'#f1f1f1'}]}
                            />
                        </Box>
                        <HStack mt={5} justifyContent='space-between'>
                            <Box width={halfWidth + 'px'}>
                                <HStack>
                                    <DefText text='생년월일' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                    <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                </HStack>
                               
                                <Input 
                                    placeholderText='Ex) 19790324'
                                    placeholderTextColor={'#a3a3a3'}
                                    value={birthDay}
                                    onChangeText = {birthDayChange}
                                    height='45px'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    _focus='transparent'
                                    style={[{fontFamily:Font.NotoSansMedium, marginTop:15}, birthDay?.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                    maxLength={8}
                                />
                            </Box>
                            <Box width={halfWidth + 'px'}>
                                <HStack>
                                    <DefText text='성별' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                    <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                </HStack>
                                <Select
                                    selectedValue={gender}
                                    height='45px'
                                    mt='15px'
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                    backgroundColor={gender.length>0 ? '#f1f1f1': '#fff'}
                                    style={{fontSize:16, fontFamily:Font.NotoSansMedium}}
                                >
                                    <Select.Item label='남자' value='남자' />
                                    <Select.Item label='여자' value='여자' />
                                </Select>
                            </Box>
                        </HStack>
                        <Box mt={5} pb='80px'>
                            <HStack>
                                <DefText text='간편비밀번호' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            <Box mt='15px'>
                                 <DefInput 
                                    placeholderText='자문요청을 위한 간편비밀번호 입력하세요.'
                                    inputValue = {counselNumber}
                                    onChangeText = {counselNumberChange}
                                    multiline = {false}
                                    secureTextEntry={counselStatus}
                                    keyboardType={'number-pad'}
                                    inputStyle={[{height:45, fontSize:16, color:'#000'}, counselNumber?.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                /> 
                                {/* <Input 
                                    placeholderText='자문요청을 위한 간편비밀번호 입력하세요.'
                                    placeholderTextColor={'#a3a3a3'}
                                    value={counselNumber}
                                    onChangeText = {counselNumberChange}
                                    height='45px'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    _focus='transparent'
                                    style={[{fontFamily:Font.NotoSansMedium}, counselNumber.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                    keyboardType='number-pad'
                                /> */}
                                <Box style={{height:45, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                    <TouchableOpacity onPress={() => setCounselStatus(!counselStatus)}>
                                        {
                                            counselStatus ?
                                            <Image 
                                                source={require('../images/eyes.png')} 
                                                alt='암호화'
                                            />
                                            :
                                            <Image 
                                                source={require('../images/eyes_yes.png')} 
                                                alt='암호화'
                                            />
                                        }
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
            <Box position={'absolute'} bottom={"30px"} right={"20px"}>
                {/* <Button onPress={_RegisterCompleteButton} text='회원정보 수정하기' buttonStyle={{borderRadius:8}} textStyle={{fontSize:14}} /> */}
                <TouchableOpacity onPress={_RegisterCompleteButton}>
                    
                    <Image source={require('../images/saveButtonNew.png')} alt='저장' style={{width:111, height:53, resizeMode:'contain'}} />
                    <Box style={{width:111, height:53, position:'absolute', top:0, left:0, justifyContent:'center', paddingLeft:60}}>
                        <DefText text='저장' style={{fontSize:19, lineHeight:27,fontFamily:Font.NotoSansBold, color:'#fff'}} />
                    </Box>
                </TouchableOpacity>
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