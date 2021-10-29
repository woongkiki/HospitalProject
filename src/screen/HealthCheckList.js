import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, CheckIcon, Input, Modal, Toast } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, Alert } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import HeaderComponents from '../components/HeaderComponents';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');
const hospitalButtonWidth = (width-40) * 0.23;

const HealthCheckList = (props) => {

    const {navigation} = props;

    //console.log(props);

    const [checkList, setCheckList] = useState('1');

    const onCheckChange = (number) => {
        setCheckList(number);
    }

    const [selectCategory, setSelectCategory] = useState([]);

    const HealthCategory = ['발열', '기침', '오한', '가래', '구토', '복통', '목안 따가움', '어지러움', '메스꺼움', '식욕부진', '호흡곤란', '체중감소', '답답함', '변비', '혈변', '설사', '두드러기', '재채기', '기타'];

    const healthCategoryButton = HealthCategory.map((item, index)=> {

        
        return(
            <TouchableOpacity key={index} onPress={()=>{categorySelectBtn(item)}} style={[{padding:10, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:15, marginRight:10}, selectCategory.includes(item) == true && {backgroundColor:'#666'} ]}>
                <DefText text={item} style={[{fontSize:14, fontWeight:'bold'}, selectCategory.includes(item) == true && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

    const categorySelectBtn = (category) => {
        
        let status = selectCategory.includes(category);

        if(!status){
            selectCategory.push(category);

        }else{

            const findIdx = selectCategory.find((e) => e === category); // 배열에 같은값이 있으면 출력
            const idxs = selectCategory.indexOf(findIdx);

            selectCategory.splice(idxs, 1)

        }

        setSelectCategory([...selectCategory]);
        
        //console.log('후',selectCategory);
    }

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
            <TouchableOpacity onPress={()=>timesSelectButton(times)} key={idx} style={[{padding:10, paddingHorizontal:20, backgroundColor:'#f1f1f1', marginTop:10, borderRadius:15, marginRight:10, justifyContent:'center', alignItems:'center'}, timesSelect == times && {backgroundColor:'#666'} ]}>
                <DefText text={times} style={[{fontSize:14, fontWeight:'bold'}, timesSelect == times && {color:'#fff'} ]} />
            </TouchableOpacity>
        )
    });


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

    const navigationMove = () => {
        ToastMessage('상담이 요청되었습니다. 담당 병원이 확인시 채팅이 시작됩니다.');
        navigation.navigate('Tab_Navigation', {
            screen: 'Home',
            
        });
    }


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

    // useEffect(()=>{
        
    //     setTimeout(() => {
    //         loadingGo();
    //     }, 200);

    // },[counselModals])

  
    // setTimeout(() => {
    //     loadingGo();
    // }, 300);

    //console.log(loadings);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='체크리스트' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='115px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box width={ (width-80) * 0.6 + 'px'}>
                            <DefText text='건강 체크리스트를 기록해주세요.' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='체크리스트는 정확한 자문에 도움이 됩니다.' style={{fontSize:14, marginTop:10 }} />
                        </Box>
                        <Image source={require('../images/checkListIcons.png')} alt='체크이미지' />
                    </HStack>
                    <Box mt={5}>
                        <DefText text='식습관 통계' style={[styles.reportLabel, {marginBottom:10}]} />
                        <HStack justifyContent='space-between'>
                            <TouchableOpacity
                                onPress={()=>onCheckChange('1')}
                                style={[{
                                        backgroundColor:'#D2D2D2',
                                        width:hospitalButtonWidth,
                                        height:hospitalButtonWidth,
                                        borderRadius:10,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    },
                                    checkList == '1' && {backgroundColor:'#696968'}
                                ]}
                                
                            >
                                <Box alignItems='center'>
                                    <Image
                                        source={require('../images/healthReportIcon1.png')}
                                        alt='증상'
                                        style={{width:40}}
                                        resizeMode='contain'
                                    />
                                    <DefText text='증상' style={{ fontSize:13, color:'#fff'}} />
                                </Box>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>onCheckChange('2')}
                                style={[{
                                        backgroundColor:'#D2D2D2',
                                        width:hospitalButtonWidth,
                                        height:hospitalButtonWidth,
                                        borderRadius:10,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    },
                                    checkList == '2' && {backgroundColor:'#696968'}
                                ]}
                                
                            >
                                <Box alignItems='center'>
                                    <Image
                                        source={require('../images/healthReportIcon2.png')}
                                        alt='신체부위'
                                        style={{width:40}}
                                        resizeMode='contain'
                                    />
                                    <DefText text='신체부위' style={{ fontSize:13, color:'#fff'}} />
                                </Box>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={()=>onCheckChange('3')}
                                style={[{
                                        backgroundColor:'#D2D2D2',
                                        width:hospitalButtonWidth,
                                        height:hospitalButtonWidth,
                                        borderRadius:10,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    },
                                    checkList == '3' && {backgroundColor:'#696968'}
                                ]}
                                
                            >
                                <Box alignItems='center'>
                                    <Image
                                        source={require('../images/healthReportIcon4.png')}
                                        alt='지속시간'
                                        style={{width:40}}
                                        resizeMode='contain'
                                    />
                                    <DefText text='지속시간' style={{ fontSize:13, color:'#fff'}} />
                                </Box>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>onCheckChange('4')}
                                style={[{
                                        backgroundColor:'#D2D2D2',
                                        width:hospitalButtonWidth,
                                        height:hospitalButtonWidth,
                                        borderRadius:10,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    },
                                    checkList == '4' && {backgroundColor:'#696968'}
                                ]}
                                
                            >
                                <Box alignItems='center'>
                                    <Image
                                        source={require('../images/counselIcons.png')}
                                        alt='상담요청'
                                        style={{width:40}}
                                        resizeMode='contain'
                                    />
                                    <DefText text='상담요청' style={{ fontSize:13, color:'#fff'}} />
                                </Box>
                            </TouchableOpacity>
                        </HStack>
                        {
                            checkList == '1' &&
                            <Box mt={5}>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <DefText text='증상에 관해 체크해주세요.' style={{fontWeight:'bold'}} />
                                    <DefText text='중복체크 가능합니다.' style={{fontSize:13, color:'#666', marginTop:5}} />
                                </Box>
                                <Box mt={5}>
                                    <HStack alignItems='flex-end'>
                                        <DefText text='연령대 별 다빈도 질환' style={[styles.reportLabel]} />
                                        <DefText text='만5세 기준' style={{fontSize:13,color:'#999', marginLeft:10}} />
                                    </HStack>
                                    <HStack flexWrap='wrap'>
                                        {healthCategoryButton}
                                    </HStack>
                                </Box>
                                <Box mt={5}>
                                    <TouchableOpacity style={[styles.buttonDef]} onPress={()=>onCheckChange('2')}>
                                        <DefText text='다음' style={styles.buttonDefText} />
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                        }
                        {
                            checkList == '2' &&
                            <Box mt={5}>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <DefText text='불편한 부위가 있다면 체크해주세요.' style={{fontWeight:'bold'}} />
                                    <DefText text='불편부위가 없으면 다음단계로 이동해주세요.' style={{fontSize:13, color:'#666', marginTop:5}} />
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
                                                    <TouchableOpacity>
                                                        <Image source={require('../images/checkListSelector.png')} alt='팔' />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
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
                                                    <TouchableOpacity onPress={()=>{setImageNumbers('legs')}}>
                                                        <Image source={require('../images/checkListSelector.png')} alt='다리' />
                                                    </TouchableOpacity>
                                                </HStack>  
                                            </Box>

                                            <Box position='absolute' top='125px' left={0} px={2.5} py='5px' backgroundColor='#f1f1f1' borderRadius={5}>
                                                <DefText text='오른쪽' style={{fontSize:14,color:'#333', fontWeight:'bold'}} />
                                            </Box>
                                        </Box>
                                        <Box position='absolute' bottom={0} left={0} width={width-40} justifyContent='center' alignItems='center'>
                                            <TouchableOpacity onPress={()=>{setImageNumbers('2')}}>
                                                <Image source={require('../images/replaceButton.png')} alt='뒤로 돌리기' />
                                            </TouchableOpacity>
                                        </Box>
                                        
                                    </Box>
                                    <Box mt={5}>
                                        <TouchableOpacity style={[styles.buttonDef]} onPress={()=>onCheckChange('3')}>
                                            <DefText text='다음' style={styles.buttonDefText} />
                                        </TouchableOpacity>
                                    </Box>
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
                                            <Box width={width-40}  position='absolute' top='85px' left={0} alignItems='center' >
                                                <HStack justifyContent='space-around' width={width-80}>
                                                    <TouchableOpacity>
                                                        <Image source={require('../images/checkListSelector.png')} alt='팔' />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Image source={require('../images/checkListSelector.png')} alt='팔' />
                                                    </TouchableOpacity>
                                                </HStack>  
                                            </Box>

                                            {/* 몸통*/}
                                            <Box width={width-40}  position='absolute' top='140px' left={0} alignItems='center' >
                                                <TouchableOpacity onPress={()=>setImageNumbers('bodyBack')}>
                                                    <Image source={require('../images/checkListSelector.png')} alt='배' />
                                                </TouchableOpacity>
                                            </Box>

                                            {/*무릎*/}
                                            <Box width={width-40}  position='absolute' top='250px' left={0} alignItems='center' >
                                                <HStack width='85px' justifyContent='space-between'>
                                                    <TouchableOpacity>
                                                        <Image source={require('../images/checkListSelector.png')} alt='무릎' />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Image source={require('../images/checkListSelector.png')} alt='무릎' />
                                                    </TouchableOpacity>
                                                </HStack>  
                                            </Box>

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
                                    <Box alignItems='center' pt='45px'>
                                        <Image source={require('../images/headFronts.png')} alt='헤드 앞' style={{width:width-40, resizeMode:'contain'}} />
                                       
                                        <Box  position='absolute' top={45} left={0} width={width-40} height={330} alignItems='center' >
                                            <Box width={180} height={180}>
                                                {/*머리*/}
                                                <Box position='absolute' top='-5px' width={180} alignItems='center'>
                                                    <TouchableOpacity onPress={()=>checkListAdd('앞부분 머리')} style={[styles.checkIcons, selectCheckList.includes('앞부분 머리') && {backgroundColor:'#f00'}]}>
                                                        <CheckIcon width={15} color={ selectCheckList.includes('앞부분 머리') ? '#fff' : '#696968'} />
                                                    </TouchableOpacity>
                                                </Box>
                                                {/**눈 */}
                                                <Box position='absolute' top='45px' width={180} alignItems='center'>
                                                    <HStack>
                                                        <TouchableOpacity onPress={()=>checkListAdd('오른쪽눈')} style={[styles.checkIcons, {marginRight:40}, selectCheckList.includes('오른쪽눈') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('오른쪽눈') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={()=>checkListAdd('왼쪽눈')} style={[styles.checkIcons, selectCheckList.includes('왼쪽눈') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('왼쪽눈') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                    </HStack>          
                                                </Box>
                                                 {/* 귀, 코 */}
                                                 <Box position='absolute' top='90px' width={180} >
                                                    <HStack justifyContent='space-between'>
                                                        <TouchableOpacity onPress={()=>checkListAdd('오른쪽귀')} style={[styles.checkIcons, {marginLeft:-5}, selectCheckList.includes('오른쪽귀') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('오른쪽귀') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={()=>checkListAdd('코')} style={[styles.checkIcons, selectCheckList.includes('코') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('코') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={()=>checkListAdd('왼쪽귀')} style={[styles.checkIcons, {marginRight:-5}, selectCheckList.includes('왼쪽귀') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('왼쪽귀') ? '#fff' : '#696968'} />
                                                        </TouchableOpacity>
                                                    </HStack>          
                                                </Box>
                                                {/*입*/}
                                                <Box position='absolute' bottom='5px' width={180} alignItems='center'>
                                                    <TouchableOpacity onPress={()=>checkListAdd('입')} style={[styles.checkIcons, selectCheckList.includes('입') && {backgroundColor:'#f00'}]}>
                                                        <CheckIcon width={15} color={ selectCheckList.includes('입') ? '#fff' : '#696968'} />
                                                    </TouchableOpacity>
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
                                    </>
                                }

                                {
                                    imageNumbers == 'headBack' &&
                                    <>
                                    <Box alignItems='center' pt='45px'>
                                        <Image source={require('../images/headBacks.png')} alt='헤드 뒤' />
                                       
                                        <Box  position='absolute' top={45} left={0} width={width-40} height={330} alignItems='center' >
                                            <Box width={180} height={180}>
                                                {/*머리*/}
                                                <Box position='absolute' top='-5px' width={180} alignItems='center'>
                                                    <TouchableOpacity onPress={()=>checkListAdd('뒷부분 머리')} style={[styles.checkIcons, selectCheckList.includes('뒷부분 머리') && {backgroundColor:'#f00'}]}>
                                                        <CheckIcon width={15} color={ selectCheckList.includes('뒷부분 머리') ? '#fff' : '#696968'} />
                                                    </TouchableOpacity>
                                                </Box>
                                               
                                                 {/* 얼굴 뒤 중앙 */}
                                                 <Box position='absolute' top='70px' width={180} >
                                                    <HStack justifyContent='space-between'>
                                                        <TouchableOpacity onPress={()=>checkListAdd('뒷부분 오른쪽 귀')} style={[styles.checkIcons, {marginLeft:0}, selectCheckList.includes('뒷부분 오른쪽 귀') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('뒷부분 오른쪽 귀') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={()=>checkListAdd('뒷부분 머리 중앙')} style={[styles.checkIcons, selectCheckList.includes('뒷부분 머리 중앙') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('뒷부분 머리 중앙') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={()=>checkListAdd('뒷부분 왼쪽 귀')} style={[styles.checkIcons, {marginRight:0}, selectCheckList.includes('뒷부분 왼쪽 귀') && {backgroundColor:'#f00'}]}>
                                                            <CheckIcon width={15} color={ selectCheckList.includes('뒷부분 왼쪽 귀') ? '#fff' : '#696968'}  />
                                                        </TouchableOpacity>
                                                    </HStack>          
                                                </Box>
                                                {/* 얼굴 뒤 아래*/}
                                                <Box position='absolute' bottom='20px' width={180} alignItems='center'>
                                                    <TouchableOpacity onPress={()=>checkListAdd('뒷부분 머리 아래')}  style={[styles.checkIcons, selectCheckList.includes('뒷부분 머리 아래') && {backgroundColor:'#f00'}]}>
                                                        <CheckIcon width={15} color={ selectCheckList.includes('뒷부분 머리 아래') ? '#fff' : '#696968'} />
                                                    </TouchableOpacity>
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
                                    </>
                                }


                                {
                                    imageNumbers == 'bodyFront' &&
                                    <>
                                        <Box alignItems='center' pt='20px'>
                                            <Image source={require('../images/checkBodyFront.png')} alt='몸 앞' />
                                            <Box position='absolute' top='20px' left={0} width={width-40} height={375} alignItems='center' >
                                                <Box width={167} height={230}  position='absolute' bottom={2.5}>
                                                    {/* 가슴부분 */}
                                                    <Box width={167} mt='40px'>
                                                        <HStack justifyContent='space-around'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('오른쪽 가슴')} style={[styles.checkIcons, selectCheckList.includes('오른쪽 가슴') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('오른쪽 가슴') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('가슴 중앙')} style={[styles.checkIcons, selectCheckList.includes('가슴 중앙') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('가슴 중앙') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('왼쪽 가슴')} style={[styles.checkIcons, selectCheckList.includes('왼쪽 가슴') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('왼쪽 가슴') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    {/* 복부위 */}
                                                    <Box width={167} mt='40px'>
                                                        <HStack justifyContent='space-around'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('오른쪽 배위')} style={[styles.checkIcons, selectCheckList.includes('오른쪽 배위') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('오른쪽 배위') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('배 중앙')} style={[styles.checkIcons, selectCheckList.includes('배 중앙') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('배 중앙') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('왼쪽 배위')} style={[styles.checkIcons, selectCheckList.includes('왼쪽 배위') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('왼쪽 배위') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    {/* 복부아래 */}
                                                    <Box width={167} mt='40px'>
                                                        <HStack justifyContent='space-around'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('오른쪽 배 아래')} style={[styles.checkIcons, selectCheckList.includes('오른쪽 배 아래') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('오른쪽 배 아래') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('배 중앙 아래')} style={[styles.checkIcons, selectCheckList.includes('배 중앙 아래') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('배 중앙 아래') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('왼쪽 배 아래')} style={[styles.checkIcons, selectCheckList.includes('왼쪽 배 아래') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('왼쪽 배 아래') ? '#fff' : '#696968'} />
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
                                    </>
                                }

                                {
                                    imageNumbers == 'bodyBack' &&
                                    <>
                                        <Box alignItems='center'  pt='20px'>
                                            <Image source={require('../images/checkBodyBack.png')} alt='몸 뒤' width={width-40} />
                                            <Box position='absolute' top='20px' left={0} width={width-40} height={375} alignItems='center'  >
                                                <Box width={180} height={375}  position='absolute' bottom={0} >
                                                    {/* 몸 뒤 목 */}
                                                     <Box width={180} mt='20px' alignItems='center'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('오른쪽 뒷 목')}  style={[styles.checkIcons, {marginRight:15}, selectCheckList.includes('오른쪽 뒷 목') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('오른쪽 뒷 목') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('왼쪽 뒷 목')} style={[styles.checkIcons, selectCheckList.includes('왼쪽 뒷 목') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('왼쪽 뒷 목') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    {/* 몸 뒤 어깨 */}
                                                    <Box width={180} alignItems='center'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('오른쪽 뒷 어깨')} style={[styles.checkIcons, {marginRight:90}, selectCheckList.includes('오른쪽 뒷 어깨') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('오른쪽 뒷 어깨') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('왼쪽 뒷 어깨')} style={[styles.checkIcons, selectCheckList.includes('왼쪽 뒷 어깨') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('왼쪽 뒷 어깨') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    {/* 몸 뒤 등 */}
                                                    <Box width={180} alignItems='center' mt='40px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('오른쪽 등')}  style={[styles.checkIcons, {marginRight:90}, selectCheckList.includes('오른쪽 등') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('오른쪽 등') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('왼쪽 등')}  style={[styles.checkIcons, selectCheckList.includes('왼쪽 등') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('왼쪽 등') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    {/* 몸 뒤 허리위 */}
                                                    <Box width={180} alignItems='center' mt='40px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('허리 위')} style={[styles.checkIcons, selectCheckList.includes('허리 위') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('허리 위') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>

                                                    {/* 몸 뒤 허리아래 */}
                                                    <Box width={180}  alignItems='center' mt='10px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('허리 아래')} style={[styles.checkIcons, selectCheckList.includes('허리 아래') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('허리 아래') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>
                                                    
                                                    {/* 몸 뒤 엉덩이 */}
                                                    <Box width={180} alignItems='center' mt='30px'>
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('오른쪽 엉덩이')} style={[styles.checkIcons, {marginRight:30}, selectCheckList.includes('오른쪽 엉덩이') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('오른쪽 엉덩이') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('엉덩이 중앙')} style={[styles.checkIcons,{marginRight:30}, selectCheckList.includes('엉덩이 중앙') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('엉덩이 중앙') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={()=>checkListAdd('왼쪽 엉덩이')} style={[styles.checkIcons, selectCheckList.includes('왼쪽 엉덩이') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('왼쪽 엉덩이') ? '#fff' : '#696968'} />
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
                                    </>
                                }

                                {
                                    imageNumbers == 'legs' &&
                                    <>
                                        <Box alignItems='center'  pt='20px'>
                                            <Image source={require('../images/legSelect.png')} alt='몸 뒤' width={width-40} />
                                            <Box position='absolute' top='20px' left={0} width={width-40} height={387} alignItems='center'  >
                                                <Box width='150px' height={387}  position='absolute' bottom={0}>
                                                    {/* 허벅지 */}
                                                    <Box width={'150px'} mt='5px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('허벅지')} style={[styles.checkIcons, {marginLeft:30}, selectCheckList.includes('허벅지') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('허벅지') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    {/* 무릎 */}
                                                    <Box width={'150px'} mt='40px' >
                                                        <HStack >
                                                            <TouchableOpacity onPress={()=>checkListAdd('앞 무릎')} style={[styles.checkIcons, {marginLeft:20}, selectCheckList.includes('앞 무릎') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('앞 무릎') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                            <TouchableOpacity onPress={()=>checkListAdd('뒷 무릎')} style={[styles.checkIcons, {marginLeft:30, marginTop:7}, selectCheckList.includes('뒷 무릎') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('뒷 무릎') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                        </HStack>
                                                    </Box>

                                                    {/* 정강이 */}
                                                    <Box width={'150px'} mt='75px' >
                                                        <HStack justifyContent='center'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('정강이')} style={[styles.checkIcons, selectCheckList.includes('정강이') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('정강이') ? '#fff' : '#696968'} />
                                                            </TouchableOpacity> 
                                                            
                                                        </HStack>
                                                    </Box>

                                                    {/* 아킬레스건 */}
                                                    <Box width={'150px'} mt='80px' >
                                                        <HStack justifyContent='center'>
                                                            <TouchableOpacity onPress={()=>checkListAdd('아킬레스건')} style={[styles.checkIcons, selectCheckList.includes('아킬레스건') && {backgroundColor:'#f00'}]}>
                                                                <CheckIcon width={15} color={ selectCheckList.includes('아킬레스건') ? '#fff' : '#696968'} />
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
                                    </>
                                }
                               
                            </Box>
                        }

                        {
                            checkList === '3' &&
                            <Box mt={5}>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <DefText text='불편함이 지속된 시간이 어느정도 되셨나요?' style={{fontWeight:'bold'}} />
                                    <DefText text='일상 생활하기에 불편한 정도를 체크해주세요.' style={{fontSize:13, color:'#666', marginTop:5}} />
                                </Box>
                                <HStack flexWrap='wrap' mt={2.5}>
                                    {timeButtons}
                                </HStack>
                                <Box mt={5}>
                                    <TouchableOpacity style={[styles.buttonDef]} onPress={()=>onCheckChange('4')}>
                                        <DefText text='다음' style={styles.buttonDefText} />
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                        }

                        {
                            checkList === '4' &&
                            <Box mt={5}>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10}>
                                    <DefText text='상담받으실 내용을 적어주세요.' style={{fontWeight:'bold'}} />
                                </Box>
                                <HStack flexWrap='wrap' mt={2.5}>
                                    {counselCategoryBtn}
                                </HStack>
                                <Box p={2.5} backgroundColor='#f1f1f1' borderRadius={10} mt='12px'>
                                    <Input
                                        placeholder='자문받고 싶은 내용을 입력하세요'
                                        height='100px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={0}
                                        //onSubmitEditing={schButtons}
                                        value={counselContent}
                                        onChangeText={counselContentChange}
                                        style={{fontSize:14}}
                                        multiline={true}
                                        textAlignVertical='top'
                                    />
                                </Box>
                                 <Box mt={5}>
                                    <TouchableOpacity onPress={navigationMove}  style={[styles.buttonDef]}>
                                        <DefText text='상담요청하기' style={styles.buttonDefText} />
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                        }
                       
                    </Box>
                    
                </Box>
            </ScrollView>
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
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportLabelSmall : {
        fontSize:13,
        color:'#666'
    },
    buttonDef:{
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#666',
        borderRadius:5
    },
    buttonDefText:{
        fontSize:14,
        color:'#fff'
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

export default HealthCheckList;