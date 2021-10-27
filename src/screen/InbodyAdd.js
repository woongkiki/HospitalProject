import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';

const {width} = Dimensions.get('window');

const InbodyAdd = (props) => {

    const {navigation} = props;

    
    const [tabOn, setTabOn] = useState('1');
    const tabChangeBtn = (text) => {
        setTabOn(text);
    }

    //직접입력
    //체중
    const [weight, setWeight] = useState('');
    const weightChange = (weight) => {
        setWeight(weight);
    }

    //키
    const [feet, setFeet] = useState('');
    const feetChange = (feet) => {
        setFeet(feet);
    }

    //목둘레
    const [neck, setNeck] = useState('');
    const neckChange = (neck) => {
        setNeck(neck);
    }

    //허리둘레
    const [waist, setWaist] = useState('');
    const waistChange = (waist) => {
        setWaist(waist);
    }

    //엉덩이둘레
    const [heep, setHeep] = useState('');
    const heepChange = (heep) => {
        setHeep(heep);
    }

    //허벅지둘레
    const [thigh, setThigh] = useState('');
    const thighChange = (thigh) => {
        setThigh(thigh);
    }


    //인바디용

    //체중
    const [weightInBody, setWeightInBody] = useState('');
    const weightInBodyChange = (weight) => {
        setWeightInBody(weight);
    }

    //키
    const [feetInBody, setFeetInBody] = useState('');
    const feetInBodyChange = (feet) => {
        setFeetInBody(feet);
    }

    //체지방률
    const [fatPercents, setFatPercents] = useState('');
    const fatPercentChange = (fat) => {
        setFatPercents(fat);
    }

    //골격근량
    const [skeleton, setSkeleton] = useState('');
    const skeletonChange = (skeleton) => {
        setSkeleton(skeleton);
    }

    //내장지방레벨
    const [fatLevel, setFatLevel] = useState('');
    const fatLevelChange = (levels) => {
        setFatLevel(levels);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='체성분 입력' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <HStack height='140px' justifyContent='space-between' px={4} backgroundColor='#F1F1F1' borderRadius='30px' alignItems='center'>
                        <Box>
                            <DefText text='체성분결과 또는 체중을 기록하세요' style={{fontSize:16, fontWeight:'bold'}} />
                            <DefText text='체성분 측정 가이드를 참조해주세요.' style={{fontSize:14, marginTop:10}} />
                            <TouchableOpacity
                                style={{
                                    width:100,
                                    height:30,
                                    backgroundColor:'#696968',
                                    borderRadius:10,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    marginTop:10 
                                }}
                                onPress={()=>{navigation.navigate('Tab_Navigation', {'screenNumber':2})}}
                            >
                                <DefText text='가이드' style={{color:'#fff', fontSize:15}} />
                            </TouchableOpacity>
                        </Box>
                        <Image source={require('../images/checkIcons.png')} alt='체크이미지' />
                    </HStack>
                    <HStack justifyContent='space-between' mt={5}>
                        <TouchableOpacity onPress={()=>tabChangeBtn('1')} style={[styles.tabButtons, tabOn == '1' && {backgroundColor:'#666'}]}>
                            <DefText text='직접입력' style={[styles.tabButtonsText, tabOn == '1' && {color:'#fff'}]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>tabChangeBtn('2')} style={[styles.tabButtons, tabOn == '2' && {backgroundColor:'#666'}]}>
                            <DefText text='인바디기기 입력' style={[styles.tabButtonsText ,tabOn == '2' && {color:'#fff'}]} />
                        </TouchableOpacity>
                    </HStack>
                    <Box mt={5}>
                        <HStack justifyContent='space-between' alignItems='center'>
                            <DefText text='검사일시' style={[styles.reportLabel]} />
                            <DefText text='2021. 06. 10' style={[styles.datetimeText]} />
                        </HStack>
                    </Box>
                    {
                        tabOn == '1' && 
                        <Box>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='체중(kg)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='66.6'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={weight}
                                        onChangeText={weightChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='신장(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='174.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={feet}
                                        onChangeText={feetChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                    />
                    
                                </Box>
                            </HStack>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='목둘레(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='37.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={neck}
                                        onChangeText={neckChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='허리둘레(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='87.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={waist}
                                        onChangeText={waistChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                            </HStack>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='엉덩이 둘레(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='80.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={heep}
                                        onChangeText={heepChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='허벅지 둘레(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='57.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={thigh}
                                        onChangeText={thighChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                            </HStack>
                            <TouchableOpacity style={[styles.buttonDef, {marginTop:20}]}>
                                <DefText text='저장' style={styles.buttonDefText} />
                            </TouchableOpacity>
                        </Box>
                    }

                    {
                        tabOn == '2' && 
                        <Box>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='체중(kg)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='66.6'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={weightInBody}
                                        onChangeText={weightInBodyChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='신장(cm)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='174.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={feetInBody}
                                        onChangeText={feetInBodyChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                    />
                    
                                </Box>
                            </HStack>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='체지방률(%)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='37.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={fatPercents}
                                        onChangeText={fatPercentChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='골격근량(kg)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='87.0'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={skeleton}
                                        onChangeText={skeletonChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                            </HStack>
                            <HStack mt={5} justifyContent='space-between'>
                                <Box width={(width-40)*0.47} >
                                    <DefText text='내장지방레벨(level)' style={[styles.reportLabel, {marginBottom:10}]} />
                                    
                                    <Input
                                        placeholder='5'
                                        height='45px'
                                        width='100%'
                                        backgroundColor='transparent'
                                        borderWidth={1}
                                        //onSubmitEditing={schButtons}
                                        value={fatLevel}
                                        onChangeText={fatLevelChange}
                                        style={{fontSize:15}}
                                        keyboardType='phone-pad'
                                        _focus='transparent'
                                    />
                    
                                </Box>
                                
                            </HStack>
                            <TouchableOpacity style={[styles.buttonDef, {marginTop:20}]}>
                                <DefText text='저장' style={styles.buttonDefText} />
                            </TouchableOpacity>
                        </Box>
                    }
                    
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    tabButtons: {
        height:34,
        width:(width-40) * 0.48,
        backgroundColor:'#f1f1f1',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    tabButtonsText: {
        fontSize:13,
        color:'#333',
    },
    reportLabel : {
        fontSize:15,
        color:'#666',
        fontWeight:'bold'
    },
    datetimeText: {
        fontSize:14,
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
})

export default InbodyAdd;