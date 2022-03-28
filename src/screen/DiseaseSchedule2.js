import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Image, Modal, CheckIcon } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Dimensions, ImageBackground, Text, View, TouchableWithoutFeedback } from 'react-native';
import { DefText, DefInput, SaveButton } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

const DiseaseSchedule2 = (props) => {

    const {navigation, route} = props;
    const {params} = route;
    const [par, setPar] = useState({});

    console.log(params);

    const [scheduleCate, setScheduleCate] = useState('매일');

    const [scheduleText, setScheduleText] = useState('매일');

    const schduleCateSelect = ( category ) => {
        if(category=='매일'){
            setScheduleText(category);
            setScheduleCate(category);
        }else{
            setScheduleText('');
            setScheduleCate(category);
        }
    }

    const [buttonState, setButtonState] = useState(true);

    const scheduleTextChange = (text) => {
        setScheduleText(text);
    }

   

    //날짜 선택..
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
    let time = {
      year: today.getFullYear(),  //현재 년도
      month: today.getMonth() + 1, // 현재 월
      date: today.getDate(), // 현제 날짜
      hours: today.getHours(), //현재 시간
      minutes: today.getMinutes(), //현재 분
    };

    let todayText = today.format("yyyy-MM-dd");;

    const [dateTimeText, setDateTimeText] = useState(todayText);
    const dateTimeChange = (text) => {
        setDateTimeText(text);
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        //console.log("A date has been picked: ", date);
        hideDatePicker();
        setDateTimeText(date.format("yyyy-MM-dd"))
    };

    const [isMedicineDate, setIsMedicineDate] = useState('계속');
    const [dateCategory, setDateCategory] = useState('계속');
    const MedicineDateChangeText = (text) => {
        setIsMedicineDate(text);
    }

    const dateCategoryChange = (category) => {
        //console.log(category);
        if(category=='계속'){
            setIsMedicineDate('계속');
            setDateCategory(category);
        }else{
            setIsMedicineDate('');
            setDateCategory(category);
        }
    }

    useEffect(()=>{
        if(scheduleText.length>0 && isMedicineDate.length > 0){
            setButtonState(false);
        }else{
            setButtonState(true);
        }
    },[scheduleText, isMedicineDate])

    const _handlerDisease = () => {
        if(scheduleText.length == 0){
            ToastMessage('복약주기를 입력하세요.');
            return false;
        }
        if(dateTimeText.length == 0){
            ToastMessage('날짜를 입력하세요.');
            return false;
        }
        if(isMedicineDate.length == 0){
            ToastMessage('복약일수를 입력하세요.');
            return false;
        }

        if(selectCategory.length == 0) {
            ToastMessage('복약시기를 선택하세요.')
            return false;
        }

        //console.log(scheduleText, dateTimeText, isMedicineDate, selectCategory);
        navigation.navigate('MedicineForm', {'dateTimeText':dateTimeText, 'scheduleText':scheduleText, 'isMedicineDate':isMedicineDate, 'selectCategory':selectCategory, 'selectIdxCategory':selectIdx});
       // navigation.navigate('MedicineForm2', {'diseaseDatas':params.diseaseDatas, 'scheduleText':scheduleText, 'isMedicineDate':isMedicineDate, 'selectCategory':selectCategory, 'medicine':params.medicine});
    }

   
    const [diseasePage, setDiseasePage] = useState(params.m_page);

    // const [medicineTimes, setMedicineTimes] = useState([]);
    let medicineTimes = Array();

    const [medicineTimesArr, setMedicineTimesArr] = useState([]);
    const [selectCategory, setSelectCategory] = useState([]);
    const [selectIdx, setSelectIdx] = useState([]);

    const medicineAdds = (category, idx) => {

        
        let medicineStatus = selectCategory.includes(category);

        //console.log(medicineStatus);

        if(!medicineStatus){
            selectCategory.push(category);
        }else{
            const findIdx = selectCategory.find((e) => e === category);
            const idxs = selectCategory.indexOf(findIdx);

            selectCategory.splice(idxs, 1)
            //console.log(findIdx);

        }

        setSelectCategory([...selectCategory])


        //////
        let medicineIdxStatus = selectIdx.includes(idx);

        //console.log(medicineStatus);

        if(!medicineIdxStatus){
            selectIdx.push(idx);
        }else{
            const findIdx2 = selectIdx.find((f) => f === idx);
            const idxs2 = selectIdx.indexOf(findIdx2);

            selectIdx.splice(idxs2, 1)
            //console.log(findIdx);

        }

        setSelectIdx([...selectIdx]);
 
        
    }

    useEffect(()=>{
        console.log(selectIdx);
    },[selectIdx])



    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='복약관리' navigation={navigation} />
            <ScrollView>
                <Box px={5} py={5}>
                    <HStack height='121px' justifyContent='space-between' px={5} backgroundColor='#F1F1F1' borderRadius='10px' alignItems='center'>
                        <Box width={(width * 0.60) + 'px'} >
                            <DefText text='복약주기 및 일수' style={{fontSize:16, fontWeight:'bold'}} />
                            {
                                diseasePage == '1' ?
                                <DefText text='어떤 주기로 얼만큼 약을 드시나요?' style={{fontSize:14, marginTop:10}} />
                                :
                                <DefText text='약을 언제 드실 예정인지 체크해주세요.' style={{fontSize:14, marginTop:10}} />
                            }
        
                        </Box>
                        <Image source={require('../images/medicineScheduleIcon.png')} alt='복약관리체크' />
                    </HStack>
                    {
                        diseasePage == '1' &&
                        <>
                            <Box mt={5}>
                                <DefText text='시작일' style={styles.labelText} />
                                <TouchableOpacity onPress={showDatePicker}>
                                    <HStack mt={2.5} alignItems='center' justifyContent='space-between' backgroundColor='#F1F1F1' borderRadius='10px' px={4}>
                                    
                                        <Box height='45px' justifyContent='center' alignItems='center'>
                                            <DefText text={dateTimeText}  />
                                        </Box>
                                        <Image source={require('../images/carlendarNew.png')} alt='달력' style={{width:20}} resizeMode='contain' />
                                    </HStack>
                                </TouchableOpacity>
                            </Box>
                            <Box mt={5}>
                                <DefText text='복약주기' style={styles.labelText} />
                                <HStack mt={2.5}>
                                    <TouchableOpacity onPress={ () => schduleCateSelect('매일') } style={[styles.scheduleCate, scheduleCate == '매일' && {backgroundColor:'#696968'}]}>
                                        <DefText text='매일' style={[styles.scheduleCateText, scheduleCate == '매일' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={ () => schduleCateSelect('일수간격') } style={[styles.scheduleCate, scheduleCate == '일수간격' && {backgroundColor:'#696968'}]}>
                                        <DefText text='일수간격' style={[styles.scheduleCateText, scheduleCate == '일수간격' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                            <Box mt={2.5}>
                                <HStack alignItems='center' backgroundColor='#F1F1F1' borderRadius='10px' px={4} >
                                    <Image source={require('../images/schduleIcons.png')} alt='스케줄 입력' />
                                    <DefInput 
                                        placeholderText='일수 간격을 입력하세요.'
                                        inputValue = {scheduleText}
                                        onChangeText = {scheduleTextChange}
                                        multiline = {false}
                                        inputStyle={{backgroundColor:'transparent', borderWidth:0, width:'90%'}}
                                        disabled={true}
                                        keyboardType={'number-pad'}
                                    />
                                </HStack>
                            </Box>
                            
                            <Box mt={5}>
                                <DefText text='복약일수' style={styles.labelText} />
                                <HStack my={2.5}>
                                    <TouchableOpacity onPress={ () => dateCategoryChange('계속') } style={[styles.scheduleCate, dateCategory == '계속' && {backgroundColor:'#696968'}]}>
                                        <DefText text='계속' style={[styles.scheduleCateText, dateCategory == '계속' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={ () => dateCategoryChange('며칠간') } style={[styles.scheduleCate, dateCategory == '며칠간' && {backgroundColor:'#696968'}]}>
                                        <DefText text='며칠간' style={[styles.scheduleCateText, dateCategory == '며칠간' && {color:'#fff'}]} />
                                    </TouchableOpacity>
                                </HStack>
                                <HStack alignItems='center' backgroundColor='#F1F1F1' borderRadius='10px' px={4} >
                                    <Image source={require('../images/schduleIcons.png')} alt='스케줄 입력' />
                                    
                                    <DefInput 
                                        placeholderText='일간 복약 예정입니다.'
                                        inputValue = {isMedicineDate}
                                        onChangeText = {MedicineDateChangeText}
                                        multiline = {false}
                                        inputStyle={{backgroundColor:'transparent', borderWidth:0, width:'90%'}}
                                        disabled={true}
                                        keyboardType={'number-pad'}
                                    />
                                </HStack>
                            </Box>
                        </>
                    }
                    {
                        diseasePage == '2' && 
                        <VStack mt={8} pb='80px'>
                        <Box> 
                            <HStack alignItems='center'>
                                <Box width='23%' p={2.5} marginRight='15px' alignItems='center'>
                                    <DefText text='8:30 AM' style={{fontSize:12, color:'#77838F'}} />
                                </Box>
                                <Box width='72%'>
                                    <Box shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                       
                                        <TouchableOpacity onPress={()=>medicineAdds('아침식사전', 1)} style={[{paddingVertical:15, paddingHorizontal: 15, paddingLeft:5, borderRadius:10}]}>
                                            <HStack alignItems={'center'}>
                                                <Box borderWidth={1} borderColor={'#ccc'} width={'20px'} height={'20px'} alignItems={'center'} justifyContent={'center'} mr='10px' >
                                                    {
                                                        selectCategory.includes('아침식사전') &&
                                                        <CheckIcon width={12} color='#333' />
                                                    }
                                                </Box>
                                                <DefText text='아침식사 전' style={[{fontSize:14, fontFamily:Font.NotoSansMedium}]} />
                                            </HStack>
                                        </TouchableOpacity>
                                    
                                    </Box>
                                    <Box mt={'15px'} shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                        <HStack alignItems='center'>
                                            <ImageBackground
                                                source={require('../images/mskyBox.png')}
                                                style={{
                                                    width:60,
                                                    height:60,
                                                    resizeMode:'contain',
                                                    justifyContent:'center',
                                                    alignItems:'center',
                                                    marginLeft:-5,
                                                    marginBottom:-2
                                                }}
                                            >
                                                <Image source={require('../images/medicineEatIcon.png')} alt='아침' style={{width:26, height:26, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                            </ImageBackground>
                                            <Box width='75%' pl='5px'>
                                                <DefText text={'아침'} style={{fontSize:14, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                            </Box>
                                        </HStack>
                                    </Box>
                                    <Box mt={'15px'} shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                     
                                        <TouchableOpacity onPress={()=>medicineAdds('아침식사후', 2)} style={[{paddingVertical:15, paddingHorizontal: 15, paddingLeft:5, borderRadius:10}]}>
                                            
                                            <HStack alignItems={'center'}>
                                                <Box borderWidth={1} borderColor={'#ccc'} width={'20px'} height={'20px'} alignItems={'center'} justifyContent={'center'} mr='10px'>
                                                    {
                                                        selectCategory.includes('아침식사후') &&
                                                        <CheckIcon width={12} color='#333' />
                                                    }
                                                </Box>
                                                <DefText text='아침식사 후' style={[{fontSize:14, fontFamily:Font.NotoSansMedium}]} />
                                            </HStack>
                                        </TouchableOpacity>
                  
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center' mt={'15px'}>
                                <Box width='23%' p={2.5} marginRight='15px' alignItems='center'>
                                    <DefText text='12:30 PM' style={{fontSize:12, color:'#77838F'}} />
                                </Box>
                                <Box width='72%'>
                                    <Box shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                        
                                        <TouchableOpacity onPress={()=>medicineAdds('점심식사전', 3)} style={[{paddingVertical:15, paddingHorizontal: 15, paddingLeft:5, borderRadius:10}]}>
                                            
                                            <HStack alignItems={'center'}>
                                                <Box borderWidth={1} borderColor={'#ccc'} width={'20px'} height={'20px'} alignItems={'center'} justifyContent={'center'} mr='10px'>
                                                    {
                                                        selectCategory.includes('점심식사전') &&
                                                        <CheckIcon width={12} color='#333' />
                                                    }
                                                </Box>
                                                <DefText text='점심식사 전' style={[{fontSize:14,fontFamily:Font.NotoSansMedium}]} />
                                            </HStack>
                                        </TouchableOpacity>
                                   
                                    </Box>
                                    <Box mt={'15px'} shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                        <HStack alignItems='center'>
                                            <ImageBackground
                                                source={require('../images/mskyBox.png')}
                                                style={{
                                                    width:60,
                                                    height:60,
                                                    resizeMode:'contain',
                                                    justifyContent:'center',
                                                    alignItems:'center',
                                                    marginLeft:-5,
                                                    marginBottom:-2
                                                }}
                                            >
                                                <Image source={require('../images/medicineEatIcon.png')} alt='점심' style={{width:26, height:26, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                            </ImageBackground>
                                            <Box width='75%' pl='5px'>
                                                <DefText text={'점심'} style={{fontSize:14, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                            </Box>
                                        </HStack>
                                    </Box>
                                    <Box mt={'15px'} shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                    
                                            <TouchableOpacity onPress={()=>medicineAdds('점심식사후', 4)} style={[{paddingVertical:15, paddingHorizontal: 15, paddingLeft:5, borderRadius:10}]}>
                                               
                                                <HStack alignItems={'center'}>
                                                    <Box borderWidth={1} borderColor={'#ccc'} width={'20px'} height={'20px'} alignItems={'center'} justifyContent={'center'} mr='10px' >
                                                        {
                                                            selectCategory.includes('점심식사후') &&
                                                            <CheckIcon width={12} color='#333' />
                                                        }
                                                    </Box>
                                                    <DefText text='점심식사 후' style={[{fontSize:14,fontFamily:Font.NotoSansMedium}]} />
                                                </HStack>
                                            </TouchableOpacity>
                           
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center' mt={'15px'}>
                                <Box width='23%' p={2.5} marginRight='15px' alignItems='center'>
                                    <DefText text='6:30 PM' style={{fontSize:12, color:'#77838F'}} />
                                </Box>
                                <Box width='72%'>
                                    <Box shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                        
                                            <TouchableOpacity onPress={()=>medicineAdds('저녁식사전', 5)}  style={[{paddingVertical:15, paddingHorizontal: 15, paddingLeft:5,  borderRadius:10}]}>
                                                
                                                <HStack alignItems={'center'}>
                                                    <Box borderWidth={1} borderColor={'#ccc'} width={'20px'} height={'20px'} alignItems={'center'} justifyContent={'center'} mr='10px' >
                                                        {
                                                            selectCategory.includes('저녁식사전') &&
                                                            <CheckIcon width={12} color='#333' />
                                                        }
                                                    </Box>
                                                    <DefText text='저녁식사 전' style={[{fontSize:14,fontFamily:Font.NotoSansMedium}]} />
                                                </HStack>
                                            </TouchableOpacity>
                                  
                                    </Box>
                                    <Box mt={'15px'} shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                        <HStack alignItems='center'>
                                            <ImageBackground
                                                source={require('../images/mskyBox.png')}
                                                style={{
                                                    width:60,
                                                    height:60,
                                                    resizeMode:'contain',
                                                    justifyContent:'center',
                                                    alignItems:'center',
                                                    marginLeft:-5,
                                                    marginBottom:-2
                                                }}
                                            >
                                                <Image source={require('../images/medicineEatIcon.png')} alt='아침' style={{width:26, height:26, resizeMode:'contain', marginLeft:-5, marginTop:-5}} />
                                            </ImageBackground>
                                            <Box width='75%' pl='5px'>
                                                <DefText text={'저녁'} style={{fontSize:14, color:'#000', fontFamily:Font.NotoSansMedium}} />
                                            </Box>
                                        </HStack>
                                    </Box>
                                    <Box mt={'15px'} shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                      
                                        <TouchableOpacity onPress={()=>medicineAdds('저녁식사후', 6)} style={[{paddingVertical:15, paddingHorizontal: 15, paddingLeft:5,  borderRadius:10}]}>
                                            
                                            <HStack alignItems={'center'}>
                                                <Box borderWidth={1} borderColor={'#ccc'} width={'20px'} height={'20px'} alignItems={'center'} justifyContent={'center'} mr='10px'>
                                                    {
                                                        selectCategory.includes('저녁식사후') &&
                                                        <CheckIcon width={12} color='#333' />
                                                    }
                                                </Box>
                                                <DefText text='저녁식사 후' style={[{fontSize:14,fontFamily:Font.NotoSansMedium}]} />
                                                
                                            </HStack>
                                        </TouchableOpacity>
                                        
                                    </Box>
                                </Box>
                            </HStack>
                            <HStack alignItems='center' mt={'15px'}>
                                <Box width='23%' p={2.5} marginRight='15px' alignItems='center'>
                                    <DefText text='10:00 PM' style={{fontSize:12, color:'#77838F'}} />
                                </Box>
                                <Box width='72%'>
                                    <Box shadow={5} width='100%' backgroundColor={'#fff'} px={2.5} borderRadius={10}>
                                       
                                            <TouchableOpacity onPress={()=>medicineAdds('잠들기전', 7)} style={[{paddingVertical:15, paddingHorizontal: 15, paddingLeft:5,  borderRadius:10}]}>
                                               
                                                <HStack alignItems={'center'}>
                                                    <Box borderWidth={1} borderColor={'#ccc'} width={'20px'} height={'20px'} alignItems={'center'} justifyContent={'center'} mr='10px'>
                                                        {
                                                            selectCategory.includes('잠들기전') &&
                                                            <CheckIcon width={12} color='#333' />
                                                        }
                                                    </Box>
                                                    <DefText text='잠들기 전' style={[{fontSize:14, fontFamily:Font.NotoSansMedium}]} />
                                                    
                                                </HStack>
                                            </TouchableOpacity>
                             
                                    </Box>
                                    
                                </Box>
                            </HStack>

                        </Box>
                    </VStack>
                    }
                </Box>
            </ScrollView>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            {
                diseasePage == '1' &&
                <Box p={2.5} alignItems={'flex-end'}>
                    <TouchableOpacity onPress={()=>setDiseasePage('2')} style={[styles.medicineButtons]}>
                        <DefText text='다음' style={styles.medicineButtonsText} />
                    </TouchableOpacity>
                </Box>
            }
            {
                diseasePage == '2' &&
                <Box position={'absolute'} bottom={"30px"} right={"30px"}>
                    <SaveButton onPress={_handlerDisease} />
                </Box>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    scheduleCate : {
        
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:10,
        alignItems:'center',
        justifyContent:'center'
    },
    scheduleCateText : {
        fontSize:14,
        color:'#333',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
    },
    medicineButtons : {
        backgroundColor:'#090A73',
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        height: 54,
        width: (width-40) * 0.45,
    },
    medicineButtonsText: {
        fontSize:16,
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
        color:'#fff',
        
    },
    labelText: {
        fontSize:16,
        color:'#696968',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
    }
})

export default DiseaseSchedule2;