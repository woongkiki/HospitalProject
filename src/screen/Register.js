import React, { useEffect, useState } from 'react';
import {Box, VStack, Image, Input, CheckIcon, HStack, Select, Modal} from 'native-base';
import { ScrollView, Dimensions, Alert, TouchableOpacity, JSON, SafeAreaView} from 'react-native';
import {DefText, Button, Button2, DefInput} from '../common/BOOTSTRAP';
import {email_check, phoneFormat} from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';
import HeaderRegister from '../components/HeaderRegister';
import Api from '../Api';
import HeaderComponents from '../components/HeaderComponents';
import ImagePicker from 'react-native-image-crop-picker';
import Postcode from '@actbase/react-daum-postcode';
import messaging from '@react-native-firebase/messaging';
import Font from '../common/Font';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

const Register = (props) => {

    const {navigation} = props;

    const {width} = Dimensions.get('window');
    const halfWidth = (width - 40) * 0.48;

    const [profileImgs, setProfileImgs] = useState('');
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

            setProfileImgs(my_photo);
          });
    }

    //e-mail 아이디
    const [emailInput, setEmailInput] = useState('');
    const emailChange = (text) => {
        setEmailInput(text);
    }

    //이름
    const [nameInput, setNameInput] = useState('');
    const nameChange = (text) => {
        setNameInput(text);
    }

    //비밀번호 입력
    const [passwordInput, setPasswordInput] = useState('');
    const passwordChange = (password) => {
        setPasswordInput(password);
    }

    //비밀번호 재입력
    const [rePasswordInput, setRePasswordInput] = useState('');
    const rePasswordChange = (password) => {
        setRePasswordInput(password);
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

    const addrSumits = (addrZip, addr1) => {
        setBaesongInfo(addrZip);
        setAddrText(addr1);
        //setAddrText2(addr2);
    }

    //자문번호
    const [counselNumber, setCounselNumber] = useState('');
    const counselNumberChange = (number) => {
        setCounselNumber(number);
    }

    //휴대폰번호 입력
    const [phoneNumber, setPhoneNumber] = useState('');
    const phoneNumberChange = (number) => {
        setPhoneNumber(phoneFormat(number));
    }

    //생년월일 입력
    const [birthDay, setBirthDay] = useState('');
    const birthDayChange = (year) => {
        setBirthDay(year);
    }

    //성별
    const [gender, setGender] = useState('남자');

    //가입코드
    const [joinCode, setJoinCode] = useState('');
    const joinCodeChange = (code) => {
        setJoinCode(code);
    }

    const [agree, setAgree] = useState(false);


    const [addrModal, setAddrModal] = useState(false);


    const [pwdStatus, setPwdStatus] = useState(true);
    const [pwdConfirmStatus, setPwdConfirmStatus] = useState(true);

    const [counselStatus, setCounselStatus] = useState(true);


    const _RegisterCompleteButton = async () => {

        const token = await messaging().getToken();

        if(!emailInput){
            ToastMessage('이메일을 입력하세요');
            return false;
        }

        if(!email_check(emailInput)){ // 이메일 유효성 검사
            ToastMessage('이메일 형식으로 입력하세요.');
            return false;
        }

        if(!nameInput){ //비밀번호 입력 검사
            ToastMessage('이름을 입력하세요.');
            return false;
        }

        if(!passwordInput){ //비밀번호 입력 검사
            ToastMessage('비밀번호를 입력하세요.');
            return false;
        }

        if(!rePasswordInput){ //비밀번호 입력 검사
            ToastMessage('비밀번호를 다시한번 입력하세요.');
            return false;
        }

        if(passwordInput!=rePasswordInput){
            ToastMessage('비밀번호가 일치하지 않습니다.');
            return false;
        }

        if(!baesongInfo){
            ToastMessage('주소를 입력하세요.');
            return false;
        }

        if(!counselNumber){
            ToastMessage('자문코드를 입력하세요.');
            return false;
        }

        if(!phoneNumber){
            ToastMessage('휴대폰번호를 입력하세요.');
            return false;
        }

        if(!birthDay){
            ToastMessage('생년월일을 입력하세요.');
            return false;
        }

        if(!gender){
            ToastMessage('성별을 선택하세요');
            return false;
        }

        if(!joinCode){
            ToastMessage('가입코드를 입력하세요.');
            return false;
        }

        if(!agree11){
            ToastMessage('서비스 이용약관에 동의해주세요.');
            return false;
        }

        if(!agree22){
            ToastMessage('위치정보 이용약관에 동의해주세요.');
            return false;
        }

        if(!agree33){
            ToastMessage('개인정보처리방침에 동의해주세요.');
            return false;
        }

        if(!agree44){
            ToastMessage('개인(민감)정보 수집 및 이용약관에 동의해주세요.');
            return false;
        }

        Api.send('member_join', {'id':emailInput, 'password':passwordInput, 'nameInput':nameInput, 'counselNumber':counselNumber,'phoneNumber':phoneNumber, 'birthDay':birthDay, 'gender':gender, 'joinCode':joinCode, 'post':baesongInfo, 'address1':addrText, 'address2': addrText2, 'photo':profileImgs, 'token':token}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('로그인 정보: ', resultItem);
                ToastMessage(resultItem.message);
                navigation.goBack();

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });

        //ToastMessage('회원가입 완료..');
    }

    const [privacyAgreeModal, setPrivacyAgreeModal] = useState(false);
    const [personalData, setPersonalData] = useState('');


    const [agree11, setAgree11] = useState(false);
    const [agree22, setAgree22] = useState(false);
    const [agree33, setAgree33] = useState(false);
    const [agree44, setAgree44] = useState(false);

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

    useEffect(()=>{
       // PersonalRecieve();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='회원가입' />
            <ScrollView>
                
                <Box p={5}>
                    <VStack >
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
                                            <Image source={{uri:profileImgs.uri}} alt='이미지 선택' style={{width:100, height:100, borderRadius:50}} resizeMode='contain' />
                                            :
                                            <Image source={require('../images/noImage.png')} alt='이미지 선택' />
                                        }
                                        
                                    </Box>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='이메일' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            {/* <DefInput 
                                placeholderText='이메일을 입력해주세요.'
                                inputValue = {emailInput}
                                onChangeText = {emailChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                            /> */}
                            <Input 
                                placeholder='이메일을 입력해주세요.'
                                value={emailInput}
                                onChangeText={emailChange}
                                _focus='transparent'
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                borderRadius={10}
                                height='45px'
                                style={[{fontSize:16, fontFamily:Font.NotoSansMedium, marginTop:15}, emailInput.length > 0 && {backgroundColor:'#f1f1f1'}]}
                            />
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='이름' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            {/* <DefInput 
                                placeholderText='이름을 입력해주세요.'
                                inputValue = {nameInput}
                                onChangeText = {nameChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                            /> */}
                            <Input 
                                placeholder='이름을 입력해주세요.'
                                value={nameInput}
                                onChangeText={nameChange}
                                _focus='transparent'
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                borderRadius={10}
                                height='45px'
                                style={[{fontSize:16, fontFamily:Font.NotoSansMedium, marginTop:15}, nameInput.length > 0 && {backgroundColor:'#f1f1f1'}]}
                            />
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='비밀번호' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            <Box mt='15px'>
                                {/* <DefInput 
                                    placeholderText='비밀번호를 입력해주세요.'
                                    inputValue = {passwordInput}
                                    onChangeText = {passwordChange}
                                    multiline = {false}
                                    secureTextEntry={pwdStatus}
                                    height='50px'
                                /> */}
                                <Input 
                                    placeholder='비밀번호를 입력해주세요.'
                                    value={passwordInput}
                                    onChangeText={passwordChange}
                                    _focus='transparent'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    height='45px'
                                    secureTextEntry={pwdStatus}
                                    style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, passwordInput.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                />
                                <Box style={{height:50, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                    <TouchableOpacity onPress={()=>setPwdStatus(!pwdStatus)}>
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
                                <DefText text='비밀번호 확인' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            <Box mt='15px'>
                                {/* <DefInput 
                                    placeholderText='비밀번호를 다시 입력해주세요.'
                                    inputValue = {rePasswordInput}
                                    onChangeText = {rePasswordChange}
                                    multiline = {false}
                                    secureTextEntry={pwdConfirmStatus}
                                /> */}
                                <Input 
                                    placeholder='비밀번호를 다시 입력해주세요.'
                                    value={rePasswordInput}
                                    onChangeText={rePasswordChange}
                                    _focus='transparent'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    height='45px'
                                    secureTextEntry={pwdConfirmStatus}
                                    style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, rePasswordInput.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                />
                                <Box style={{height:50, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                    <TouchableOpacity onPress={()=>setPwdConfirmStatus(!pwdConfirmStatus)}>
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
                                {
                                    passwordInput!=rePasswordInput &&
                                    <DefText text='비밀번호가 일치하지 않습니다.' style={{fontSize:14, color:"#f00", marginTop:10}} />
                                }
                            </Box>
                        </Box>

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
                                /> */}
                                <Box style={[{width:(width-40)*0.6, height:45, justifyContent:'center', borderWidth:1, borderColor:'#f1f1f1', borderRadius:10, paddingLeft:15}, baesongInfo != '' && {backgroundColor:'#f1f1f1'}]}>
                                    {
                                        baesongInfo != '' ?
                                        <DefText text={baesongInfo} style={{color:'#000', fontFamily:Font.NotoSansMedium}} />
                                        :
                                        <DefText text='지번' style={{color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                    }
                                </Box>
                                <TouchableOpacity onPress={() => setAddrModal(true)} style={{width:(width-40)*0.37, height:45, alignItems:'center', justifyContent:'center', borderRadius:10, borderWidth:1,borderColor:'#f1f1f1', backgroundColor:'#090A73'}}>
                                    <DefText text='주소찾기' style={{fontFamily:Font.NotoSansMedium, color:'#fff'}} />
                                </TouchableOpacity>
                            </HStack>
                            <Box mt={2.5}>
                                {/* <DefInput 
                                    placeholderText='주소를 입력하세요.'
                                    multiline = {false}
                                    inputValue={addrText}
                                    onChangeText={addrChange}
                                    
                                /> */}
                                <Input 
                                    placeholder='주소를 입력하세요.'
                                    value={addrText}
                                    onChangeText={addrChange}
                                    _focus='transparent'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    height='45px'
                                    style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, addrText.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                />
                            </Box>
                            <Box mt={2.5}>
                                {/* <DefInput 
                                    placeholderText='상세주소를 입력하세요.'
                                    multiline = {false}
                                    inputValue={addrText2}
                                    onChangeText={addrTextChange2}
                                    
                                /> */}
                                <Input 
                                    placeholder='상세주소를 입력하세요.'
                                    value={addrText2}
                                    onChangeText={addrTextChange2}
                                    _focus='transparent'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    height='45px'
                                    style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, addrText2.length > 0 && {backgroundColor:'#f1f1f1'}]}
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
                                placeholder='휴대폰번호를 입력해주세요. (-를 빼고 입력하세요.)'
                                value={phoneNumber}
                                onChangeText={phoneNumberChange}
                                _focus='transparent'
                                borderWidth={1}
                                borderColor='#f1f1f1'
                                borderRadius={10}
                                height='45px'
                                keyboardType='phone-pad'
                                maxLength={13}
                                style={[{fontSize:16, fontFamily:Font.NotoSansMedium, marginTop:15}, phoneNumber.length > 0 && {backgroundColor:'#f1f1f1'}]}
                            />
                        </Box>
                        <HStack mt={5} justifyContent='space-between'>
                            <Box width={halfWidth + 'px'}>
                                <HStack>
                                    <DefText text='생년월일' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}}/>
                                    <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                </HStack>
                                {/* <DefInput 
                                    placeholderText='Ex) 19790324'
                                    inputValue = {birthDay}
                                    onChangeText = {birthDayChange}
                                    multiline = {false}
                                    inputStyle={{marginTop:15}}
                                    maxLength={8}
                                    keyboardType='phone-pad'
                                /> */}
                                <Input 
                                    placeholder='Ex) 19790324'
                                    value={birthDay}
                                    onChangeText={birthDayChange}
                                    _focus='transparent'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    height='45px'
                                    keyboardType='phone-pad'
                                    maxLength={8}
                                    style={[{fontSize:16, fontFamily:Font.NotoSansMedium, marginTop:15}, birthDay.length > 0 && {backgroundColor:'#f1f1f1'}]}
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
                                    fontSize={16}
                                    backgroundColor={ gender.length > 0 ? '#f1f1f1' : '#fff' }
                                    style={{fontFamily:Font.NotoSansMedium, color:'#000'}}
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                >
                                    <Select.Item label='남자' value='남자' />
                                    <Select.Item label='여자' value='여자' />
                                </Select>
                            </Box>
                        </HStack>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='가입코드' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            <Box>
                                {/* <DefInput 
                                    placeholderText='보유하신 가입코드를 입력해주세요'
                                    inputValue = {joinCode}
                                    onChangeText = {joinCodeChange}
                                    multiline = {false}
                                    inputStyle={{marginTop:15}}
                                    keyboardType='phone-pad'
                                    
                                /> */}
                                <Input 
                                    placeholder='Ex) 19790324'
                                    value={joinCode}
                                    onChangeText={joinCodeChange}
                                    _focus='transparent'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    height='45px'
                                    
                                    style={[{fontSize:16, fontFamily:Font.NotoSansMedium, marginTop:15}, joinCode.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                />
                            </Box>
                        </Box>
                        <Box mt={5}>
                            <HStack>
                                <DefText text='간편비밀번호' style={{fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            <Box mt='15px'>
                                <Input 
                                    placeholder='자문요청을 위한 간편비밀번호 입력하세요.'
                                    value={counselNumber}
                                    onChangeText={counselNumberChange}
                                    _focus='transparent'
                                    borderWidth={1}
                                    borderColor='#f1f1f1'
                                    borderRadius={10}
                                    height='45px'
                                    secureTextEntry={counselStatus}
                                    keyboardType='phone-pad'
                                    style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, counselNumber.length > 0 && {backgroundColor:'#f1f1f1'}]}
                                />
                                <Box style={{height:50, position:'absolute', top:0, right:15, justifyContent:'center'}}>
                                    <TouchableOpacity onPress={()=>setCounselStatus(!counselStatus)}>
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

                        <Box backgroundColor='#f1f1f1' p={5} py='15px' borderRadius={10} mt={'20px'}>
                         
                            <HStack alignItems='center'>
                                <TouchableOpacity onPress={()=>setAgree11(!agree11)}>
                                    <HStack>
                                        <Box width='20px' height='20px' borderRadius='20px' borderWidth={1} borderColor={ agree11 ? '#f00' : '#666' } alignItems='center' justifyContent='center' mr={2.5}>
                                            <CheckIcon width='10px' color={agree11 ? '#f00' : '#666'} />
                                        </Box>
                                        <DefText text='서비스 이용약관' />
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>PersonalRecieve('service')} style={{marginTop:-4}}>
                                    <Box borderBottomWidth={1} borderBottomColor='#888' ml={2.5}>
                                        <DefText text='자세히' style={{fontSize:13,color:'#888'}} />
                                    </Box>
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <Box backgroundColor='#f1f1f1' p={5} py='15px' borderRadius={10} mt={'10px'}>
                          
                            <HStack alignItems='center'>
                                <TouchableOpacity onPress={()=>setAgree22(!agree22)}>
                                    <HStack>
                                        <Box width='20px' height='20px' borderRadius='20px' borderWidth={1} borderColor={ agree22 ? '#f00' : '#666' } alignItems='center' justifyContent='center' mr={2.5}>
                                            <CheckIcon width='10px' color={ agree22 ? '#f00' : '#666' } />
                                        </Box>
                                        <DefText text='위치정보 이용약관' />
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>PersonalRecieve('location')} style={{marginTop:-4}}>
                                    <Box borderBottomWidth={1} borderBottomColor='#888' ml={2.5}>
                                        <DefText text='자세히' style={{fontSize:13,color:'#888'}} />
                                    </Box>
                                </TouchableOpacity>
                             
                            </HStack>
                    
                        </Box>
                        <Box backgroundColor='#f1f1f1' p={5} py='15px' borderRadius={10} mt={'10px'}>
                           
                            <HStack alignItems='center'>
                                <TouchableOpacity onPress={()=>setAgree33(!agree33)}>
                                    <HStack>
                                        <Box width='20px' height='20px' borderRadius='20px' borderWidth={1} borderColor={ agree33 ? '#f00' : '#666' } alignItems='center' justifyContent='center' mr={2.5}>
                                            <CheckIcon width='10px' color={agree33 ? '#f00' : '#666'} />
                                        </Box>
                                        <DefText text='개인정보처리방침' />
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>PersonalRecieve('personal')} style={{marginTop:-4}}>
                                    <Box borderBottomWidth={1} borderBottomColor='#888' ml={2.5}>
                                        <DefText text='자세히' style={{fontSize:13,color:'#888'}} />
                                    </Box>
                                </TouchableOpacity>
                            </HStack>
                          
                        </Box>
                        <Box backgroundColor='#f1f1f1' p={5} py='15px' borderRadius={10} mt={'10px'}>
                            
                            <HStack alignItems='center'>
                                <TouchableOpacity onPress={()=>setAgree44(!agree44)}>
                                    <HStack>
                                        <Box width='20px' height='20px' borderRadius='20px' borderWidth={1} borderColor={ agree44 ? '#f00' : '#666' } alignItems='center' justifyContent='center' mr={2.5}>
                                            <CheckIcon width='10px' color={agree44 ? '#f00' : '#666'} />
                                        </Box>
                                        <DefText text='개인(민감)정보 수집 및 이용약관' />
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>PersonalRecieve('personal2')} style={{marginTop:-4}}>
                                    <Box borderBottomWidth={1} borderBottomColor='#888' ml={2.5}>
                                        <DefText text='자세히' style={{fontSize:13,color:'#888'}} />
                                    </Box>
                                </TouchableOpacity>
                            </HStack>
   
                        </Box>
                        {/* <HStack mt={3}>
                            <TouchableOpacity onPress={()=>{setAgree(!agree)}} activeOpacity={1}>
                                <HStack alignItems='center'>
                                    <Box style={{width:24, height:24, borderRadius:4, borderWidth:1, borderColor:'#D0D0D0', justifyContent:'center', alignItems:'center'}}>
                                        {
                                            agree &&
                                            <CheckIcon style={{width:15, height:15}} />
                                        }
                                    </Box>
                                    <HStack style={{marginLeft:10}}>
                                        <TouchableOpacity onPress={()=>setPrivacyAgreeModal(true)}>
                                            <DefText text='이용약관' style={{fontSize:12, color:'#090A73', borderBottomWidth:1, borderBottomColor:'#090A73' }} />
                                        </TouchableOpacity>
                                        <DefText text='에 동의합니다.' style={{fontSize:12, color:'#090A73'}} />
                                    </HStack>
                                </HStack>
                            </TouchableOpacity>
                        </HStack> */}
                        <Box mt={'30px'}>
                            <Button onPress={_RegisterCompleteButton} text='가입완료' buttonStyle={{borderRadius:10, backgroundColor:'#090A73', height:45}} textStyle={{fontSize:16, fontFamily:Font.NotoSansMedium}} />
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
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
            <Modal isOpen={privacyAgreeModal} onClose={()=>setPrivacyAgreeModal(false)}>
                <Modal.Content maxWidth={width-40} backgroundColor='#fff'>
                    <Modal.Body>
                        <DefText text={personalData.title} />
                        <Box mt={'15px'}>
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
                            <TouchableOpacity onPress={()=>setPrivacyAgreeModal(false)} style={{width:width-90, height:45, backgroundColor:'#090A73', justifyContent:'center', alignItems:'center', borderRadius:10}}>
                                <DefText text='확인' style={{color:'#fff'}} />
                            </TouchableOpacity>
                            
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

export default Register;