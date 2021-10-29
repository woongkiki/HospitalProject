import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import {DefInput, DefText} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import { foodCategory, foodLists, foodSearchData, diseaseDatas1, diseaseDatas2, foodCategoryLists } from '../Utils/DummyData';
import HeaderComponents from '../components/HeaderComponents';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToastMessage from '../components/ToastMessage';

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

const {width} = Dimensions.get('window');

const FoodDiaryAdd = (props) => {

    const {navigation} = props;

    const [profileImgs, setProfileImgs] = useState('');
    const _changeProfileImg = () =>{
      // console.log('이미지 변경');
        ImagePicker.openPicker({
            width: 110,
            height: 100,
            cropping: true,
            cropperCircleOverlay: true
          }).then(image => {
            //console.log(image);

            const my_photo = {
                idx : 1,
                uri : image.path,
                type : image.mime,
                data : image.data,
                name : 'profile_img.jpg'
            }

            setProfileImgs(my_photo);
          });
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

    

    let todayText = time.year + '년 ' + time.month + '월 ' + time.date +'일';

    const [dateTimeText, setDateTimeText] = useState(todayText);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        //console.log("A date has been picked: ", date);
        hideDatePicker();
        setDateTimeText(date.format("yyyy년 MM월 dd일"))
    };

    const [timeInput, setTimeInput] = useState('');
    const timeInputChange = (time) => {
        setTimeInput(time);
    }

    const [starSelect, setStarSelect] = useState('');
    const starChange = (star) => {
        setStarSelect(star);
    }


    const [positionSelect, setPositionSelect] = useState('');
    const positionChange = (position) => {
        setPositionSelect(position);
    }


    const [foodAddModal, setFoodAddModal] = useState(false);

    const [foodSearch, setFoodSearch] = useState('메밀국수');
    const foodSearchChange = (sch) => {
        setFoodSearch(sch);
    }

    const [foodSearchRes, setFoodSearchRes] = useState([]);

    const foodSearchBtn = () => {
        if(foodSearch.length == 0){
            ToastMessage('검색어를 입력하세요.');
            return false;
        }

        if(foodSearch == '메밀국수'){
            setFoodSearchRes(foodSearchData);
        }

    }


    const [foodSelects, setFoodSelects] = useState('');
    const [foods, setFoods] = useState('');

    const foodSelectBtn = (food, items) => {
        setFoodSelects(food);
        
    }

    useEffect(()=>{
        if(foodSelects != ''){
            setFoods(foodSelects);
        }
    },[foodSelects])

    const foodSaveBtn = () => {
        setFoodAddModal(false);
    }


    const [tagVisible, setTagVisible] = useState(false);

    const [selectDisease, setSelectDisease] = useState('');

    const [schText, setSchText] = useState('');

    const [tags, setTags] = useState('');

    const diseaseSelectButton = (buttonText) => {
        setSelectDisease('#'+buttonText);
        
    }
    
    useEffect(()=>{
        if(selectDisease != ''){
            setTags(selectDisease);
        }
    },[selectDisease])

    const [diseaseModal, setDiseaseModal] = useState(false);
    const [diseaseInput, setDiseaseInput] = useState('');
    const diseaseChange = (text) => {
        setDiseaseInput(text);
    }

    const diseaseInputSubmit = () => {
        if(diseaseInput.length==0){
            ToastMessage('질환명을 입력하세요.');
        }

        setSelectDisease(diseaseInput);
        setDiseaseModal(false);
        setDiseaseInput('');
    }

    const tagAdds = () => {
        setTagVisible(false);
    }

    const diseaseDataList1 = foodCategoryLists.map((item, index)=>{
        return(
            <TouchableOpacity key={index} style={[styles.disButton, selectDisease === item && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item)}>
                <DefText text={'#'+item} style={[styles.disText, selectDisease === item && {color:'#fff'}]} />
            </TouchableOpacity>
        )
    })

    const foodDiarySaves = () => {
        navigation.navigate('FoodDiary');
        ToastMessage('식단일기가 입력되었습니다.');
    }

    const foodSearchResults = foodSearchRes.map((item, index)=>{
        return(
            <TouchableOpacity onPress={()=>foodSelectBtn(item.foodName, item)} key={index} style={[ index != 0 && {marginTop:10} ]}>
                <HStack style={[{height:40, backgroundColor:'#f1f1f1', borderRadius:15}, foodSelects === item.foodName && {backgroundColor:'#aaa'} ]} justifyContent='space-between' alignItems='center' px={5}>
                    <DefText text={item.foodName} style={{fontSize:14, color:'#333', fontWeight:'bold'}} />
                    <DefText text={item.foodKcal + 'kcal, ' + item.foodSize} style={{fontSize:13,color:'#666'}}/>
                </HStack>
            </TouchableOpacity>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='식단일기' navigation={navigation} />
            <ScrollView>
                <Box p={5}>
                    <Box>
                        <Box>
                            <DefText text='대표이미지를 등록해주세요.' style={styles.reportLabel} />
                        </Box>
                        <Box justifyContent='center' alignItems='center'>
                            <TouchableOpacity style={{width:70, height:70, borderRadius:35, marginTop:15}} onPress={_changeProfileImg}>
                                <Box alignItems='center'>
                                    {
                                        profileImgs ?
                                        <Image source={{uri:profileImgs.uri}} alt='이미지 선택' style={{width:70, height:70, borderRadius:35}} resizeMode='contain' />
                                        :
                                        <Image source={require('../images/noImage.png')} alt='이미지 선택' />
                                    }
                                    
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <HStack mt={5} justifyContent='space-between'>
                        <Box width={(width-40)*0.47} >
                            <DefText text='일자' style={[styles.reportLabel, {marginBottom:10}]} />
                            <HStack justifyContent='center' alignItems='center' width='100%' backgroundColor='#ff0' py='5px'  backgroundColor='#f1f1f1' borderRadius={20} >
                                <DefText text={dateTimeText} style={{fontSize:14}} />
                                <TouchableOpacity onPress={showDatePicker}>
                                    <Image source={require('../images/datepickerIcon.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <Box width={(width-40)*0.47} >
                            <DefText text='시간' style={[styles.reportLabel, {marginBottom:10}]} />
                            <Box width='100%' backgroundColor='#ff0'  backgroundColor='#f1f1f1' borderRadius={20}>
                                <Input
                                    placeholder='시간입력'
                                    height='45px'
                                    width='100%'
                                    backgroundColor='transparent'
                                    borderWidth={0}
                                    //onSubmitEditing={schButtons}
                                    value={timeInput}
                                    onChangeText={timeInputChange}
                                    style={{fontSize:14}}
                                />
                            </Box>
                        </Box>
                    </HStack>
                    <Box mt={5}>
                        <Box>
                            <HStack alignItems='center' justifyContent='space-between' mb={2.5}>
                                <DefText text='음식명 또는 설명' style={[styles.reportLabel]} />
                                <TouchableOpacity onPress={()=>setFoodAddModal(true)} style={{paddingVertical:5,paddingHorizontal:10, backgroundColor:'#666', borderRadius:10}}>
                                    <DefText text='음식추가' style={{fontSize:13, color:'#fff'}} />
                                </TouchableOpacity>
                            </HStack>
                           {
                               foods != '' ?
                               <HStack>
                                    <Box>
                                        <HStack style={[{height:40, backgroundColor:'#f1f1f1', borderRadius:15}]} justifyContent='space-between' alignItems='center' px={5}>
                                            <DefText text={foods} style={{fontSize:14, color:'#333', fontWeight:'bold'}} />  
                                        </HStack>
                                    </Box>
                                </HStack>
                               :
                                <Box justifyContent='center' alignItems='center' height={50}>
                                    <DefText text='음식을 추가하세요.' style={{fontSize:14, color:'#666'}} />
                                </Box>
                           }
                            
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <Box>
                            <HStack alignItems='center' justifyContent='space-between' mb={2.5}>
                                <DefText text='태그' style={[styles.reportLabel]} />
                                <TouchableOpacity onPress={()=>setTagVisible(true)} style={{paddingVertical:5,paddingHorizontal:10, backgroundColor:'#666', borderRadius:10}}>
                                    <DefText text='추가' style={{fontSize:13, color:'#fff'}} />
                                </TouchableOpacity>
                            </HStack>
                            {
                                tags != '' ?
                                
                                <HStack>
                                    <Box>
                                        <HStack style={[{height:40, backgroundColor:'#f1f1f1', borderRadius:15}]} justifyContent='space-between' alignItems='center' px={5}>
                                            <DefText text={tags} style={{fontSize:14, color:'#333', fontWeight:'bold'}} />  
                                        </HStack>
                                    </Box>
                                </HStack>
                                :
                                <Box justifyContent='center' alignItems='center' height={50}>
                                    <DefText text='음식에 관한 태그를 추가하세요.' style={{fontSize:14, color:'#666'}} />
                                </Box>
                            }
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <Box>
                            <DefText text='평가' style={[styles.reportLabel, {marginBottom:10}]} />
                            <HStack alignItems='center'>
                                <Select
                                    selectedValue={starSelect} 
                                    width={(width-40) * 0.5}
                                    height={45}
                                    backgroundColor='#fff'
                                    placeholder='평점선택'
                                    onValueChange={(itemValue) => starChange(itemValue)}
                                    style={{fontSize:14}}
                                >
                                    <Select.Item 
                                        label='1점'
                                        value='1' 
                                    />
                                    <Select.Item label="2점" value='2' />
                                    <Select.Item label="3점" value='3' />
                                    <Select.Item label="4점" value='4' />
                                    <Select.Item label="5점" value='5' />
                                </Select>
                                {
                                    starSelect == 1 && 
                                    <Image source={require('../images/s_star1.png')} alt='별점 1' style={{width:100, resizeMode:'contain', marginLeft:20}} />
                                }
                                {
                                    starSelect == 2 && 
                                    <Image source={require('../images/s_star2.png')} alt='별점 2' style={{width:100, resizeMode:'contain', marginLeft:20}} />
                                }
                                {
                                    starSelect == 3 && 
                                    <Image source={require('../images/s_star3.png')} alt='별점 3' style={{width:100, resizeMode:'contain', marginLeft:20}} />
                                }
                                {
                                    starSelect == 4 && 
                                    <Image source={require('../images/s_star4.png')} alt='별점 4' style={{width:100, resizeMode:'contain', marginLeft:20}} />
                                }
                                {
                                    starSelect == 5 && 
                                    <Image source={require('../images/s_star5.png')} alt='별점 5' style={{width:100, resizeMode:'contain', marginLeft:20}} />
                                }
                                
                            </HStack>
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <Box>
                            <DefText text='장소입력' style={[styles.reportLabel, {marginBottom:10}]} />
                            <Input 
                                placeholder='장소를 입력하세요'
                                height='45px'
                                width='100%'
                                backgroundColor='transparent'
                                
                                //onSubmitEditing={schButtons}
                                value={positionSelect}
                                onChangeText={positionChange}
                                style={{fontSize:14}}
                            />
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <Box>
                            <DefText text='메모' style={[styles.reportLabel, {marginBottom:10}]} />
                            <Input 
                                placeholder='식사에 대한 감상평을 입력하세요.'
                                height='100px'
                                width='100%'
                                backgroundColor='transparent'
                                multiline={true}
                                textAlignVertical='top'
                                //onSubmitEditing={schButtons}
                                value={positionSelect}
                                onChangeText={positionChange}
                                style={{fontSize:14}}
                            />
                        </Box>
                    </Box>
                    <TouchableOpacity onPress={foodDiarySaves} style={[styles.buttonDef, {marginTop:20}]}>
                        <DefText text='저장' style={styles.buttonDefText} />
                    </TouchableOpacity>
                </Box>
            </ScrollView>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            {/* 음식추가 */}
            <Modal isOpen={foodAddModal} style={{flex:1, backgroundColor:'#fff'}}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                <Box >
                    <HStack height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                        <Box width={width} height={50} alignItems='center' justifyContent='center' position='absolute' top={0} left={0} >
                            <DefText text='음식추가' style={{fontSize:20}} />
                        </Box>
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setFoodAddModal(false)}}>
                            <Image source={require('../images/map_close.png')} alt='닫기' />
                        </TouchableOpacity>
                    </HStack>
                    <ScrollView>
                        <Box p={5}>
                            <HStack alignItems='center' height='50px' backgroundColor='#F1F1F1' borderRadius={5}>
                                <Input
                                    placeholder='음식 이름을 입력하세요.'
                                    height='45px'
                                    width={width-80}
                                    backgroundColor='transparent'
                                    borderWidth={0}
                                    onSubmitEditing={foodSearchBtn}
                                    value={foodSearch}
                                    onChangeText={foodSearchChange}
                                />
                                <TouchableOpacity onPress={foodSearchBtn}>
                                    <Image source={require('../images/schIcons.png')} alt='검색' />
                                </TouchableOpacity>
                            </HStack>
                            <Box mt={5}>
                                {
                                    foodSearchRes.length > 0 ?
                                    foodSearchResults
                                    :
                                    <Box justifyContent='center' alignItems='center' height={50}>
                                        <DefText text='검색된 음식 목록이 없습니다.' style={{fontSize:14, color:'#666'}} />
                                    </Box>
                                }
                            </Box>
                        </Box>
                    </ScrollView>
                    <Box p={2.5} px={5}>
                        <TouchableOpacity onPress={foodSaveBtn} style={[styles.buttonDef]}>
                        <DefText text='음식 추가' style={styles.buttonDefText} />
                        </TouchableOpacity>
                    </Box>
                    
                </Box>
                </SafeAreaView>
            </Modal>


            {/* 태그추가 */}
            <Modal isOpen={tagVisible} style={{flex:1, backgroundColor:'#fff'}}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                <Box>
                    <HStack height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                        <Box width={width} height={50} alignItems='center' justifyContent='center' position='absolute' top={0} left={0} >
                            <DefText text='태그추가' style={{fontSize:20}} />
                        </Box>
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setTagVisible(false)}}>
                            <Image source={require('../images/map_close.png')} alt='닫기' />
                        </TouchableOpacity>
                    </HStack>
                    <ScrollView>
                        <Box p={5}>
                            <Box>
                                <DefText text='선택한 태그' />
                                {
                                    selectDisease == '' ?
                                    <Box py={5} alignItems='center' justifyContent='center'>
                                        <DefText text='선택된 태그가 없습니다.' style={{fontSize:14,color:'#666'}} />
                                    </Box>
                                    :
                                    <HStack>
                                        <Box style={[styles.disButton, {backgroundColor:'#666'} ]}>
                                            <DefText text={selectDisease} style={[styles.disText, {color:'#fff'}]} />
                                        </Box>
                                    </HStack>
                                
                                }
                                
                            </Box>
                            
                            <Box mt={5}>
                                <DefText text='등록태그' />
      
                                <HStack flexWrap='wrap'>
                                {
                                    diseaseDataList1.length>0 && 
                                    diseaseDataList1
                                }
                                </HStack>
                            </Box>
                            <TouchableOpacity style={[styles.inputEnters]}>
                                <DefText text='기타질환을 직접 입력해주세요.' />
                            </TouchableOpacity>
                        </Box>
                    </ScrollView>
                    <Box p={2.5} px={5}>
                        <TouchableOpacity onPress={tagAdds} style={[styles.buttonDef]}>
                        <DefText text='태그 추가' style={styles.buttonDefText} />
                        </TouchableOpacity>
                    </Box>
                </Box>
                </SafeAreaView>
            </Modal>

            
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
        fontSize:15,
        color:'#333'
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
    inputEnters:{
        height:35,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#70A86E',
        borderRadius:10,
        marginTop:20
    },
    disButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        height:30,
        backgroundColor:'#f1f1f1',
        marginRight:10,
        marginTop:10
    },
    disText: {
        fontSize:14,
        color:'#333',
        fontWeight:'bold'
    },
})

export default FoodDiaryAdd;