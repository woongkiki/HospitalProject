import React, { useEffect, useState } from 'react';
import { extendTheme, NativeBaseProvider, Box, Text, Image} from 'native-base';
import Theme from '../common/Theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import store from '../redux/configureStore';
import {Provider} from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView, View, Dimensions, StyleSheet, TouchableOpacity, Platform } from 'react-native';

import Login from '../screen/Login';
import Register from '../screen/Register';
import PasswordLost from '../screen/PasswordLost';
import PasswordChange from '../screen/PasswordChange';

import Home from '../screen/Home';
import Community from './Community';
import CustomCommunity from './CustomCommunity';
import ChatingList from './ChatingList';
import ChatView from './ChatView';
import Report from '../screen/Report';
import Mypage from '../screen/Mypage';
import HospitalInfo from '../screen/HospitalInfo';
import Medicine from '../screen/Medicine';
import MedicineList from '../screen/MedicineList';
import MedicineForm from '../screen/MedicineForm';
import MedicineForm2 from '../screen/MedicineForm2';
import DiseaseSelect from '../screen/DiseaseSelect';
import DiseaseSchedule from './DiseaseSchedule';
import DiseaseSchedule2 from './DiseaseSchedule2';
import Notice from '../screen/Notice';
import NoticeView from '../screen/NoticeView';
import Content from '../screen/Content';
import ServiceTerm from '../screen/ServiceTerm';
import Privacy from '../screen/Privacy';
import LocationContent from '../screen/LocationContent';
import ServiceQa from '../screen/ServiceQa';
import QaList from '../screen/QaList';
import InquiryList from '../screen/InquiryList';
import InquiryForm from '../screen/InquiryForm';
import Scrap from '../screen/Scrap';
import ScrapView from '../screen/ScrapView';
import AcountInfo from '../screen/AcountInfo';
import AcountInfoChange from '../screen/AcountInfoChange';
import OrderList from '../screen/OrderList';
import Point from '../screen/Point';
import Board from '../screen/Board';
import BoardView from '../screen/BoardView';
import Clinic from '../screen/Clinic';
import ClinicView from '../screen/ClinicView';
import OrderForm from '../screen/OrderForm';
import OrderComplete from '../screen/OrderComplete';
import FoodDiary from '../screen/FoodDiary';
import FoodDiaryList from './FoodDiaryList';
import FoodDiaryView from './FoodDiaryView';
import FoodDiaryAdd from './FoodDiaryAdd';
import CommunityView from '../screen/CommunityView';
import HealthReport from '../screen/HealthReport';
import MyDiseaseReport from '../screen/MyDiseaseReport';
import DnaSelect from '../screen/DnaSelect';
import BloodPressure from './BloodPressure';
import BloodPressureAdd from './BloodPressureAdd';
import BloodSugar from './BloodSugar';
import BloodSugarAdd from './BloodSugarAdd';
import Inbody from './Inbody';
import InbodyAdd from './InbodyAdd';
import AlarmList from './AlarmList';
import HealthCheckList from './HealthCheckList';

import Toast from 'react-native-toast-message';
import Font from '../common/Font';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const theme = extendTheme({ Theme });

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const tabBarWidth = screenWidth / 5;

