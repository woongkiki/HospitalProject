import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderMedicine from '../components/HeaderMedicine';
import { medicineDatas, medicineDatasType1, medicineDatasType2 } from '../Utils/DummyData';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import HeaderComponents from '../components/HeaderComponents';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const MedicineListView = (props) => {

    const {navigation, route, userInfo} = props;

    const { params } = route;


    const [medicineViewLoading, setMedicineViewLoading] = useState(false);
    const [medicineView, setMedicineView] = useState('');
    console.log('params::::',params);

    const medicineViewReceive = async () => {

        await setMedicineViewLoading(false);

        await Api.send('drug_detail', {'id':userInfo.id,  'token':userInfo.appToken, 'idx':params.medicineIdx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('복약기록 정보: ', arrItems);
                //setDrugScheduleDatas(arrItems);
                setMedicineView(arrItems);
                //console.log(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });

        await setMedicineViewLoading(true);
    }

    useEffect(()=>{
        medicineViewReceive();
    }, [])

    return (
        <Box flex={1} backgroundColor={'#fff'}>
            <HeaderComponents headerTitle='복약기록 정보' navigation={navigation} />
            {
                medicineViewLoading ?
                <ScrollView>
                    {
                        medicineView != '' &&
                        <Box>
                            {
                                medicineView.dtype == 'N' ?
                                <Box>
                                    <Image source={{uri:medicineView.upfile}} alt={medicineView.name} style={{width:width, height:width / 1.4, resizeMode:'cover'}} />
                                    <Box p={5}>
                                        <DefText text={medicineView.name} style={{fontSize:20, lineHeight:22}} />
                                        
                                        <Box mt={5}>
                                            <DefText text='섭취량' style={{color:'#666'}}/>
                                           
                                            <DefText text={medicineView.qty} style={{marginTop:5}} />

                                        </Box>
                                        <Box mt={5}>
                                            <DefText text='복약 시작일자' style={{color:'#666'}}/>
                                            <HStack mt={1}>
                                                <DefText text={medicineView.sdate} />
                                                <DefText text={ " (" + medicineView.cdate + '일차) '} />
                                            </HStack>
                                        </Box>
                                        <Box mt={5}>
                                            <DefText text='현재 복용률' style={{color:'#666'}}/>
                                            <DefText text={medicineView.percent + '%'}  style={{marginTop:5}}/>
                                        </Box>
                                        <Box mt={5}>
                                            <DefText text='스케줄' style={{color:'#666'}}/>
                                            <HStack flexWrap={'wrap'}>
                                                {
                                                    medicineView.schedule.map((item, index)=>{
                                                        return(
                                                            <Box key={index}  p={2.5} py={1} backgroundColor={'#f1f1f1'} borderRadius={5} mr='10px' mt='10px'>
                                                                <DefText text={item} style={{fontSize:14}} />
                                                            </Box>
                                                        )
                                                    })
                                                }
                                            </HStack>
                                        </Box>
                                        
                                    </Box>
                                </Box>
                                :
                                <Box>
                                    <Box p={5}>
                                        
                                        <Box>
                                            <DefText text='병원명' style={[styles.labelText]}/>
                                            <DefText text={medicineView.name} style={{marginTop:5}} />
                                        </Box>
                                        <Box mt={5}>
                                            <DefText text='질병명' style={[styles.labelText]}/>
                                            <DefText text={medicineView.dname} style={{marginTop:5}} />
                                        </Box>
                                        
                                        <Box mt={5}>
                                            <DefText text='복약 시작일자' style={[styles.labelText]}/>
                                            <HStack mt={1}>
                                                <DefText text={medicineView.sdate} />
                                                <DefText text={ " (" + medicineView.cdate + '일차) '} />
                                            </HStack>
                                        </Box>
                                        <Box mt={5}>
                                            <DefText text='현재 복용률' style={[styles.labelText]}/>
                                            <DefText text={medicineView.percent + '%'}  style={{marginTop:5}}/>
                                        </Box>
                                        <Box mt={5}>
                                            <DefText text='스케줄' style={[styles.labelText]}/>
                                            <HStack flexWrap={'wrap'}>
                                                {
                                                    medicineView.schedule.map((item, index)=>{
                                                        return(
                                                            <Box key={index}  p={2.5} py={1} backgroundColor={'#f1f1f1'} borderRadius={10} mr='10px' mt='10px'>
                                                                <DefText text={item} style={{fontSize:16, fontFamily:Font.NotoSansMedium, color:'#000'}} />
                                                            </Box>
                                                        )
                                                    })
                                                }
                                            </HStack>
                                        </Box>
                                        <Box mt={5}>
                                            <DefText text='약 정보' style={[styles.labelText]}/>
                                            <VStack>
                                                {
                                                    medicineView.drgArr.map((item, index)=>{
                                                        return(
                                                            <Box key={index} mt={2.5} p={5} py={2.5} backgroundColor={'#f1f1f1'} borderRadius={10} borderWidth={1} borderColor='#f1f1f1'>
                                                                <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                                    <Box width='80%'>
                                                                        <DefText text={item.name} style={{fontSize:16, fontFamily:Font.NotoSansMedium, color:'#000'}} />
                                                                    </Box>
                                                                    <TouchableOpacity onPress={()=>navigation.navigate('MedicineView', {'idx':item.idx})} style={{paddingVertical:5, paddingHorizontal:10, backgroundColor:'#696968', borderRadius:10}}>
                                                                        <DefText text='정보' style={{color:'#fff', fontSize:16, lineHeight:25, fontFamily:Font.NotoSansMedium}} />
                                                                    </TouchableOpacity>
                                                                </HStack>
                                                            </Box>
                                                        )
                                                    })
                                                }
                                            </VStack>
                                        </Box>
                                       
                                    </Box>
                                </Box>
                            }
                            
                        </Box>
                    }
                    
                </ScrollView>               
                :
                <Box alignItems={'center'} flex={1} justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    labelText: {
        fontSize:16,
        color:'#696968',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
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
)(MedicineListView);