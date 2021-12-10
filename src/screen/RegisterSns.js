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

const RegisterSns = (props) => {

    const {navigation, route} = props;

    const {params} = route;

    console.log('넘어온 파라미터 sns 정보', params);

   

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

    const [sns, setSns] = useState('');

    const [snsKey, setSnsKey] = useState('');

    useEffect(()=>{
        if(params){
            console.log('파라미터 있음', params);

            setEmailInput(params.email);
            setNameInput(params.name);
            setSns(params.sns);
            setSnsKey(params.snskey);
        }
    }, [])

    const _RegisterCompleteButton = async () => {

        const token = await messaging().getToken();

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

        if(!agree){
            ToastMessage('이용약관에 동의해주세요.');
            return false;
        }

        Api.send('member_join', {'id':emailInput, 'nameInput':nameInput, 'counselNumber':counselNumber,'phoneNumber':phoneNumber, 'birthDay':birthDay, 'gender':gender, 'joinCode':joinCode, 'post':baesongInfo, 'address1':addrText, 'address2': addrText2, 'photo':profileImgs, 'token':token, 'sns':sns, 'snsKey':snsKey}, (args)=>{
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

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='회원가입(SNS)' />
            <ScrollView>
                
                <Box p={5}>
                    <VStack >
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
                        </Box>
                        <Box mt={5}>
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
                                <DefText text='가입코드' style={{fontSize:14}} />
                                <DefText text='*' style={{fontSize:14, color:'#f00', marginLeft:5}} />
                            </HStack>
                            <DefInput 
                                placeholderText='보유하신 가입코드를 입력해주세요'
                                inputValue = {joinCode}
                                onChangeText = {joinCodeChange}
                                multiline = {false}
                                inputStyle={{marginTop:15}}
                                
                            />
                        </Box>
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
                        <HStack mt={3}>
                            <TouchableOpacity onPress={()=>{setAgree(!agree)}} activeOpacity={1}>
                                <HStack alignItems='center'>
                                    <Box style={{width:24, height:24, borderRadius:4, borderWidth:1, borderColor:'#D0D0D0', justifyContent:'center', alignItems:'center'}}>
                                        {
                                            agree &&
                                            <CheckIcon style={{width:15, height:15}} />
                                        }
                                    </Box>
                                    <HStack style={{marginLeft:10}}>
                                        <TouchableOpacity>
                                            <DefText text='이용약관' style={{fontSize:12, color:'#3AD4E0', borderBottomWidth:1, borderBottomColor:'#3ad4e0' }} />
                                        </TouchableOpacity>
                                        <DefText text='에 동의합니다.' style={{fontSize:12, color:'#3AD4E0'}} />
                                    </HStack>
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                        <Box mt={12}>
                            <Button onPress={_RegisterCompleteButton} text='가입완료' buttonStyle={{borderRadius:8}} textStyle={{fontSize:14}} />
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
        </Box>
    );
};

export default RegisterSns;