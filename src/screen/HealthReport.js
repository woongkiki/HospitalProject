import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Box, Image, HStack, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { NoticeData, medicineDatas, dnaReport } from '../Utils/DummyData';

const {width} = Dimensions.get('window');
const hospitalButtonWidth = (width-40) * 0.23;

const HealthReport = ( props ) => {

    const {navigation} = props;

    //console.log(props);

    const [buttonIdx, setButtonIdx] = useState(1);

    const reportButton = (idx) => {
        setButtonIdx(idx);
    }

    const [disLoading, setDisLoading] = useState(true);
    const [diseaseDatas, setDiseaseDatas] = useState(['노년백내장', '치질 및 치핵', '담석증','1년전에 교통사고로 오른쪽 다리를 다쳤음']);

    const disDataDelete = (idx) => {
        if(diseaseDatas.includes(idx)){
             const findIdx = diseaseDatas.find((e) => e === idx); // 배열에 같은값이 있으면 출력
             const idxs = diseaseDatas.indexOf(findIdx);
            
             //console.log('1',diseaseDatas);
             diseaseDatas.splice(idxs, 1)
             //const disNew = diseaseDatas.splice(idxs, 1);
             setDiseaseDatas([...diseaseDatas]);
             //console.log('2',diseaseDatas);
        }
    }


    const disData = diseaseDatas.map((item, index)=>{
        return(
            <Box key={index} px={2.5} py={2.5} backgroundColor='#f1f1f1' mt={2.5} borderRadius={15} mr={2.5}>
                <HStack alignItems='center'>
                    <DefText text={item} style={{marginRight:10, fontSize:14, fontWeight:'bold'}} />
                    <TouchableOpacity onPress={()=>{disDataDelete(item)}}>
                        <Image source={require('../images/closeDis.png')} alt='삭제' />
                    </TouchableOpacity>
                </HStack>
            </Box>
        )
    })

    const medicineDataR = medicineDatas.map((item, index)=>{
        return(
            <TouchableOpacity key={index} style={[{backgroundColor:'#f1f1f1', marginBottom:20, borderRadius:10}]}>
                <Box backgroundColor='#f1f1f1' p={5} borderRadius='10px' alignItems='center'>
                    <HStack alignItems='center'>
                        <Box height='100%' alignItems='flex-start' justifyContent='flex-start' marginRight={2.5}>
                            {
                                item.category == '조제약' ?
                                <Image
                                    source={require('../images/medicineLIstIcon1.png')} 
                                    alt='조제약 아이콘'
                                    
                                />
                                :
                                <Image
                                    source={require('../images/medicineLIstIcon2.png')} 
                                    alt='조제약 아이콘'
                                    
                                />
                            }
                            
                        </Box>
                        <Box  width='70%'>
                            
                            <DefText text={item.category} style={{fontSize:13, color:'#000'}} />
                            <DefText text='2형 당뇨병' style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                            <HStack mt={2.5}>
                                <HStack alignItems='center' mr={2.5}>
                                    <DefText text='복약순응도' style={{fontSize:14, color:'#000', marginRight:10}} />
                                    <DefText text={item.percent} style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                                </HStack>
                                <HStack alignItems='center'>
                                    <DefText text='복약기간' style={{fontSize:14, color:'#000', marginRight:10}} />
                                    <DefText text={item.dates + '일차'} style={{fontSize:15, color:'#000', fontWeight:'bold'}} />
                                </HStack>
                            </HStack>
                            <Text style={{fontSize:14, marginTop:10}}>
                                {item.message}
                            </Text>
                        </Box>
                        <Image source={{uri:item.medicineImg}} alt='약 샘플' style={{width:70, height:70}} resizeMode='contain' />
                    </HStack>
                </Box>
            </TouchableOpacity>
        )
    })


    const dnaReportData = dnaReport.map((item, index)=> {
        return(
            <Box key={index} mt={2.5}>
                <HStack justifyContent='space-between' alignItems='center' px={2.5} pl={4} style={styles.dnaDisName}>
                    <DefText text={item.diseaseName} style={styles.dnaTitle} />
                    <HStack>
                        <Box style={[styles.dnaSelectButton, {marginRight:5}, item.disParent === 1 && {backgroundColor:'#666'}]}>
                            <DefText text='부모' style={[styles.dnaSelectButtonText]} />
                        </Box>
                        <Box style={[styles.dnaSelectButton, item.disFamily === 1 && {backgroundColor:'#666'}]}>
                            <DefText text='형제자매' style={[styles.dnaSelectButtonText]}  />
                        </Box>
                    </HStack>
                </HStack>
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='건강기록부' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack alignItems='center' pb={2.5} borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                        <Image source={require('../images/healthThumb.png')} alt='건강기록부 이미지' style={{marginRight:20}} />
                        <VStack>
                            <DefText text='김건강' style={styles.myInfoName} />
                            <DefText text='나이 : 만 36세' style={styles.myInfoAge} />
                            <DefText text='성별 : 남자' style={styles.myInfoGender} />
                        </VStack>
                    </HStack>
                    <Box mt={10}>
                        <DefText text='건강기록부' style={[styles.reportLabel]} />
                        <HStack mt={2.5} justifyContent='space-between'>
                            <TouchableOpacity
                                onPress={()=>{reportButton(1)}}
                                style={[{
                                        backgroundColor:'#D2D2D2',
                                        width:hospitalButtonWidth,
                                        height:hospitalButtonWidth,
                                        borderRadius:10,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    },
                                    buttonIdx === 1 && {backgroundColor:'#696968'}
                                ]}
                                
                            >
                                <Box alignItems='center'>
                                    <Image
                                        source={require('../images/healthReportIcon1.png')}
                                        alt='병원정보'
                                        style={{width:40}}
                                        resizeMode='contain'
                                    />
                                    <DefText text='병원정보' style={{ fontSize:13, color:'#fff'}} />
                                </Box>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{reportButton(2)}}
                                style={[{
                                        backgroundColor:'#D2D2D2',
                                        width:hospitalButtonWidth,
                                        height:hospitalButtonWidth,
                                        borderRadius:10,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    },
                                    buttonIdx === 2 && {backgroundColor:'#696968'}
                                ]}
                                
                            >
                                <Box alignItems='center'>
                                    <Image
                                        source={require('../images/healthReportIcon2.png')}
                                        alt='질환기록'
                                        style={{width:40}}
                                        resizeMode='contain'
                                    />
                                    <DefText text='질환기록' style={{ fontSize:13, color:'#fff'}} />
                                </Box>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{reportButton(3)}}
                                style={[{
                                        backgroundColor:'#D2D2D2',
                                        width:hospitalButtonWidth,
                                        height:hospitalButtonWidth,
                                        borderRadius:10,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    },
                                    buttonIdx === 3 && {backgroundColor:'#696968'}
                                ]}
                                
                            >
                                <Box alignItems='center'>
                                    <Image
                                        source={require('../images/healthReportIcon3.png')}
                                        alt='복약기록'
                                        style={{width:40}}
                                        resizeMode='contain'
                                    />
                                    <DefText text='복약기록' style={{ fontSize:13, color:'#fff'}} />
                                </Box>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{reportButton(4)}}
                                style={[{
                                        backgroundColor:'#D2D2D2',
                                        width:hospitalButtonWidth,
                                        height:hospitalButtonWidth,
                                        borderRadius:10,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    },
                                    buttonIdx === 4 && {backgroundColor:'#696968'}
                                ]}
                                
                            >
                                <Box alignItems='center'>
                                    <Image
                                        source={require('../images/healthReportIcon4.png')}
                                        alt='유전기록'
                                        style={{width:40}}
                                        resizeMode='contain'
                                    />
                                    <DefText text='유전기록' style={{ fontSize:13, color:'#fff'}} />
                                </Box>
                            </TouchableOpacity>
                        </HStack>
                        {
                            buttonIdx === 1 &&
                            <>
                                <Box p={5} backgroundColor='#F1F1F1' borderRadius={10} mt={5}>
                                    <DefText text='김건강님의 건강프로필입니다.' />
                                </Box>
                                <Box mt={5}>
                                    <HStack>
                                        <DefText text='건강리포트' style={styles.reportDataText} />
                                        <Box borderBottomWidth={1} borderBottomColor='#666' ml={1}>
                                            <DefText text='체성분데이터' style={[styles.reportDataText, {fontWeight:'bold'}]} />
                                        </Box>
                                        <DefText text='와 연동됩니다.' style={[styles.reportDataText]} />
                                    </HStack>
                          
                                </Box>
                                <Box>
                                    <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={5}>
                                        <HStack width={(width-60)*0.25} >
                                            <DefText text='신장' style={[styles.reportDataText]} />
                                            <DefText text='(cm)' style={[styles.reportDataText]} />
                                        </HStack>
                                        <Box width={(width-60)*0.7}  alignItems='center' >
                                            <DefText text='178' style={[styles.reportDataText]} />
                                        </Box>
                                    </HStack>
                                    <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={2.5}>
                                        <HStack width={(width-60)*0.25} >
                                            <DefText text='체중' style={[styles.reportDataText]} />
                                            <DefText text='(kg)' style={[styles.reportDataText]} />
                                        </HStack>
                                        <Box width={(width-60)*0.7} alignItems='center' >
                                            <DefText text='66.6' style={[styles.reportDataText]} />
                                        </Box>
                                    </HStack>
                                    <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={2.5}>
                                        <HStack width={(width-60)*0.25} >
                                            <DefText text='체지방량' style={[styles.reportDataText]} />
                                            <DefText text='(kg)' style={[styles.reportDataText]} />
                                        </HStack>
                                        <Box width={(width-60)*0.7} alignItems='center' >
                                            <DefText text='9.3' style={[styles.reportDataText]} />
                                        </Box>
                                    </HStack>
                                    <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={2.5}>
                                        <HStack width={(width-60)*0.25} >
                                            <DefText text='골격근량' style={[styles.reportDataText]} />
                                            <DefText text='(kg)' style={[styles.reportDataText]} />
                                        </HStack>
                                        <Box width={(width-60)*0.7} alignItems='center' >
                                            <DefText text='37.4' style={[styles.reportDataText]} />
                                        </Box>
                                    </HStack>
                                    <HStack px={5} py={2.5} backgroundColor='#f1f1f1' borderRadius={20} mt={2.5}>
                                        <HStack width={(width-60)*0.25} >
                                            <DefText text='복부둘레' style={[styles.reportDataText]} />
                                            <DefText text='(cm)' style={[styles.reportDataText]} />
                                        </HStack>
                                        <Box width={(width-60)*0.7} alignItems='center' >
                                            <DefText text='70' style={[styles.reportDataText]} />
                                        </Box>
                                    </HStack>
                                </Box>
                            </>
                        }
                        {
                            buttonIdx === 2 && 
                            <>
                                <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10} mt={5}>
                                    <DefText text='과거 앓았던 질환에 대한 기록을 남겨주세요.' style={{fontWeight:'bold'}} />
                                    <DefText text='최신 데이터는 +를 통해 업데이트 가능합니다.' style={{fontSize:13, color:'#666', marginTop:5}} />
                                </Box>
                                <Box mt={5}>
                                    <DefText text='질환기록' style={[styles.reportLabel]} />
                                    <HStack flexWrap='wrap'>
                                        {
                                            diseaseDatas.length > 0 ?
                                            <>
                                                {disData}
                                                {
                                                    props.route.params != undefined &&
                                                    <Box px={2.5} py={2.5} backgroundColor='#f1f1f1' mt={2.5} borderRadius={15} mr={2.5}>
                                                        <HStack alignItems='center'>
                                                            <DefText text={props.route.params.selectDisease} style={{marginRight:10, fontSize:14, fontWeight:'bold'}} />
                                                            <TouchableOpacity onPress={()=>{disDataDelete(item)}}>
                                                                <Image source={require('../images/closeDis.png')} alt='삭제' />
                                                            </TouchableOpacity>
                                                        </HStack>
                                                    </Box>
                                                }
                                            </>
                                            :
                                            <Box py={5} alignItems='center' justifyContent='center' width={width-40}>
                                                <DefText text='선택된 질환기록이 없습니다.' style={{fontSize:14,color:'#333'}} />
                                            </Box>
                                        }
                                    </HStack>
                                </Box>
                                
                            </>
                        }
                       
                    </Box>
                    {
                        buttonIdx === 3 && 
                        <>
                            <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10} mt={5}>
                                <DefText text='드시는 약에 대한 기록입니다.' style={{fontWeight:'bold'}} />
                                <DefText text='복약관리에서 입력하시면 자동으로 기록됩니다.' style={{fontSize:13, color:'#666', marginTop:5}} />
                            </Box>
                            <Box mt={5}>
                                <HStack>
                                    <DefText text='복약관리' style={styles.reportDataText} />
                                    <Box borderBottomWidth={1} borderBottomColor='#666' ml={1}>
                                        <DefText text='복약기록데이터' style={[styles.reportDataText, {fontWeight:'bold'}]} />
                                    </Box>
                                    <DefText text='와 연동됩니다.' style={[styles.reportDataText]} />
                                </HStack>
                                <Box mt={5}>
                                    {medicineDataR}
                                </Box>
                            </Box>
                        </>
                    }
                    {
                        buttonIdx === 4 &&
                        <>
                            <Box px={5} py={2.5} backgroundColor='#F1F1F1' borderRadius={10} mt={5}>
                                <DefText text='질환중 가족력이 있는 여부를 체크해주세요.' style={{fontWeight:'bold'}} />
                                <DefText text='건강은 가족력과 밀접한 관련이 있습니다.' style={{fontSize:13, color:'#666', marginTop:5}} />
                            </Box>
                            <Box mt={5} pb={5}>
                                <DefText text='가족력 질환' style={styles.reportDataText} />
                                <VStack>
                                    {dnaReportData}
                                </VStack>
                            </Box>
                        </>
                    }
                </Box>
            </ScrollView>
            {
                buttonIdx === 2 && 
                <Box style={{position:'absolute', bottom:20, right:20}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('MyDiseaseReport')}}>
                        <Image source={require('../images/medicinePlus.png')} alt='질환기록 추가' />
                    </TouchableOpacity>
                </Box>
            }
            {
                buttonIdx === 4 && 
                <Box style={{position:'absolute', bottom:20, right:20}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('DnaSelect')}}>
                        <Image source={require('../images/medicinePlus.png')} alt='유전기록 추가' />
                    </TouchableOpacity>
                </Box>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    myInfoName : {
        fontSize:15,
        color:'#333',
        fontWeight:'bold',
        marginBottom:10
    },
    myInfoAge : {
        fontSize:14,
        color:'#666'
    },
    myInfoGender:{
        fontSize:14,
        color:'#666'
    },
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportDataText: {
        fontSize:15,
        color:'#333'
    },
    dnaDisName:{
        height:40,
        backgroundColor:'#f1f1f1',
        borderRadius:10
    },
    dnaTitle:{
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
    },
    dnaSelectButton:{
        height:30,
        backgroundColor:'#D2D2D2',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        paddingHorizontal:10
    },
    dnaSelectButtonText: {
        fontSize:13,
        color:'#fff',
    }
})

export default HealthReport;