/* 바텀 탭바 커스텀 */
function CustomTabBar(props){

    const {state, navigation, optionsNum} = props;

    let os;
    if(Platform.OS === 'android'){
        os = '안드';
    }else{
        os = '아오스'
    }

    const [optionsN, setOptionsN] = useState('1');

    console.log(os,optionsN);

    useEffect(()=>{setOptionsN(optionsNum.screenNumber)});

    useEffect(()=>{
        if(optionsN=='2'){
            navigation.navigate('Community');
        }
    },[optionsN])
    //const focusedOptions = descriptors[state.routes[state.index].key];
 
    const screenName = state.routes[state.index].name;
 
   // console.log(screenName);
 
     const navigateToHome=()=>{
         navigation.navigate('Home');
         console.log()
     }
 
     const navigateToCommunity=()=>{
         navigation.navigate('Community');
     }
 
     const navigateToChatingList=()=>{
         navigation.navigate('ChatingList');
     }
 
     const navigateToReport = () => {
         navigation.navigate('Report');
     }

     const navigateToMypage = () => {
        navigation.navigate('Mypage');
    }


 
     return(
         <View style={styles.TabBarMainContainer}>
             <TouchableOpacity activeOpacity={0.8} onPress={navigateToHome} style={styles.button}>
                 {
                     screenName === 'Home' ?
                     <>
                         <Image source={require('../images/tab01_on.png')} alt='tabon' />
                     </>
                     :
                     <>
                         <Image source={require('../images/tab01_off.png')} alt='taboff' />
                     </>
                 }
             </TouchableOpacity>
             <TouchableOpacity activeOpacity={0.8} onPress={navigateToCommunity} style={styles.button}>
                 {
                     screenName === 'Community' ?
                     <>
                         <Image source={require('../images/tab02_on.png')} alt='tabon' />
                     </>
                     :
                     <>
                         <Image source={require('../images/tab02_off.png')} alt='taboff' />
                     </>
                 }
             </TouchableOpacity>
             <TouchableOpacity activeOpacity={0.8} onPress={navigateToChatingList} style={styles.button}>
                 {
                     screenName === 'ChatingList' ?
                     <>
                         <Image source={require('../images/tab03_on.png')} alt='tabon' />
                     </>
                     :
                     <>
                         <Image source={require('../images/tab03_off.png')} alt='taboff' />
                     </>
                 }
             </TouchableOpacity>
             <TouchableOpacity activeOpacity={0.8} onPress={navigateToReport} style={styles.button}>
                 {
                     screenName === 'Report' ?
                     <>
                         <Image source={require('../images/tab04_on.png')} alt='tabon' />
                     </>
                     :
                     <>
                         <Image source={require('../images/tab04_off.png')} alt='taboff' />
                     </>
                 }
             </TouchableOpacity>
             <TouchableOpacity activeOpacity={0.8} onPress={navigateToMypage} style={styles.button}>
                 {
                     screenName === 'Mypage' ?
                     <>
                         <Image source={require('../images/tab05_on.png')} alt='tabon' />
                     </>
                     :
                     <>
                         <Image source={require('../images/tab05_off.png')} alt='taboff' />
                     </>
                 }
             </TouchableOpacity>
         </View>
     )
 
 }

function Tab_Navigation(props){

   // console.log(props);

    const {navigation} = props;

    //console.log(props.route.params);

    let optionss;
    if(props.route.params !=undefined){
        optionss = props.route.params;
    }else{
        optionss = '';
    }
   
    return(
        <Tab.Navigator initialRouteName={Home} screenOptions={{headerShown:false}} tabBar={ (props) => <CustomTabBar {...props} optionsNum={optionss} /> }>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Community" component={Community} />
            <Tab.Screen name="ChatingList" component={ChatingList} />
            <Tab.Screen name="Report" component={Report} />
            <Tab.Screen name="Mypage" component={Mypage} />
        </Tab.Navigator>
    )
}

