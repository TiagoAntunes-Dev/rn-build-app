import { icons } from '@/constants/icons'
import { StyleSheet, Text, View, Image, TextInput } from 'react-native'

interface Props {
    placeholder: string;
    onPress?: () => void; 
}

export default function SearchBar({ placeholder, onPress}: Props) {
  return (
    <View
        className='flex-row     items-center    bg-dark-20     rounded-full  px-5 py-4'
    >
      <Image 
        source={icons.search}
        className='size-5'
        resizeMode='contain'
        tintColor="#ab8bff"
      />

      <TextInput 
        onPress={onPress}
        placeholder={placeholder}
        value=''
        onChangeText={() => {}}
        placeholderTextColor="white"
        className='flex-1 ml-2 text-white'
      />
    </View>
  )
}

const styles = StyleSheet.create({})