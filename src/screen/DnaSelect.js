import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack, VStack, Input, Modal } from 'native-base';
import { DefText, SaveButton } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import {dnaDataList, dnaReport} from '../Utils/DummyData';
import ToastMessage from '../components/ToastMessage';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import Font from '../common/Font';


const {width} = Dimensions.get('window');

const DnaSelect = (props) => {

    const {navigation, userInfo} = props;


    const [dnaDatas, setDnaDatas] = useState(dnaReport);


    const [dnaDataLists, setDnaDataLists] = useState('');

    const DnaDataReceive = () => {
        Api.send('member_familyDisease', {'id':userInfo.id, 'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 정보123: ', arrItems);

               setDnaDataLists(arrItems);
               

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        DnaDataReceive();
    }, [])


    const DnaAddButton = (i) => {
        let newDnaLists = [...dnaDataLists];
        let newDna = {...dnaDataLists[i]};

        //console.log('선택...',newDna.value);

        let arr = newDna.value.split(',');
        //console.log("arr:::::",arr);
        let str = "";

        //console.log(arr.includes('1'));

        let arrStatus = arr.includes('1');
        let arrStatusNull = arr.includes('');

        if(arrStatus){
            
            const findIdx = arr.find((e) => e === '1'); // 배열에 같은값이 있으면 출력
            const idxs = arr.indexOf(findIdx);

            arr.splice(idxs, 1)
            //arr.splice(index,1);
        }else{
           
            if(arrStatusNull){
                arr = [];
                arr.push('1');
            }else{
                arr.splice(0, 0, '1');
            }
        }

       // console.log("arr변화후::;", arr);
         str = arr.join(',');
         newDnaLists[i].value = str;
         console.log("str::::",newDnaLists);
         setDnaDataLists([...newDnaLists])
        // arr.map((e,index)=>{
            
        //     if(e == value){
        //         console.log("index",index);
        //         arr.splice(index,1);
        //     }
        // });
    }

    const DnaAddButtonDad = (i) => {
        let newDnaLists = [...dnaDataLists];
        let newDna = {...dnaDataLists[i]};

        //console.log('선택...',newDna.value);

        let arr = newDna.value.split(',');
        //console.log("arr:::::",arr);
        let str = "";

        //console.log(arr.includes('1'));

        let arrStatus = arr.includes('2');
        let arrStatusNull = arr.includes('');

        if(arrStatus){
            
            const findIdx = arr.find((e) => e === '2'); // 배열에 같은값이 있으면 출력
            const idxs = arr.indexOf(findIdx);

            arr.splice(idxs, 1)
            //arr.splice(index,1);
        }else{
           
            if(arrStatusNull){
                arr = [];
                arr.push('2');
            }else{
                arr.splice(1, 0, '2');
            }
        }

       // console.log("arr변화후::;", arr);
         str = arr.join(',');
         newDnaLists[i].value = str;
         console.log("str::::",newDnaLists);
         setDnaDataLists([...newDnaLists])
    }

    const DnaAddButtonMom = (i) => {
        let newDnaLists = [...dnaDataLists];
        let newDna = {...dnaDataLists[i]};

        //console.log('선택...',newDna.value);

        let arr = newDna.value.split(',');
        //console.log("arr:::::",arr);
        let str = "";

        //console.log(arr.includes('1'));

        let arrStatus = arr.includes('3');
        let arrStatusNull = arr.includes('');

        if(arrStatus){
            
            const findIdx = arr.find((e) => e === '3'); // 배열에 같은값이 있으면 출력
            const idxs = arr.indexOf(findIdx);

            arr.splice(idxs, 1)
            //arr.splice(index,1);
        }else{
           
            if(arrStatusNull){
                arr = [];
                arr.push('3');
            }else{
                arr.splice(2, 0, '3');
            }
        }

       // console.log("arr변화후::;", arr);
         str = arr.join(',');
         newDnaLists[i].value = str;
         console.log("str::::",newDnaLists);
         setDnaDataLists([...newDnaLists])
    }

    const DnaAddButtonBro = (i) => {
        let newDnaLists = [...dnaDataLists];
        let newDna = {...dnaDataLists[i]};

        //console.log('선택...',newDna.value);

        let arr = newDna.value.split(',');
        //console.log("arr:::::",arr);
        let str = "";

        //console.log(arr.includes('1'));

        let arrStatus = arr.includes('4');
        let arrStatusNull = arr.includes('');

        if(arrStatus){
            
            const findIdx = arr.find((e) => e === '4'); // 배열에 같은값이 있으면 출력
            const idxs = arr.indexOf(findIdx);

            arr.splice(idxs, 1)
            //arr.splice(index,1);
        }else{
           
            if(arrStatusNull){
                arr = [];
                arr.push('4');
            }else{
                arr.splice(3, 0, '4');
            }
        }

       // console.log("arr변화후::;", arr);
         str = arr.join(',');
         newDnaLists[i].value = str;
         console.log("str::::",newDnaLists);
         setDnaDataLists([...newDnaLists])
    }

    // const dnaParentButton = (disNames) => {

    //     const disNameInfo = disNames;
    //     disNames.diseaseParent =  0;
        
    //     console.log(disNameInfo);
    //     console.log(disNames.diseaseParent);


    const DnaInfoSave = () => {


        console.log(dnaDataLists.join('^'));
        let newArr = dnaDataLists;
        let tmpArr = [];
        newArr.map((e)=>{
            tmpArr.push(JSON.stringify(e));
        })
        
        Api.send('member_familyDiseaseSet', {'id':userInfo.id, 'token':userInfo.appToken, "disease":tmpArr.join('^')}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 정보123: ', arrItems);

               setDnaDataLists(arrItems);
               navigation.navigate('HealthReport');

            }else{
                console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
            //console.log(args);
        });
    }
    // }

    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='가족력질환' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='121px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                        <Box width={(width * 0.65) + 'px'}>
                            <DefText text='질환 중 가족력 여부를 체크해주세요.' style={{fontSize:16, fontWeight:'bold', fontFamily:Font.NotoSansBold}} />
                            <DefText text='건강은 가족력과 밀접한 관련이 있습니다.' style={{fontSize:14, marginTop:10}} />
                        </Box>
                        <Image source={require('../images/checkIcons.png')} alt='체크이미지' />
                    </HStack>
                    <Box mt={5} pb='80px'>
                        <DefText text='가족력 질환기록' style={styles.reportDataText} />
                        {
                            dnaDataLists != '' &&
                            dnaDataLists.map((item, index)=> {
                                return (
                                    <Box key={index} mt={2.5}>
                                        <HStack justifyContent='space-between' alignItems='center' px={2.5} pl={4} style={styles.dnaDisName}>
                                            <DefText text={item.key} style={styles.dnaTitle} />
                                            <HStack>
                                                <TouchableOpacity onPress={()=>DnaAddButton(index)} style={[styles.dnaSelectButton, {marginRight:5}, item.value.includes('1') && {backgroundColor:'#666'}]}>
                                                    <DefText text='조부모' style={[styles.dnaSelectButtonText]} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={()=>DnaAddButtonDad(index)} style={[styles.dnaSelectButton, {marginRight:5}, item.value.includes('2') && {backgroundColor:'#666'}]}>
                                                    <DefText text='부' style={[styles.dnaSelectButtonText]} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={()=>DnaAddButtonMom(index)} style={[styles.dnaSelectButton, {marginRight:5}, item.value.includes('3') && {backgroundColor:'#666'}]}>
                                                    <DefText text='모' style={[styles.dnaSelectButtonText]} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={()=>DnaAddButtonBro(index)} style={[styles.dnaSelectButton, item.value.includes('4') && {backgroundColor:'#666'}]}>
                                                    <DefText text='형제자매' style={[styles.dnaSelectButtonText]}  />
                                                </TouchableOpacity>
                                            </HStack>
                                        </HStack>
                                    </Box>
                                )
                            })
                        }
                    </Box>
                </Box>
            </ScrollView>
            <Box position={'absolute'} bottom={"30px"} right={"30px"}>
                <SaveButton onPress={DnaInfoSave} />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportDataText: {
        fontSize:16,
        color:'#696969',
        fontFamily:Font.NotoSansMedium,
    },
    dnaDisName:{
        height:40,
        backgroundColor:'#f1f1f1',
        borderRadius:10
    },
    dnaTitle:{
        fontSize:14,
        color:'#000',
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold
    },
    dnaSelectButton:{
        height:30,
        backgroundColor:'#a3a3a3',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        paddingHorizontal:10
    },
    dnaSelectButtonText: {
        fontSize:14,
        color:'#fff',
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
});

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
    })
)(DnaSelect);