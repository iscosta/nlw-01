
import React, {useState,useEffect} from 'react'
import { View, StyleSheet, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'


interface Pickers {
  label: string;
  value: string;
}

const Home = () => {
  const [ufs,setUfs] = useState<Pickers[]>([])
  const [cities,setCities] = useState<Pickers[]>([]);
  const [selectedUf,setSelectedUf] = useState('');
  const [selectedCity,setSelectedCity] = useState('');

  const navigation = useNavigation();

  function handleNavigationToPoints() {
    if(selectedUf === '' || selectedUf === null){
      Alert.alert("Opss", "Selecione um estado!!!")
      return;
    }

    if(selectedCity === '' || selectedCity === null){
      Alert.alert("Opss", "Selecione uma cidade!!!")
      return;
    }
    
    navigation.navigate('Points',{
      uf:selectedUf,
      city:selectedCity
    })
  }

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(resp => {
     const values = resp.data.map((item: { sigla: String }) => {
      return {
        label:item.sigla,
        value:item.sigla,
        }
      })
    setUfs(values);
    })
},[])

useEffect(() => {
    if(selectedUf === '') return
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(resp => {
      const values = resp.data.map((item: { nome: String }) => {
        return {
          label:item.nome,
          value:item.nome,
          }
        })
      setCities(values);
    })
},[selectedUf])

  return (
    <KeyboardAvoidingView
    style={{flex:1}}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
     >
      <ImageBackground style={styles.container} source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368 }}>
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
          <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coletta de forma eficiente.</Text>
          </View>
        </View>
        <View style={styles.footer}>
         {/*} <TextInput 
          style={styles.input} 
          placeholder="Digite a UF do estado" 
          autoCapitalize="characters"
          maxLength={2}
          value={uf}
          autoCorrect={false}
          onChangeText={setUf}
          />
          <TextInput 
          style={styles.input} 
          placeholder="Digite a cidade"
          value={city}
          autoCorrect={false}
          onChangeText={setCity}
        />*/}

          <RNPickerSelect
            placeholder={{label: 'Selecione a UF do Estado', value:null}}
            items={ufs}
            onValueChange={(value) => setSelectedUf(value)}
            style={{...pickerSelectStyles}}
            value={selectedUf}
            Icon={() => (<Icon name='chevron-down' color="#000" size={24}/>)}
          />
          <RNPickerSelect
            placeholder={{label: 'Selecione a cidade', value:null}}
            items={cities}
            onValueChange={(value) => setSelectedCity(value)}
            style={{...pickerSelectStyles}}
            value={selectedCity}
            Icon={() => (<Icon name='chevron-down' color="#000" size={24}/>)}
          />
          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name='arrow-right' color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}> Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,

  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: 16,
      paddingTop: 20,
      paddingBottom: 12,
      borderWidth: 1,
      borderColor: 'gray',
      fontFamily: 'Roboto_400Regular',
      //color: 'black',
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
  },
  iconContainer: {
    top: 20,
    right: 15,
  },

});

export default Home