import "@/app/globals.css";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import { BlurView } from 'expo-blur';
import { Image, ImageBackground, Text, View } from "react-native";


const TabIcon = ({ focused, icon, title } : any) => {

    if (focused) {
    return (
    <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
    >
        <Image source={icon}
            tintColor="#151312"
            className="size-5" 
        />
        <Text
            className="text-secondary text-base font-semibold ml-2"
        >
            {title}
        </Text>
    </ImageBackground>
    )}

    return (
        <View className="size-full justify-center items-center mt-3 rounded-full">
            <Image 
                source={icon}
                tintColor="#A8B5DB"
                className="size-5"
            />
        </View>
    )

}


export default function _Layout() {
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'

            },

            tabBarStyle:{
                backgroundColor: '#1A1A1E',
                borderRadius: 50,
                marginHorizontal: 20,
                marginBottom: 36,
                height: 52,
                position: 'absolute',
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#0F0D23',
                // Sombra elegante para dar destaque flutuante
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            },
            tabBarBackground: () => (
                <BlurView 
                    tint="dark" // Pode usar 'light', 'dark' ou 'default'
                    intensity={20} // Regula a força do desfoque (0 a 100)
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}
                />
            )
        }}
    >
    <Tabs.Screen 
        name="index"
        options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
                <TabIcon 
                    focused={focused} 
                    icon={icons.home}
                    title="Home"
                />
            )
        }}
    />

        <Tabs.Screen 
            name="search"
            options={{
                title: 'Search',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused} 
                        icon={icons.search}
                        title="Search"
                    />
                )
            }}
        
        />

        <Tabs.Screen 
            name="saved"
            options={{
                title: 'Saved',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused} 
                        icon={icons.save}
                        title="Saved"
                    />
                )
            }}
        
        />

        <Tabs.Screen 
            name="profile"
            options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused} 
                        icon={icons.person}
                        title="Profile"
                    />
                )
            }}
        
        />
    </Tabs>
  );
}