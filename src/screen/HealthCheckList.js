import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, CheckIcon, Input, Modal, Toast } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, Alert, ImageBackground } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import HeaderComponents from '../components/HeaderComponents';
import ToastMessage from '../components/ToastMessage';
import { StackActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import AsyncStorage from '@react-native-community/async-storage';
import Font from '../common/Font';

const {width} = Dimensions.get('window');
const hospitalButtonWidth = (width-40) * 0.23;

console.log('size',  width-40);

const HealthCheckList = (props) => {

    const {navigation, route, userInfo, member_info} = props;

    //console.log(member_info);

    const {params} = route;

    //console.log(params);

    const hospitalButtonWidth2 = (width-40) * 0.27;

    //console.log(params);

    const [checkList, setCheckList] = useState('1');

    useEffect(()=>{
        if(params.qaList1 != '1'){
            setCheckList('4');
        }

        if(params.checkListStatus != undefined){

            let selectCateSave = params.checkListStatus.pain.split('^'); //카테고리..
            let checkListSave = params.checkListStatus.part.split('^');

            setCheckList(params.checkListStatus.ctype);
            setSelectCategory(selectCateSave);
            setSelectCheckList(checkListSave);
            setTimesSelect(params.checkListStatus.duration);
            setCounselContent(params.checkListStatus.memo);
        }
    },[])

    const onCheckChange = (number) => {
        setCheckList(number);
    }

    const [selectCategory, setSelectCategory] = useState([]);
    const [selectDiseaseName, setSelectDiseaseName] = useState([]);


    const categorySelectBtn = (idx) => {
        
        let status = selectCategory.includes(idx);

        if(!status){
            selectCategory.push(idx);
         
        }else{

            const findIdx = selectCategory.find((e) => e === idx); // 배열에 같은값이 있으면 출력
            const idxs = selectCategory.indexOf(findIdx);
            selectCategory.splice(idxs, 1)


          
        }

        setSelectCategory([...selectCategory]);
        
        //console.log('후',selectCategory);
    }


    useEffect(()=>{
        console.log(selectCategory);
    }, [selectCategory])

    //아픈곳 선택이미지
    const [imageNumbers, setImageNumbers] = useState('1');

    //지속시간 선택
    const times = ['6시간 이내', '6~24시간 이내', '1~4일 내내', '1주일 내내', '1주일 이상', '기억이 나질 않는다.'];

    const [timesSelect, setTimesSelect] = useState('');

    const timesSelectButton = (times) => {

        if(timesSelect == times){
            setTimesSelect('');
        }else{
            setTimesSelect(times);
        }
    }

    const timeButtons = times.map((times, idx)=> {
        return(
            <TouchableOpacity onPress={()=>timesSelectButton(times)} key={idx} style={[{padding:5, paddingHorizontal:10, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:10, marginRight:10, justifyContent:'center', alignItems:'center'}, timesSelect == times && {backgroundColor:'#696969'} ]}>
                <DefText text={times} style={[{fontSize:14, fontFamily:Font.NotoSansMedium, fontFamily:Font.NotoSansBold}, timesSelect == times && {color:'#fff'} ]} />
            </TouchableOpacity>
        )
    });

    useEffect(()=>{
        console.log('시간선택:::', timesSelect);
    }, [timesSelect])


    //상담요청
    const counselCategory = ['조기진료', '시력저하', '1주일 내내', '일상에 지장을 줄만큼 불편함', '눈부심'];

    const [counselSelect, setCounselSelect] = useState('');

    const counselContentChange = (text) => {
        setCounselContent(text);
    }

    const counselSelectButton = (category) => {

        if(counselSelect == category){
            setCounselSelect('');
        }else{
            setCounselSelect(category);
        }
       
    }

    const [counselContent, setCounselContent] = useState('');

    const counselCategoryBtn = counselCategory.map((counsel, idx)=>{
        return(
            <TouchableOpacity onPress={()=>counselSelectButton(counsel)} key={idx} style={[{padding:10, paddingHorizontal:20, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:15, marginRight:10, justifyContent:'center', alignItems:'center'}, counselSelect == counsel && {backgroundColor:'#666'} ]}>
                <DefText text={counsel} style={[{fontSize:14, fontWeight:'bold'}, counselSelect == counsel && {color:'#fff'} ]} />
            </TouchableOpacity>
        )
    })


    //상담요청시 모달창
    const [counselModals, setCounselModals] = useState(false);

    const [loadings, setLoadings] = useState(0);

    


    const [selectCheckList, setSelectCheckList] = useState([]);

    const checkListAdd = (checkList) => {
        
        let statusCheck = selectCheckList.includes(checkList);

        if(!statusCheck){
            selectCheckList.push(checkList);
        }else{
            const findIdx = selectCheckList.find((e) => e === checkList); // 배열에 같은값이 있으면 출력
            const idxs = selectCheckList.indexOf(findIdx);

            selectCheckList.splice(idxs, 1)
        }
        
        setSelectCheckList([...selectCheckList])
        console.log(selectCheckList);
    }

 

    //console.log(loadings);
    const [ageInfo, setAgeInfo] = useState('');
    const [ageDisease, setAgeDisease] = useState('');


   // console.log(userInfo)

   const [hospitalCode, setHospitalCode] = useState()
    

   //임시저장하기
    const SaveButton = () => {

        let painList = selectCategory.join('^');

        let partList = selectCheckList.join('^');


         Api.send('checklist_insert', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'ctype':params.qaList1, 'pain':painList, 'part':partList, 'duration':timesSelect, 'memo':counselContent, 'status':''}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('임시저장하기: ', resultItem);
                ToastMessage(resultItem.message);
                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
  
    }

    //상담요청
    const navigationMove = () => {

        let painList = selectCategory.join('^');

        let partList = selectCheckList.join('^');

    
            Api.send('checklist_insert', {'id':userInfo.id,  'token':userInfo.appToken, 'hcode':userInfo.m_hcode, 'ctype':params.qaList1, 'pain':painList, 'part':partList, 'duration':timesSelect, 'memo':counselContent, 'status':'Y'}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('임시저장하기: ', resultItem);
                //ToastMessage(resultItem.message);

                ToastMessage(resultItem.message);
                navigation.navigate('Tab_Navigation', {
                    screen: 'Home',
                    
                });

                //setReserveList(arrItems)
            }else{
                //console.log('결과 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }


    useEffect(()=>{
        console.log(hospitalCode);
    }, [hospitalCode])

    const AgeStatus = () => {
        Api.send('disease_pain', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                
                
                console.log('연령별 질환정보::::::',arrItems);
                setAgeInfo(arrItems.age)
                setAgeDisease(arrItems.painList);

            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
    }


   
    


    useEffect(()=>{

        //CheckListSend();
        AgeStatus();
    }, [])



   

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='체크리스트' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                        <Box width={ (width-80) * 0.67 + 'px'}>
                            <DefText text='건강 체크리스트를 기록해주세요.' style={{fontSize:16, fontWeight:Font.NotoSansBold, fontWeight:'bold'}} />
                            <DefText text='체크리스트는 정확한 자문에 도움이 됩니다.' style={{fontSize:14, }} />
                        </Box>
                        <Image source={require('../images/checklistIconsNew.png')} style={{width:72, height:84, resizeMode:'contain'}} alt='체크이미지' />
                    </HStack>
                    <Box mt={5}>
                        {/* <DefText text='식습관 통계' style={[styles.reportLabel, {marginBottom:10}]} /> */}
                        <HStack justifyContent='space-between'>
                            <Box style={{marginTop:-5, marginLeft:-5}}>
                                {
                                    checkList == 1 ?
                                    <ImageBackground
                                        source={require('../images/blackShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/chkIconW01.png')} style={{width:37, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='증상'/>
                                        <DefText text='증상' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                    
                                    :
                                    <ImageBackground
                                        source={require('../images/grayShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/chkIconB01.png')} style={{width:37, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='증상'/>
                                        <DefText text='증상' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#696969', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                }
                            </Box>

                            <Box style={{marginTop:-5, marginLeft:-5}}>
                                {
                                    checkList == 2 ?
                                    <ImageBackground
                                        source={require('../images/blackShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/chkIconW02.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='신체부위'/>
                                        <DefText text='신체부위' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                    
                                    :
                                    <ImageBackground
                                        source={require('../images/grayShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/chkIconB02.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='신체부위'/>
                                        <DefText text='신체부위' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#696969', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                }
                            </Box>

                            <Box style={{marginTop:-5, marginLeft:-5}}>
                                {
                                    checkList == 3 ?
                                    <ImageBackground
                                        source={require('../images/blackShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/chkIconW03.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='지속시간'/>
                                        <DefText text='지속시간' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                    
                                    :
                                    <ImageBackground
                                        source={require('../images/grayShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/chkIconB03.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='지속시간'/>
                                        <DefText text='지속시간' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#696969', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                }
                            </Box>

                            <Box style={{marginTop:-5, marginLeft:-5}}>
                                {
                                    checkList == 4 ?
                                    <ImageBackground
                                        source={require('../images/blackShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/chkIconW04.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='상담요청'/>
                                        <DefText text='상담요청' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#fff', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                    
                                    :
                                    <ImageBackground
                                        source={require('../images/grayShadowBox.png')}
                                        style={{width:hospitalButtonWidth2, height:hospitalButtonWidth2, resizeMode:'contain', alignItems:'center', justifyContent:'center'}}
                                    >
                                        
                                        <Image source={require('../images/chkIconB04.png')} style={{width:43, height:43, resizeMode:'contain', marginLeft:-5, marginTop:-3}} alt='상담요청'/>
                                        <DefText text='상담요청' style={{fontSize:13, fontFamily:Font.NotoSansMedium, color:'#696969', marginLeft:-5, marginTop:5}} />
                                    </ImageBackground>
                                }
                            </Box>

                        </HStack>
                        {
                            checkList == '1' &&
                            <Box mt={2.5}>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <DefText text='증상을 선택해주세요.' style={{fontWeight:'bold', fontFamily:Font.NotoSansBold}} />
                                    <DefText text='중복체크 가능합니다.' style={{fontSize:13, color:'#696969', marginTop:5}} />
                                </Box>
                                <Box mt={5}>
                                    <HStack alignItems='center'>
                                        <DefText text='연령대 별 다빈도 질환' style={[styles.reportLabel]} />
                                        <DefText text={'만'+ageInfo+'세 기준'} style={{color:'#000', marginLeft:10, fontWeight:'bold', fontFamily:Font.NotoSansBold}} />
                                    </HStack>
                                    <HStack flexWrap='wrap'>
                                        {
                                            ageDisease != '' ?
                                            ageDisease.map((item, index)=>{
                                                return (
                                                    <TouchableOpacity key={index} onPress={()=>{categorySelectBtn(item)}}  style={[{padding:10, paddingVertical:5, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:15, marginRight:10}, selectCategory.includes(item) == true && {backgroundColor:'#696969'}]}>
                                                        <DefText text={item} style={[{fontSize:14, fontFamily:Font.NotoSansMedium}, selectCategory.includes(item) == true && {color:'#fff'}]} />
                                                    </TouchableOpacity>
                                                )
                                            })
                                            :
                                            <Box justifyContent={'center'} py={'50px'} alignItems='center' width='100%'>
                                                <DefText text='등록된 연령대 별 질환이 없습니다.' style={{fontSize:14, color:'#696969'}} />
                                            </Box>
                                        }

                                    </HStack>
                                </Box>
                                
                            </Box>
                        }
                        {
                            checkList == '2' &&
                            <Box mt={2.5}>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <DefText text='불편한 부위가 있다면 체크해주세요.' style={{fontWeight:'bold', fontFamily:Font.NotoSansBold}} />
                                    <DefText text='불편부위가 없으면 다음단계로 이동해주세요.' style={{fontSize:14, color:'#696969', marginTop:5}} />
                                </Box>
                                
                                {
                                    imageNumbers == '1' &&
                                    /*단계1*/
                                    <>
                                    <Box alignItems='center' pt='15px'>
                                        <Image source={require('../images/personAllFronts.png')} alt='전체 보여지기' style={{width:width-40, resizeMode:'contain'}} />
                                        <Box  position='absolute' top={0} left={0} width={width-40} height={380} resizeMode='contain'>
                                            {/*머리*/}
                                            <Box width={width-40}  position='absolute' top='20px' left={0} alignItems='center'>
                                                <TouchableOpacity onPress={()=>{setImageNumbers('headFront')}} >
                                                    <Image source={require('../images/checkListSelector.png')} alt='머리' />
                                                </TouchableOpacity>
                                            </Box>

                                            {/*팔*/}
                                            <Box width={width-40}  position='absolute' top='85px' left={0} alignItems='center' >
                                                <HStack justifyContent='space-around' width={width-80}>
                                                    <TouchableOpacity onPress={()=>{setImageNumbers('arms')}}>
                                                        <Image source={require('../images/checkListSelector.png')} alt='팔' />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={()=>{setImageNumbers('armsLeft')}}>
                                                        <Image source={require('../images/checkListSelector.png')} alt='팔' />
                                                    </TouchableOpacity>
                                                </HStack>  
                                            </Box>

                                            {/*몸통*/}
                                            <Box width={width-40}  position='absolute' top='140px' left={0} alignItems='center' >
                                                <TouchableOpacity onPress={()=>setImageNumbers('bodyFront')}>
                                                    <Image source={require('../images/checkListSelector.png')} alt='배' />
                                                </TouchableOpacity>
                                            </Box>

                                            {/*다리*/}
                                            <Box width={width-40}  position='absolute' top='250px' left={0} alignItems='center' >
                                                <HStack width='85px' justifyContent='space-between'>
                                                    <TouchableOpacity onPress={()=>{setImageNumbers('legs')}}>
                                                        <Image source={require('../images/checkListSelector.png')} alt='다리' />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={()=>{setImageNumbers('legsLeft')}}>
                                                        <Image source={require('../images/checkListSelector.png')} alt='다리' />
                                                    </TouchableOpacity>
                                                </HStack>  
                                            </Box>

                                            <Box position='absolute' top='125px' left={0} px={2.5} py='5px' backgroundColor='#f1f1f1' borderRadius={10}>
                                                <DefText text='오른쪽' style={{fontSize:14,color:'#000', fontWeight:'bold', fontFamily:Font.NotoSansBold}} />
                                            </Box>
                                        </Box>
                                        <Box position='absolute' bottom={0} left={0} width={width-40} justifyContent='center' alignItems='center'>
                                            <TouchableOpacity onPress={()=>{setImageNumbers('2')}}>
                                                <Image source={require('../images/replaceButton.png')} alt='뒤로 돌리기' />
                                            </TouchableOpacity>
                                        </Box>
                                        
                                    </Box>
                                    {/* <HStack justifyContent={'space-between'} mt={5}>
                                       
                                        <TouchableOpacity style={[styles.buttonDef,{width:(width-40)*0.48}]} onPress={()=>onCheckChange('1')}>
                                            <DefText text='이전' style={styles.buttonDefText} />
                                        </TouchableOpacity>
                                
                                    
                                        <TouchableOpacity style={[styles.buttonDef, {width:(width-40)*0.48}]} onPress={()=>onCheckChange('3')}>
                                            <DefText text='다음' style={styles.buttonDefText} />
                                        </TouchableOpacity>
                                      
                                    </HStack> */}
                                   
                                    </>
                                }
                                {
                                    imageNumbers == '2' &&
                                    /*단계1 뒷면*/
                                    <Box alignItems='center' pt='15px'>
                                        <Image source={require('../images/personAllBacks.png')} alt='전체 보여지기 뒤' style={{width:width-40, resizeMode:'contain'}} />
                                        <Box  position='absolute' top={0} left={0} width={width-40} height={456} >
                                            {/*머리*/}
                                            <Box width={width-40}  position='absolute' top='20px' left={0} alignItems='center'>
                                                <TouchableOpacity onPress={()=>{setImageNumbers('headBack')}}>
                                                    <Image source={require('../images/checkListSelector.png')} alt='머리' />
                                                </TouchableOpacity>
                                            </Box>

                                            {/*팔*/}
                                            {/* <Box width={width-40}  position='absolute' top='85px' left={0} alignItems='center' >
                                                <HStack justifyContent='space-around' width={width-80}>
                                                    <TouchableOpacity>
                                                        <Image source={require('../images/checkListSelector.png')} alt='팔' />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Image source={require('../images/checkListSelector.png')} alt='팔' />
                                                    </TouchableOpacity>
                                                </HStack>  
                                            </Box> */}

                                            {/* 몸통*/}
                                            <Box width={width-40}  position='absolute' top='140px' left={0} alignItems='center' >
                                                <TouchableOpacity onPress={()=>setImageNumbers('bodyBack')}>
                                                    <Image source={require('../images/checkListSelector.png')} alt='배' />
                                                </TouchableOpacity>
                                            </Box>

                                            {/*무릎*/}
                                            {/* <Box width={width-40}  position='absolute' top='250px' left={0} alignItems='center' >
                                                <HStack width='85px' justifyContent='space-between'>
                                                    <TouchableOpacity>
                                                        <Image source={require('../images/checkListSelector.png')} alt='무릎' />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Image source={require('../images/checkListSelector.png')} alt='무릎' />
                                                    </TouchableOpacity>
                                                </HStack>  
                                            </Box> */}

                                            <Box position='absolute' top='125px' right={0} px={2.5} py='5px' backgroundColor='#f1f1f1' borderRadius={5}>
                                                <DefText text='오른쪽' style={{fontSize:14,color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </Box>
                                        <Box position='absolute' bottom={0} left={0} width={width-40} justifyContent='center' alignItems='center'>
                                            <TouchableOpacity onPress={()=>{setImageNumbers('1')}}>
                                                <Image source={require('../images/replaceButton.png')} alt='뒤로 돌리기' />
                                            </TouchableOpacity>
                                        </Box>

                                       
                                    </Box>
                                }

                                {
                                    imageNumbers == 'headFront' &&
                                    <>
                                    <Box alignItems='center' pt='45px' >
                                        <Image source={require('../images/frontHead.png')} alt='헤드 앞' style={{width:width-40, height:(width-40) / 0.96, resizeMode:'contain'}} />
                                       
                                        <Box  position='absolute' top={45} left={0} width={width-40} height={(width-40) / 0.96} alignItems='center' >
                                            <Box width={180} height='100%'>
                                                {/*머리*/}
                                                <Box position='absolute' top='45px' width={180} alignItems='center'>
                                                    <HStack>
                                                        <TouchableOpacity onPress={()=>checkListAdd('FH1')} style={[styles.checkIcons, {marginRight:40}, selectCheckList.includes('FH1') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('FH1') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={()=>checkListAdd('FH2')} style={[styles.checkIcons, selectCheckList.includes('FH2') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('FH2') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                    </HStack>
                                                    
                                                </Box>
                                                {/**눈 */}
                                                <Box position='absolute' top='110px' width={180} >
                                                    <HStack justifyContent='space-between'>
                                                        <TouchableOpacity onPress={()=>checkListAdd('FH3')} style={[styles.checkIcons, selectCheckList.includes('FH3') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('FH3') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={()=>checkListAdd('FH4')} style={[styles.checkIcons, selectCheckList.includes('FH4') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('FH4') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                    </HStack>          
                                                </Box>
                                                 {/* 귀, 코 */}
                                                 <Box position='absolute' top='170px' width={180} alignItems='center'>
                                                    <HStack >
                                                        <TouchableOpacity onPress={()=>checkListAdd('FH5')} style={[styles.checkIcons, {marginRight:40}, selectCheckList.includes('FH5') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('FH5') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                        
                                                        <TouchableOpacity onPress={()=>checkListAdd('FH6')} style={[styles.checkIcons, {marginRight:-5}, selectCheckList.includes('FH6') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('FH6') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                    </HStack>          
                                                </Box>
                                                {/*입*/}
                                                <Box position='absolute' top='250px' width={180} alignItems='center'>
                                                    <HStack >
                                                        <TouchableOpacity onPress={()=>checkListAdd('FH7')} style={[styles.checkIcons, {marginRight:40}, selectCheckList.includes('FH7') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('FH7') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                        
                                                        <TouchableOpacity onPress={()=>checkListAdd('FH8')} style={[styles.checkIcons, {marginRight:-5}, selectCheckList.includes('FH8') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('FH8') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                    </HStack>     
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box position='absolute' top='15px' left={0} zIndex={99}>
                                            <TouchableOpacity onPress={()=>{setImageNumbers('1')}}>
                                                <Image source={require('../images/allSelectMove.png')} alt='왼쪽 전체보기' />
                                            </TouchableOpacity>
                                        </Box>
                                    </Box>
                                     <HStack justifyContent='flex-end' mt={5}>
                                        <Box py='5px' px={2.5} borderRadius={20} backgroundColor='#696968'>
                                            <DefText text='중복선택가능' style={{fontSize:14,color:'#fff'}} />
                                        </Box>
                                    </HStack>
                                    <Box mt={5}>
                                        <TouchableOpacity style={[styles.buttonDef]} onPress={()=>{setImageNumbers('1')}}>
                                            <DefText text='확인' style={styles.buttonDefText} />
                                        </TouchableOpacity>
                                    </Box>
                                    </>
                                }

                                {
                                    imageNumbers == 'headBack' &&
                                    <>
                                    <Box alignItems='center' pt='45px'>
                                        <Image source={require('../images/backHead.png')} alt='헤드 뒤' style={{width:width-40, height:(width-40) / 0.96, resizeMode:'contain'}} />
                                       
                                        <Box  position='absolute' top={45} left={0} width={width-40} height={(width-40) / 0.96} alignItems='center' >
                                            <Box width={180} height='100%'>
                                                {/*머리*/}
                                                <Box position='absolute' top='90px' width={180} alignItems='center'>
                                                    <HStack justifyContent='space-between'>
                                                        <TouchableOpacity onPress={()=>checkListAdd('BH1')} style={[styles.checkIcons, {marginRight:40}, selectCheckList.includes('BH1') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('BH1') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={()=>checkListAdd('BH2')} style={[styles.checkIcons, selectCheckList.includes('BH2') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('BH2') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                        
                                                    </HStack>
                                                </Box>
                                               
                                                 {/* 얼굴 뒤 중앙 */}
                                                 <Box position='absolute' top='150px' width={180} alignItems='center'>
                                                    <HStack >
                                                        <TouchableOpacity onPress={()=>checkListAdd('BH3')} style={[styles.checkIcons, {marginRight:40}, selectCheckList.includes('BH3') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('BH3') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                        
                                                        <TouchableOpacity onPress={()=>checkListAdd('BH4')} style={[styles.checkIcons, {marginRight:0}, selectCheckList.includes('BH4') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('BH4') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                    </HStack>          
                                                </Box>
                                                {/* 얼굴 뒤 아래*/}
                                                <Box position='absolute' top='230px' width={180} alignItems='center'>
                                                    <HStack >
                                                        <TouchableOpacity onPress={()=>checkListAdd('BH5')} style={[styles.checkIcons, {marginRight:40}, selectCheckList.includes('BH5') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('BH5') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                        
                                                        <TouchableOpacity onPress={()=>checkListAdd('BH6')} style={[styles.checkIcons, {marginRight:0}, selectCheckList.includes('BH6') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('BH6') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                    </HStack>          
                                                </Box>

                                                <Box position='absolute' top='280px' width={180} alignItems='center'>
                                                    <HStack >
                                                        <TouchableOpacity onPress={()=>checkListAdd('BH7')} style={[styles.checkIcons, {marginRight:40}, selectCheckList.includes('BH7') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('BH7') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                        
                                                        <TouchableOpacity onPress={()=>checkListAdd('BH8')} style={[styles.checkIcons, {marginRight:0}, selectCheckList.includes('BH8') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('BH8') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                    </HStack>          
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box position='absolute' top='15px' left={0}>
                                            <TouchableOpacity onPress={()=>{setImageNumbers('2')}}>
                                                <Image source={require('../images/allSelectMove.png')} alt='왼쪽 전체보기' />
                                            </TouchableOpacity>
                                        </Box>
                                        
                                    </Box>
                                     <HStack justifyContent='flex-end' mt={5}>
                                        <Box py='5px' px={2.5} borderRadius={20} backgroundColor='#696968'>
                                            <DefText text='중복선택가능' style={{fontSize:14,color:'#fff'}} />
                                        </Box>
                                    </HStack>
                                    <Box mt={5}>
                                        <TouchableOpacity style={[styles.buttonDef]} onPress={()=>{setImageNumbers('2')}}>
                                            <DefText text='확인' style={styles.buttonDefText} />
                                        </TouchableOpacity>
                                    </Box>
                                    </>
                                }


                                {
                                    imageNumbers == 'bodyFront' &&
                                    <>
                                        <Box alignItems='center' pt='20px'>
                                            <Image source={require('../images/bodyFront.png')} alt='몸 앞' style={{width:width-40, height:(width-40) / 0.96, resizeMode:'contain'}} />
                                            <Box position='absolute' top='20px' left={0} width={width-40} height={(width-40) / 0.96} alignItems='center' >
                                                <Box width={167} height='100%' position='absolute'>
                                                    {/* 가슴부분 */}
                                                    <Box width={167} position='absolute' top='5px' alignItems='center'>
                                                        <HStack>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB1')} style={[styles.checkIcons, {marginRight:15},selectCheckList.includes('FB1') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB1') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                          
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB2')} style={[styles.checkIcons, selectCheckList.includes('FB2') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB2') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    {/* 복부위 */}
                                                    <Box width={167}  position='absolute' top='80px'>
                                                        <HStack justifyContent='space-around'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB3')} style={[styles.checkIcons, selectCheckList.includes('FB3') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB3') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB4')} style={[styles.checkIcons, selectCheckList.includes('FB4') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB4') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB5')} style={[styles.checkIcons, selectCheckList.includes('FB5') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB5') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    

                                                    {/* 복부아래 */}
                                                    <Box width={167} position='absolute' top='140px'>
                                                        <HStack justifyContent='space-around'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB6')} style={[styles.checkIcons, selectCheckList.includes('FB6') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB6') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB7')} style={[styles.checkIcons, selectCheckList.includes('FB7') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB7') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB8')} style={[styles.checkIcons, selectCheckList.includes('FB8') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB8') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    <Box width={167} position='absolute' top='220px'>
                                                        <HStack justifyContent='space-around'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB9')} style={[styles.checkIcons, selectCheckList.includes('FB9') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB9') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB10')} style={[styles.checkIcons, selectCheckList.includes('FB10') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB10') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB11')} style={[styles.checkIcons, selectCheckList.includes('FB11') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB11') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>
                                                    <Box width={167} position='absolute' top='280px'>
                                                        <HStack justifyContent='space-around'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB12')} style={[styles.checkIcons, selectCheckList.includes('FB12') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB12') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB13')} style={[styles.checkIcons, selectCheckList.includes('FB13') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB13') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB14')} style={[styles.checkIcons, selectCheckList.includes('FB14') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB14') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>
                                                    <Box width={167} position='absolute' top='340px'>
                                                        <HStack justifyContent='space-around'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB15')} style={[styles.checkIcons, selectCheckList.includes('FB15') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB15') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            
                                                            <TouchableOpacity onPress={()=>checkListAdd('FB16')} style={[styles.checkIcons, selectCheckList.includes('FB16') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('FB16') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box position='absolute' top='15px' left={0}>
                                                <TouchableOpacity onPress={()=>{setImageNumbers('1')}}>
                                                    <Image source={require('../images/allSelectMove.png')} alt='왼쪽 전체보기' />
                                                </TouchableOpacity>
                                            </Box>
                                            <Box position='absolute' top='125px' left={0} px={2.5} py='5px' backgroundColor='#f1f1f1' borderRadius={5}>
                                                <DefText text='오른쪽' style={{fontSize:14,color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </Box>
                                        <HStack justifyContent='flex-end' mt={2.5}>
                                            <Box py='5px' px={2.5} borderRadius={20} backgroundColor='#696968'>
                                                <DefText text='중복선택가능' style={{fontSize:14,color:'#fff'}} />
                                            </Box>
                                        </HStack>
                                        <Box mt={5}>
                                            <TouchableOpacity style={[styles.buttonDef]} onPress={()=>{setImageNumbers('1')}}>
                                                <DefText text='확인' style={styles.buttonDefText} />
                                            </TouchableOpacity>
                                        </Box>
                                    </>
                                }

                                {
                                    imageNumbers == 'bodyBack' &&
                                    <>
                                        <Box alignItems='center'  pt='20px'>
                                            <Image source={require('../images/bodyBack.png')} alt='몸 앞' style={{width:width-40, height:(width-40) / 0.96, resizeMode:'contain'}} />
                                            <Box position='absolute' top='20px' left={0} width={width-40} height={(width-40) / 0.96} alignItems='center'  >
                                                <Box width={180} height='100%'  position='absolute'  >
                                                    {/* 몸 뒤 목 */}
                                                     <Box width={180}  alignItems='center'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB1')}  style={[styles.checkIcons,  selectCheckList.includes('BB1') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB1') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            
                                                        </HStack>
                                                    </Box>

                                                    {/* 몸 뒤 어깨 */}
                                                    <Box width={180} alignItems='center'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB2')} style={[styles.checkIcons, {marginRight:90}, selectCheckList.includes('BB2') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB2') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB3')} style={[styles.checkIcons, selectCheckList.includes('BB3') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB3') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    {/* 몸 뒤 등 */}
                                                    <Box width={180} alignItems='center' position='absolute' top='90px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB4')}  style={[styles.checkIcons, {marginRight:70}, selectCheckList.includes('BB4') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB4') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB5')}  style={[styles.checkIcons, selectCheckList.includes('BB5') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB5') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    {/* 몸 뒤 허리위 */}
                                                    <Box width={180} alignItems='center' position='absolute' top='140px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB6')} style={[styles.checkIcons, selectCheckList.includes('BB6') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB6') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    <Box width={180} alignItems='center' position='absolute' top='190px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB7')}  style={[styles.checkIcons, {marginRight:70}, selectCheckList.includes('BB7') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB7') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB8')}  style={[styles.checkIcons, selectCheckList.includes('BB8') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB8') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                
                                                    
                                                    {/* 몸 뒤 엉덩이 */}
                                                    <Box width={180} alignItems='center' position='absolute' top='290px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB9')} style={[styles.checkIcons, {marginRight:30}, selectCheckList.includes('BB9') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB9') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB10')} style={[styles.checkIcons,{marginRight:30}, selectCheckList.includes('BB10') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB10') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('BB11')} style={[styles.checkIcons, selectCheckList.includes('BB11') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('BB11') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box position='absolute' top='15px' left={0}>
                                                <TouchableOpacity onPress={()=>{setImageNumbers('2')}}>
                                                    <Image source={require('../images/allSelectMove.png')} alt='왼쪽 전체보기' />
                                                </TouchableOpacity>
                                            </Box>
                                            <Box position='absolute' top='160px' right={0} px={2.5} py='5px' backgroundColor='#f1f1f1' borderRadius={5}>
                                                <DefText text='오른쪽' style={{fontSize:14,color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </Box>
                                        <HStack justifyContent='flex-end' mt={2.5}>
                                            <Box py='5px' px={2.5} borderRadius={20} backgroundColor='#696968'>
                                                <DefText text='중복선택가능' style={{fontSize:14,color:'#fff'}} />
                                            </Box>
                                        </HStack>
                                        <Box mt={5}>
                                            <TouchableOpacity style={[styles.buttonDef]} onPress={()=>{setImageNumbers('2')}}>
                                                <DefText text='확인' style={styles.buttonDefText} />
                                            </TouchableOpacity>
                                        </Box>
                                    </>
                                }

                                {
                                    imageNumbers == 'legs' &&
                                    <>
                                        <Box alignItems='center'  pt='20px'>
                                            
                                            <Image source={require('../images/legRight.png')} alt='몸 앞' style={{width:width-40, height:(width-40) / 0.96, resizeMode:'contain'}} />
                                            <Box position='absolute' top='20px' left={0} width={width-40} height={(width-40) / 0.96} alignItems='center'  >
                                                <Box width='150px' height='100%'  position='absolute' >
                                                    {/* 허벅지 */}
                                                    <Box width={'150px'}  alignItems='center' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('RL1')} style={[styles.checkIcons, selectCheckList.includes('RL1') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('RL1') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'150px'}  alignItems='center' position='absolute' top='120px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('RL2')} style={[styles.checkIcons, {marginLeft:-15}, selectCheckList.includes('RL2') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('RL2') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'150px'}  alignItems='center' position='absolute' top='280px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('RL3')} style={[styles.checkIcons, {marginLeft:-15}, selectCheckList.includes('RL3') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('RL3') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'150px'}  alignItems='center' position='absolute' bottom='10px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('RL4')} style={[styles.checkIcons, {marginLeft:-15}, selectCheckList.includes('RL4') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('RL4') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>
                                                </Box>   
                                            </Box>
                                            <Box position='absolute' top='15px' left={0}>
                                                <TouchableOpacity onPress={()=>{setImageNumbers('1')}}>
                                                    <Image source={require('../images/allSelectMove.png')} alt='왼쪽 전체보기' />
                                                </TouchableOpacity>
                                            </Box>
                                            <Box position='absolute' top='160px' right={0} px={2.5} py='5px' backgroundColor='#f1f1f1' borderRadius={5}>
                                                <DefText text='왼쪽' style={{fontSize:14,color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </Box>
                                        <HStack justifyContent='flex-end' mt={2.5}>
                                            <Box py='5px' px={2.5} borderRadius={20} backgroundColor='#696968'>
                                                <DefText text='중복선택가능' style={{fontSize:14,color:'#fff'}} />
                                            </Box>
                                        </HStack>
                                        <Box mt={5}>
                                            <TouchableOpacity style={[styles.buttonDef]} onPress={()=>{setImageNumbers('1')}}>
                                                <DefText text='확인' style={styles.buttonDefText} />
                                            </TouchableOpacity>
                                        </Box>
                                    </>
                                }

                                {
                                    imageNumbers == 'legsLeft' &&
                                    <>
                                        <Box alignItems='center'  pt='20px'>
                                            
                                            <Image source={require('../images/legLeft.png')} alt='몸 앞' style={{width:width-40, height:(width-40) / 0.96, resizeMode:'contain'}} />
                                            <Box position='absolute' top='20px' left={0} width={width-40} height={(width-40) / 0.96} alignItems='center'  >
                                                <Box width='150px' height='100%'  position='absolute' >
                                                    {/* 허벅지 */}
                                                    <Box width={'150px'}  alignItems='center' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('LL1')} style={[styles.checkIcons, selectCheckList.includes('LL1') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('LL1') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'150px'}  alignItems='center' position='absolute' top='120px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('LL2')} style={[styles.checkIcons, {marginRight:-15}, selectCheckList.includes('LL2') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('LL2') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'150px'}  alignItems='center' position='absolute' top='280px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('LL3')} style={[styles.checkIcons, {marginRight:-15}, selectCheckList.includes('LL3') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('LL3') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'150px'}  alignItems='center' position='absolute' bottom='10px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('LL4')} style={[styles.checkIcons, {marginRight:-15}, selectCheckList.includes('LL4') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('LL4') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>
                                                </Box>   
                                            </Box>
                                            <Box position='absolute' top='15px' left={0}>
                                                <TouchableOpacity onPress={()=>{setImageNumbers('1')}}>
                                                    <Image source={require('../images/allSelectMove.png')} alt='왼쪽 전체보기' />
                                                </TouchableOpacity>
                                            </Box>
                                            <Box position='absolute' top='160px' right={0} px={2.5} py='5px' backgroundColor='#f1f1f1' borderRadius={5}>
                                                <DefText text='오른쪽' style={{fontSize:14,color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </Box>
                                        <HStack justifyContent='flex-end' mt={2.5}>
                                            <Box py='5px' px={2.5} borderRadius={20} backgroundColor='#696968'>
                                                <DefText text='중복선택가능' style={{fontSize:14,color:'#fff'}} />
                                            </Box>
                                        </HStack>
                                        <Box mt={5}>
                                            <TouchableOpacity style={[styles.buttonDef]} onPress={()=>{setImageNumbers('1')}}>
                                                <DefText text='확인' style={styles.buttonDefText} />
                                            </TouchableOpacity>
                                        </Box>
                                    </>
                                }

                                {
                                    imageNumbers == 'arms' &&
                                    <>
                                        <Box alignItems='center'  pt='20px'>
                                            
                                            <Image source={require('../images/armsRight.png')} alt='몸 앞' style={{width:width-40, height:(width-40) / 0.96, resizeMode:'contain'}} />
                                            <Box position='absolute' top='20px' left={0} width={width-40} height={(width-40) / 0.96} alignItems='center'  >
                                                <Box width='200px' height='100%'  position='absolute'>
                                                    {/* 허벅지 */}
                                                    <Box width={'100%'} alignItems='flex-end' position='absolute' right='20px' top='10px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('RA1')} style={[styles.checkIcons, selectCheckList.includes('RA1') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('RA1') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'100%'} alignItems='center' position='absolute' top='130px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('RA2')} style={[styles.checkIcons, selectCheckList.includes('RA2') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('RA2') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'100%'} position='absolute' left='60px' top='220px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('RA3')} style={[styles.checkIcons, selectCheckList.includes('RA3') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('RA3') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'100%'} position='absolute' left='10px' bottom='20px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('RA4')} style={[styles.checkIcons, selectCheckList.includes('RA4') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('RA4') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                   
                                                </Box>   
                                            </Box>
                                            <Box position='absolute' top='15px' left={0}>
                                                <TouchableOpacity onPress={()=>{setImageNumbers('1')}}>
                                                    <Image source={require('../images/allSelectMove.png')} alt='왼쪽 전체보기' />
                                                </TouchableOpacity>
                                            </Box>
                                            <Box position='absolute' top='160px' right={0} px={2.5} py='5px' backgroundColor='#f1f1f1' borderRadius={5}>
                                                <DefText text='왼쪽' style={{fontSize:14,color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </Box>
                                        <HStack justifyContent='flex-end' mt={2.5}>
                                            <Box py='5px' px={2.5} borderRadius={20} backgroundColor='#696968'>
                                                <DefText text='중복선택가능' style={{fontSize:14,color:'#fff'}} />
                                            </Box>
                                        </HStack>
                                        <Box mt={5}>
                                            <TouchableOpacity style={[styles.buttonDef]} onPress={()=>{setImageNumbers('1')}}>
                                                <DefText text='확인' style={styles.buttonDefText} />
                                            </TouchableOpacity>
                                        </Box>
                                    </>
                                }

                                {
                                    imageNumbers == 'armsLeft' &&
                                    <>
                                        <Box alignItems='center'  pt='20px'>
                                            
                                            <Image source={require('../images/armsLeft.png')} alt='몸 앞' style={{width:width-40, height:(width-40) / 0.96, resizeMode:'contain'}} />
                                            <Box position='absolute' top='20px' left={0} width={width-40} height={(width-40) / 0.96} alignItems='center'  >
                                                <Box width='200px' height='100%'  position='absolute'>
                                                    {/* 허벅지 */}
                                                    <Box width={'100%'} alignItems='flex-start' position='absolute' left='20px' top='10px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('LA1')} style={[styles.checkIcons, selectCheckList.includes('LA1') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('LA1') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'100%'} alignItems='center' position='absolute' top='130px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('LA2')} style={[styles.checkIcons, {marginLeft:-40},selectCheckList.includes('LA2') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('LA2') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'100%'} position='absolute' left='100px' top='220px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('LA3')} style={[styles.checkIcons, selectCheckList.includes('LA3') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('LA3') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    <Box width={'100%'} position='absolute' alignItems='flex-end' right='20px' bottom='20px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('LA4')} style={[styles.checkIcons, selectCheckList.includes('LA4') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('LA4') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                   
                                                </Box>   
                                            </Box>
                                            <Box position='absolute' top='15px' right={0}>
                                                <TouchableOpacity onPress={()=>{setImageNumbers('1')}}>
                                                    <Image source={require('../images/allSelectMove.png')} alt='왼쪽 전체보기' />
                                                </TouchableOpacity>
                                            </Box>
                                            <Box position='absolute' top='160px' right={0} px={2.5} py='5px' backgroundColor='#f1f1f1' borderRadius={5}>
                                                <DefText text='왼쪽' style={{fontSize:14,color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </Box>
                                        <HStack justifyContent='flex-end' mt={2.5}>
                                            <Box py='5px' px={2.5} borderRadius={20} backgroundColor='#696968'>
                                                <DefText text='중복선택가능' style={{fontSize:14,color:'#fff'}} />
                                            </Box>
                                        </HStack>
                                        <Box mt={5}>
                                            <TouchableOpacity style={[styles.buttonDef]} onPress={()=>{setImageNumbers('1')}}>
                                                <DefText text='확인' style={styles.buttonDefText} />
                                            </TouchableOpacity>
                                        </Box>
                                    </>
                                }
                               
                            </Box>
                        }

                        {
                            checkList === '3' &&
                            <Box mt={2.5}>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <DefText text='불편함이 지속된 시간이 어느정도 되셨나요?' style={{fontWeight:'bold', fontFamily:Font.NotoSansBold}} />
                                    <DefText text='일상 생활하기에 불편한 정도를 체크해주세요.' style={{fontSize:14, color:'#696969', marginTop:5}} />
                                </Box>
                                <HStack flexWrap='wrap' mt={2.5}>
                                    {timeButtons}
                                </HStack>

                                {/* <HStack justifyContent={'space-between'} mt={5}>
                                       
                                    <TouchableOpacity style={[styles.buttonDef,{width:(width-40)*0.48}]} onPress={()=>onCheckChange('2')}>
                                        <DefText text='이전' style={styles.buttonDefText} />
                                    </TouchableOpacity>
                            
                                
                                    <TouchableOpacity style={[styles.buttonDef, {width:(width-40)*0.48}]} onPress={()=>onCheckChange('4')}>
                                        <DefText text='다음' style={styles.buttonDefText} />
                                    </TouchableOpacity>
                                    
                                </HStack> */}
                            </Box>
                        }

                        {
                            checkList === '4' &&
                            <Box mt={2.5}>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <DefText text='상담받으실 내용을 적어주세요.' style={{fontWeight:'bold'}} />
                                </Box>
                                {
                                    params.qaList1 == "1" &&
                                    <>
                                        <DefText text='주요증상' style={[styles.reportLabelSmall, {marginTop:10}]} />
                                        <HStack flexWrap='wrap'>
                                        {
                                            selectCategory && 
                                            selectCategory.map((item, index)=>{
                                                return(
                                                    <Box key={index} style={[{padding:10, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:15, marginRight:10}]}>
                                                        <DefText text={item} style={[{fontSize:14, fontWeight:'bold'}]} />
                                                    </Box>
                                                )
                                            })
                                        }
                                        </HStack>
                                    </>
                                }
                                {
                                    params.qaList1 == "2" &&
                                    <HStack>
                                        <Box  style={[{padding:10, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:15, marginRight:10}]}>
                                            <DefText text='재진료' style={[{fontSize:14, fontWeight:'bold'}]} />
                                        </Box>
                                    </HStack>
                                }
                                {
                                    params.qaList1 == "3" &&
                                    <HStack>
                                        <Box style={[{padding:10, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:15, marginRight:10}]}>
                                            <DefText text='건강상식' style={[{fontSize:14, fontWeight:'bold'}]} />
                                        </Box>
                                    </HStack>
                                }
                                {
                                    params.qaList1 == "4" &&
                                    <HStack>
                                        <Box  style={[{padding:10, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:15, marginRight:10}]}>
                                            <DefText text='기타문의' style={[{fontSize:14, fontWeight:'bold'}]} />
                                        </Box>
                                    </HStack>
                                }
                               
                                
                                    <Input
                                        placeholder='자문받고 싶은 내용을 입력하세요'
                                        placeholderTextColor={'#a3a3a3'}
                                        height='100px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        borderColor='#f1f1f1'
                                        //onSubmitEditing={schButtons}
                                        value={counselContent}
                                        onChangeText={counselContentChange}
                                        style={[{marginTop:10, fontSize:14, fontWeight:'500', fontFamily:Font.NotoSansMedium}, counselContent.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                                        multiline={true}
                                        textAlignVertical='top'
                                        _focus={'transparent'}
                                    />
                            
                                 {/* <Box mt={5}>
                                    <HStack justifyContent='space-between'>
                                        {
                                            params.qaList1 == 1 &&
                                            <TouchableOpacity style={[styles.buttonDef,{width:(width-40)*0.28}]} onPress={()=>onCheckChange('3')}>
                                                <DefText text='이전' style={styles.buttonDefText} />
                                            </TouchableOpacity>
                                        }
                                       
                                        <TouchableOpacity onPress={SaveButton} style={[styles.buttonDef, {width: params.qaList1 == 1 ? width*0.28 : width*0.43}]}>
                                            <DefText text='임시저장하기' style={styles.buttonDefText} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={navigationMove}  style={[styles.buttonDef, {width:params.qaList1 == 1 ? width*0.28 : width*0.43}]}>
                                            <DefText text='상담요청하기' style={styles.buttonDefText} />
                                        </TouchableOpacity>
                                    </HStack>
                                    
                                </Box> */}
                            </Box>
                        }
                       
                    </Box>
                    
                </Box>
            </ScrollView>
            {
                checkList == '1' &&
                <Box px={5} py={2.5}>
                    <TouchableOpacity style={[styles.buttonDef]} onPress={()=>onCheckChange('2')}>
                        <DefText text='다음' style={styles.buttonDefText} />
                    </TouchableOpacity>
                </Box>
            }
            {
                checkList == '2' &&
                <HStack justifyContent={'space-between'}  py={2.5} px={5}>
                                       
                    <TouchableOpacity style={[styles.buttonDef,{width:(width-40)*0.48}]} onPress={()=>onCheckChange('1')}>
                        <DefText text='이전' style={styles.buttonDefText} />
                    </TouchableOpacity>
            
                
                    <TouchableOpacity style={[styles.buttonDef, {width:(width-40)*0.48}]} onPress={()=>onCheckChange('3')}>
                        <DefText text='다음' style={styles.buttonDefText} />
                    </TouchableOpacity>
                    
                </HStack>
            }
            {
                checkList == '3' &&
                <HStack justifyContent={'space-between'} py={2.5} px={5}>
                                       
                    <TouchableOpacity style={[styles.buttonDef,{width:(width-40)*0.48}]} onPress={()=>onCheckChange('2')}>
                        <DefText text='이전' style={styles.buttonDefText} />
                    </TouchableOpacity>
            
                
                    <TouchableOpacity style={[styles.buttonDef, {width:(width-40)*0.48}]} onPress={()=>onCheckChange('4')}>
                        <DefText text='다음' style={styles.buttonDefText} />
                    </TouchableOpacity>
                    
                </HStack>
            }
            {
                checkList == '4' &&
                <Box px={5} py={2.5}>
                    <HStack justifyContent='space-between'>
                        {
                            params.qaList1 == 1 &&
                            <TouchableOpacity style={[styles.buttonDef,{width:(width-40)*0.48}]} onPress={()=>onCheckChange('3')}>
                                <DefText text='이전' style={styles.buttonDefText} />
                            </TouchableOpacity>
                        }
                        
                        {/* <TouchableOpacity onPress={SaveButton} style={[styles.buttonDef, {width: params.qaList1 == 1 ? width*0.28 : width*0.43}]}>
                            <DefText text='임시저장하기' style={styles.buttonDefText} />
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={navigationMove}  style={[styles.buttonDef, {width:params.qaList1 == 1 ? (width-40)*0.48 : width-40}]}>
                            <DefText text='상담요청하기' style={styles.buttonDefText} />
                        </TouchableOpacity>
                    </HStack>
                    
                </Box>
            }
        
            {/* <Modal isOpen={checkListSaveModal} backgroundColor='rgba(255,255,255,0.7)' onClose={()=>setCheckListSaveModal(false)}>
                <Modal.Content maxWidth={width-40} backgroundColor='#fff'>
                    <Modal.Body>
                        <DefText text='임시저장된 체크리스트가 존재합니다.' />
                        <DefText text='불러올까요?' />
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity onPress={saveCheckListReceive} style={{width:(width-80) * 0.47, height:35, backgroundColor:'#f1f1f1', justifyContent:'center', alignItems:'center', borderRadius:5}}>
                                <DefText text='예' />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={CheckListSaveEmpty} style={{width:(width-80) * 0.47, height:35, backgroundColor:'#f1f1f1', justifyContent:'center', alignItems:'center', borderRadius:5}}>
                                <DefText text='아니오' />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal> */}
            {/* <Modal isOpen={counselModals} backgroundColor='rgba(255,255,255,0.7)' onClose={()=>setCounselModals(false)}>
                <Modal.Content maxWidth={width-40} backgroundColor='#ccc'>
                    <Modal.Body alignItems='center'>
                        <TouchableOpacity onPress={()=>Submits()}>
                        <Image source={require('../images/loadingIcons.png')} alt='체크리스트' style={{width:86, height:86, resizeMode:'contain'}} />
                        </TouchableOpacity>
                        <Box width={width-80} backgroundColor='#fff' height='25px' mt={5}>
                            <Box height='25px' width={loadingIng+'%'} backgroundColor='#666'>
                            </Box>
                        </Box>
                        <DefText text='체크리스트 전송중' style={{fontSize:15,marginTop:10}} />
                    </Modal.Body>
                </Modal.Content>
            </Modal> */}
        </Box>
    );
};

const styles = StyleSheet.create({
    reportLabel : {
        color:'#696969',
        fontWeight:'bold',
        fontFamily:Font.NotoSansBold
    },
    reportLabelSmall : {
        fontSize:14,
        color:'#696969',
        fontFamily:Font.NotoSansMedium
    },
    buttonDef:{
        height:45,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#090A73',
        borderRadius:10
    },
    buttonDefText:{
        color:'#fff',
        fontFamily:Font.NotoSansMedium,
        fontWeight:'500'
    },

    checkIcons : {
        width:29,
        height: 29,
        backgroundColor:'#F1F1F1',
        borderRadius:29,
        alignItems:'center',
        justifyContent:'center'
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
  )(HealthCheckList);