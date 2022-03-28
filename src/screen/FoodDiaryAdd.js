import React, {useState, useEffect} from 'react';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { TouchableOpacity, Dimensions, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import {DefInput, DefText, SaveButton} from '../common/BOOTSTRAP';
import HeaderFood from '../components/HeaderFood';
import { foodCategory, foodLists, foodSearchData, diseaseDatas1, diseaseDatas2, foodCategoryLists } from '../Utils/DummyData';
import HeaderComponents from '../components/HeaderComponents';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToastMessage from '../components/ToastMessage';
import { connect } from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { textLengthOverCut } from '../common/dataFunction';
import Font from '../common/Font';
import { fontFamily } from 'styled-system';

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

    const {navigation, userInfo, route} = props;

    const {params} = route;


    const isFocused = useIsFocused();

    const [foods, setFoods] = useState([]);
    const [foodIdx, setFoodIdx] = useState([]);
    const [tagDataList, setTagDataList] = useState([]);

    console.log(params);

    useEffect(()=>{
        //console.log(foods);
        if(isFocused){
           
            //태그
            if(tagDataList == ''){
                setTagDataList(params.tagList);
            }else{
                setTagDataList(params.tagList)
            }
            
            //음식    
            if(foods == ''){

                if(Array.isArray(params.foodName)){
                    setFoods(params.foodName);
                }else{
                    setFoods([params.foodName]);
                }

            }else{

               // console.log('ok',Array.isArray(params.foodName));

                if(foodIdx.includes(params.foods)){
                    //console.log('이미 있는 파라미터값1');
                    
                }else{
                    
                    if(Array.isArray(params.foodName)){
                        setFoods(params.foodName);
                    }else{
                        setFoods([...foods, params.foodName]);
                    }
                    
                }
            }


            //음식 인덱스
            if(foodIdx == ''){
                if(Array.isArray(params.foods)){
                    setFoodIdx(params.foods);
                }else{
                    setFoodIdx([params.foods]);
                }
            }else{

                if(foodIdx.includes(params.foods)){
                    //console.log('이미 있는 파라미터값2');
                }else{
                    if(Array.isArray(params.foods)){
                        setFoodIdx(params.foods);
                    }else{
                        setFoodIdx([...foodIdx, params.foods]);
                    }
                        
                    
                }

            }
          
            
     
            
        }
    }, [isFocused])



    //귀리
    useEffect(()=>{
        console.log('넘어온 음식정보::',foods, '/ 넘어온 음식정보 idx::' , foodIdx, '태그정보', tagDataList);

    }, [foods, tagDataList]);


    const [foodNameInput, setFoodNameInput] = useState('');
    const foodNameChange = (food) => {
        setFoodNameInput(food);
    }


    const [profileImgs, setProfileImgs] = useState('');
    const _changeProfileImg = () =>{
      // console.log('이미지 변경');
        // ImagePicker.openPicker({
        //     width: 400,
        //     height: 400,
        //     cropping: true,
        //     cropperCircleOverlay: true
        //   }).then(image => {
        //     //console.log(image);

        //     const my_photo = {
        //         idx : 1,
        //         uri : image.path,
        //         type : image.mime,
        //         data : image.data,
        //         name : 'profile_img.jpg'
        //     }

        //     setProfileImgs(my_photo);
        //   });

        setProfileImageModal(true);
    }

    const [profileImageModal, setProfileImageModal] = useState(false);

    const gallerySelect = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
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
            setProfileImageModal(false);
          });
    }

    const cameraSelect = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
            cropperCircleOverlay: true
          }).then(image => {
            console.log(image);

            const my_photo = {
                idx : 1,
                uri : image.path,
                type : image.mime,
                data : image.data,
                name : 'profile_img.jpg'
            }

            setProfileImgs(my_photo);
            setProfileImageModal(false);
          });
    }

    //날짜 선택..
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
    let time = {
      year: today.getFullYear(),  //현재 년도
      month: today.getMonth() + 1, // 현재 월
      date: today.getDate(), // 현제 날짜
      hours: today.getHours(), //현재 시간
      minutes: today.getMinutes(), //현재 분
    };

    

    let todayText = today.format('yyyy-MM-dd');

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
        setDateTimeText(date.format("yyyy-MM-dd"))
    };


    let todayTimes = today.format('HH:mm');

    const [timeInput, setTimeInput] = useState(todayTimes);

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleConfirmTime = (date) => {
        //console.log("A date has been picked: ", date);
        hideTimePicker();
        setTimeInput(date.format("HH:mm"))
    };



    const [starSelect, setStarSelect] = useState('');
    const starChange = (star) => {
        setStarSelect(star);
    }


    const [positionSelect, setPositionSelect] = useState('');
    const positionChange = (position) => {
        setPositionSelect(position);
    }
  
    const [foodMemo, setFoodMemo] = useState('');
    const foodMemoChange = (text)=> {
        setFoodMemo(text);
    }


    const [tagVisible, setTagVisible] = useState(false);

    const [selectDisease, setSelectDisease] = useState('');

    const [tags, setTags] = useState('');

    const [tagInsert, setTagInsert] = useState('');
    const tagChanges = (tags) => {
        setTagInsert(tags);
    }

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


    const foodDiarySaves = () => {

        if(!foodNameInput){
            ToastMessage('음식명을 입력하세요.');
            return false;
        }

        if(!dateTimeText){
            ToastMessage('섭취날짜를 입력하세요.');
            return false;
        }

        if(!timeInput){
            ToastMessage('섭취시간을 입력하세요.');
            return false;
        }

        if(!foods){
            ToastMessage('음식을 선택하세요.');
            return false;
        }

        let params = {'id':userInfo.id, 'token':userInfo.appToken, 'foods':"",'tag':"", 'fdate':dateTimeText, 'ftime':timeInput, 'upfile':profileImgs, 'score':starSelect, 'place':positionSelect, 'memo':foodMemo, 'fname':foodNameInput };
        let newFoods = foods;
        newFoods.map((e)=>{
            params.foods += JSON.stringify(e) + "^^";
        });

        if(tagDataList) params.tag = tagDataList.join("^");
     
        console.log(params);
        
        Api.send('food_insert', params, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('식단정보 등록: ', resultItem);
                
                ToastMessage(resultItem.message);
                navigation.navigate('FoodDiary');

            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        })        

        //navigation.navigate('FoodDiary');
        //ToastMessage('식단일기가 입력되었습니다.');
    }

  
    //음식 카운트 +
    const handleFoodQty = (i) => {
        //console.log(foods[i]);
        let newFood = {...foods[i]};
        newFood.fqty += 0.2;
        newFood.fqty = Math.round(newFood.fqty*100)/100;
        newFood.fkcal =  Math.round( (newFood.fqty * newFood.kcalReal) * 100 ) / 100;

        newFood.fcost =  Math.round( (newFood.fqty * newFood.costReal) * 100 ) / 100;

        
        let newFoods    = [...foods];
        newFoods[i]     = newFood;
        setFoods(newFoods);

     
    }

    //음식 카운트 -
    const handleFoodQtyMinus = (i) => {

        let newFood = {...foods[i]};

        if(newFood.fqty == 0.2){
            ToastMessage('더이상 감소할 수 없습니다.');
            return false;
        }

        newFood.fqty -= 0.2;
        newFood.fqty = Math.round(newFood.fqty*100)/100;
        newFood.fkcal =  Math.round( (newFood.fqty * newFood.kcalReal) * 100 ) / 100;

        newFood.fcost =  Math.round( (newFood.fqty * newFood.costReal) * 100 ) / 100;

        
        let newFoods    = [...foods];
        newFoods[i]     = newFood;
        setFoods(newFoods);
    }

    //푸드 등록 태그
    const [foodTagSubmit, setFoodTagSubmit] = useState([]);
    
    const foodTagSubmitList = () => {
        Api.send('food_tagList', {'id':userInfo.id,  'token':userInfo.appToken}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('등록된 태그 정보: ', arrItems);
                
                setFoodTagSubmit(arrItems);
                //console.log(arrItems);
            }else{
                console.log('결과 출력 실패!', resultItem);
               
            }
        });
    }
