import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Box, Image, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { NoticeData } from '../Utils/DummyData';
import Api from '../Api';

const Notice = (props) => {

    const {navigation} = props;

    const [noticeLoading, setNoticeLoading] = useState(true);

    const [noticeDatas, setNoticeDatas] = useState(NoticeData);

    const [noticeDataReceiveData, setNoticeDataReceiveData] = useState([]);

    //커뮤니티 데이터 가져오기
    const noticeDataReceive = async () => {
        await setNoticeLoading(true);
        await Api.send('notice_list', {'schText':''}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
                console.log('공지사항 결과 출력 ㅇㅇ : ', arrItems);
                setNoticeDataReceiveData(arrItems);
            }else{
                console.log(resultItem);
            }
        });

        await setNoticeLoading(false);
    }

    useEffect(()=>{
        noticeDataReceive();
    }, [])

    useEffect(()=>{
        setNoticeDatas(noticeDataReceiveData);
    },[noticeDataReceiveData])


    const _renderItem = ({item, index}) => {
        return(
            <Box key={index} px={5}>
                <TouchableOpacity 
                    
                    style={{ paddingVertical:20, borderBottomWidth:1, borderBottomColor:'#707070'}}
                    onPress={()=>{navigation.navigate('NoticeView', item)}}
                >
                    <DefText text={item.subject} style={styles.noticeTitle} />
                    <DefText text={item.wdate} style={styles.noticeDates} />
                </TouchableOpacity>
            </Box>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='공지사항' navigation={navigation} />
            {
                noticeLoading ?
                <Box flex={1} justifyContent='center'>
                    <ActivityIndicator size='large' color='#000' />
                </Box>
                :
                <FlatList
                    nestedScrollEnabled
                    data={noticeDatas}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Box flex={1} justifyContent='center' alignItems='center' py={10}>
                            <DefText text='등록된 공지사항이 없습니다.' style={{color:'#666'}} />
                        </Box>                
                    }
                />
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    noticeTitle: {
        fontSize:14,
        color:'#000',
        fontWeight:'bold',
        marginBottom:15
    },
    noticeDates:{
        fontSize:12,
        color:'#696968'
    }
})

export default Notice;