const Main = (props) => {

    const toastConfig = {
        custom_type: (internalState) => (
          <View
            style={{
              backgroundColor: '#000000e0',
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
              opacity: 0.8,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: 15,
                lineHeight: 22,
                letterSpacing: -0.38,
              }}
            >
              {internalState.text1}
            </Text>
          </View>
        ),
    };

    return (
        <Provider store={store}>
            <PaperProvider>
                <NativeBaseProvider theme={theme}>
                    <NavigationContainer >
                        <SafeAreaView style={{flex:1}}>
                            <Stack.Navigator
                                initialRouteName="Tab_Navigation"
                                screenOptions={{
                                    headerShown:false,
                                }}
                            >
                                <Stack.Screen name="Tab_Navigation" component={Tab_Navigation} />
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen name="Register" component={Register} />
                                <Stack.Screen name="PasswordLost" component={PasswordLost} />
                                <Stack.Screen name="PasswordChange" component={PasswordChange} />
                                <Stack.Screen name="HospitalInfo" component={HospitalInfo} />
                                <Stack.Screen name="Medicine" component={Medicine} />
                                <Stack.Screen name="MedicineList" component={MedicineList} />
                                <Stack.Screen name="MedicineForm" component={MedicineForm} />
                                <Stack.Screen name="MedicineForm2" component={MedicineForm2} />
                                <Stack.Screen name="DiseaseSelect" component={DiseaseSelect} />
                                <Stack.Screen name="DiseaseSchedule" component={DiseaseSchedule} />
                                <Stack.Screen name="DiseaseSchedule2" component={DiseaseSchedule2} />
                                <Stack.Screen name="Notice" component={Notice} />
                                <Stack.Screen name="NoticeView" component={NoticeView} />
                                <Stack.Screen name="Content" component={Content} />
                                <Stack.Screen name="ServiceTerm" component={ServiceTerm} />
                                <Stack.Screen name="Privacy" component={Privacy} />
                                <Stack.Screen name="LocationContent" component={LocationContent} />
                                <Stack.Screen name="ServiceQa" component={ServiceQa} />
                                <Stack.Screen name="QaList" component={QaList} />
                                <Stack.Screen name="InquiryList" component={InquiryList} />
                                <Stack.Screen name="InquiryForm" component={InquiryForm} />
                                <Stack.Screen name="Scrap" component={Scrap} />
                                <Stack.Screen name="ScrapView" component={ScrapView} />
                                <Stack.Screen name="AcountInfo" component={AcountInfo} />
                                <Stack.Screen name="AcountInfoChange" component={AcountInfoChange} />
                                <Stack.Screen name="OrderList" component={OrderList} />
                                <Stack.Screen name="Point" component={Point} />
                                <Stack.Screen name="CustomCommunity" component={CustomCommunity} />
                                <Stack.Screen name="Board" component={Board} />
                                <Stack.Screen name="BoardView" component={BoardView} />
                                <Stack.Screen name="Clinic" component={Clinic} />
                                <Stack.Screen name="ClinicView" component={ClinicView} />
                                <Stack.Screen name="OrderForm" component={OrderForm} />
                                <Stack.Screen name="OrderComplete" component={OrderComplete} />
                                <Stack.Screen name="FoodDiary" component={FoodDiary} />
                                <Stack.Screen name="FoodDiaryList" component={FoodDiaryList} />
                                <Stack.Screen name="FoodDiaryView" component={FoodDiaryView} />
                                <Stack.Screen name="FoodDiaryAdd" component={FoodDiaryAdd} />
                                <Stack.Screen name="CommunityView" component={CommunityView} />
                                <Stack.Screen name="HealthReport" component={HealthReport} />
                                <Stack.Screen name="MyDiseaseReport" component={MyDiseaseReport} />
                                <Stack.Screen name="DnaSelect" component={DnaSelect} />
                                <Stack.Screen name="BloodPressure" component={BloodPressure} />
                                <Stack.Screen name="BloodPressureAdd" component={BloodPressureAdd} />
                                <Stack.Screen name="BloodSugar" component={BloodSugar} />
                                <Stack.Screen name="BloodSugarAdd" component={BloodSugarAdd} />
                                <Stack.Screen name="Inbody" component={Inbody} />
                                <Stack.Screen name="InbodyAdd" component={InbodyAdd} />
                                <Stack.Screen name="AlarmList" component={AlarmList} />
                                <Stack.Screen name="HealthCheckList" component={HealthCheckList} />
                                <Stack.Screen name="ChatView" component={ChatView} />
                                
                            </Stack.Navigator>
                        </SafeAreaView>
                        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
                    </NavigationContainer>
                </NativeBaseProvider>
            </PaperProvider>
        </Provider>
    );
};

const styles = StyleSheet.create({
    TabBarMainContainer: {
        justifyContent:'space-between',
        alignItems:'center',
        height: 62,
        flexDirection:'row',
        width:'100%',
        
    },
    button:{
        width:tabBarWidth,
        height: 60,
        justifyContent:'center',
        backgroundColor:'#fff',
        alignItems:'center',
        flexGrow:1,
        //borderTopWidth:1,
        //borderTopColor:'#e3e3e3'
    },
})

export default Main;