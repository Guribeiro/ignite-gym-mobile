import { useState } from "react";
import { TouchableOpacity, FlatList } from "react-native";

import { Center, Text, VStack, HStack, Heading, View } from "@gluestack-ui/themed"
import { StatusBar } from 'expo-status-bar';
import {SignOut} from 'phosphor-react-native'
import {config} from '@config/gluestack-ui.config'
import { UserAvatar } from "@components/user-avatar";
import { Group } from "@components/group";
import { Exercise } from "@components/exercise";

import userPhotoDefault from '@assets/userPhotoDefault.png'
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useNavigation } from "@react-navigation/native";
 

export const Home = () => {
  const {colors} = config.tokens
  const [groups, setGroups] = useState(['Costas', 'Ombros', 'Biceps', 'Tricipes'])
  const [groupSelected, setGroupSelected] = useState<String | undefined>()

  const {navigate} = useNavigation<AppNavigatorRoutesProps>()

  return (
    <VStack flex={1} bg='$gray700'>
      <StatusBar style="inverted" translucent />
      <HStack px='$4' pt='$16' pb='$5' bg='$gray600' alignItems="center" justifyContent="space-between">
        <HStack gap={4} alignItems="center" >
          <UserAvatar source={userPhotoDefault} alt='user avatar' />
          <VStack>
            <Text color="$white">Olá,</Text>
            <Heading color="$white">Gustavo Henrique</Heading>
          </VStack>
        </HStack>

        <TouchableOpacity>
          <SignOut color={colors.gray100}/>
        </TouchableOpacity>

      </HStack >
      <Center>
        <FlatList 
          data={groups}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16
          }}
          style={{
            marginVertical: 40,
            maxHeight: 44,
            minHeight: 44
          }}
          renderItem={({item}) => (
            <View mr='$3'>
              <Group title={item} active={item === groupSelected} onPress={() => setGroupSelected(item)} />
            </View>
          )}
        />
      </Center>
      
      <FlatList 
        contentContainerStyle={{
          paddingHorizontal: 16
        }}
        ListHeaderComponent={() => (
          <View mb='$4'>
             <HStack justifyContent="space-between" alignItems="center">
              <Heading color='$gray100'>Exercícios</Heading>
              <Text>0</Text>
            </HStack>
          </View>
        )}
        data={[1,2,3,4,5,6,7,8,9]}
        renderItem={() => (
          <TouchableOpacity style={{marginBottom: 8}} onPress={() => navigate('Exercise')}>
            <Exercise />
          </TouchableOpacity>
        )}
      />
    </VStack>
  )
}