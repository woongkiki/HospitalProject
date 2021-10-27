import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Dimensions, Text, ScrollView, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { Box, Image, HStack, Input, Modal, VStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import HeaderComponents from '../components/HeaderComponents';
import { ScrapFolderData } from '../Utils/DummyData';

const {width} = Dimensions.get('window');

const Scrap = ( props ) => {

    const { navigation } = props;

    const [folderAddModal, setFolderAddModal] = useState(false);

    const [folderName, setFolderName] = useState('');

    const folderNameChange = (text) => {
        setFolderName(text);
    }

    const [folderData, setFolderData] = useState(ScrapFolderData);

    const ScrapFolderAdds = () => {
        if(!folderName){
            Alert.alert('폴더명을 입력하세요.');
        }

        setFolderData([...folderData, {idx:2, folderName:folderName, board :[]}]);
        setFolderAddModal(false);
        setFolderName('');
    }

    useEffect(()=>{
        console.log(folderData);
    },[folderData]);


    const folderDataR = folderData.map((item, index)=> {
        return(
            <TouchableOpacity onPress={()=>{navigation.navigate('ScrapView', item)}} activeOpacity={0.9} key={index} style={index != 0 && {marginTop:10}} >
                <ImageBackground 
                    source={require('../images/folderImg.png')}
                    style={{ height:87, width:width-40, justifyContent:'center', paddingLeft:20}}
                    resizeMode='contain'
                >
                    <DefText text={item.folderName} style={{fontSize:18}} />
                </ImageBackground>
            </TouchableOpacity>
        )
    })
    

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderComponents headerTitle='스크랩' navigation={navigation} />
            <ScrollView>
                <Box px={5} py={5}>
                    {
                        folderDataR.length > 0 &&
                        folderDataR
                    }
                </Box>
            </ScrollView>
            <Box style={{position:'absolute', bottom:20, right:20}}>
                <TouchableOpacity onPress={()=>{setFolderAddModal(!folderAddModal)}}>
                    <Image source={require('../images/medicinePlus.png')} alt='복약관리 추가' />
                </TouchableOpacity>
            </Box>
            <Modal isOpen={folderAddModal} onClose={() => setFolderAddModal(false)}>
            
                <Modal.Content maxWidth={width-40}>
                    <Modal.Body>
                        <DefText text='폴더추가' style={{textAlign:'center'}}/>
                        <Input
                            _focus='transparent'
                            height={46}
                            backgroundColor='#fff'
                            placeholder='폴더명을 입력해주세요.'
                            mt={3}
                            value={folderName}
                            onChangeText={folderNameChange}
                        />
                        <HStack justifyContent='space-between' mt={2.5}>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={ScrapFolderAdds}>
                                <DefText text='확인' style={styles.folderButtonText} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.folderAddButtons} onPress={()=>setFolderAddModal(false)}>
                                <DefText text='취소' style={styles.folderButtonText} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    folderAddButtons : {
        height:45,
        width:(width-80) *0.47,
        borderRadius:10,
        backgroundColor:'#696968',
        alignItems:'center',
        justifyContent:'center'
    },
    folderButtonText: {
        fontSize:15,
        color:'#fff'
    }
})

export default Scrap;