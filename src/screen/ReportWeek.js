import React, {useState, useEffect} from 'react';
import { Box, HStack, VStack, Image } from 'native-base';
import { TouchableOpacity, ScrollView, Dimensions, Animated, StyleSheet, Text, Platform, ActivityIndicator, Linking } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import HeaderDefault from '../components/HeaderDefault';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ReportWeeks from '../components/ReportWeeks';
import ReportMonths from '../components/ReportMonths';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const initialLayout = { width: Dimensions.get('window').width };

const firstChartWidth = (width - 80) * 0.5;

const secondChartWidth = (width - 80) * 0.45;

const ReportWeek = (props) => {

    const {navigation, userInfo} = props;


    const [reportCategory, setReportCategory] = useState('1');

    const [reportLoading, setReportLoading] = useState(true);

    const categoryChange = (number) => {
        setReportCategory(number);
        
    }


    return (
        <Box backgroundColor='#fff' flex={1}>
            <HeaderDefault headerTitle='리포트' navigation={navigation} />

            <ScrollView>
                <Box p={5}>
                    <HStack flexWrap='wrap' justifyContent='space-between' mb={5}>
                        <TouchableOpacity onPress={()=>categoryChange('1')} style={[{width:(width-40)*0.48, height:30, alignItems:'center', justifyContent:'center', borderRadius:10}, reportCategory == '1' ? {backgroundColor:'#696968'} : {backgroundColor:'#f1f1f1'}]}>
                            <DefText text='주간' style={[{fontWeight:'500', fontFamily:Font.NotoSansMedium}, reportCategory == '1' ? {color:'#fff'} : {color:'#696968'}]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>categoryChange('2')} style={[{width:(width-40)*0.48, height:30, alignItems:'center', justifyContent:'center', borderRadius:10}, reportCategory == '2' ? {backgroundColor:'#696968'} : {backgroundColor:'#f1f1f1'}]}>
                            <DefText text='월간' style={[{fontWeight:'500', fontFamily:Font.NotoSansMedium}, reportCategory == '2' ? {color:'#fff'} : {color:'#696968'}]} />
                        </TouchableOpacity>
                    </HStack>
                    
                    {
                        reportCategory == '1' &&
                        <ReportWeeks navigation={navigation} />
                    }
                    {
                        reportCategory == '2' && 
                        <ReportMonths navigation={navigation} />
                    }
                    
                </Box>
            </ScrollView>

            
        </Box>
    );
};

const styles = StyleSheet.create({
    tabButton:{
        
        width:width*0.43,
        height: 30,
        borderWidth:1,
        borderColor:'#f2f2f2',
        backgroundColor:'#dfdfdf',
        //alignItems:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
    },
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    reportLabelSmall : {
        fontSize:13,
        color:'#666'
    },
    reportChartText: {
        fontSize:14,
        color:'#fff'
    },
    tableText: {
        fontSize:14,
        color:'#333',
        textAlign:'center'
    },
    progerssChartText: {
        fontSize:14,
        color:'#333'
    },
    progerssChartNumber : {
        fontSize:18,
        color:'#333',
        fontWeight:'bold',
        marginVertical:2.5
    },
    kcalAvgText: {
        fontSize:15,
        color:'#666',
        marginBottom:10,
        fontWeight:'bold',
        textAlign:'center'
    },
    kcalAvgNumber : {
        fontSize:15,
        color:'#666',
        textAlign:'center'

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
)(ReportWeek);