//메밀
    useEffect(()=>{
        foodTagSubmitList();
    }, [])


    const [delFoodModal, setDelFoodModal] = useState(false);
    const [delFoodSelect, setDelFoodSelect] = useState('');
    const foodSelectRemove = (item) => {

        //foods 값 삭제
        const categoryFilter = foods.filter((e, index)=>{
            return e !== item;
        });
        setFoods(categoryFilter);


        //foodIdx 값 삭제
        const categoryFilterIdx = foodIdx.filter((e, index)=>{
            return e !== item.fidx;
        });
        setFoodIdx(categoryFilterIdx);


        ////
        // console.log('삭제할 음식 선택',item);
        // console.log(foods, foodIdx);
        // console.log('음식 ㄱ', foods.includes(item));
        // console.log('categoryFilterIdx',categoryFilterIdx);
        // console.log('categoryFilter',categoryFilter);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='식단일기' navigation={navigation} />
            <ScrollView>
                <Box p={5} paddingBottom='100px'>
                    <Box>
                        <HStack>
                            <DefText text='음식명' style={[styles.reportLabel, {marginBottom:10}]} />
                            <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                        </HStack>
                        <Input 
                            placeholder='음식명을 입력하세요'
                            placeholderTextColor={'#a3a3a3'}
                            height='45px'
                            width='100%'
                            backgroundColor='transparent'
                            borderRadius={10}
                            //onSubmitEditing={schButtons}
                            value={foodNameInput}
                            onChangeText={foodNameChange}
                            style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, foodNameInput.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                            _focus='transparent'
                        />
                    </Box>
                    <Box mt={5} >
                        <Box>
                            <DefText text='대표이미지를 등록해주세요.' style={styles.reportLabel} />
                        </Box>
                        <Box justifyContent='center' alignItems='center'>
                            <TouchableOpacity style={{width:70, height:70, borderRadius:35, marginTop:15}} onPress={_changeProfileImg}>
                                <Box alignItems='center'>
                                    {
                                        profileImgs ?
                                        <Image source={{uri:profileImgs.uri}} alt='이미지 선택' style={{width:70, height:70, borderRadius:35}} resizeMode='cover' />
                                        :
                                        <Image source={require('../images/noImage.png')} alt='이미지 선택' />
                                    }
                                    
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <HStack mt={5} justifyContent='space-between'>
                        <Box width={(width-40)*0.47} >
                            <HStack>
                                <DefText text='일자' style={[styles.reportLabel, {marginBottom:10}]} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            <HStack justifyContent='space-between' alignItems='center' width='100%'  height='45px' py='5px'  backgroundColor='#f1f1f1' borderRadius={10} px={5} >
                                <DefText text={dateTimeText} style={{fontSize:16, fontFamily:Font.NotoSansMedium}} />
                                <TouchableOpacity onPress={showDatePicker}>
                                    <Image source={require('../images/carlendarNew.png')} alt='달력' style={{width:20, resizeMode:'contain', marginLeft:10}}  />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <Box width={(width-40)*0.47} >
                            <HStack>
                                <DefText text='시간' style={[styles.reportLabel, {marginBottom:10}]} />
                                <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                            </HStack>
                            <HStack justifyContent='space-between' alignItems='center' width='100%'  height='45px' backgroundColor='#f1f1f1' borderRadius={10} >
                                <TouchableOpacity onPress={showTimePicker} style={{width:'100%'}} >
                                    <HStack alignItems={'center'} justifyContent='space-between' px={5} pr='10px'>
                                        <DefText text={timeInput} style={{fontSize:16, fontFamily:Font.NotoSansMedium}} />
                                        <Image source={require('../images/timeIcons.png')} alt='측정시간' style={{width:26, height:26, resizeMode:'contain'}} />
                                    </HStack>
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                    </HStack>

                    {/* onPress={()=>setFoodAddModal(true)} */}
                    <Box mt={5}>
                        <Box>
                            <HStack alignItems='center' justifyContent='space-between' mb={2.5}>
                                <HStack>
                                    <DefText text='음식데이터' style={[styles.reportLabel]} />
                                    <DefText text='*' style={{fontSize:18, color:'#FFC400', marginLeft:5}} />
                                </HStack>
                                <TouchableOpacity onPress={()=>navigation.navigate('FoodAdd', {'foodsIdxSend':foodIdx, 'tagList':tagDataList})} >
                                    {/* <DefText text='음식추가' style={{fontSize:13, color:'#fff'}} /> */}
                                    <Image source={require('../images/smallAddNew.png')} style={{width:61, height:29, resizeMode:'contain'}} alt='추가' />
                                    <Box style={{width:61, height:29,position:'absolute', top:0, left:0, justifyContent:'center', paddingLeft:25}}>
                                        <DefText text='추가' style={{fontSize:15, lineHeight:21,fontFamily:Font.NotoSansMedium}} />
                                    </Box>
                                </TouchableOpacity>
                            </HStack>
                           {
                               foods != '' ?
                               foods.map((item, index)=>{

                                   let costs = foods[index.toString()].fcost;
                                   costs = Math.floor(costs);
                                   //costs = Math.costs.floor();
                                   


                                    return (
                                        <Box key={index} style={[ index != 0 && {marginTop:10} ]}>
                                            
                                            <Box style={[{backgroundColor:'#f1f1f1', borderRadius:15}]} justifyContent='space-between' alignItems='center' px='15px' py='10px' flexWrap={'wrap'}>
                                                <Box justifyContent={'flex-start'} width='100%'>
                                                    <HStack alignItems={'center'}>
                                                        <DefText text={ item.fname } style={{fontSize:14, color:'#333', fontWeight:'bold'}} />
                                                        <TouchableOpacity onPress={()=>foodSelectRemove(item)} style={{marginLeft:10}}>
                                                            <Image source={require('../images/closeDis.png')} alt='삭제' />
                                                        </TouchableOpacity>
                                                    </HStack>
                                                </Box>
                                                <Box justifyContent={'flex-end'} width='100%' mt='5px'>
                                                    <HStack alignItems='center' justifyContent={'flex-end'} >
                                                        <DefText text={item.fkcal + 'kcal, ' + item.fqty+'인분 '+ costs +item.fstd} style={{fontSize:13,color:'#666', marginRight:5}}/>

                                                        <TouchableOpacity onPress={ ()=>handleFoodQty(index) } style={{marginRight:5}}>
                                                            <Image source={require('../images/plusFood.png')} alt='음식추가' style={{width:24, height:24, resizeMode:'contain'}} />
                                                        </TouchableOpacity>


                                                        <TouchableOpacity onPress={()=>handleFoodQtyMinus(index)}>
                                                            <Image source={require('../images/minusFood.png')} alt='음식빼기' style={{width:24, height:24, resizeMode:'contain'}} />
                                                        </TouchableOpacity>
                                                    </HStack>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                })
                               :
                               <Box justifyContent='center' alignItems='flex-start' height={'45px'} borderRadius={10} borderWidth={1} borderColor='#f1f1f1' px='15px'>
                                    <DefText text='음식을 추가하세요.' style={{color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
                                </Box>
                           }
                            
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <Box>
                            <HStack alignItems='center' justifyContent='space-between' mb={2.5}>
                                <DefText text='태그' style={[styles.reportLabel]} />
                                <TouchableOpacity onPress={()=>navigation.navigate('FoodDiaryTag', {'foods':foodIdx, 'foodName':foods})} >
                                    {/* <DefText text='추가' style={{fontSize:13, color:'#fff'}} /> */}
                                    {/* <Image source={require('../images/foodDataAdd.png')} alt='추가' /> */}
                                    <Image source={require('../images/smallAddNew.png')} style={{width:61, height:29, resizeMode:'contain'}} alt='추가' />
                                    <Box style={{width:61, height:29,position:'absolute', top:0, left:0, justifyContent:'center', paddingLeft:25}}>
                                        <DefText text='추가' style={{fontSize:15, lineHeight:21,fontFamily:Font.NotoSansMedium}} />
                                    </Box>
                                </TouchableOpacity>
                            </HStack>
                           
                            {
                                tagDataList ?
                                <HStack>
                                {
                                    tagDataList.map((tag, index)=>{
                                        return(
                                            
                                            <Box key={index} style={[ index != 0 && {marginLeft:10}]}>
                                                <HStack style={[{height:40, backgroundColor:'#f1f1f1', borderRadius:15}]} justifyContent='space-between' alignItems='center' px={5}>
                                                    <DefText text={tag} style={{fontSize:14, color:'#333', fontWeight:'bold'}} />  
                                                </HStack>
                                            </Box>
                                        
                                        )
                                    })
                                }
                                </HStack>
                                :
                                <Box justifyContent='center' alignItems='flex-start' height={'45px'} borderRadius={10} borderWidth={1} borderColor='#f1f1f1' px='15px'>
                                    <DefText text='음식에 관한 태그를 추가하세요.' style={{color:'#a3a3a3', fontFamily:Font.NotoSansMedium}} />
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
                                    borderRadius={10}
                                    placeholder='평점선택'
                                    onValueChange={(itemValue) => starChange(itemValue)}
                                    style={{fontSize:16, fontFamily:Font.NotoSansMedium}}
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
                                placeholderTextColor={'#a3a3a3'}
                                height='45px'
                                width='100%'
                                backgroundColor='transparent'
                                borderRadius={10}
                                //onSubmitEditing={schButtons}
                                value={positionSelect}
                                onChangeText={positionChange}
                                style={[{fontSize:16, color:'#a3a3a3', fontFamily:Font.NotoSansMedium}, positionSelect.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                                _focus='transparent'
                            />
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <Box>
                            <DefText text='메모' style={[styles.reportLabel, {marginBottom:10}]} />
                            <Input 
                                placeholder='식사에 대한 감상평을 입력하세요.'
                                placeholderTextColor='#a3a3a3'
                                height='100px'
                                width='100%'
                                backgroundColor='transparent'
                                borderRadius={10}
                                multiline={true}
                                textAlignVertical='top'
                                //onSubmitEditing={schButtons}
                                value={foodMemo}
                                onChangeText={foodMemoChange}
                                style={[{fontSize:16, fontFamily:Font.NotoSansMedium}, foodMemo.length > 0 && {backgroundColor:'#f1f1f1', color:'#000'}]}
                                _focus='transparent'
                            />
                        </Box>
                    </Box>
                    
                </Box>
            </ScrollView>
            <Box position={'absolute'} bottom={"30px"} right={"30px"}>
                <SaveButton onPress={foodDiarySaves} />
            </Box>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
            />

            <Modal isOpen={profileImageModal} onClose={()=>setProfileImageModal(false)}>
                <Box width={width} backgroundColor='#fff' p={5} position={'absolute'} bottom='0'>
                    <HStack>
                       
                        <TouchableOpacity onPress={()=>gallerySelect()} style={{alignItems:'center', justifyContent:'center', width:width*0.43}}>
                            <Image source={require('../images/gallerySelect.png')} alt='갤러리'/>
                            <DefText text='갤러리' style={{textAlign:'center', marginTop:5}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>cameraSelect()} style={{alignItems:'center', justifyContent:'center', width:width*0.43}}>
                            <Image source={require('../images/cameraSelect.png')} alt='카메라'/>
                            <DefText text='카메라' style={{textAlign:'center', marginTop:5}} />
                        </TouchableOpacity>
                    </HStack>
                </Box>
            </Modal>

            <Modal isOpen={delFoodModal} onClose={()=>setDelFoodModal(false)}>
                <Modal.Content>
                    <Modal.Body>
                        <Box>
                            <DefText text='선택하신 음식을 삭제하시겠습니까?' />
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            {/* 태그추가 */}
            <Modal isOpen={tagVisible} style={{flex:1, backgroundColor:'#fff'}}>
                <SafeAreaView style={{width:'100%', flex:1}}>
                <Box>
                    <HStack height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3'}} >
                        <Box width={width} height={50} alignItems='center' justifyContent='center' position='absolute' top={0} left={0} >
                            <DefText text='태그추가' style={{fontSize:20, lineHeight:24}} />
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
      
                                {
                                     foodTagSubmit != "" ?
                                     <HStack flexWrap='wrap'>
                                         {
                                             foodTagSubmit.map((item, index)=>{
                                                return(
                                                    <TouchableOpacity key={index} style={[styles.disButton, selectDisease === item && {backgroundColor:'#666'} ]} onPress={()=>diseaseSelectButton(item)}>
                                                        <DefText text={'#'+item} style={[styles.disText, selectDisease === item && {color:'#fff'}]} />
                                                    </TouchableOpacity>
                                                )
                                             })
                                         }
                                     </HStack>
                                     :
                                     <Box py={5} alignItems='center' justifyContent='center'>
                                        <DefText text='등록된 태그가 없습니다.' style={{fontSize:14,color:'#666'}} />
                                    </Box>
                                }
                                
                            </Box>
                            <Input 
                                placeholder='등록하실 태그명을 입력하세요..'
                                height='40px'
                                width={width-40}
                                backgroundColor='transparent'
                                borderWidth={1}
                                style={{fontSize:14, marginTop:10}}
                                value={tagInsert}
                                onChangeText={tagChanges}
                            />
                            <TouchableOpacity style={[styles.inputEnters]}>
                                <DefText text='태그등록' style={{color:'#fff'}} />
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
        color:'#696968',
        fontWeight:'500',
        fontFamily:Font.NotoSansMedium,
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
        marginTop:10
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

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(FoodDiaryAdd);