import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, View, Linking, Platform, Text, Alert } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderMain from '../components/HeaderMain';
import { mainIconData, communityData, boardDatas } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');
const iconButtonWidth = width * 0.25;

const Home = (props) => {

    const {navigation} = props;

    const imageBackground1 = {uri:'http://cnj06.cafe24.com/images/mainIconYellow.png'};
    const imageBackground2 = {uri:'http://cnj06.cafe24.com/images/mainIconSkyBlue.png'};
    const imageBackground3 = {uri:'http://cnj06.cafe24.com/images/mainIconGreen.png'};
    const imageBackground4 = {uri:'http://cnj06.cafe24.com/images/mainIconGray.png'};

    const MainNavButton = (idx) => {
        if(idx==1){
            navigation.navigate('Inbody');
        }

        if(idx==2){
            navigation.navigate('FoodDiary');
        }

        if(idx==3){
            navigation.navigate('Medicine');
        }

        if(idx==4){
            navigation.navigate('BloodSugar');
        }

        if(idx==5){
            navigation.navigate('BloodPressure');
        }

        if(idx == 6){
            navigation.navigate('CustomCommunity');
        }
    }

    const mainIconList = mainIconData.map((item, index)=>{
        return(
            <TouchableOpacity 
                key={item.idx} 
                style={[
                    styles.mainIconButtonWrap,
                    { overflow:'hidden', borderRadius:10,  },
                    item.idx !== 1 && {marginLeft:-10}
                ]}
                onPress={()=>{MainNavButton(index+1)}}
            >
                
                <ImageBackground
                    source={
                        item.idx === 1 ? imageBackground1 :
                        item.idx === 2 ? imageBackground2 : 
                        item.idx === 3 ? imageBackground3 :
                        item.idx === 4 ? imageBackground4 :
                        item.idx === 5 ? imageBackground1 :
                        item.idx === 6 ? imageBackground2 : imageBackground1
                    }
                    resizeMode='contain'
                    style={{width:iconButtonWidth, height:iconButtonWidth, justifyContent:'center', alignItems:'center'}}
                >
                    <Box style={[styles.mainIconButton]}>
                        <Image source={{uri:item.imageUrl}} alt={item.title} style={{width:38, height:38, marginLeft:-5, marginTop:-5}} resizeMode='contain' />
                        <DefText text={item.title} style={[styles.mainIconTitle, {marginLeft:-5}]} />
                    </Box>
                </ImageBackground>
                
            </TouchableOpacity>
        )
    });


    // const communityDataList = communityData.map((item, index)=>{
    //     return(
    //         <TouchableOpacity key={item.idx}>
    //             <View>
    //                 <DefText
    //                     text={textLengthOverCut(item.title, 21)}
    //                     style={[
    //                         { fontSize:13, color:'#000'},
    //                         item.idx !== 1 && { marginTop:5 }
    //                     ]}
    //                 />
    //             </View>
    //         </TouchableOpacity>
    //     )
    // })

    //게시판 내용
    const boardDataList = boardDatas.map((item, index)=>{
        return(
            <TouchableOpacity key={index} onPress={()=>navigation.navigate('BoardView', item)}>
                <DefText text={textLengthOverCut( "[" + item.category + "] " + item.title, 20)} style={[{fontSize:13, color:'#000'}, index !== 0 && {marginTop:5} ]} />
            </TouchableOpacity>
        )
    })


    const [counselModal, setCounselModal] = useState(false);
    const counselModalClosed = () => {
        setCounselModal(false);
        setCounselPage('1');
    }

    const [qaList1, setQaList1] = useState('');
    const qaListChange = (qa) => {
        if(qa == qaList1){
            setQaList1('')
        }else{
            setQaList1(qa)
        }
        
    }

    const [counselPage, setCounselPage] = useState('1');
    const counselPageChange = () => {
        if(!qaList1){
           // ToastMessage('상담유형을 선택하세요.');
           Alert.alert('상담유형을 선택하세요.');
            return false;
        }

        setCounselPage('2');
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderMain navigation={navigation} />
            <ScrollView>
                <Box pt={6}>
                    <VStack px={5} >
                        <Box>
                            <Box alignItems='flex-end'>
                                <Image source={require('../images/mainBannerImg.png')} alt='메인배너' />
                            </Box>
                            <Box position='absolute' top={2.5} left={0}>
                                <DefText text='안녕하세요 김건강님' style={{fontSize:15, color:'#000', marginBottom:10}} />
                                <DefText text={'건강을 지켜드리는'+`\n`+'주치의원 더힐링입니다.'} style={{fontSize:18, color:'#000'}} />
                                <TouchableOpacity
                                    style={{borderRadius:8, overflow:'hidden', width:100, height:30, marginTop:15, backgroundColor:"#696968", alignItems:'center', justifyContent:'center' }}
                                    onPress={()=>setCounselModal(true)}
                                >
                                    <Box shadow={8} >
                                        <DefText text='상담요청' style={{fontSize:15, color:'#FFFFFF'}} />
                                    </Box>
                                </TouchableOpacity>
                            </Box>
                        </Box>
                        
                    </VStack>
                    {/* 메인 버튼 */}
                    <VStack pl='15px'>
                        <Box mt={5}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <HStack pr={5}>
                                   {mainIconList}
                                </HStack>
                            </ScrollView>
                        </Box>
                    </VStack>
                    {/* 메인 버튼 */}
                    {/* 빠른 예약 */}
                    <Box px={5} mt={2.5}>
                        <TouchableOpacity  onPress={()=> Linking.openURL(`tel:010-1234-5678`)}>
                            <ImageBackground 
                                source={require('../images/mainShadowBox.png')}
                                style={{ height:140, width:width-10, marginLeft:-10, marginTop:-15, alignItems:'center', justifyContent:'center'}}
                                resizeMode='contain'
                            >
                                <Box
                                    width={width-40}
                                    height={100}
                                    //backgroundColor='#ff0'
                                    alignItems='center'
                                    justifyContent='center'
                                    mt={-2.5}
                                >
                                    <HStack alignItems='center' justifyContent='space-between' width={width-40} px={6}>
                                        <VStack>
                                            <DefText text='빠른예약' style={{fontSize:18, fontWeight:'bold'}} />
                                            <DefText text='해피콜로 예약을 도와드립니다.' style={{fontSize:15, marginTop:10}} />
                                        </VStack>
                                        <Image source={require('../images/reservationIcon.png')} alt='빠른예약' />
                                    </HStack>
                                </Box>
                            </ImageBackground>
                        </TouchableOpacity>
                    </Box>
                    {/* 빠른 예약 */}
                    {/* 병원 소개 */}
                    <Box px={5}>
                        
                        <TouchableOpacity 
                            onPress={()=>{navigation.navigate('HospitalInfo')}}
                            style={{width:width-40, height:110, backgroundColor:'#fff', borderRadius:10}}>
                            <ImageBackground 
                                source={require('../images/mainShadowBox.png')}
                                style={{ height:140, width:width-10, marginLeft:-10, marginTop:-15, alignItems:'center', justifyContent:'center'}}
                                resizeMode='contain'
                            >
                                <Box
                                    width={width-40}
                                    height={100}
                                    //backgroundColor='#ff0'
                                    alignItems='center'
                                    justifyContent='center'
                                    mt={-2.5}
                                >
                                    <HStack alignItems='center' justifyContent='space-between' width={width-40} px={6}>
                                        <VStack>
                                            <DefText text='병원소개' style={{fontSize:18, fontWeight:'bold'}} />
                                            <DefText text='병원,의료진, 진료시간안내' style={{fontSize:15, marginTop:10}} />
                                        </VStack>
                                        <Image source={require('../images/hospitalIcons.png')} alt='빠른예약' />
                                    </HStack>
                                </Box>
                            </ImageBackground>
                        </TouchableOpacity>
                        
                    </Box>
                    {/* 병원 소개 */}

                    {/* 당뇨 관리 */}
                    <Box px={5} mt={4}>
                        <TouchableOpacity onPress={()=>{navigation.navigate('BloodSugar')}} style={{width:width-40, height:110, backgroundColor:'#fff', borderRadius:10}}>
                            <ImageBackground 
                                source={require('../images/diabetesBg.png')}
                                style={{ height:140, width:width-10, marginLeft:-10, marginTop:-15, alignItems:'center', justifyContent:'center'}}
                                resizeMode='contain'
                            >
                                <Box
                                    width={width-40}
                                    height={100}
                                    //backgroundColor='#ff0'
                                    alignItems='center'
                                    justifyContent='center'
                                    mt={-2.5}
                                >
                                    <HStack alignItems='center' justifyContent='space-between' width={width-40} >
                                        
                                        <VStack position='absolute' right={5} backgroundColor='#fff' py={2.5} pl={2.5}>
                                            <DefText text='똑똑한 당뇨관리' style={{fontSize:18, fontWeight:'bold', textAlign:'right'}} />
                                            <DefText text='이제 연속혈당측정기로 확인하세요' style={{fontSize:15, marginTop:10}} />
                                        </VStack>
                                    </HStack>
                                </Box>
                            </ImageBackground>
                        </TouchableOpacity>
                    </Box>
                    {/* 당뇨 관리 */}

                    {/* 클리닉 소개 */}
                    <Box px={5} mt={4}>
                        <TouchableOpacity onPress={()=>{navigation.navigate('Clinic')}} style={{width:width-40, height:110, backgroundColor:'#fff', borderRadius:10}}>
                            <ImageBackground 
                                source={require('../images/mainShadowBox.png')}
                                style={{ height:140, width:width-10, marginLeft:-10, marginTop:-15, alignItems:'center', justifyContent:'center'}}
                                resizeMode='contain'
                            >
                                <Box
                                    width={width-40}
                                    height={100}
                                    //backgroundColor='#ff0'
                                    alignItems='center'
                                    justifyContent='center'
                                    mt={-2.5}
                                >
                                    <HStack alignItems='center' justifyContent='space-between' width={width-40} px={6}>
                                        
                                        <VStack>
                                            <DefText text='클리닉 소개' style={{fontSize:18, fontWeight:'bold'}} />
                                            <DefText text='건강을 챙기는 클리닉안내' style={{fontSize:15, marginTop:10}} />
                                        </VStack>
                                        <Image source={require('../images/clinicIcons.png')} alt='클리닉' />
                                    </HStack>
                                </Box>
                            </ImageBackground>
                        </TouchableOpacity>
                    </Box>
                    {/* 클리닉 소개 */}

                    {/* 안내 */}
                    <Box px={5} mt={4}>
                       
                        <ImageBackground 
                            source={require('../images/mainShadowBox.png')}
                            style={{ height:140, width:width-10, marginLeft:-10, marginTop:-15, alignItems:'center', justifyContent:'center'}}
                            resizeMode='contain'
                        >
                            <Box
                                width={width-40}
                                height={100}
                                //backgroundColor='#ff0'
                                alignItems='center'
                                justifyContent='center'
                                mt={-2.5}
                            >
                                <HStack alignItems='center'  width={width-40} px={6}>
                                    <VStack alignItems='center'>
                                        <TouchableOpacity onPress={()=>navigation.navigate('Board')}>
                                            <DefText text='안내' style={{fontSize:18, fontWeight:'bold', marginBottom:10}} />
                                            <Image source={require('../images/infomationIcon.png')} alt='안내' height='45px' resizeMode='contain' /> 
                                        </TouchableOpacity>
                                    </VStack>
                                    <VStack ml={7} justifyContent='space-between'>
                                        {boardDataList}
                                    </VStack>
                                </HStack>
                            </Box>
                        </ImageBackground>
                       
                    </Box>
                    {/* 안내 */}
                </Box>
            </ScrollView>

            <Modal isOpen={counselModal} style={{flex:1}} onClose={counselModalClosed}>
                <Box p={5} pb={Platform.OS === 'ios' ? '40px' : 5} backgroundColor='#f1f1f1' position='absolute' bottom={0} left={0} width={width} borderTopLeftRadius={20} borderTopRightRadius={20}>
                    {
                        counselPage == '1' &&
                        <>
                            <DefText text='어떤 상담을 원하시나요?' style={{fontSize:15, color:'#333', fontWeight:'bold', marginBottom:10}} />
                            <HStack flexWrap='wrap'>
                            
                                <TouchableOpacity onPress={()=>qaListChange('진료 전 아프거나 불편한 점이 있어요.')} style={[styles.counselButton , qaList1 == '진료 전 아프거나 불편한 점이 있어요.' && {backgroundColor:'#999'}]}>
                                    <DefText text='진료 전 아프거나 불편한 점이 있어요.' style={[styles.counselButtonText, qaList1 == '진료 전 아프거나 불편한 점이 있어요.' && {color:'#fff'}]} />
                                </TouchableOpacity>
                    
                                <TouchableOpacity onPress={()=>qaListChange('진료 후 아프거나 문의사항이 있어요.')} style={[styles.counselButton, qaList1 == '진료 후 아프거나 문의사항이 있어요.' && {backgroundColor:'#999'}]}>
                                    <DefText text='진료 후 아프거나 문의사항이 있어요.' style={[styles.counselButtonText, qaList1 == '진료 후 아프거나 문의사항이 있어요.' && {color:'#fff'}]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>qaListChange('건강상식에 관해 궁금한 점이 있어요.')} style={[styles.counselButton, qaList1 == '건강상식에 관해 궁금한 점이 있어요.' && {backgroundColor:'#999'}]}>
                                    <DefText text='건강상식에 관해 궁금한 점이 있어요.' style={[styles.counselButtonText, qaList1 == '건강상식에 관해 궁금한 점이 있어요.' && {color:'#fff'}]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>qaListChange('예약이나 가격에 관한 기타 문의사항이 있습니다.')} style={[styles.counselButton, qaList1 == '예약이나 가격에 관한 기타 문의사항이 있습니다.' && {backgroundColor:'#999'}]}>
                                    <DefText text='예약이나 가격에 관한 기타 문의사항이 있습니다.' style={[styles.counselButtonText, qaList1 == '예약이나 가격에 관한 기타 문의사항이 있습니다.' && {color:'#fff'}]} />
                                </TouchableOpacity>
                            </HStack>
                            <HStack justifyContent='flex-end' mt={2.5}>
                                <TouchableOpacity onPress={counselPageChange} style={[styles.counselButton]}>
                                    <DefText text='다음' />
                                </TouchableOpacity>
                            </HStack>
                        </>
                    }
                    {
                        counselPage == '2' && 
                        <>
                            <Text style={{fontSize:15, color:'#333', fontWeight:'bold', marginBottom:10}}>
                                상담을 위해 문진이 필요합니다. 문진을{'\n'}진행하시겠습니까?
                            </Text>
                            <HStack>
                                <TouchableOpacity onPress={()=>navigation.navigate('HealthCheckList', {'qaTitle':qaList1})} style={[styles.counselButton]}>
                                    <DefText text='예' style={[styles.counselButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                            <HStack>
                                <TouchableOpacity onPress={counselModalClosed} style={[styles.counselButton]}>
                                    <DefText text='아니오' style={[styles.counselButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                        </>
                    }
                    
                </Box>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({

    mainIconButton:{
        
        alignItems:'center', 
        justifyContent:'center', 
        
    },
    mainIconTitle:{
        fontSize:13,
        color:'#FFFFFF', 
        marginTop:7
    },

    counselButton: {
        paddingHorizontal:10,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#666',
        marginTop:10,
        width:'auto',
        height:45,
        justifyContent:'center',
        backgroundColor:'#fff',
        width:'auto'
    },
    counselButtonText: {
        fontSize:14,
        color:'#333'
    }
})

export default Home;