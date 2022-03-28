import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack, VStack, Input, Modal } from 'native-base';
import { DefText, SaveButton } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import {diseaseDatas1, diseaseDatas2} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import Font from '../common/Font';


const {width} = Dimensions.get('window');

const MyDiseaseReport = (props) => {

    const {navigation, userInfo} = props;

    const [selectDisease, setSelectDisease] = useState('');

    const [schText, setSchText] = useState('');

    const schTextChange = (text) => {
        setSchText(text);
    }

    const [schData, setSchData] = useState('');

    //어깨병변
    const schButtons = () => {
        if(schText.length==0){
            console.log('검색어를 입력하세요.');
            return false;
        }

        Api.send('disease_list', {'id':userInfo.id, 'token':userInfo.appToken, 'schText':schText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('질병정보 검색::::: ', arrItems);

               setSchData(arrItems);
               //ToastMessage(resultItem.message);
               //navigation.navigate('HealthReport');

            }else{
                console.log('질병정보 검색 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
        //ToastMessage(schText);
    }

    const diseaseDataList1 = diseaseDatas1.map((item, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.disButton, selectDisease === item.diseaseName && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item.diseaseName)}>
                <DefText text={item.diseaseName} style={[styles.disText, selectDisease === item.diseaseName && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

 
 

    const [diseaseModal, setDiseaseModal] = useState(false);
    const [diseaseInput, setDiseaseInput] = useState('');
    const diseaseChange = (text) => {
        setDiseaseInput(text);
    }

    const diseaseInputSubmit = () => {
        if(diseaseInput.length==0){
            ToastMessage('질환명을 입력하세요.');
            return false;
        }

        setSelectDisease(diseaseInput);
        diseaseSelectButton(diseaseInput)
        setDiseaseModal(false);
        setDiseaseInput('');
    }

    const [diseaseDatas, setDiseaseDatas] = useState('');
    const [diseaseAge, setDiseaseAge] = useState('');
    const [diseasePain, setDiseasePain] = useState('');

    const [disaseSelect, setDiseaseSelect] = useState('');

    const DiseaseDataR = () => {
        Api.send('disease_age', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('연령대 별 질환정보: ', arrItems);

               setDiseaseDatas(arrItems);
               setDiseaseAge(arrItems.age);
               setDiseasePain(arrItems.disease);

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });


        Api.send('member_profile', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 정보123: ', arrItems.disease);

              
               setDiseaseSelect(arrItems.disease);
   

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        DiseaseDataR();
    }, [])


    const [disSelects, setDisSelect] = useState([]);

    const diseaseSelectButton = (buttonText) => {
        
        
       

        if(disSelects.includes(buttonText)){
            const findIdx = disSelects.find((e) => e === buttonText); // 배열에 같은값이 있으면 출력
            const idxs = disSelects.indexOf(findIdx);
        
            //console.log('1',diseaseDatas);
            disSelects.splice(idxs, 1)
        }else{
            disSelects.push(buttonText);
        }

        setDisSelect([...disSelects]);

    }


    useEffect(()=>{
        console.log(disSelects)
    }, [disSelects]);



    const diseaseSave = () => {

        if(disSelects.length==0){
            ToastMessage('질환명을 선택하거나 입력하세요.');
            return false;
        }


        let diseaseDD =  disSelects.join('^');

        console.log(diseaseDD);


        Api.send('member_disease', {'id':userInfo.id, 'token':userInfo.appToken, 'disease':diseaseDD}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 정보123: ', resultItem);

               ToastMessage(resultItem.message);
               navigation.navigate('HealthReport');

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });

        // console.log(disSelects);
      
       // console.log('완료', disSelects);
        
           // navigation.replace('HealthReport', selectDisease);
    }

    const [chrinicData, setChrinicData] = useState('');

    const mansungDisease = () => {
        Api.send('disease_chronic', { 'id':userInfo.id, 'token':userInfo.appToken }, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('만성질환', arrItems);

                setChrinicData(arrItems.disease);

            }else{
                console.log('만성질환 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        mansungDisease();
    }, [])


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents navigation={navigation} headerTitle='질환기록' />
            <ScrollView>
                <Box p={5} mb='80px'>
                    <Box>
                        <DefText text='선택한 질환' style={{fontSize:16, fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                        {
                            disSelects != '' ?
                            <HStack flexWrap='wrap'>
                                {
                                    disSelects.map((item, index)=> {
                                        return (
                                           
                                            <Box key={index} style={[styles.disButton, {backgroundColor:'#696969'} ]}>
                                                <DefText text={item} style={[styles.disText, {color:'#fff'}]} />
                                            </Box>
    
                                        )
                                    })
                                }
                            </HStack>

                            :
                            <Box py={5} alignItems='center' justifyContent='center'>
                                <DefText text='선택된 질환이 없습니다.' style={{fontSize:14,color:'#666'}} />
                            </Box>
                        }
                        
                    </Box>
                    <Box mt={5}>
                        <HStack alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                            <Input
                                placeholder='질병명으로 검색하세요.'
                                height='45px'
                                width={width-80}
                                backgroundColor='transparent'
                                borderWidth={0}
                                borderRadius={10}
                                onSubmitEditing={schButtons}
                                value={schText}
                                onChangeText={schTextChange}
                            />
                            <TouchableOpacity onPress={schButtons}>
                                <Image source={require('../images/schIcons.png')} alt='검색' />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    {
                        schData != '' &&
                        <Box mt={5}>
                            <HStack>
                                <DefText text={schText + '의 검색결과'} />
                            </HStack>
                            {
                                schData != '' ?
                                <HStack flexWrap='wrap'>
                                    {
                                        schData.map((item, index)=> {
                                            return (
                                                <TouchableOpacity key={index} style={[styles.disButton]} onPress={()=>diseaseSelectButton(item.name)}>
                                                    <DefText text={item.name} style={[styles.disText]} />
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </HStack>
                                :
                                <Box height='100px' justifyContent='center' alignItems='center'>
                                    <DefText text='검색된 질환정보가 없습니다.' />
                                </Box>
                            }
                        </Box>
                    }
                    {
                        chrinicData != '' && 
                        <Box mt={5}>
                            <DefText text='만성질환' style={{fontSize:16, fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                            {
                                chrinicData.length > 0 &&
                                <HStack flexWrap={'wrap'}>
                                    {
                                            chrinicData.map((item, index)=> {
                                            return(
                                                <TouchableOpacity key={index} style={[styles.disButton]} onPress={()=>diseaseSelectButton(item.name, item.idx)}>
                                                    <DefText text={item.name} style={[styles.disText]} />
                                                </TouchableOpacity>       
                                            )
                                        })
                                    }
                                </HStack>
                            }
                        </Box>
                    }
                    <Box mt={5}>
                        {
                            diseaseDatas != '' && 

                            diseaseAge != '' &&
                            <>
                            <HStack alignItems='flex-end'>
                                <DefText text='연령대 별 다빈도 질환' style={{fontSize:16, fontFamily:Font.NotoSansMedium, color:'#696969'}} />
                                <DefText text={'만'+diseaseAge+'세 기준'} style={{color:'#000', marginLeft:10, fontFamily:Font.NotoSansMedium}} />
                            </HStack>
                            {
                                diseasePain != '' ?
                                <HStack flexWrap='wrap'>
                                    {
                                        diseasePain.map((item, index)=> {
                                            return (
                                                <TouchableOpacity key={index} style={[styles.disButton]} onPress={()=>diseaseSelectButton(item.name)}>
                                                    <DefText text={item.name} style={[styles.disText]} />
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </HStack>
                                :
                                <Box height='100px' justifyContent='center' alignItems='center'>
                                    <DefText text='등록된 질환정보가 없습니다.' />
                                </Box>
                            }
                            
                            </>
                        }
                        

                    </Box>
                    <TouchableOpacity onPress={()=>setDiseaseModal(true)} style={[styles.inputEnters]}>
                        <DefText text='기타질환을 직접 입력해주세요.' />
                    </TouchableOpacity>
                </Box>
            </ScrollView>
            <Box position={'absolute'} bottom={"30px"} right={"30px"}>
                <SaveButton onPress={diseaseSave} />
            </Box>

            <Modal isOpen={diseaseModal} onClose={() => setDiseaseModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='기타질환 직접 입력' style={{textAlign:'center', fontFamily:Font.NotoSansMedium}}/>
                        <Input
                            _focus='transparent'
                            height={45}
                            backgroundColor='#fff'
                            placeholder='기타질환을 직접 입력하세요.'
                            placeholderTextColor={'#a3a3a3'}
                            mt={3}
                            value={diseaseInput}
                            style={[{fontFamily:Font.NotoSansMedium}, diseaseInput.length > 0 && {backgroundColor:'#f1f1f1'}]}
                            borderRadius={10}
                            borderWidth={1}
                            borderColor='#f1f1f1'
                            onChangeText={diseaseChange}
                        />
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={diseaseInputSubmit}>
                                <DefText text='확인' style={styles.folderButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={()=>setDiseaseModal(false)}>
                                <DefText text='취소' style={styles.folderButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    disButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:10,
        marginTop:10
    },
    disText: {
        fontSize:14,
        color:'#000',
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold
    },
    medicineButtons : {
        backgroundColor:'#999',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height: 40,
    },
    medicineButtonsText: {
        fontSize:15,
        color:'#fff',
        
    },
    inputEnters:{
        height:35,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#70A86E',
        borderRadius:10,
        marginTop:20
    },
    folderAddButtons : {
        height:45,
        width:(width-80) *0.47,
        borderRadius:10,
        backgroundColor:'#090A73',
        alignItems:'center',
        justifyContent:'center'
    },
    folderButtonText: {
        fontSize:16,
        color:'#fff',
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
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
    })
)(MyDiseaseReport);